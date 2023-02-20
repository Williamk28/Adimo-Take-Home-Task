const puppeteer = require("puppeteer-extra"); 
const pluginStealth = require("puppeteer-extra-plugin-stealth"); 
const { executablePath } = require("puppeteer"); 
 
puppeteer.use(pluginStealth());

const userAgentsList = [
    'Mozilla/5.0 (X11; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
];

puppeteer.launch({ executablePath: executablePath() }).then(async browser => { 
	const page = await browser.newPage(); 

    await page.setUserAgent(userAgentsList[Math.floor(Math.random() * 3)]);
 
	await page.goto("https://www.thewhiskyexchange.com/search?q=cider"); 
 
	await page.waitForTimeout(1000); 

    const ciders = await page.evaluate(() => {
        const ciderList= document.querySelectorAll(".product-grid__item");

        return Array.from(ciderList).map((cider) => {
            const name = cider.querySelector(".product-card__name").innerText;
            const price = cider.querySelector(".product-card__price").innerText;
            const imageURL = cider.querySelector(".product-card__image").src;

            return {name, price, imageURL}
        })
    })

    var totalPrice = 0;

    for (let i = 0; i < ciders.length; i++){
        totalPrice = totalPrice + parseFloat(ciders[i].price.replace("£", ""));
    }

    var noOfCiders = "The total number of ciders is " + ciders.length;
    var avgPrice = "The average price of all items is £" + Math.round(totalPrice/ciders.length * 100) / 100;

    ciders.push(noOfCiders);
    ciders.push(avgPrice);

    var fs = require('fs');
    fs.writeFile("challenge.json", JSON.stringify(ciders), function(error) {
        if (error) {
            console.log(error);
        }
    });
 
	await browser.close(); 
});