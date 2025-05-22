const http = require('http');

const server = http.createServer(routing);

function routing() {
    let url = res.url;
    if (url.startsWith('/form')) {
        console.log('The form page is working');
    } else {
        console.log('Invalid response');
    }
}

//listen on port 3000
server.listen(3000, () => {
    console.log("Server listening on port 3000... ");
})