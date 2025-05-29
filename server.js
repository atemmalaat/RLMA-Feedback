// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Define paths
const dataDir = path.join(__dirname, 'data');
const dataPath = path.join(dataDir, 'feedbackData.json');
const publicDir = path.join(__dirname, 'public');
const viewsDir = path.join(__dirname, 'views');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initial feedback options and their default counts
const initialCounts = {
    facebook: 0,
    instagram: 0,
    google: 0,
    tv: 0,
    tiktok: 0,
    people: 0,
    // Add any new feedback options here with a default count of 0
};

// --- Functions for reading and writing counts ---

// Function to read counts from feedbackData.json
function readCounts() {
    try {
        // Check if the file exists
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            // Check if data is empty or not valid JSON
            if (data.trim() === '') {
                console.log("JSON file is empty. Initializing with default counts.");
                writeCounts(initialCounts); // Initialize with default counts
                return { ...initialCounts }; // Return a copy
            }
            const counts = JSON.parse(data);
            // Ensure all initial keys are present, add if missing (for backward compatibility if new options are added)
            let needsUpdate = false;
            for (const key in initialCounts) {
                if (!counts.hasOwnProperty(key)) {
                    counts[key] = 0;
                    needsUpdate = true;
                }
            }
            if (needsUpdate) {
                writeCounts(counts);
            }
            return counts;
        } else {
            // File doesn't exist, create it with initial counts
            console.log("JSON file not found. Creating and initializing with default counts.");
            writeCounts(initialCounts);
            return { ...initialCounts }; // Return a copy
        }
    } catch (error) {
        console.error("Error encountered reading or parsing JSON:", error);
        // If there's an error (e.g., corrupt file), try to re-initialize
        console.log("Attempting to re-initialize JSON file due to error.");
        writeCounts(initialCounts);
        return { ...initialCounts }; // Return a copy of initial counts as a fallback
    }
}

// Function to write counts to feedbackData.json
function writeCounts(counts) {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(counts, null, 2), 'utf8');
    } catch (err) {
        console.error("Error writing JSON file:", err);
    }
}

// --- Middleware ---
// Serve static files (CSS, images, client-side JS) from the 'public' folder
app.use(express.static(publicDir));

// --- Routes ---

// Route for the main feedback form
// This will serve the index.html file from the 'views' folder
app.get('/form', (req, res) => {
    res.sendFile(path.join(viewsDir, 'index.html'));
});

// Route for the success page (handles form submission via GET)
app.get('/success_page', (req, res) => {
    const source = req.query.feedback; // Get the 'feedback' value from the URL query string
    const counts = readCounts();

    if (source) { // Check if a source was provided
        if (counts.hasOwnProperty(source)) {
            counts[source]++;
            writeCounts(counts);
            console.log(`[✅] Feedback received for '${source}'. New count: ${counts[source]}. Current counts:`, counts);
        } else {
            console.warn(`[⚠️] Received unknown feedback source: '${source}'. Not counted.`);
        }
    } else {
        console.warn(`[⚠️] Received submission to /success_page without 'feedback' query parameter.`);
    }

    // Send a simple success page
    // The CSS for this page should also be in the 'public' folder and linked as /styles.css
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Feedback Submitted!</title>
            <link href="/styles.css" rel="stylesheet"> <style>
                body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background-color: #f9f9f9;
                    text-align: center;
                    padding: 20px;
                    box-sizing: border-box;
                }
                .success-container {
                    background-color: #ffffff;
                    padding: 30px 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #28a745; /* Green color for success */
                    font-size: 2em;
                    margin-bottom: 20px;
                }
                p {
                    font-size: 1.2em;
                    color: #333;
                    margin-bottom: 30px;
                }
                .back-button {
                    display: inline-block;
                    padding: 12px 25px;
                    font-size: 1em;
                    color: white;
                    background-color: #007AFF;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
                .back-button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="success-container">
                <h1>🎉 Thank You!</h1>
                <p>Your feedback has been successfully recorded.</p>
                <a href="/form" class="back-button">Submit Another Feedback</a>
            </div>
        </body>
        </html>
    `);
});

// --- Start the server ---
app.listen(PORT, () => {
    console.log(`🔥 Server listening at http://localhost:${PORT}`);
    console.log(`📝 Feedback form available at http://localhost:${PORT}/form`);
    // Initialize/check data file on server start
    readCounts();
    console.log("Current feedback counts on startup:", readCounts());
});
