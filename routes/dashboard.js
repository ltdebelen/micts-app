var express = require('express');
var router = express.Router();
var connection = require('../common/mysqlconfig');

// INTERFACE DATATABLES
router.get('/interface', function (req, res) {
	connection.query("SELECT *, date_format(date_part, '%M %d, %Y %H:%i:%s') as str_date_time \
	FROM interface ORDER BY date_added DESC" , function (err, interfaceList) {
			res.render('interface', {
				interfaceList: interfaceList,
				dashboard_treeview: 'active',
				interface: 'active'
			});
		});
});

// NODES DATATABLES
router.get('/nodes', function (req, res) {
	connection.query("SELECT *, date_format(date_part, '%M %d, %Y %H:%i:%s') as str_date_time \
	FROM nodes ORDER BY date_added DESC" , function (err, nodeList) {
			res.render('nodes', {
				nodeList : nodeList,
				dashboard_treeview: 'active',
				nodes: 'active'
			});
		});
});

// SITE DATATABLES
router.get('/site', function (req, res) {
	connection.query("SELECT *, date_format(date_part, '%M %d, %Y %H:%i:%s') as str_date_time \
	FROM site ORDER BY date_added DESC" , function (err, siteList) {
			res.render('site', {
				siteList : siteList,
				dashboard_treeview: 'active',
				site: 'active'
			});
		});
});

module.exports = router;
