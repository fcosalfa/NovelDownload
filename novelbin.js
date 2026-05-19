import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';      // Namespace import for cheerio
import fs from 'node:fs'; 
import sleep from 'await-sleep';

const baseUrl = 'https://freewebnovel.com';
var firstChapURL = 'https://freewebnovel.com/novel/qi-cultivation-starting-from-the-repair-panel/chapter-1';
var TotalChap = 1;

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
        //const ChapterTitle = $('.chr-title').attr('title') + '\n'; 
        //content = '# ' + content + ChapterTitle;
        content = "# Chapter : " + TotalChap + '\n'; 


        // Select all p elements
        const paragraphs = $('#article p');

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
        const nextPageLink = $('#next_url');


        // If there is a link to the next page
        if (nextPageLink.length > 0) {

            // Get the href attribute of the link
            const nextPageUrl = baseUrl + nextPageLink.attr('href');

            // Debug
            console.log("Extract Chapter No. : " + TotalChap);
            console.log("Extract URL : " + nextPageUrl);

            // Chapter counter
            TotalChap = TotalChap + 1;

            // Wait 2 seconds before the next page
            await sleep(500); 
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
