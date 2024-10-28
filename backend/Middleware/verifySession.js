import puppeteer from "puppeteer-extra";
let browser;
let page;
const usuario = process.env.USUARIO_PJN;
const password = process.env.PASSWORD;

const loginPuppeteer = async () => {
  console.log("middleware");
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "/usr/bin/chromium",
    });
    page = await browser.newPage();
  }

  await page.goto("https://deox.pjn.gov.ar/deox/inicio.do");
  console.log("ingresando usuario y password desde middleware");
  await page.type("#username", usuario);
  await page.type("#password", password);
  await page.click("#kc-login");
  await page.waitForNavigation({ waitUntil: "networkidle0" });
};

export const verificarSesion = async (req, res, next) => {
  console.log("middleware 2");
  if (!page) {
    // Si no hay sesión activa, se hace login
    await loginPuppeteer();
  }
  next();
};
