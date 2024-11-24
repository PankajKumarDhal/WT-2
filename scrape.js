// const puppeteer = require('puppeteer');
// const fs = require('fs');

// const scrapeIPLStats = async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
    
//     const url = "https://www.iplt20.com/stats/"; // IPL stats URL
//     await page.goto(url, { waitUntil: "networkidle2" });

//     const data = [];

//     // Scrape data for the last 5 seasons
//     for (let season = 2023; season >= 2019; season--) {
//         console.log(`Scraping season ${season}`);
        
//         // Update selector logic based on website structure
//         await page.goto(`${url}?season=${season}`, { waitUntil: "networkidle2" });
//         await page.waitForSelector('.stats-table tbody'); // Example selector for table rows

//         const seasonData = await page.evaluate(() => {
//             const rows = Array.from(document.querySelectorAll('.stats-table tbody tr'));
//             return rows.slice(0, 10).map(row => {
//                 const columns = row.querySelectorAll('td');
//                 return {
//                     player: columns[0]?.innerText.trim(),
//                     runs: columns[1]?.innerText.trim(),
//                     fours: columns[2]?.innerText.trim(),
//                     sixes: columns[3]?.innerText.trim(),
//                     centuries: columns[4]?.innerText.trim(),
//                     fifties: columns[5]?.innerText.trim()
//                 };
//             });
//         });

//         data.push({ season, stats: seasonData });
//     }

//     await browser.close();
//     fs.writeFileSync('ipl-stats.json', JSON.stringify(data, null, 2));
//     console.log("Data scraped and saved to ipl-stats.json");
// };

// scrapeIPLStats().catch(console.error);

// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');

// (async () => {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     const baseUrl = 'https://www.iplt20.com/stats/';
//     const outputDir = path.join(__dirname, 'data');
//     if (!fs.existsSync(outputDir)) {
//         fs.mkdirSync(outputDir);
//     }

//     const categories = [
//         { name: 'orange-cap', url: 'most-runs', key: 'runs' },
//         { name: 'most-fours', url: 'most-fours', key: 'fours' },
//         { name: 'most-sixes', url: 'most-sixes', key: 'sixes' },
//         { name: 'most-centuries', url: 'most-centuries', key: 'centuries' },
//         { name: 'most-fifties', url: 'most-fifties', key: 'fifties' }
//     ];

//     const seasons = [2023, 2022, 2021, 2020, 2019]; // Last 5 seasons

//     for (let season of seasons) {
//         console.log(`Scraping data for season ${season}...`);
//         const seasonData = {};

//         for (let category of categories) {
//             const url = `${baseUrl}${category.url}?season=${season}`;
//             console.log(`Fetching data for ${category.name} from ${url}...`);
//             await page.goto(url, { waitUntil: 'networkidle2' });

//             const data = await page.evaluate(() => {
//                 const rows = Array.from(document.querySelectorAll('.table tbody tr'));
//                 return rows.slice(0, 10).map(row => {
//                     const columns = row.querySelectorAll('td');
//                     return {
//                         player: columns[1]?.innerText.trim(),
//                         value: parseInt(columns[2]?.innerText.trim(), 10) || 0
//                     };
//                 });
//             });

//             seasonData[category.name] = data;
//         }

//         // Save the season data to a JSON file
//         const outputFilePath = path.join(outputDir, `season-${season}.json`);
//         fs.writeFileSync(outputFilePath, JSON.stringify(seasonData, null, 2));
//         console.log(`Data for season ${season} saved to ${outputFilePath}`);
//     }

//     console.log('Scraping completed!');
//     await browser.close();
// })();

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const baseUrl = 'https://www.iplt20.com/stats/';
    const outputFile = path.join(__dirname, 'ipl-stats.json');
    const seasons = [2023, 2022, 2021, 2020, 2019];
    const categories = [
        { name: 'orangeCap', url: 'most-runs' },
        { name: 'mostFours', url: 'most-fours' },
        { name: 'mostSixes', url: 'most-sixes' },
        { name: 'mostCenturies', url: 'most-centuries' },
        { name: 'mostFifties', url: 'most-fifties' }
    ];

    const result = [];

    for (let season of seasons) {
        const seasonData = { season, stats: {} };

        for (let category of categories) {
            const url = `${baseUrl}${category.url}?season=${season}`;
            console.log(`Fetching ${category.name} for season ${season} from ${url}...`);

            await page.goto(url, { waitUntil: 'networkidle2' });

            const data = await page.evaluate(() => {
                const rows = Array.from(document.querySelectorAll('.table tbody tr'));
                return rows.slice(0, 10).map(row => {
                    const columns = row.querySelectorAll('td');
                    return {
                        player: columns[1]?.innerText.trim(),
                        value: parseInt(columns[2]?.innerText.trim(), 10) || 0
                    };
                });
            });

            seasonData.stats[category.name] = data;
        }

        result.push(seasonData);
        console.log(`Data for season ${season} collected.`);
    }

    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
    console.log(`All data saved to ${outputFile}`);
    await browser.close();
})();
