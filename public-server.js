const express = require("./node/node_modules/express");
const path = require('path');

const app = express();
const router = express.Router();
const PORT = process.env.port || 3001;

router.get("/ping", function (request, response) {
    response.send("OK");
});

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

router.get('/addExpenses', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/addExpenses.html'));
});


app.use('/expenses/assets', express.static(__dirname + "/public/js"));
app.use('/expenses/assets', express.static(__dirname + "/public/css"));
app.use('/expenses/assets', express.static(__dirname + "/public/fonts"));
app.use('/expenses/assets', express.static(__dirname + "/public/images"));
app.use('/expenses', router);

app.listen(PORT, function () {
    console.log("Expenses public server status : running");
    console.log("Expenses public server port   : " + PORT);
})