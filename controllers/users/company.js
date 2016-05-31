var express   	  = require('express'),
	router 	      = express.Router(),
	mongoose  	  = require('../../libs/mongoose'),
	Company  	  = mongoose.model('Company'),
    HtmlError     = require('../../libs/HtmlError'),
	mw         	  = require('../../mw/'),
	statuses 	  = require('../../utils/status'),
	log 	      = require('../../utils/logger')(module);

router.get('/profile', mw.user.isCompany, function(req, res, next) {
	Company
		.findById(req.user.id)
		.exec((err, company) => {
			if (err) return next(err);

			if (company) {
				res.render('company/index', { 
					company: company.toJSON()
				})
			} else {
				log.warn('Couldn\'t a company but it should be here. Id: ' + res.user.id);
				next(new HtmlError(404));
			}
		});
})

router.get('/search', (req, res, next) => {
	var name = req.query.name;

	if (name) {
		var	Company = mongoose.model('Company');
		var regex = new RegExp(name, 'i');
		Company
			.find({ 'name': { $regex: regex } })
			.lean()
			.select('name avatar description')
			.exec(function(err, companies) {
				if (err) return next(err);

				res.json(companies);
			});
	} else {
		res.render('company/search');
	}
})

router.get('/stats', mw.user.isCompany,
					mw.load.archiveForUser,
					(req, res, next) => {
						res.render('company/stats', {
							archives: req.archives
						})
					});

router.get('/popular', (req, res, next) => {
	var Archive = mongoose.model('Archive');

	Archive
		.aggregate([
			{
				$match: {
					'status': statuses.done
				}
			},
	        {
	            $group: {
	                _id: '$company',  //$region is the column name in collection
	                count: {$sum: 1}
	            }
	        },
	        {
            	$sort: { count: -1 }
            }
	    ])
	    .exec(function (err, result) {
	        if (err) {
	            next(err);
	        } else {
	        	Company
	        		.find({
	        			'_id': {
	        				$in: result.map((el) => {
	        					return el._id
	        				})
	        			}
	        		})
	        		.lean()
	        		.exec((err, companies) => {
	        			if (err) return next(err);
	        			var results = companies.map((el, ind) => {
	        				return {
	        					name: el.name,
	        					avatar: el.avatar,
	        					count: result[ind].count 
	        				}
	        			})
	        			res.render('company/popular', {
			            	companies: results
			            });
	           			// res.json(companies);
	        		});
	        }
	    });
})

router.get('/', (req, res, next) => {
	var id = req.query.id;
	var Company = mongoose.model('Company');

	Company
		.findById(id)
		.select('-hashedPassword -salt -login -_id -__t -__v')
		.lean()
		.exec((err, company) => {
			if (err) return next(err);

			if (company) {
				res.render('company/info', {
					company: company
				});
			} else {
				next(new HtmlError(404));
			}
		})
})

module.exports = router;
