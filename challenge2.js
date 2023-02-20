const puppeteer = require("puppeteer-extra"); 
const pluginStealth = require("puppeteer-extra-plugin-stealth"); 
const { executablePath } = require("puppeteer"); 

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const userAgentsList = [
    'Mozilla/5.0 (X11; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
];

puppeteer.use(pluginStealth());
 
readline.question('What would you like to search for from The Whisky Exchange website?', search => {
    console.log("Gathering data for " + search);
    readline.close();
    var url = "https://www.thewhiskyexchange.com/search?q=" + search;
    puppeteer.launch({ executablePath: executablePath() }).then(async browser => { 
        const page = await browser.newPage(); 
    
        await page.setUserAgent(userAgentsList[Math.floor(Math.random() * 3)]);
     
        await page.goto(url); 
     
        await page.waitForTimeout(1000); 
    
        const searchResults = await page.evaluate(() => {
            const resultList= document.querySelectorAll(".product-grid__item");
    
            return Array.from(resultList).map((result) => {
                const name = result.querySelector(".product-card__name").innerText;
                const price = result.querySelector(".product-card__price").innerText;
                const imageURL = result.querySelector(".product-card__image").src;
    
                return {name, price, imageURL}
            })
        })
    
        var totalPrice = 0;
    
        for (let i = 0; i < searchResults.length; i++){
            totalPrice = totalPrice + parseFloat(searchResults[i].price.replace("£", ""));
        }
    
        var noOfItems = "The total number of items is " + searchResults.length;
        var avgPrice = "The average price of all items is £" + Math.round(totalPrice/searchResults.length * 100) / 100;
    
        searchResults.push(noOfItems);
        searchResults.push(avgPrice);
    
        var fs = require('fs');
        fs.writeFile("challenge2.json", JSON.stringify(searchResults), function(error) {
            if (error) {
                console.log(error);
            }
        });
     
        await browser.close(); 
    });
})