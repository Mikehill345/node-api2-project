const express = require('express');
const postsRouter = require('./hubs/posts-router.js')

const server = express();

server.use(express.json());
server.use(postsRouter)
server.get('/', (req, res) => {
  res.send(`
    <h2>Sanity Check</h>
  `);
});



module.exports = server