const axios = require('axios');
const cheerio = require('cheerio');
const base = "https://cdn.adimo.co/clients/Adimo/test/";

axios.get('https://cdn.adimo.co/clients/Adimo/test/index.html')
    .then(function(response) {
        // HTML is inside response.data
        let $ = cheerio.load(response.data);
        const cheeses = [];
        var totalPrice = 0;
        
        $('div.item').each(function(i, elem){
            const cheese = {title: "", localImageURL: "", absoluteImageURL: "", oldPrice: "", currentPrice: ""};
            cheese.title = $(elem).children("h1").text();
            cheese.localImageURL = $(elem).children("img").attr("src");
            cheese.absoluteImageURL = new URL(cheese.localImageURL, base).href;
            cheese.oldPrice = $(elem).children("span.oldPrice").text();
            cheese.currentPrice = $(elem).children("span.price").text();

            const price = cheese.currentPrice.replace("£", "");
            totalPrice = totalPrice + parseFloat(price);

	        cheeses.push(cheese);
        })

        var noOfCheeses = "The total number of cheeses is " + cheeses.length;
        var avgPrice = "The average price of all items is £" + Math.round(totalPrice/cheeses.length * 100) / 100;

        cheeses.push(noOfCheeses);
        cheeses.push(avgPrice);

        var fs = require('fs');
        fs.writeFile("app.json", JSON.stringify(cheeses), function(error) {
            if (error) {
                console.log(error);
            }
        });

    })
    .catch(function(error) {
        //Print error if any occured
        console.error('Error!: ', error.message);
    })