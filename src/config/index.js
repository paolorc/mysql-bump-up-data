const mysql = require('mysql');
const { promisify } = require('util');

const { mysqlConfig } = require('./db');

const connection = mysql.createConnection({
	host: mysqlConfig.HOST,
	port: mysqlConfig.PORT,
	user: mysqlConfig.USER,
	password: mysqlConfig.PASSWORD,
	database: mysqlConfig.DB_NAME,
});

exports.asyncQuery = promisify(connection.query).bind(connection);
