'use strict';

class HtmlError extends Error {
	constructor(code, message) {
		super(message);
		this.code = code || '500';
		this._setMessage();

		Error.captureStackTrace(this, HtmlError);
	}

	_setMessage() {
		if (!this.message) {
			switch (this.code) {
				case 404:
					this.message = 'Ничего не нашел, вчера тут было, точно помню';
					break;
				case 403:
					this.message = 'Ты не пройдешь!';
					break;
				default:
					this.message = 'Ооой, ошибка';
					break;
			}
		}
	}
}

module.exports = HtmlError;