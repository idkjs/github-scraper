## Puppeteer

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
