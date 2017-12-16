const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./app/apiRoutes.js');

/* Require .env */
const dotenv = require('dotenv');
dotenv.config();
dotenv.load();

const port = process.env.PORT || 4000


if (process.env.NODE_ENV !== 'production') {
    const webpackDevHelper = require('./index.dev.js')
    const logger = require('morgan')
    console.log('DEVELOPMENT ENVIRONMENT: Turning on WebPack Middleware...')
    app.use(logger('dev'));
    webpackDevHelper.useWebpackMiddleware(app)
} else {
    console.log('PRODUCTION ENVIRONMENT..')
    app.use('/js', express.static(__dirname + '/dist/js'))
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'assets')));
// app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/api',apiRoutes);

/* Index route */
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

/* Ignite server */
app.listen(port, () => {
  console.log("Server running at http://localhost:" + port);
})
