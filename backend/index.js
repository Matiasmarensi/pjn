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

    // Esperar el selector del dropdown y seleccionarlo
    // await page.waitForSelector("#formPublica\\:recaptcha-publico\\:reCaptcha");
    // let { captchas, filtered, error } = await page.findRecaptchas();
    // console.log(captchas, filtered, error);
    // // const capt = await page.solveRecaptchas();
    // // console.log(capt);
    // const selectSelector = "#formPublica\\:camaraNumAni"; // Selector del <select>
    // await page2.waitForSelector(selectSelector);
    // console.log("Selector del dropdown encontrado.");

    // await page2.select(selectSelector, "10");
    // console.log("Opción seleccionada en el dropdown: COM");
    // console.log(selectSelector);
    // const inputNum = await page2.waitForSelector("#formPublica\\:numero");
    // console.log("Input de número encontrado.");
    // await inputNum.type("1203");
    // const inputAni = await page2.waitForSelector("#formPublica\\:anio");
    // await inputAni.type("2023");
    //
    // si hay captcha
    // si hay captcha
    // const captchaSelector = "#formPublica\\:recaptcha-publico\\:reCaptcha"; // Selector del CAPTCHA
    // const captchaExists = await page2.$(captchaSelector); // Verifica si el elemento existe

    // if (captchaExists) {
    //   console.log("Captcha encontrado. Por favor resuélvelo manualmente.");
    //   // Espera 60 segundos para que el usuario resuelva el CAPTCHA
    //   await new Promise((resolve) => setTimeout(resolve, 60000));
    // } else {
    //   console.log("Captcha no encontrado.");
    // }

    // // Esperar a que el usuario complete el CAPTCHA
    // console.log("Presiona Enter cuando hayas completado el CAPTCHA...");
    // await page2.evaluate(() => {
    //   return new Promise((resolve) => {
    //     const confirmation = confirm("¿Has completado el CAPTCHA?");
    //     if (confirmation) {
    //       resolve();
    //     }
    //   });
    // });
    // Hacer clic en el botón de consultar
    // const consultarButtonSelector = "#formPublica\\:buscarPorNumeroButton"; // Selector del botón
    // const consultarButton = await page2.waitForSelector(consultarButtonSelector);
    // await consultarButton.click();
    // console.log("Botón de consulta clickeado.");
  } catch (error) {
    console.log("Error:", error);
  }
}
