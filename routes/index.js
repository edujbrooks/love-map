var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'LOVE MAP' });
  console.log("index requested");
});

module.exports = router;
