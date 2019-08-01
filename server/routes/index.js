var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'Express1' });
  res.json({
    'status': 1,
    'data': 'Home',
    'message':'Home API'
  })
});

module.exports = router;
