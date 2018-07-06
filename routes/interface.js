var express = require('express');
var router = express.Router();
var moment = require('moment');
var connection = require('../common/mysqlconfig');
var fs = require('fs');
var csv = require('fast-csv');

// CREATE INTERFACE FORM
router.get('/interface_form', function (req, res) {
	res.render('form', {
		form_icon_class: 'fa fa-fw fa-gears',
		form_name: 'Interface Form',
		form_action: '/interface_form_submit',
		form_select: 'interface_name[]',
		form_input_label: 'Interface Name',
		forms_treeview: 'active',
		interface_form: 'active'
	});
});

// CREATE INTERFACE FORM SUBMIT
router.post('/interface_form_submit', function (req, res) {
	var interface_name = req.body.interface_name;
	var remarks = req.body.remarks;

	for (var count = 0; count < interface_name.length; count++) {

		// Get Date Range Values from HTML
		var date_times = req.body.date_time;

		// Split Dates
		var dates = splitDateTimeRange(date_times);
		console.log('DATES: ' + dates);

		// Get Date Hour Difference
		var start_date_time = moment(dates[0]);
		var end_date_time = moment(dates[1]);
		var difference = moment.duration(end_date_time.diff(start_date_time));
		var hours = difference.asHours();
		console.log('HOURS DIFFERENCE: ' + hours);

		// Loop through Hour Difference 
		for (var i = 1; i <= hours; i++) {

			// Avoiding Add in the first iteration
			if (i != 1) {
				start_date_time.add(1, "hours");
			}

			// Convert Date Format to MYSQL DateTime Format
			var myDate = moment(start_date_time.format('YYYY-MM-DD HH:mm:ss')).format("YYYY-MM-DD HH:mm:ss");
			console.log('Index [' + i + ']: ' + myDate);

			var data = {
				interface_name: interface_name[count],
				remarks: remarks,
				date_part: myDate
			}

			connection.query("INSERT INTO interface SET ?", [data], function (err, result) {
				if (err) {
					console.log(err);
				} else {
					console.log('Index [' + i + ']: INSERTED');
				}
			});
		}
	}
	res.redirect('/interface');
});

// GET INTEFACE ITEM
router.post('/get_interface_item', function (req, res) {
	var id = req.body.interface_id;

	connection.query("SELECT *, date_format(date_part, '%Y-%m-%d %H:%i') as str_date_part \
	FROM interface WHERE id = ?", [id], function (err, result) {
			res.json({
				result: result
			})
		});
});

// UPDATE INTERFACE ITEM SUBMIT
router.post('/update_interface', function (req, res) {
	var id = req.body.hidden_interface_item_id;

	var data = {
		interface_name: req.body.interface_name,
		remarks: req.body.remarks,
		date_part: req.body.date_part
	}

	connection.query("UPDATE interface SET ? WHERE id = ?", [data, id], function (err, result) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/interface');
		}
	});
});

// DELETE INTERFACE ITEM
router.post('/delete_interface', function (req, res) {
	var id = req.body.hidden_interface_item_id;

	connection.query("DELETE FROM interface WHERE id = ?", [id], function (err, result) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/interface');
		}
	});
});

// EXPORT INTERFACE TO CSV
router.post('/interface_export', function (req, res) {
	connection.query("SELECT id, interface_name, remarks,date_format(date_part, '%Y-%m-%d %H:%i:%s') as date_part \
	FROM interface;", function (err, result) {
			if (err) {
				console.log(err);
			} else {
				var data = result;
				var ws = fs.createWriteStream('public/exports/interface-' + Date.now() + '.csv');
				csv.write(data, { headers: true })
					.pipe(ws);

				ws.on("finish", function () {
					res.download(ws.path);
				});
			}
		});
});

// Function Splitting Date Time value from HTML DateTimeRange Picker
function splitDateTimeRange(date_times) {
	var date_times = date_times;
	var date_time_split = date_times.split(' - ');

	var start_date_time = date_time_split[0];
	var end_date_time = date_time_split[1];

	return [start_date_time, end_date_time];
}

module.exports = router;
