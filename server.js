const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve Swagger UI from the swagger-ui-dist package
app.use(express.static(path.join(__dirname, 'node_modules', 'swagger-ui-dist')));

// Serve the index.html file (Swagger UI entry point)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Swagger UI running at http://localhost:${port}`);
});
