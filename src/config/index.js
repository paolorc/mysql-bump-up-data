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

const query = (sql, args) => {
	const promiseQuery = promisify(connection.query).bind(connection);

	return promiseQuery(sql, args);
};

exports.connection = connection;
exports.promiseQuery = query;
