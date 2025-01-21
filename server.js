const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to serve seeds data
app.get('/api/seeds', (req, res) => {
    fs.readFile('scarlet6iv5star.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).send('Internal Server Error');
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData.seeds);
        } catch (err) {
            console.error('Error parsing JSON data:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
