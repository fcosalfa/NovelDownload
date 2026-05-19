import request from 'request';           // Default import for request
import * as cheerio from 'cheerio';      // Namespace import for cheerio
import fs from 'node:fs';                // Native module (node: prefix is best practice)


// Define the URL of the website you want to crawl
const baseUrl = 'https://novelfull.com';

// Define the first chapter 
const url = 'https://novelfull.com/steadily-becoming-a-saint-the-immortal-officials-hired-me-to-tend-the-horses/chapter-1-chapter-1-seizing-life-span.html';

let TotalChap = 1;
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

				// Completed the URL
				const Nextpage = baseUrl + nextPageUrl;

				// Debug
				console.log("Extract Chapter No. : " + TotalChap);
				console.log("Extract URL : " + Nextpage);

				// Chapter counter
				TotalChap = TotalChap + 1;

				crawlPage(Nextpage);

				// Check the length of the URL
				// Shorten URL
				/*
				if(Nextpage.length > 120){
					TinyURL.shorten(Nextpage, function(nextUrl, err) {
						crawlPage(nextUrl);
					});
				} 
				else {
					crawlPage(Nextpage);
				}
				*/
	      	}
	    }
	    else {
	    	console.log(error);
	    	console.log("Status Code : " + response.statusCode);
	    	//console.log(html);
	    	console.log(url);
	    }
  });
}

// Start the crawl by calling the crawlPage function with the initial URL
crawlPage(url);