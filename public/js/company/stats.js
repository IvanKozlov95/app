(function getStats() {
	$.ajax({
		url: '/archive/bydayofweek',
		method: 'GET',
		complete: (jqXHR, status) => {
			createChartDaysOfWeek(jqXHR.responseJSON);
		}
	})

	$.ajax({
		url: '/archive/bystatus',
		method: 'GET',
		complete: (jqXHR, status) => {
			createChartStatus(jqXHR.responseJSON);
		}
	})

    $.ajax({
        url: '/archive/byclient',
        method: 'GET',
        complete: (jqXHR, status) => {
            createActiveClientsTable(jqXHR.responseJSON, 5);
        }
    })

    $.ajax({
        url: '/archive/bytime',
        method: 'GET',
        complete: (jqXHR, status) => {
            createChartTime(jqXHR.responseJSON);
        }
    })
}());

function createChartDaysOfWeek(data) {
	// prepareData(data);
	$('#daysofweek').highcharts({
		chart: {
            type: 'column'
        },
        title: {
            text: 'Заявки по дням недели'
        },
        xAxis: {
            type: 'category',
            categories: [
                'Воскресенье',
                'Понедельник',
                'Вторник',
                'Среда',
                'Четверг',
                'Пятница',
                'Суббота'
            ],
        },
        yAxis: {
        	min: 0,
        	name: "Количество"
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },

        series: [{
	        	name: 'Заявки',
	        	data: [data[0],
		        	data[1],
		        	data[2],
		        	data[3],
		        	data[4],
		        	data[5],
		        	data[6],
	        	]
	        }
        ]
	})
}

function createChartStatus(data) {
	$('#status').highcharts({
		chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: 'Эффективность',
            align: 'center',
            verticalAlign: 'middle',
            y: 110
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%']
            }
        },
        legend: {
            enabled: false
        },

        series: [{
        		type: 'pie',
	        	name: 'Заявки',
	        	innerSize: '50%',
	        	data: [
	        		['Выполненые', data['Выполнена']],
                    ['Просроченные', data['Просрочена']],
	        		['Отклоненные', data['Отклонена'] || 0]
	        	]
	        }
        ]
	})
}

function createChartTime(data) {
    var ours = ['00',
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
                '21',
                '22',
                '23',];
    var series = [{
        name: 'Заявки',
        data: []
    }];
    for (i in ours) {
        series[0].data.push(data[ours[i]] || 0);
    }
    $('#time').highcharts({
       chart: {
            type: 'areaspline'
        },
        title: {
            text: 'Нагрузка по часам'
        },
        // legend: {
        //     layout: 'vertical',
        //     align: 'left',
        //     verticalAlign: 'top',
        //     x: 150,
        //     y: 100,
        //     floating: true,
        //     borderWidth: 1,
        //     backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        // },
        xAxis: {
            categories: ours,
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Заявки'
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' заявок'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        },
        series: series
    })
}

function createActiveClientsTable(data, count) {
    var $div = $('#activeclients');
    for (id in data) {
        var row = $('<div>')
            .addClass('col-xs-12')
            .append('<a href=/client/?id='+id+'>'+(data[id].name || 'Нет данных')+'<strong class="pull-right">'+data[id].count+'</strong></p>')
            .appendTo($div);
    }
}
// function prepareData(data) {
// 	data.each((el) => {

// 	})
// }