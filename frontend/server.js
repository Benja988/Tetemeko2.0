// // server.js


// const express = require('express');
// const next = require('next');

// const dev = process.env.NODE_ENV !== 'production';
// const hostname = process.env.NODE_ENV !== 'production'  ? '0.0.0.0'  : 'tetemekomediagroup.org';
// const port = process.env.PORT || 3000;
// const app = next({ dev, hostname, port });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();

//   server.get('*', (req, res) => {
//     return handle(req, res);
//   });

//   server.listen(3000, (err) => {
//     if (err) throw err;
//     console.log('> Ready on http://localhost:3000');
//   });
// });
