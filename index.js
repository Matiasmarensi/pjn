import puppeteer from "puppeteer";
import ExcelJS from "exceljs";
import "dotenv/config";

const usuario = process.env.USUARIO_PJN;
const password = process.env.PASSWORD;

async function openBrowser() {
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
    await page2.goto("http://scw.pjn.gov.ar/");
    console.log("Navegando a la página secundaria...");

    // Esperar el selector del dropdown y seleccionarlo
    const selectSelector = "#formPublica\\:camaraNumAni"; // Selector del <select>
    await page2.waitForSelector(selectSelector);
    console.log("Selector del dropdown encontrado.");

    await page2.select(selectSelector, "10");
    console.log("Opción seleccionada en el dropdown: COM");
    console.log(selectSelector);

    // Cerrar el navegador (opcional)
    // await browser.close();
  } catch (error) {
    console.log("Error:", error);
  }
}

openBrowser();
