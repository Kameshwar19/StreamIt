const express = require('express');
const app = express();
app.all('*', (req, res) => {
    res.json({
        message: 'Test route',
        method: req.method,
        url: req.url,
        originalUrl: req.originalUrl,
        path: req.path
    });
});
module.exports = app;
