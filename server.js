// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const app = express();

// app.use(bodyParser.json());
// app.use(express.static('public')); // Serve static files (HTML, JS, CSS)

// app.get('/data', (req, res) => {
//     const data = JSON.parse(fs.readFileSync('ipl-stats.json', 'utf-8'));
//     res.json(data);
// });

// app.listen(3000, () => console.log("Server running at http://localhost:3000"));

const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static('public')); // Serve static files (HTML, JS, CSS)

app.get('/data', (req, res) => {
    const data = JSON.parse(fs.readFileSync('ipl-stats.json', 'utf-8'));
    res.json(data);
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
