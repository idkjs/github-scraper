## Puppeteer

Medium Tutorial: https://medium.com/@e_mad_ehsan/getting-started-with-puppeteer-and-chrome-headless-for-web-scrapping-6bf5979dee3e

## LIST_SELECTOR

* Currently one way to extract text from an element is by using evaluate method of Page or ElementHandle.
* When we navigate to page with search results, we will use page.evaluate method to get the length of
* users list on the page. The evaluate method evaluates the code inside browser context.

- we will use this inside our async loop

```js
 let listLength = await page.evalute((sel) => {
   return document.getElementsByClassName(sel).length;
 }, LENGTH_SELECTOR_CLASS);
```

## async loop

```js
for (let h = 1; h <= numPages; h++) {
   let pageUrl = searchUrl + '&p=' + h;
   await page.goto(pageUrl);

   let listLength = await page.evaluate((sel) => {
     return document.getElementsByClassName(sel).length;
   }, LENGTH_SELECTOR_CLASS);

   for (let i = 1; i <= listLength; i++) {
     // change the index to the next child
     let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX", i);
     let emailSelector = LIST_EMAIL_SELECTOR.replace("INDEX", i);

     let username = await page.evaluate((sel) => {
       return document.querySelector(sel).getAttribute('href').replace('/', '');
     }, usernameSelector);

     let email = await page.evaluate((sel) => {
       let element = document.querySelector(sel);
       return element ? element.innerHTML : null;
     }, emailSelector);

     // not all users have emails visible
     if (!email)
       continue;

     console.log(username, ' -> ', email);

     upsertUser({
       username: username,
       email: email,
       dateCrawled: new Date()
     });
   }
}
```

## selecting username selector

At this point in your tut, [Extract Emails](https://medium.com/@e_mad_ehsan/getting-started-with-puppeteer-and-chrome-headless-for-web-scrapping-6bf5979dee3e#---0-14), when you selected the username selector in devtools, this is what I am getting:
`#user_search_results > div.user-list > div:nth-child(1) > div.d-flex > div > a > em`.

Note the `em` at then end. If you use this, the loop doesnt work. You have to change it to #user_search_results > div.user-list > div:nth-child(1) > div.d-flex > div > a for it to run.

Correct string `#user_search_results > div.user-list > div:nth-child(2) > div.d-flex > div > ul > li:nth-child(2) > a`.

## looping through pages

At the bottom of the search results page, if you hover the mouse over buttons with page numbers, you can see they link to the next pages. The link to 2nd page with results is `https://github.com/search?p=2&q=john&type=Users&utf8=%E2%9C%93`. Notice the p=2 query parameter in the URL. This will help us navigate to the next page. Or click inspect and copy out html:

```html
<a rel="next" href="/search?p=2&amp;q=john&amp;type=Users&amp;utf8=%E2%9C%93">2</a>
```
