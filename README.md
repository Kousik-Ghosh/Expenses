<p  align="center"><img  src="https://raw.githubusercontent.com/Kousik-Ghosh/Expenses/master/public/images/AppScreenShot-phone.PNG"  alt="Expenses logo"></p>

# Expenses
Expenses is a NodeJS app that helps you to track your daily expenses. All the expense are shown as card and can be filter based on *today's total expenses* or *monthly total expenses*. 

# System Requirement
-	NodeJS - **14.2.0** *or above*
-	Mysql - **8.0.20** *or above*

# Installation
1.	Download the project zip into some folder and and extract it.
2.	[Install NodeJS](https://nodejs.org/en/download/ "NodeJS Homepage") *(if not already).* 
3.	Open terminal and navigate to the folder ``Expenses-master\node`` and type
```
$ npm install
```
4. [Install Mysql](https://dev.mysql.com/downloads/mysql/ "MySql Community") *(if not already).* 
5. Create the following schema with name **t_expenses**.
```
$ desc t_expenses;
+---------------------+--------------+------+-----+---------+-------+
| Field               | Type         | Null | Key | Default | Extra |
+---------------------+--------------+------+-----+---------+-------+
| f_expense_uuid      | varchar(36)  | NO   | PRI | NULL    |       |
| f_expense_date_time | datetime     | NO   |     | NULL    |       |
| f_expense_name      | varchar(35)  | NO   |     | NULL    |       |
| f_expense_cost      | decimal(6,2) | NO   |     | NULL    |       |
+---------------------+--------------+------+-----+---------+-------+
```
6.	Create a new Mysql user with access to this table and grant *select, insert, delete*. **(Not required if using root user)**
7.	Open file   ``Expenses-master\util\dbConfig.json `` and change the *user, password, database* values.
```
{
	"connectionLimit":"10"
	"host":"localhost",
	"user":"<your database user name> or root",
	"password":<your database user password> or root password"",
	"database":"<your database name>",
	"timezone":"ist"
}
```
8.	Open terminal and navigate to ``Expenses-master\`` and run the app.
```
$ node server.js
Expenses server status : running
Expenses server port   : 3000
```
9.	Open browser and hit ``http://localhost:3000/expenses/``.  and *Eureka!*