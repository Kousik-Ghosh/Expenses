const express = require("../node/node_modules/express");
const bodyParser = require("../node/node_modules/body-parser");
const dbConnectionPool = require("./util/dbConnectionPool.js");
const cors = require("../node/node_modules/cors");

const app = new express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = 3000;

app.get("/expenses/api/ping", function (request, response) {
    response.send("OK");
});

app.get("/expenses/api/expenses", function (request, response) {
    dbConnectionPool.getDBConnection().query("SELECT f_expense_uuid, f_expense_name, f_expense_date_time, f_expense_cost FROM t_expenses order by f_expense_date_time desc", function (err, result) {
        if (err) {
            response.status(500);
            response.send("Internal Server Error");
        } else {
            response.send(result);
        }
    });
});

app.post("/expenses/api/expenses", function (request, response) {
    const insertQuery = "insert into T_Expenses values(uuid(),'" + request.body.expenseDateTime + "','" + request.body.expenseName + "'," + request.body.expenseAmount + ");"
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

app.delete("/expenses/api/expenses/:expense_uuid", function (request, response) {
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

app.get("/expenses/api/expenses/filter/today", function (request, response) {
    dbConnectionPool.getDBConnection().query("SELECT f_expense_uuid, f_expense_name, f_expense_date_time, f_expense_cost FROM t_expenses where date(f_expense_date_time) = curdate() order by f_expense_date_time desc", function (err, result) {
        if (err) {
            response.status(500);
            response.send("Internal Server Error");
        } else {
            response.send(result);
        }
    });
});

app.get("/expenses/api/expenses/filter/thismonth", function (request, response) {
    dbConnectionPool.getDBConnection().query("SELECT f_expense_uuid, f_expense_name, f_expense_date_time, f_expense_cost FROM t_expenses where month(f_expense_date_time) = month(now()) order by f_expense_date_time desc", function (err, result) {
        if (err) {
            response.status(500);
            response.send("Internal Server Error");
        } else {
            response.send(result);
        }
    });
});


app.listen(PORT, function () {
    console.log("Expenses API server status : running");
    console.log("Expenses API server port   : " + PORT);
})