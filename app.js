const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const TinyURL = require('tinyurl');

// Define the URL of the website you want to crawl
const baseUrl = 'https://novelfull.com';

// Define the first chapter 
const url = 'https://novelfull.com/i-am-loaded-with-passive-skills/chapter-1.html';

let TotalChap = 0;
let content;

function crawlPage(url) {
	// Make an HTTP request to the website
	request(url, (error, response, html) => {
	    if (!error && response.statusCode == 200) {

	    	// Reset content for the new chapter
	    	content = "";

	      	// Load the HTML into cheerio
	      	const $ = cheerio.load(html);

			// Select Chapter title
			const ChapterTitle = $('.chapter-text').text() + '\n'; 
			content = '# ' + content + ChapterTitle;

			// Select all p elements
			const paragraphs = $('#chapter-content p');

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
			const nextPageLink = $('#next_chap');

			// If there is a link to the next page
			if (nextPageLink.length > 0) {

				// Get the href attribute of the link
				const nextPageUrl = nextPageLink.attr('href');

				// Chapter counter
				TotalChap = TotalChap + 1;
				console.log(TotalChap);

				// Completed the URL
				const Nextpage = baseUrl + nextPageUrl;

				// Check the length of the URL
				if(Nextpage.length > 120){
					// Shorten URL
					TinyURL.shorten(Nextpage, function(nextUrl, err) {
						crawlPage(nextUrl);
					});
				} else {
					crawlPage(Nextpage);
				}
	      	}
	    }
	    else {
	    	console.log(error);
	    	console.log(url);
	    }
  });
}

// Start the crawl by calling the crawlPage function with the initial URL
crawlPage(url);