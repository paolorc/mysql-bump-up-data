const { asyncQuery } = require('./config');

const initProcess = async (query) => {
	try {
		console.log('init');
		return query('SELECT * FROM articulo');
	} catch (error) {
		throw new Error(error);
	}
};

initProcess(asyncQuery)
	.then((data) => console.log(data))
	.catch((err) => console.log(`Error on process: ${err.stack}`));
