const puppeteer = require("puppeteer");
const CREDS = require("./creds");

/** login into github */
async function run() {
  /**
   *For visual debugging, make chrome launch with GUI by passing an object with
    headless: false to launch method.
    */
  try {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();

    /** get screenshots */
    // await page.goto('https://github.com');
    // await page.screenshot path: 'screenshots/github.png' });

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
    /** Click users tab and type search term into search input to get the url for get request then pass
     * search term parameter to it.
     * const searchUrl = `https://github.com/search?utf8=%E2%9C%93&q=john&type=Users&utf8=✓`
     */
    const userToSearch = "john";
    const searchUrl = `https://github.com/search?utf8=%E2%9C%93&q=${userToSearch}&type=Users&utf8=✓`;

    /** navigate to search page and run search */
    await page.goto(searchUrl);
    await page.waitFor(2 * 1000);

    /** get username, and email selector in devtools
     *
     * Let’s loop through all the listed users and extract emails. As we loop through the DOM, we have to change index inside
     *  the selectors to point to the next DOM element. So, I’ve put the INDEX string at the place where we want to place the index as we loop through.
     */
    // const LIST_USERNAME_SELECTOR ='#user_search_results > div.user-list > div:nth-child(2) > div.d-flex > div > a > em';
    const LIST_USERNAME_SELECTOR =
      "#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > a";

    // const LIST_EMAIL_SELECTOR ='#user_search_results > div.user-list > div:nth-child(2) > div.d-flex > div > ul > li:nth-child(2) > a';
    const LIST_EMAIL_SELECTOR =
      "#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > ul > li:nth-child(2) > a";
    /**
     * ADD `LENGTH_SELECTOR_CLASS`: If you look at the page's code inside developers tool, you will observe that divs with
     * class user-list-item are actually housing information about a single user each.
     */
    const LENGTH_SELECTOR_CLASS = "user-list-item";

    let listLength = await page.evaluate(sel => {
      return document.getElementsByClassName(sel).length;
    }, LENGTH_SELECTOR_CLASS);

    /** extract loop */
    for (let i = 1; i <= listLength; i++) {
      // change the index to the next child
      let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX", i);
      let emailSelector = LIST_EMAIL_SELECTOR.replace("INDEX", i);

      let username = await page.evaluate(sel => {
        return document
          .querySelector(sel)
          .getAttribute("href")
          .replace("/", "");
      }, usernameSelector);

      let email = await page.evaluate(sel => {
        let element = document.querySelector(sel);
        return element ? element.innerHTML : null;
      }, emailSelector);

      // not all users have emails visible
      if (!email) continue;

      console.log(username, " -> ", email);

      // TODO save this user
    }
  } catch (error) {
    console.error(error);
  }
}
run();
