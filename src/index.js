const path = require('path');
const ObjectsToCsv = require('objects-to-csv');
const csv = require('csvtojson');

const { promiseQuery } = require('./config');

const csvFilePath = path.join(__dirname, '../LISTA_PIRAMIDE.csv');

const loadedRowsFilePath = path.join(
	__dirname,
	'../ARTICULOS_SUBIDOS_CORRECTAMENTE.csv',
);
const unloadedRowsFilePath = path.join(__dirname, '../ARTICULOS_SIN_SUBIR.csv');

const initProcess = async (query) => {
	const DEFAULT_DIVION = 'LurinPS';

	try {
		console.log('Get all categories');
		const categories = await query('SELECT idcategoria ,nombre FROM categoria');

		console.log('Get all records from csv');
		const loadedRows = [];
		const ignoredRows = [];
		await csv({ trim: true, delimiter: [','] })
			.fromFile(csvFilePath)
			.on('data', async (data) => {
				// Add processing data
				const newItem = {};
				const parsed = JSON.parse(data.toString('utf8'));
				const category = categories.find(
					(cat) =>
						cat.nombre.toLowerCase() === parsed.CATEGORY.toLowerCase().trim(),
				);

				if (!category) {
					console.log(`Sin categoria, Item #: ${parsed.ITEM}`);
					ignoredRows.push(parsed);

					return;
				}
				try {
					newItem.idcategoria = category.idcategoria;
					newItem.codigo = parsed.SKU;
					newItem.nombre = parsed.DESCRIPTION.replace(/"/g, '&quot;');
					newItem.stock = Number(parsed.STOCK);
					newItem.stock2 = parsed.STOCK;
					newItem.tiempo_entrega = 'Inmediato';
					newItem.precio_venta = Number(parsed.PRICE);
					newItem.division = DEFAULT_DIVION;

					loadedRows.push(newItem);
					await query(`INSERT INTO articulo SET ?`, newItem);
				} catch (error) {
					throw new Error(
						`Error on article sku, code: ${newItem.codigo}, error: ${error.message}`,
					);
				}
			})
			.on('error', (error) => {
				throw new Error(error);
			});

		const loadedRowsCsv = new ObjectsToCsv(loadedRows);
		const unloadedRowCsv = new ObjectsToCsv(ignoredRows);

		await loadedRowsCsv.toDisk(loadedRowsFilePath, { append: true });
		await unloadedRowCsv.toDisk(unloadedRowsFilePath, { append: true });

		console.log(
			`Not loaded rows, Item #: \n ${ignoredRows
				.map((row, idx) => `${idx}=> ${row.ITEM}`)
				.join(`\n`)}`,
		);
		console.log(`Not Loaded rows count: ${ignoredRows.length}`);
		console.log(`Loaded Rows count: ${loadedRows.length}`);
	} catch (error) {
		throw new Error(error);
	}
};

initProcess(promiseQuery)
	.then(() => console.log(`Finished =)`))
	.catch((err) => console.log(`Error on process: ${err.stack}`));
