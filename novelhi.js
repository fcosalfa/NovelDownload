import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';      // Namespace import for cheerio
import fs from 'node:fs'; 
import sleep from 'await-sleep';

const baseUrl = 'https://novelhi.com/s/Godlevel-Pet-Evolution-System/';
var firstChapURL = 'https://novelhi.com/s/Godlevel-Pet-Evolution-System/2211';
var TotalChap = 2211;

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
        const ChapterTitle = "# Chapter : " + TotalChap + '\n'; 
        content = content + ChapterTitle;

        // Select all p elements
        const paragraphs = $('#showReading sent');

        // Iterate over the elements
        paragraphs.each((i, element) => {
            const text = $(element).text();
            content = content + text + '\n';
        });

        // Write text to the file
        fs.appendFile('new-file.txt', content, {encoding: 'utf8'}, (err) => {
            if (err) throw err;
        });


        // Debug
        console.log("Extract Chapter No. : " + TotalChap);        
        
        // Chapter counter
        TotalChap = TotalChap + 1;

        // Get the href attribute of the link
        const nextPageUrl = baseUrl + TotalChap;

        // Debug
        console.log("Next Chapter URL    : " + nextPageUrl);

        // Wait 1 seconds before the next page
        await sleep(100); 
        await CrawlNovelFull(nextPageUrl);
        
    } catch (error) {
        if (error.response && error.response.statusCode === 403) {
            console.error('Still blocked with 403. The site might require a full browser (Playwright).');
        } else {
            console.error('Error:', error.message);
        }
    }
}

CrawlNovelFull(firstChapURL);
