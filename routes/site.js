var express = require('express');
var router = express.Router();
var moment = require('moment');
var connection = require('../common/mysqlconfig');
var fs = require('fs');
var csv = require('fast-csv');

// CREATE SITE FORM
router.get('/site_form', function (req, res) {
    res.render('form', {
        form_icon_class: 'fa fa-fw fa-institution',
        form_name: 'Site Form',
        form_action: '/site_form_submit',
        form_select: 'site_name[]',
        form_input_label: 'Site Name',
        forms_treeview: 'active',
        site_form: 'active'
    });
});

// CREATE SITE FORM SUBMIT
router.post('/site_form_submit', function (req, res) {
    var site_name = req.body.site_name;
    var remarks = req.body.remarks;

    for (var count = 0; count < site_name.length; count++) {

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
                site_name: site_name[count],
                remarks: remarks,
                date_part: myDate
            }

            connection.query("INSERT INTO site SET ?", [data], function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Index [' + i + ']: INSERTED');
                }
            });
        }
    }
    res.redirect('/site');
});

// GET SITE ITEM
router.post('/get_site_item', function (req, res) {
    var id = req.body.site_id;

    connection.query("SELECT *, date_format(date_part, '%Y-%m-%d %H:%i') as str_date_part \
	FROM site WHERE id = ?", [id], function (err, result) {
            res.json({
                result: result
            })
        });
});

// UPDATE SITE ITEM SUBMIT
router.post('/update_site', function (req, res) {
    var id = req.body.hidden_site_item_id;

    var data = {
        site_name: req.body.site_name,
        remarks: req.body.remarks,
        date_part: req.body.date_part
    }

    connection.query("UPDATE site SET ? WHERE id = ?", [data, id], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/site');
        }
    });
});

// DELETE SITE ITEM
router.post('/delete_site', function (req, res) {
    var id = req.body.hidden_site_item_id;

    connection.query("DELETE FROM site WHERE id = ?", [id], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/site');
        }
    });
});

// EXPORT SITE TO CSV
router.post('/site_export', function (req, res) {
    connection.query("SELECT id, site_name, remarks,date_format(date_part, '%Y-%m-%d %H:%i:%s') as date_part \
	FROM site;", function (err, result) {
            if (err) {
                console.log(err);
            } else {
                var data = result;
                var ws = fs.createWriteStream('public/exports/site-' + Date.now() + '.csv');
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