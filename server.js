const express = require('express');
const path = require('path');

//for data storage 
const fs = require('fs');
const dataPath = './data/feedbackData.json'

const app = express();
const PORT = 3000;

//Create functions for reading and writing counts
//read
function readCounts() {
  try {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
  } catch (error) {
    console.log("Error encountered reading the JSON:", err);
    return {};
  }
}

function writeCounts(counts) {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(counts, null, 2));
    } catch (err) {
        console.error("Error writing JSON file:", err);
    }
}

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for feedback form
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route for success page
app.get('/success_page', (req, res) => {
    const source = req.query.feedback;
    const counts = readCounts();

    if (source && counts.hasOwnProperty(source)) {
        counts[source]++;
        writeCounts(counts);
        console.log(`[✅] ${source} +1 ->`, counts[source]);
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Success</title>
            <link href="/styles.css" rel="stylesheet">
            <style>
                .back-button {
                    display: inline-block;
                    margin-top: 30px;
                    padding: 15px 30px;
                    background-color: #007BFF;
                    color: white;
                    font-size: 18px;
                    text-decoration: none;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .back-button:hover {
                    background-color: #0056b3;
                }

                body {
                    text-align: center;
                    padding: 100px;
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                }
            </style>
        </head>
        <body>
            <h1>🎉 Thank you for your feedback!</h1>
            <a href="/form" class="back-button">Give More Feedback</a>
        </body>
        </html>
    `);
});


// Start the server
app.listen(PORT, () => {
    console.log(`🔥 Server listening at http://localhost:${PORT}`);
});
































/*
function routing(req, res) {
    let url = req.url;

    if (url === '/public/styles.css') {
        const cssPath = path.join(__dirname, 'public', 'styles.css');
        fs.readFile(cssPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("CSS not found");
            } else {
                res.writeHead(200, {"Content-Type": "text/css"});
                res.write(data);
                res.end();
            }
        });
    } else if (url.startsWith('/form')) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(`
            <html>
    <head>
      <title>Feedback Form</title>
      <link href="/public/styles.css" rel="stylesheet">
    </head>
    <body>
      <form action="/success_page">
        <p>How did you hear about us?</p><br><br>
        <input type="radio" id="facebook" name="feedback" value="facebook">
        <label for="facebook">Facebook</label><br>

        <input type="radio" id="instagram" name="feedback" value="instagram">
        <label for="instagram">Instagram</label><br>

        <input type="radio" id="google" name="feedback" value="google">
        <label for="google">Google</label><br>

        <input type="radio" id="tv" name="feedback" value="tv">
        <label for="tv">TV</label><br>

        <input type="radio" id="tiktok" name="feedback" value="tiktok">
        <label for="tiktok">TikTok</label><br>

        <input type="radio" id="people" name="feedback" value="people">
        <label for="people">People</label><br>

        <input type="submit" value="Submit">
        <input type="reset" value="Reset">
      </form>
    </body>
  </html>`);
        res.end();
    } else if (url.startsWith('/success_page')) {
        res.write("This is the success page after the form is submitted - Success");
        res.end();
    } else {
        res.write('Invalid response');
        res.end();
    }
}

//listen on port 3000
server.listen(3000, () => {
    console.log("Server listening on port 3000... ");
})
*/