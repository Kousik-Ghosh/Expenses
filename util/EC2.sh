#!/bin/bash
# For Pre-config of EC2 - System
sudo timedatectl set-timezone Asia/Kolkata
sudo apt-get update
sudo apt-get install -y nodejs
sudo apt-get install -y npm

# App setup
git clone https://github.com/Kousik-Ghosh/Expenses.git
cd Expenses/node/
npm install

# Mysql Setup
sudo apt-get install -y mysql-server
mysql -u root -p
create database db_expenses;
use db_expenses;
create table t_expenses (
     f_expense_uuid      varchar (36) not null primary key,
     f_expense_date_time datetime     not null,
     f_expense_name      varchar(35)  not null,
     f_expense_cost      decimal (6,2)     not null
     );
create user '<user-name>'@'localhost' identified by '<password>';
grant select, insert, delete on <database-name>.<table-name> to '<user-name>'@'localhost';

# Do not forget to update util/dbConfig.json