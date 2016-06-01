var nodemailer = require('nodemailer'),
	config	   = require('../config'),
	mongoose   = require('../libs/mongoose'),
	log		   = require('./logger')(module);

var transport = nodemailer.createTransport(config.get('mail'));

function newRequest(requestId) {
	var Request = mongoose.model('Request');

	Request
		.findById(requestId)
		.populate('client company')
		.lean()
		.exec((err, request) => {
			sendMail({
				from: request.company.email,
				to: request.client.email,
				subject: 'Заявка была создана',
				html: '<p>Ваша заявка была создана</p><p>Текущий статус: ' + request.status + '</p><p><a href="http://localhost:8080/request/info/?id='+request._id+'">Ссылка на заявку</a></p>'
			})
		});
}

function rejectRequest(requestId) {
	var Archive = mongoose.model('Archive');

	Archive
		.findById(requestId)
		.populate('client company')
		.lean()
		.exec((err, request) => {
			sendMail({
				from: request.company.email,
				to: request.client.email,
				subject: 'Заявка была отклонена',
				html: '<p>Ваша заявка была отклонена</p><p>Текущий статус: ' + request.status + '</p><p>Причина'+request.message+'<p><a href="http://localhost:8080/request/info/?id='+request._id+'">Ссылка на заявку</a></p>'
			})
		});
}

function submitRequest(requestId) {
	var Request = mongoose.model('Request');

	Request
		.findById(requestId)
		.populate('client company')
		.lean()
		.exec((err, request) => {
			sendMail({
				from: request.company.email,
				to: request.client.email,
				subject: 'Заявка была принята',
				html: '<p>Ваша заявка была принята</p><p>Текущий статус: ' + request.status + '</p><p><a href="http://localhost:8080/request/info/?id='+request._id+'">Ссылка на заявку</a></p>'
			})
		});
}

function doneRequest() {
	var Archive = mongoose.model('Archive');

	Archive
		.findById(requestId)
		.populate('client company')
		.lean()
		.exec((err, request) => {
			sendMail({
				from: request.company.email,
				to: request.company.email,
				subject: 'Напоминание',
				html: '<p>Сейчас в Вам придет '+request.client.name+'<p><p>Причина'+request.message+'<p><a href="http://localhost:8080/request/info/?id='+request._id+'">Ссылка на бронь</a></p>'
			});
			sendMail({
				from: request.company.email,
				to: request.client.email,
				subject: 'Напоминание',
				html: '<p>Напоминам, что у Вас забронирован столик у компании <a href="http://localhost:8080/company/?id='+request.company.id+'">'+request.company.name+'</a></p><a href="http://localhost:8080/archive/info/?id='+request._id+'">Ссылка на заявку</a></p>'
			})
		});
}

function validate(mailOptions) {
	mailOptions.from ||  new Error('Missing from option'); 
	mailOptions.to ||  new Error('Missing to option'); 
	mailOptions.subject ||  new Error('Missing subject option'); 
	mailOptions.text 
	|| mailOptions.html
	||  new Error('Missing text or html options'); 
}

function sendMail(mailOptions) {
	validate(mailOptions);
	transport.sendMail(mailOptions, (err) => {
		if (err) return log.error(err);
		log.info('Mailer послал письмо');
	});
}

module.exports = {
	newRequest: newRequest,
	rejectRequest: rejectRequest,
	submitRequest: submitRequest,
	doneRequest: doneRequest,
}