const http = require('http');
const app = require('../../server.js');
const models = require('../../app/models')
const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

const server = http.createServer(app);
models.sequelize.sync().then(() => {
    server.listen(port);
    console.log("Magic happens at: " + port);
})