const puppeteer = require("puppeteer");
const CREDS = require("./creds");

/** login into github */
async function run() {
  /**
   *For visual debugging, make chrome launch with GUI by passing an object with
    headless: false to launch method.
    */
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  /** Navigate to login */
  await page.goto("https://github.com/login");
  const USERNAME_SELECTOR = "#login_field";
  const PASSWORD_SELECTOR = "#password";
  const BUTTON_SELECTOR =
    "#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block";
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(CREDS.username);

  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(CREDS.password);

  await page.click(BUTTON_SELECTOR);

  await page.waitForNavigation();
  /** browser will close, obviously, if call browser.close()
   * comment out to be able to get the html selector tags
   *
   */
  // browser.close();
}

run();
// async function run() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.goto("https://github.com");
//   await page.screenshot({ path: "screenshots/github.png" });

//   browser.close();
// }

// run();
