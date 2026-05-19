const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// Define the URL of the website you want to crawl
// const baseUrl = 'https://boxnovel.com/';

// Define the first chapter 
const url = 'https://boxnovel.com/novel/signing-in-at-mount-sword-for-100-years-to-become-invincible/chapter-1/';

let TotalChap = 0;
let ThisChap = 1
let content;

function crawlPage(url) {
	// Make an HTTP request to the website
	request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {

    	content = "";

      	// Load the HTML into cheerio
      	const $ = cheerio.load(html);

		// Select Chapter title		
		content = '# Chapter' + ThisChap + '\n';

		// Select all p elements
		const paragraphs = $('.read-container p');

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
		const nextPageLink = $('.nav-next a');

		// If there is a link to the next page
		if (nextPageLink.length > 0) {

			// Get the href attribute of the link
			const nextPageUrl = nextPageLink.attr('href');

			// Chapter counter
			TotalChap = TotalChap + 1;
			ThisChap = ThisChap + 1;
			console.log(TotalChap);

			// Check the length of the URL
			// Shorten URL
			if(nextPageUrl.length > 120){
				TinyURL.shorten(nextPageUrl, function(nextUrl, err) {
					crawlPage(nextUrl);
				});
			} else {
				crawlPage(nextPageUrl);
			}
			
      	}
    } else {
	    	console.log(error);
	    	console.log(url);
    }
  });
}

// Start the crawl by calling the crawlPage function with the initial URL
crawlPage(url);
