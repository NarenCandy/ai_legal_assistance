const http = require('http');

const data = JSON.stringify({
    documentText: 'This is a test document. The contract duration is 12 months.',
    question: 'What is the contract duration?'
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/ask',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    let body = '';

    res.on('data', chunk => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', body);
    });
});

req.on('error', error => {
    console.error('Request error:', error);
});

req.write(data);
req.end();