var express = require('express');
var router = express.Router();
var { ensureAuthenticated } = require('../config/auth');
var multer = require("multer");
var upload = multer({ dest: "public/uploads/" });
var Fs = require('fs');
var CsvReadableStream = require('csv-reader');
const AutoDetectDecoderStream = require('autodetect-decoder-stream');

/* GET home page. */
router.get('/', ensureAuthenticated, function (req, res, next) {
  res.render('pie', {

  });
});

//Job Apply Post Handle
var csv_upload = upload.fields([{ name: "file" }]);
router.post("/", ensureAuthenticated, csv_upload, (req, res) => {
  var filename = req.files["file"][0].filename;

  let inputStream = Fs.createReadStream("public/uploads/" + filename)
    .pipe(new AutoDetectDecoderStream({ defaultEncoding: '1255' }));
  var xAxisArray = [];
  var yAxisArray = [];
  inputStream
    .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', function (row) {
      // console.log('A row arrived: ', row);
      xAxisArray.push("'" + row[0] + "'");
      yAxisArray.push("'" + row[1] + "'");
    }).on('end', function (data) {
      // console.log('No more rows!');
      console.log('Column-1', xAxisArray);
      console.log('Column-2', yAxisArray);
      res.render('pie', {
        title: req.body.title,
        label: req.body.label,
        height: req.body.height,
        width: req.body.width,
        "xAxisArray": xAxisArray,
        "yAxisArray": yAxisArray
      });
    });

});

module.exports = router;
