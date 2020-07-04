const express = require("./node/node_modules/express");
const path = require('path');
const bodyParser = require("./node/node_modules/body-parser");
const dbConnectionPool = require("./util/dbConnectionPool.js");

const app = express();
const router = express.Router();
const PORT = process.env.port || 80;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


router.get("/all", function (request, response) {
    dbConnectionPool.getDBConnection().query("SELECT f_expense_uuid, f_expense_name, f_expense_date_time, f_expense_cost FROM t_expenses order by f_expense_date_time desc", function (err, result) {
        if (err) {
            response.status(500);
            response.send("Internal Server Error");
        } else {
            response.send(result);
        }
    });
});

router.post("/create", function (request, response) {
    const insertQuery = "insert into t_expenses values(uuid(),'" + request.body.expenseDateTime + "','" + request.body.expenseName + "'," + request.body.expenseAmount + ");"
    dbConnectionPool.getDBConnection().query(insertQuery, function (err, result) {
        if (err) {
            console.log(err);
            response.status(500);
            response.send("Internal Server Error");
        } else {
            response.status(200);
            response.send("Data Recieved");
        }
    });
});

router.delete("/:expense_uuid", function (request, response) {
    const insertQuery = "delete from t_expenses where f_expense_uuid = '" + request.params.expense_uuid + "';";
    dbConnectionPool.getDBConnection().query(insertQuery, function (err, result) {
        if (err) {
            console.log(err);
            response.status(500);
            response.send("Internal Server Error");
        } else {
            response.status(200);
            response.send("Data Recieved");
        }
    });
});

router.get("/filter/today", function (request, response) {
    dbConnectionPool.getDBConnection().query("SELECT f_expense_uuid, f_expense_name, f_expense_date_time, f_expense_cost FROM t_expenses where date(f_expense_date_time) = curdate() order by f_expense_date_time desc", function (err, result) {
        if (err) {
            response.status(500);
            response.send("Internal Server Error");
        } else {
            response.send(result);
        }
    });
});

router.get("/filter/thismonth", function (request, response) {
    dbConnectionPool.getDBConnection().query("SELECT f_expense_uuid, f_expense_name, f_expense_date_time, f_expense_cost FROM t_expenses where month(f_expense_date_time) = month(now()) order by f_expense_date_time desc", function (err, result) {
        if (err) {
            response.status(500);
            response.send("Internal Server Error");
        } else {
            response.send(result);
        }
    });
});

router.get("/ping", function (request, response) {
    response.send("OK");
});

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use('/expenses/assets', express.static(__dirname + "/public/js"));
app.use('/expenses/assets', express.static(__dirname + "/public/css"));
app.use('/expenses/assets', express.static(__dirname + "/public/fonts"));
app.use('/expenses/assets', express.static(__dirname + "/public/images"));
app.use('/expenses', router);

app.listen(PORT, function () {
    console.log("Expenses server status : running");
    console.log("Expenses server port   : " + PORT);
})