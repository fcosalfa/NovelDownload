const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// Define the URL of the website you want to crawl
 const baseUrl = 'https://www.fanmtl.com/';

// Define the first chapter 
const url = 'https://www.fanmtl.com/novel/following-a-hundred-years-of-cultivation-im-dying-before-i-got-cheats_1.html';

let TotalChap = 0;
//let ThisChap = 1049
let content;
let TextChap = url.split("_")[1].split(".")[0];

function crawlPage(url) {
	// Make an HTTP request to the website
	request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {

    	content = "";


      	// Load the HTML into cheerio
      	const $ = cheerio.load(html);

		// Select Chapter title		
		const ChapterTitle = $('header .titles h2').text();

		if(ChapterTitle !== "") {
			content = '# ' + ChapterTitle + '\n';
		}
		else{
			content = '# Chapter ' + ThisChap + '\n';
		}
		


		// Select all p elements
      	const paragraphs = $('.chapter-content p');

		// Iterate over the elements
		paragraphs.each((i, element) => {
		  	// Get the text content of the element
		  	const text = $(element).text();
			content = content + text + '\n';
		});

		// Write text to the file
		fs.appendFile('new-file.txt', content, {encoding: 'utf8'}, (err) => {
			if (err) throw err;
		});

		

		// Look for a link to the next page
		// const nextPageLink = $('.navimedia .left .');
		//const nextPageLink = $('.nextchap');

		// If there is a link to the next page
		//if (nextPageLink.length > 0) {

		// Get the href attribute of the link
		const nextPageUrl = "https://www.fanmtl.com/novel/online-game-god-tier-assassin-i-am-the-shadow_" + ThisChap + ".html"; 

		// Chapter counter
		TotalChap = TotalChap + 1;
		//ThisChap = ThisChap + 1;
		TextChap = TextChap + 1
		console.log(TextChap);

		// Check the length of the URL
		// Shorten URL
		if(nextPageUrl.length > 120){
			TinyURL.shorten(nextPageUrl, function(nextUrl, err) {
				crawlPage(nextUrl);
			});
		} else {
			crawlPage(nextPageUrl);
		}

			
      	//}
      	


    } else {
	    	console.log(error);
	    	console.log(url);
    }
  });
}

// Start the crawl by calling the crawlPage function with the initial URL
crawlPage(url);
