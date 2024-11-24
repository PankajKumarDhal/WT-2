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

            try {
                await page.goto(url, { waitUntil: 'networkidle2' });

                const data = await page.evaluate(() => {
                    const rows = Array.from(document.querySelectorAll('.table tbody tr'));
                    return rows.slice(0, 10).map(row => {
                        const columns = row.querySelectorAll('td');
                        return {
                            player: columns[1]?.innerText.trim() || 'Unknown',
                            value: parseInt(columns[2]?.innerText.replace(/,/g, '').trim(), 10) || 0
                        };
                    });
                });

                seasonData.stats[category.name] = data.filter(item => item.value > 0); // Ensure no zero-value entries
            } catch (error) {
                console.error(`Error fetching ${category.name} for season ${season}:`, error);
                seasonData.stats[category.name] = [];
            }
        }

        result.push(seasonData);
        console.log(`Data for season ${season} collected.`);
    }

    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
    console.log(`All data saved to ${outputFile}`);
    await browser.close();
})();



// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');

// (async () => {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     const baseUrl = 'https://www.iplt20.com/stats/';
//     const outputFile = path.join(__dirname, 'ipl-stats.json');
//     const seasons = [2023, 2022, 2021, 2020, 2019];
//     const categories = [
//         { name: 'orangeCap', url: 'most-runs' },
//         { name: 'mostFours', url: 'most-fours' },
//         { name: 'mostSixes', url: 'most-sixes' },
//         { name: 'mostCenturies', url: 'most-centuries' },
//         { name: 'mostFifties', url: 'most-fifties' }
//     ];

//     const result = [];

//     for (let season of seasons) {
//         const seasonData = { season, stats: {} };

//         for (let category of categories) {
//             const url = `${baseUrl}${category.url}?season=${season}`;
//             console.log(`Fetching ${category.name} for season ${season} from ${url}...`);

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

//             seasonData.stats[category.name] = data;
//         }

//         result.push(seasonData);
//         console.log(`Data for season ${season} collected.`);
//     }

//     fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));
//     console.log(`All data saved to ${outputFile}`);
//     await browser.close();
// })();
