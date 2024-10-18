import puppeteer from "puppeteer-extra";
import ExcelJS from "exceljs";
import captcha from "puppeteer-extra-plugin-recaptcha";
import "dotenv/config";
import { saveExpedienteToDB } from "../services/dbService.js";

const usuario = process.env.USUARIO_PJN;
const password = process.env.PASSWORD;

export default async function openBrowser(data) {
  // Separar la data en múltiples expedientes en formato xxxx/yyyy
  const expedientes = data.split(",").map((item) => item.trim()); // Elimina espacios extra alrededor de cada expediente

  try {
    const browser = await puppeteer.launch({ headless: true }, { args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();

    // Navegar a la página de inicio
    await page.goto("https://deox.pjn.gov.ar/deox/inicio.do");
    console.log("Navegando a la página de inicio...");

    // Esperar el input de usuario y contraseña
    const usernameInput = await page.waitForSelector("#username");
    console.log("Input de usuario encontrado.");
    await page.type("#username", usuario);
    await page.type("#password", password);
    console.log("Credenciales ingresadas.");

    // Hacer clic en el botón de inicio de sesión
    const loginButton = await page.waitForSelector("#kc-login");
    await loginButton.click();
    console.log("Botón de inicio de sesión clickeado.");

    // Esperar a que la navegación a la página siguiente complete
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    console.log("Navegación completada.");
    const resultados = [];

    // Procesar cada expediente en la lista
    for (const item of expedientes) {
      let datos = [];
      await page.reload(); // Recarga la página actual
      const page2 = await browser.newPage();
      await page2.goto("http://scw.pjn.gov.ar/scw/consultaListaRelacionados.seam");
      const [expediente, anio] = item.split("/").map((part) => part.trim());
      console.log(`Procesando expediente: ${expediente}, año: ${anio}`);

      if (!expediente || !anio) {
        console.log("Error: formato de expediente inválido.");
        continue;
      }

      // Seleccionar el botón de "Nueva Consulta" usando evaluate
      const nuevaConsultaSelector = await page2.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("a")); // Selecciona todos los elementos 'a'
        const button = buttons.find((button) => button.textContent.includes("Nueva Consulta"));
        if (button) {
          return button.getAttribute("id"); // Devuelve el ID del botón
        }
        return null; // Si no lo encuentra, devuelve null
      });

      if (nuevaConsultaSelector) {
        console.log("NUEVA CONSULTA encontrada");

        // Escapamos los dos puntos en el selector
        const escapedSelector = `#${nuevaConsultaSelector.replace(/:/g, "\\:")}`;
        await page2.click(escapedSelector); // Usamos el selector escapado para hacer clic
      } else {
        console.log("No se encontró el botón de Nueva Consulta");
      }

      // Limpiar los inputs antes de la nueva consulta
      // await page2.evaluate(() => {
      //   document.querySelector("#formPublica\\:numero").value = "";
      //   document.querySelector("#formPublica\\:anio").value = "";
      // });

      console.log("Inputs limpios, listos para la nueva consulta.");

      // Seleccionar la cámara
      const selectSelector = "#formPublica\\:camaraNumAni";
      await page2.waitForSelector(selectSelector);
      await page2.select(selectSelector, "10");
      console.log("Opción seleccionada en el dropdown.");

      // Ingresar el expediente y el año
      const inputNum = await page2.waitForSelector("#formPublica\\:numero");
      await inputNum.type(expediente);
      console.log("Input de número ingresado.");

      const inputAni = await page2.waitForSelector("#formPublica\\:anio");
      await inputAni.type(anio);
      console.log("Input de año ingresado.");

      // Hacer clic en el botón de consulta
      const consultarButtonSelector = "#formPublica\\:buscarPorNumeroButton";
      const consultarButton = await page2.waitForSelector(consultarButtonSelector);
      await consultarButton.click();
      console.log("Botón de consulta clickeado.");

      // Esperar los resultados
      try {
        await page2.waitForSelector("#expediente\\:j_idt90\\:j_idt91", { timeout: 10000 }); // Espera 10 segundos
      } catch (err) {
        console.log(`El expediente ${expediente}/${anio} no se encontró.`);
        continue; // Saltar al siguiente expediente
      }
      const fieldsetData = await page2.evaluate(() => {
        const expediente = document?.querySelector("#expediente\\:j_idt90\\:j_idt91");
        if (!expediente) return null;
        if (expediente) {
          const expedienteValue = expediente.querySelector('span[style="color:#000000;"]')?.innerText?.trim() || "N/A";
          const jurisdiccion =
            expediente.querySelector("#expediente\\:j_idt90\\:detailCamera")?.innerText?.trim() || "N/A";
          const dependencia =
            expediente.querySelector("#expediente\\:j_idt90\\:detailDependencia")?.innerText?.trim() || "N/A";
          const situacionActual =
            expediente.querySelector("#expediente\\:j_idt90\\:detailSituation")?.innerText?.trim() || "N/A";
          const caratula = expediente.querySelector("#expediente\\:j_idt90\\:detailCover")?.innerText?.trim() || "N/A";
          const datosDeOrigen =
            expediente.querySelector("#expediente\\:j_idt90\\:j_idt123\\:detailNumeracionOrigen")?.innerText?.trim() ||
            "N/A";

          const fecha = new Date();
          const dia = String(fecha.getUTCDate()).padStart(2, "0");
          const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
          const anio = fecha.getUTCFullYear();
          const updatedAt = `${dia}/${mes}/${anio}`; // Formato dd/mm/aaaa

          return {
            expediente: expedienteValue,
            jurisdiccion,
            dependencia,
            situacionActual,
            caratula,
            datosDeOrigen,
            actualizado: updatedAt || "N/A",
          };
        }

        return null;
      });
      if (fieldsetData) {
        const tableData = await page2.evaluate(() => {
          // Seleccionamos las filas de la tabla
          const rows = Array.from(document.querySelectorAll("#expediente\\:action-table tbody tr"));

          if (rows.length > 0) {
            // Solo tomamos la primera fila
            const cells = rows[0].querySelectorAll("td");
            let fecha = cells[2].innerText.trim();

            // Usamos una expresión regular para extraer solo la fecha
            const fechaLimpia = fecha.replace(/Fecha:\n?/, "").trim();
            return fechaLimpia;
          }

          return null; // Si no hay filas, devolvemos null
        });

        if (tableData) {
          // Solo guardamos el movimiento si encontramos una fecha
          fieldsetData.ultimoMovimiento = tableData;
          resultados.push(fieldsetData);
        }
      }
      await saveExpedienteToDB(fieldsetData); // Guardar en la base de datos

      console.log("Datos extraídos del fieldset:", fieldsetData);
    }
    //retornar datos

    await browser.close(); // Cerrar el navegador cuando se hayan procesado todos los expedientes
    return resultados;
  } catch (error) {
    console.log("Error:", error);
  }
}
