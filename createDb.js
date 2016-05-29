var mongoose = require('./libs/mongoose'),
 	log      = require('./utils/logger')(module),
	async 	 = require('async'),
	statuses = require('./utils/status');

function open(cb){
    mongoose.connection.on('open', cb);
}

function dropDatabase(cb) {
	var db = mongoose.connection.db;
	db.dropDatabase(cb);
}

function requireModels(cb) {
	require('./models');

    async.each(Object.keys[mongoose.models], function(modelName, cb) {
		mongoose.models[modelName].ensureIndexes(cb);     
	}, cb); 
}

function createUsers(cb) {
	var users = [
		new mongoose.models.Client({login: 'Ivan', password: '123', name: 'Иван Козлов', email: 'ikozlov9000@gmail.com', phone: '7 (915) 812 56 69'}),
		new mongoose.models.Client({ login: 'Vasya', email: 'Vasya@Vasya.Vasya', name: 'Вася Пупкин', password: '123' }),
		new mongoose.models.Client({ login: 'Petya', password: '123', email: 'email3@asd.com' }),
		new mongoose.models.Client({ login: 'admin', password: '123' }),
		new mongoose.models.Company({login: 'company1', password: '123', name: 'Rocco', email: 'asd@asd.com', phone: '92-90-05', address: 'Pushkina sq., 2', description: 'One advanced diverted domestic sex repeated bringing you old. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy.', logo: 'rocco.jpg'}),
		new mongoose.models.Company({login: 'company2', password: '123', name: 'Company', email: 'company@company.com', phone: '123-456-789', address: 'Schorsa st., 68', description: 'One advanced diverted domestic sex repeated bringing you old. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy.'})
	];

	async.each(users, function(item, cb) {
		item.save(cb);
	}, cb);
}

function createRequests(cb) {
	var list = [
		// просроченные
		{ client: 'user2', company: 'company1', date: new Date(2016,4,29), time: '20:00' },
		{ client: 'Vasya', company: 'company1', date: new Date(2016,4,29), time: '20:00' },
		{ client: 'Petya', company: 'company1', date: new Date(2016,4,29), time: '12:00' }, 
		// новые
		{ client: 'Ivan', company: 'company1', date: new Date(2016,4,30), time: '21:00' },
		{ client: 'Ivan', company: 'company1', date: new Date(2016,4,30), time: '12:00' },
		{ client: 'Ivan', company: 'company1', date: new Date(2016,4,30), time: '12:00' },
		// принятые
		{ client: 'Ivan', company: 'company1', date: new Date(2016,4,30), time: '02:00', status: statuses.accepted },
		{ client: 'Ivan', company: 'company1', date: new Date(2016,4,30), time: '02:30', status: statuses.accepted },
		{ client: 'Ivan', company: 'company1', date: new Date(2016,4,30), time: '02:45', status: statuses.accepted },
		{ client: 'user1', company: 'company1', date: new Date(2016,4,30), time: '03:00', status: statuses.accepted },
		{ client: 'Ivan', company: 'company1', date: new Date(2016,4,30), time: '23:00', status: statuses.accepted }, 
		{ client: 'Ivan', company: 'company1', date: new Date(2016,4,30), time: '23:00', status: statuses.accepted }, 
		{ client: 'Ivan', company: 'company1', date: new Date(2016,4,30), time: '23:00', status: statuses.accepted }, 
		{ client: 'Ivan', company: 'company1', date: new Date(2016,4,30), time: '23:00', status: statuses.accepted },
	];
	async.each(list, createSingleRequest, cb)
}

function createSingleRequest(options, cb) {
	var User = mongoose.model('User');
	var Request = mongoose.model('Request');

	async.parallel([ (callback) => {
			User.find({login: options.client}, callback);
		}, (callback) => {
			User.find({login: options.company}, callback);
		} ], (err, results) => {
			if (err) return cb(err);

			clientId = results[0][0].id;
			companyId = results[1][0].id;
			var _new = new Request({
				client: clientId,
				company: companyId,
				date: options.date,
				time: options.time,
				status: options.status,
				message: 'Автоматическое сообщение'
			});
			_new.save(cb);
		});
}

function generateRandomClients(count) {
	var users = [];
	return function(cb) {
		for(var i =0; i < count; i++) {
			users.push(new mongoose.models.Client( {login: 'user'+i, password: '123', name: 'Имя Фамилия'+i, email: 'user@user.com'+i, phone: '8 888 888 88 88'} ));
		}

		async.each(users, function(item, cb) {
			item.save(cb);
		}, cb)
	}
}

function generateRandomCompanies(count) {
	var users = [];
	return function(cb) {
		for(var i =0; i < count; i++) {
			users.push(new mongoose.models.Company( {login: 'compan'+i, password: '123', name: 'Company'+i, email: 'company@company.com'+i, phone: '8 888 888 88 88', address: 'Город, улица, дом', description: 'Описание компании. Описание компании.Описание компании.Описание компании.Описание компании.Описание компании.Описание компании.Описание компании.Описание компании.Описание компании.Описание компании.Описание компании.Описание компании.Описание компании.Описание компании.'} ));
		}

		async.each(users, function(item, cb) {
			item.save(cb);
		}, cb)
	}
}

async.series([
	open,
	dropDatabase,
	requireModels,
	createUsers,
	generateRandomClients(1000),
	generateRandomCompanies(500),
	createRequests
	], function(err) {
		if (!err) {
			log.info("Тестовая база создана!");
		} else {
			log.error(err);
		}

		mongoose.disconnect();
	});