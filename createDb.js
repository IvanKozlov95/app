var mongoose = require('./libs/mongoose'),
 	log      = require('./utils/logger')(module),
	async 	 = require('async');

function open(cb){
    mongoose.connection.on('open', cb);
}

function dropDatabase(cb) {
	var db = mongoose.connection.db;
	db.dropDatabase(cb);
}

function requireModels(cb) {
	require('models');

    async.each(Object.keys[mongoose.models], function(modelName, cb) {
		mongoose.models[modelName].ensureIndexes(cb);     
	}, cb); 
}

function createUsers(cb) {
	var users = [
		new mongoose.models.Client({login: 'Ivan', password: '123', name: 'Ivan Kozlov', email: 'ikozlov9000@gmail.com', phone: '7 (915) 812 56 69'}),
		new mongoose.models.Client({login: 'Vasya', email: 'Vasya@Vasya.Vasya', password: '123'}),
		new mongoose.models.Client({login: 'admin', password: '123'}),
		new mongoose.models.Company({login: 'company1', password: '123', name: 'Rocco', email: 'asd@asd.com', phone: '92-90-05', address: 'Pushkina sq., 2', desc: 'One advanced diverted domestic sex repeated bringing you old. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy.', logo: 'rocco.jpg'}),
		new mongoose.models.Company({login: 'company2', password: '123', name: 'Company', email: 'company@company.com', phone: '123-456-789', address: 'Schorsa st., 68', desc: 'One advanced diverted domestic sex repeated bringing you old. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy.'})
	];

	async.each(users, function(item, cb) {
		item.save(cb);
	}, cb);
}

function createRequests(cb) {
	var list = [
		{
			client: 'Ivan',
			company: 'company1'
		}, 
		{
			client: 'Vasya',
			company: 'company1'
		}
	];
	async.each(list, function(item, callback) {
		createSingleRequest(item.client, item.company, callback);
	}, cb)
}

function createViews(cb) {
	var views = [
		new mongoose.models.View({ tag: 'input', type: 'text', text: 'Текст', value: 1 }),
		new mongoose.models.View({ tag: 'input', type: 'date', text: 'Дата', value: 2 }),
		new mongoose.models.View({ tag: 'input', type: 'file', text: 'Файл', value: 3 })
	];

	async.each(views, function(item, cb) {
		item.save(cb);
	}, cb);
}

function createSingleRequest(clientName, companyName, cb) {
	var User = mongoose.model('User');
	var Request = mongoose.model('Request');

	async.parallel([ (callback) => {
			User.find({login: clientName}, callback);
		}, (callback) => {
			User.find({login: companyName}, callback);
		} ], (err, results) => {
			if (err) return cb(err);

			clientId = results[0][0].id;
			companyId = results[1][0].id;
			Request.create({
				client: clientId,
				company: companyId,
				date: new Date(),
			}, cb);
		});
}

async.series([
	open,
	dropDatabase,
	requireModels,
	createViews,
	createUsers,
	createRequests,
	], function(err) {
		if (!err) {
			log.info("Тестовая база создана!");
		} else {
			log.error(err);
		}

		mongoose.disconnect();
	});