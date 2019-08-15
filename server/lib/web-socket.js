var express = require('express');
var router = express.Router();
router.get('/init/', async function (req, res, next) {
    req.app.io.on('connection', function (socket) {
        console.log('client connect');
        socket.on('ping',function(data){
           console.log(data);
        });
        socket.on('disconnect', function () {
          console.log('client disconnect');
        });
       
      });
});

module.exports = router;