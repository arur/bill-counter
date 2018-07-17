'use strict';
const http = require('http');
const url = require('url');
const { parse } = require('querystring');
const PORT = process.env.PORT || 3000;

const countBills = require('./countBills');

const handle = {};
handle['/'] = indexHandler;

http.createServer(onRequest).listen(PORT, () => {
  console.log(`Server has started on port ${PORT}.`);
});

function onRequest(request, response) {
  let postData = [];
  const pathname = url.parse(request.url).pathname;

  request
    .on('error', err => {
      console.error(err);
    })
    .on('data', chunk => {
      postData.push(chunk);
    })
    .on('end', () => {
      postData = parse(Buffer.concat(postData).toString());

      route(handle, pathname, response, postData);
    });
}

// router
function route(handle, pathname, response, postData) {
  console.log('Routing a request for ' + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, postData);
  } else {
    console.log('No request handler found for ' + pathname);
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('404 Not found');
  }
}

// handler
function indexHandler(response, postData) {
  console.log("Request handler for '/' was called.");

  let data = '';

  if (postData && postData.amount) {
    const { amount } = postData;

    if (Number.isInteger(+amount)) {
      let bills = countBills(amount);

      data = `<h2>${amount}</h2><h3>Bills</h3><ul>
        ${bills
          .filter(({ type }) => type === 'bill')
          .map(({ quantity, value }) => `<li>${quantity} of ${value}</li>`)
          .join('')}
        </ul><h3>Big coins</h3><ul>
        ${bills
          .filter(({ type, size }) => type === 'coin' && size >= 5)
          .map(({ quantity, value }) => `<li>${quantity} of ${value}</li>`)
          .join('')}
        </ul><h3>Small coins</h3><ul>
        ${bills
          .filter(({ type, size }) => type === 'coin' && size < 5)
          .map(({ quantity, value }) => `<li>${quantity} of ${value}</li>`)
          .join('')}
        </ul>`;
    } else {
      console.log('Invalid input was submitted');
      data = `<p>${amount} is not valid number</p>`;
    }
  }

  const content = `<!doctype html><html><body>
      <form action="/" method="post">
      <input type="number" name="amount" />
      <input type="submit" value="Submit" />
      </form> ${data} </body></html>`;

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end(content);
}
