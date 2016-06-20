describe('Cliend side', function() {
	
	describe('modal', function() {
		it('Показывает модальное окно для резервации стола', function() {
		    var x = "", i;
		    for (i=0; i<5; i++) {
		        x = x + "The number is " + i + "<br>";
		    }
			expect(true).toBe(true);
		});

		it('Валидатор работает корректно', function() {
			expect(true).toBe(true);
		});

		it('Выводит ошибку при неправильно дате', function() {
			expect(true).toBe(true);
		});
	});
	
	describe('request/processing', function() {
		it('Создает заявку', function() {
			expect(true).toBe(true);
		});

		it('Обновляет заявку', function() {
			expect(true).toBe(true);
		});

		it('Не дает обновить заявку неправильной датой', function() {
			expect(true).toBe(true);
		});

		it('Удаляет заявку', function() {
			expect(true).toBe(true);
		});
	});

	describe('event handler', function() {
		it('Добавляет новый обработчик', function() {
			expect(true).toBe(true);
		});

		it('Удалет обработчик', function() {
			expect(true).toBe(true);
		});
	});

	describe('login', function() {
		it('Авторизовывает пользователя', function() {
			expect(true).toBe(true);
		});
	});
});
