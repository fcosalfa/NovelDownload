import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';      // Namespace import for cheerio
import fs from 'node:fs'; 
import sleep from 'await-sleep';

const baseUrl = 'https://novelfull.com';
var firstChapURL = 'https://novelfull.com/the-clan-master-cant-possibly-be-a-mortal/chapter-1999-qingchen-ancient-immortals-frustration-atop-the-green-mountain.html';
var TotalChap = 1999;

async function CrawlNovelFull(firstChapURL){
    try {
        const response = await gotScraping.get({
            url: firstChapURL, // Put your target URL here
        });

        // Reset content for the new chapter
        let content = "";

        // Load the HTML into cheerio
        const $ = cheerio.load(response.body);

        // Select Chapter title
        const ChapterTitle = $('.chapter-text').text() + '\n'; 
        content = '# ' + content + ChapterTitle;

        // Select all p elements
        const paragraphs = $('#chapter-content p');

        // Iterate over the elements
        paragraphs.each((i, element) => {
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
            const nextPageUrl = baseUrl + nextPageLink.attr('href');

            // Debug
            console.log("Extracted Chapter No. : " + TotalChap);
            console.log("Next chapter URL : " + nextPageUrl);

            // Chapter counter
            TotalChap = TotalChap + 1;

            // Wait 2 seconds before the next page
            await sleep(100); 
            await CrawlNovelFull(nextPageUrl);
        }
        
    } catch (error) {
        if (error.response && error.response.statusCode === 403) {
            console.error('Still blocked with 403. The site might require a full browser (Playwright).');
        } else {
            console.error('Error:', error.message);
        }
    }
}

CrawlNovelFull(firstChapURL);
