import puppeteer from "puppeteer";
import ExcelJS from "exceljs";
import "dotenv/config";

const usuario = process.env.USUARIO_PJN;
const password = process.env.PASSWORD;

// const saveExcel = async (data) => {
//   try {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("LinkedIn Links");

//     worksheet.columns = [
//       { header: "Name", key: "name", width: 30 },
//       { header: "LinkedIn Link", key: "linkedinLink", width: 50 },
//     ];

//     data.forEach((item) => {
//       worksheet.addRow({ name: item.name, linkedinLink: item.linkedinLink });
//     });

//     await workbook.xlsx.writeFile("linkedin_links6.xlsx");
//     console.log("Excel file created successfully!");
//   } catch (error) {
//     console.log("Error writing Excel file:", error);
//   }
// };

async function openBrowser() {
  const browser = await puppeteer.launch({ headless: false }); // Configura headless en false para ver el navegador
  const page = await browser.newPage();
  await page.goto("https://deox.pjn.gov.ar/deox/inicio.do");

  const usernameInput = await page.waitForSelector("#username"); // Cambia el selector por el que corresponda
  console.log(usernameInput);
  await page.type("#username", usuario);
  await page.type("#password", password);
  await page.goto("http://scw.pjn.gov.ar/scw/home.seam");

  //   const loginButton = await page.waitForSelector("#kc-login"); // Cambia el selector por el que corresponda
  //   await loginButton.click();

  // Evaluar la página para extraer los enlaces
}

openBrowser();
