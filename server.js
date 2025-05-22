const http = require('http');

const server = http.createServer(routing);

function routing(req, res) {
    let url = req.url;
    if (url.startsWith('/form')) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(`
            <html>
    <head>
      <title>Feedback Form</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          padding: 20px;
          margin: 0;
          background-color: #f9f9f9;
        }

        form {
          max-width: 500px;
          margin: auto;
          background-color: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        p {
          font-size: 1.2em;
          margin-bottom: 20px;
        }

        label {
          display: block;
          font-size: 1.1em;
          padding: 10px 0;
          cursor: pointer;
        }

        input[type="radio"] {
          margin-right: 10px;
          transform: scale(1.3);
        }

        input[type="submit"],
        input[type="reset"] {
          padding: 12px 20px;
          font-size: 1em;
          margin: 10px 5px 0 0;
          border: none;
          border-radius: 5px;
          background-color: #007AFF;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        input[type="reset"] {
          background-color: #ccc;
          color: #333;
        }

        input[type="submit"]:hover {
          background-color: #005FCC;
        }

        input[type="reset"]:hover {
          background-color: #bbb;
        }

        @media (max-width: 768px) {
          form {
            padding: 20px;
          }

          input[type="submit"],
          input[type="reset"] {
            width: 100%;
            margin: 10px 0;
          }
        }
      </style>
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