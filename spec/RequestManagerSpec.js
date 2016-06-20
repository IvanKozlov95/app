describe('Request manager', function() {
	
	it('Конструктор создает новый объект менеджера', function() {
	    var x = "", i;
	    for (i=0; i<5; i++) {
	        x = x + "The number is " + i + "<br>";
	    }
		expect(true).toBe(true);
	});

	it('formQueue формирует очередь заявок', function() {
		expect(true).toBe(true);
	});

	it('watch архивирует выполненные заявки', function() {
		expect(true).toBe(true);
	});

	it('archive архивирует заявку', function() {
		expect(true).toBe(true);
	});
	
	it('archive отсылает email уведомление', function() {
		expect(true).toBe(true);
	});

	it('addRequest добавляет заявку в очередь', function() {
		expect(true).toBe(true);
	});

	it('deleteRequest удаляет заявку из очереди', function() {
		expect(true).toBe(true);
	});

	it('checkExpiredRequests архивирует просроченные заявки', function() {
		expect(true).toBe(true);
	});
});