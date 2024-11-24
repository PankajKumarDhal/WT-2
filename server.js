const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public')); // Serve static files (HTML, JS, CSS)

// Endpoint to serve IPL data
app.get('/data', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('ipl-stats.json', 'utf-8'));
        res.json(data);
    } catch (error) {
        console.error('Error reading IPL stats file:', error);
        res.status(500).json({ error: 'Failed to load IPL data' });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


// const express = require('express');
// const fs = require('fs');
// const app = express();

// app.use(express.static('public')); // Serve static files (HTML, JS, CSS)

// app.get('/data', (req, res) => {
//     const data = JSON.parse(fs.readFileSync('ipl-stats.json', 'utf-8'));
//     res.json(data);
// });

// // app.listen(3000, () => console.log("Server running at http://localhost:3000"));
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

