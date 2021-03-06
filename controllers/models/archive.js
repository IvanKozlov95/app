var express     = require('express'),
    router      = express.Router(),
    mongoose    = require('../../libs/mongoose'),
    HtmlError   = require('../../libs/HtmlError'),
    mw          = require('../../mw/')
    commonUtil  = require('../../utils/common'),
    HtmlError   = require('../../libs/HtmlError'),
    log         = require('../../utils/logger')(module),
    statuses    = require('../../utils/status');

router.get('/bydate',   mw.user.isCompany,
                        mw.load.archiveByQueryForUser,
                        (req, res, next) => {
                            if (req.xhr) {
                                res.json(req.archives);
                            } else {
                                res.render('archive/bydate', {
                                    archives: req.archives,
                                    date: req.query.date
                                });
                            }
                        })

router.get('/bydayofweek',  mw.user.isCompany,
                            mw.archive.aggregateByField('dayOfWeek'),
                            (req, res, next) => {
                                res.json(req.results);
                            })

router.get('/bystatus', mw.user.isCompany,
                        mw.archive.aggregateByField('status'),
                            (req, res, next) => {
                                res.json(req.results);
                            })

router.get('/byclient', mw.user.isCompany,
                        mw.archive.getActiveClients(5),
                            (req, res, next) => {
                                res.json(req.results);
                            })

router.get('/bytime',   mw.user.isCompany,
                        mw.archive.aggregateByField('time'),
                            (req, res, next) => {
                                res.json(req.results);
                            })

router.get('/info',/*mw.user.isAuthentificated,*/
                    (req, res, next) => {
                        var id = commonUtil.castToObjectId(req.query.id);
                        var Archive = mongoose.model('Archive');

                        Archive
                            .findById(id)
                            .populate('client company')
                            .lean()
                            .exec((err, archive) => {
                                if (err) return next(err);

                                if (archive) {
                                    res.render('request/info', {
                                        request: archive
                                    })
                                } else {
                                    return next(new HtmlError(404))
                                }
                            });
                        });

module.exports = router;