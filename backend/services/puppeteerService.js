import puppeteer from "puppeteer-extra";
import "dotenv/config";
import { saveExpedienteToDB } from "../services/dbService.js";

export default async function openBrowser(data, usuario, password) {
  const expedientes = data.split(",").map((item) => item.trim());

  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Iniciar sesión
    await page.goto("https://deox.pjn.gov.ar/deox/inicio.do");
    await page.waitForSelector("#username");
    await page.type("#username", usuario);
    await page.type("#password", password);
    await page.click("#kc-login");
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    // Procesar en bloques de 5 expedientes para evitar sobrecarga
    const blockSize = 5;
    for (let i = 0; i < expedientes.length; i += blockSize) {
      const currentBlock = expedientes.slice(i, i + blockSize);
      for (const item of currentBlock) {
        const [expediente, anio] = item.split("/").map((part) => part.trim());

        // Verificar el formato
        if (!expediente || !anio) {
          console.log("Formato de expediente inválido.");
          continue;
        }

        await page.goto("http://scw.pjn.gov.ar/scw/consultaListaRelacionados.seam");

        // Realizar la consulta
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("a"));
          const button = buttons.find((b) => b.textContent.includes("Nueva Consulta"));
          if (button) button.click();
        });

        // Esperar el dropdown y seleccionarlo
        await page.waitForSelector("#formPublica\\:camaraNumAni", { timeout: 5000 });
        await page.select("#formPublica\\:camaraNumAni", "10");

        // Ingresar datos de expediente y año
        await page.type("#formPublica\\:numero", expediente);
        await page.type("#formPublica\\:anio", anio);

        // Iniciar la búsqueda
        await page.click("#formPublica\\:buscarPorNumeroButton");

        try {
          await page.waitForSelector("#expediente\\:j_idt90\\:j_idt91", { timeout: 10000 });

          const fieldsetData = await page.evaluate(() => {
            const expedienteElem = document.querySelector(
              "#expediente\\:j_idt90\\:j_idt91 span[style='color:#000000;']"
            );
            return {
              expediente: expedienteElem?.innerText.trim() || "N/A",
              jurisdiccion: document.querySelector("#expediente\\:j_idt90\\:detailCamera")?.innerText.trim() || "N/A",
              dependencia:
                document.querySelector("#expediente\\:j_idt90\\:detailDependencia")?.innerText.trim() || "N/A",
              situacionActual:
                document.querySelector("#expediente\\:j_idt90\\:detailSituation")?.innerText.trim() || "N/A",
              caratula: document.querySelector("#expediente\\:j_idt90\\:detailCover")?.innerText.trim() || "N/A",
              datosDeOrigen:
                document.querySelector("#expediente\\:j_idt90\\:j_idt123\\:detailNumeracionOrigen")?.innerText.trim() ||
                "N/A",
              actualizado: new Date().toLocaleDateString("es-AR"),
            };
          });

          // Guardar en DB
          if (fieldsetData) {
            fieldsetData.ultimoMovimiento = await page.evaluate(() => {
              const rows = document.querySelectorAll("#expediente\\:action-table tbody tr");
              return rows.length > 0 ? rows[0].querySelector("td:nth-child(3)")?.innerText.trim() : null;
            });
            await saveExpedienteToDB(fieldsetData);
          }
        } catch (error) {
          console.log(`Expediente ${expediente}/${anio} no encontrado o error en la búsqueda.`);
        }
      }
    }
    await browser.close();
  } catch (error) {
    console.log("Error:", error);
  }
}

// import puppeteer from "puppeteer-extra";
// import ExcelJS from "exceljs";
// import captcha from "puppeteer-extra-plugin-recaptcha";
// import "dotenv/config";
// import { saveExpedienteToDB } from "../services/dbService.js";

// // const usuario = process.env.USUARIO_PJN;
// // const password = process.env.PASSWORD;

// export default async function openBrowser(data, usuario, password) {
//   console.log("DATAAAA," + data);
//   // Separar la data en múltiples expedientes en formato xxxx/yyyy
//   const expedientes = data.split(",").map((item) => item.trim()); // Elimina espacios extra alrededor de cada expediente

//   try {
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       // executablePath: "/usr/bin/chromium", // Asegúrate de que esta ruta sea correcta
//     });
//     const page = await browser.newPage();

//     // Navegar a la página de inicio
//     await page.goto("https://deox.pjn.gov.ar/deox/inicio.do");
//     console.log("Navegando a la página de inicio...");

//     // Esperar el input de usuario y contraseña
//     const usernameInput = await page.waitForSelector("#username");
//     console.log("Input de usuario encontrado.");
//     await page.type("#username", usuario);
//     await page.type("#password", password);
//     console.log("Credenciales ingresadas.");

//     // Hacer clic en el botón de inicio de sesión
//     const loginButton = await page.waitForSelector("#kc-login");
//     await loginButton.click();
//     console.log("Botón de inicio de sesión clickeado.");

//     // Esperar a que la navegación a la página siguiente complete
//     await page.waitForNavigation({ waitUntil: "networkidle0" });
//     console.log("Navegación completada.");
//     const resultados = [];

//     // Procesar cada expediente en la lista
//     for (const item of expedientes) {
//       let datos = [];
//       await page.reload(); // Recarga la página actual
//       const page2 = await browser.newPage();
//       await page2.goto("http://scw.pjn.gov.ar/scw/consultaListaRelacionados.seam");
//       const [expediente, anio] = item.split("/").map((part) => part.trim());
//       console.log(`Procesando expediente: ${expediente}, año: ${anio}`);

//       if (!expediente || !anio) {
//         console.log("Error: formato de expediente inválido.");
//         continue;
//       }

//       // Seleccionar el botón de "Nueva Consulta" usando evaluate
//       const nuevaConsultaSelector = await page2.evaluate(() => {
//         const buttons = Array.from(document.querySelectorAll("a")); // Selecciona todos los elementos 'a'
//         const button = buttons.find((button) => button.textContent.includes("Nueva Consulta"));
//         if (button) {
//           return button.getAttribute("id"); // Devuelve el ID del botón
//         }
//         return null; // Si no lo encuentra, devuelve null
//       });

//       if (nuevaConsultaSelector) {
//         console.log("NUEVA CONSULTA encontrada");

//         // Escapamos los dos puntos en el selector
//         const escapedSelector = `#${nuevaConsultaSelector.replace(/:/g, "\\:")}`;
//         await page2.click(escapedSelector); // Usamos el selector escapado para hacer clic
//       } else {
//         console.log("No se encontró el botón de Nueva Consulta");
//         throw new Error("usuario no válido"); // Lanza el error
//       }

//       // Limpiar los inputs antes de la nueva consulta
//       // await page2.evaluate(() => {
//       //   document.querySelector("#formPublica\\:numero").value = "";
//       //   document.querySelector("#formPublica\\:anio").value = "";
//       // });

//       console.log("Inputs limpios, listos para la nueva consulta.");

//       // Seleccionar la cámara
//       const selectSelector = "#formPublica\\:camaraNumAni";
//       await page2.waitForSelector(selectSelector);
//       await page2.select(selectSelector, "10");
//       console.log("Opción seleccionada en el dropdown.");

//       // Ingresar el expediente y el año
//       const inputNum = await page2.waitForSelector("#formPublica\\:numero");
//       await inputNum.type(expediente);
//       console.log("Input de número ingresado.");

//       const inputAni = await page2.waitForSelector("#formPublica\\:anio");
//       await inputAni.type(anio);
//       console.log("Input de año ingresado.");

//       // Hacer clic en el botón de consulta
//       const consultarButtonSelector = "#formPublica\\:buscarPorNumeroButton";
//       const consultarButton = await page2.waitForSelector(consultarButtonSelector);
//       await consultarButton.click();
//       console.log("Botón de consulta clickeado.");

//       // Esperar los resultados
//       try {
//         await page2.waitForSelector("#expediente\\:j_idt90\\:j_idt91", { timeout: 10000 }); // Espera 10 segundos
//       } catch (err) {
//         console.log(`El expediente ${expediente}/${anio} no se encontró.`);
//         continue; // Saltar al siguiente expediente
//       }
//       const fieldsetData = await page2.evaluate(() => {
//         const expediente = document?.querySelector("#expediente\\:j_idt90\\:j_idt91");
//         if (!expediente) return null;
//         if (expediente) {
//           const expedienteValue = expediente.querySelector('span[style="color:#000000;"]')?.innerText?.trim() || "N/A";
//           const jurisdiccion =
//             expediente.querySelector("#expediente\\:j_idt90\\:detailCamera")?.innerText?.trim() || "N/A";
//           const dependencia =
//             expediente.querySelector("#expediente\\:j_idt90\\:detailDependencia")?.innerText?.trim() || "N/A";
//           const situacionActual =
//             expediente.querySelector("#expediente\\:j_idt90\\:detailSituation")?.innerText?.trim() || "N/A";
//           const caratula = expediente.querySelector("#expediente\\:j_idt90\\:detailCover")?.innerText?.trim() || "N/A";
//           const datosDeOrigen =
//             expediente.querySelector("#expediente\\:j_idt90\\:j_idt123\\:detailNumeracionOrigen")?.innerText?.trim() ||
//             "N/A";

//           const fecha = new Date();
//           const dia = String(fecha.getUTCDate()).padStart(2, "0");
//           const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
//           const anio = fecha.getUTCFullYear();
//           const updatedAt = `${dia}/${mes}/${anio}`; // Formato dd/mm/aaaa

//           return {
//             expediente: expedienteValue,
//             jurisdiccion,
//             dependencia,
//             situacionActual,
//             caratula,
//             datosDeOrigen,
//             actualizado: updatedAt || "N/A",
//           };
//         }

//         return null;
//       });
//       if (fieldsetData) {
//         const tableData = await page2.evaluate(() => {
//           // Seleccionamos las filas de la tabla
//           const rows = Array.from(document.querySelectorAll("#expediente\\:action-table tbody tr"));

//           if (rows.length > 0) {
//             // Solo tomamos la primera fila
//             const cells = rows[0].querySelectorAll("td");
//             let fecha = cells[2].innerText.trim();

//             // Usamos una expresión regular para extraer solo la fecha
//             const fechaLimpia = fecha.replace(/Fecha:\n?/, "").trim();
//             return fechaLimpia;
//           }

//           return null; // Si no hay filas, devolvemos null
//         });

//         if (tableData) {
//           // Solo guardamos el movimiento si encontramos una fecha
//           fieldsetData.ultimoMovimiento = tableData;
//           resultados.push(fieldsetData);
//         }
//       }
//       await saveExpedienteToDB(fieldsetData); // Guardar en la base de datos

//       console.log("Datos extraídos del fieldset:", fieldsetData);
//     }
//     //retornar datos

//     await browser.close(); // Cerrar el navegador cuando se hayan procesado todos los expedientes
//     return resultados;
//   } catch (error) {
//     console.log("Error:", error);
//   }
// }
