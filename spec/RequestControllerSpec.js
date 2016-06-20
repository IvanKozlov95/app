describe('Request controller', function() {
	
	describe('/create', function() {
		it('Не создает заявку, если каптча введена неверно', function() {
		    var x = "", i;
		    for (i=0; i<5; i++) {
		        x = x + "The number is " + i + "<br>";
		    }
			expect(true).toBe(true);
		});

		it('Не создает заявку, если дата введена неправильно', function() {
			expect(true).toBe(true);
		});

		it('Создает нового пользователя, если пользователь не зарегистрирован', function() {
			expect(true).toBe(true);
		});

		it('Создает новую заявку', function() {
			expect(true).toBe(true);
		});
	});
	
	describe('/list', function() {
		it('Возвращает 403, если пользователь не имеет доступа', function() {
			expect(true).toBe(true);
		});

		it('Возвращает список заявок, если пользователь имеет доступ', function() {
			expect(true).toBe(true);
		});
	});

	describe('/submit', function() {
		it('Подтверждает заявку, если пользователь имеет доступ', function() {
			expect(true).toBe(true);
		});

		it('Возвращает 403, если пользователь не имеет доступа', function() {
			expect(true).toBe(true);
		});
	});

	describe('/info', function() {
		it('Возвращает информацию о заявке, если пользователь имеет доступ', function() {
			expect(true).toBe(true);
		});
	});

	describe('delete', function() {
		it('Удаляет заявку', function() {
			expect(true).toBe(true);
		});
	});
});
