const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');

const app = express();

mongoose.connect('mongodb+srv://alymab:website4002@cluster.tcgt3ij.mongodb.net/?retryWrites=true&w=majority&appName=cluster'); 

app.use(express.json());
app.use(routes);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

module.exports = app;

