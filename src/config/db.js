require('dotenv').config();

exports.mysqlConfig = {
	HOST: process.env.MYSQL_HOST,
	PORT: Number(process.env.MYSQL_PORT),
	USER: process.env.MYSQL_USER,
	PASSWORD: process.env.MYSQL_PASSWORD,
	DB_NAME: process.env.MYSQL_DB_NAME || 'test',
};
