import puppeteer from "puppeteer-extra";
import ExcelJS from "exceljs";
import captcha from "puppeteer-extra-plugin-recaptcha";
import "dotenv/config";

const usuario = process.env.USUARIO_PJN;
const password = process.env.PASSWORD;

export default async function openBrowser(expediente, anio) {
  try {
    const browser = await puppeteer.launch({ headless: false });
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

    // Abrir una nueva página
    const page2 = await browser.newPage();
    await page2.goto("http://scw.pjn.gov.ar/scw/consultaListaRelacionados.seam");
    const nuevaConsultaButton = await page2.waitForSelector("#j_idt24\\:menuNavigation\\:j_idt36\\:menuNuevaConsulta", {
      visible: true,
    });

    if (nuevaConsultaButton) {
      console.log("NUEVA CONSULTA encontrada");
      // Hacer clic y esperar a que la navegación termine
      await nuevaConsultaButton.click();
    } else {
      console.log("No se encontró el botón de Nueva Consulta");
    }

    console.log("Navegando a la página secundaria...");
    const selectSelector = "#formPublica\\:camaraNumAni"; // Selector del <select>
    await page2.waitForSelector(selectSelector);
    console.log("Selector del dropdown encontrado.");

    await page2.select(selectSelector, "10");
    console.log("Opción seleccionada en el dropdown: COM");
    console.log(selectSelector);
    const inputNum = await page2.waitForSelector("#formPublica\\:numero");
    console.log("Input de número encontrado.");
    await inputNum.type(expediente);
    const inputAni = await page2.waitForSelector("#formPublica\\:anio");
    await inputAni.type(anio);
    const consultarButtonSelector = "#formPublica\\:buscarPorNumeroButton"; // Selector del botón
    const consultarButton = await page2.waitForSelector(consultarButtonSelector);
    await consultarButton.click();
    console.log("Botón de consulta clickeado.");
    await page2.waitForSelector("#expediente\\:j_idt90\\:j_idt91");
    const fieldsetData = await page2.evaluate(() => {
      const expediente = document.querySelector("#expediente\\:j_idt90\\:j_idt91"); // Selección del fieldset por ID

      if (expediente) {
        // Extraer los valores específicos
        const expedienteValue = expediente.querySelector('span[style="color:#000000;"]').innerText.trim();
        const jurisdiccion = expediente.querySelector("#expediente\\:j_idt90\\:detailCamera").innerText.trim();
        const dependencia = expediente.querySelector("#expediente\\:j_idt90\\:detailDependencia").innerText.trim();
        const situacionActual = expediente.querySelector("#expediente\\:j_idt90\\:detailSituation").innerText.trim();
        const caratula = expediente.querySelector("#expediente\\:j_idt90\\:detailCover").innerText.trim();

        return {
          expediente: expedienteValue,
          jurisdiccion: jurisdiccion,
          dependencia: dependencia,
          situacionActual: situacionActual,
          caratula: caratula,
        };
      }

      return null;
    });
    return fieldsetData;
    console.log("Datos extraídos del fieldset:", fieldsetData);
  } catch (error) {
    console.log("Error:", error);
  }
}
