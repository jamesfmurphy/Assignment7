var express = require('express');
var router = express.Router();
var redis = require('redis');
client = redis.createClient();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'URL Shortener' });
});

router.get('/processURL', function(req, res, next) {
  res.render('processURL', { title: 'URL Processor'});
});

router.post('/save', function(req, res, next) {
  var newURL = {};
  // The random string generator idea comes from
  // stackoverflow.com/question
  var append = "";
  var library ="abcdefghijklmnopqrstuvwxyz";
  for(var i = 0; i < 4; i++)
  {
  	append += library.charAt(Math.floor(Math.random()* library.length));
  }
  	// Get the url regardless of existence
  	newURL.name = req.body.processURL;
  	temp = 'http://' + newURL.name.split('/')[2] + '/' + append;

  	client.get(newURL.name, function(err, reply) {
  		if (reply == null){
  			newURL.id = temp;

        client.set(newURL.name, newURL.id);
    		client.set(newURL.id, newURL.name);
    		
    		res.render('processURL', {processURL: newURL.id, originalURL: newURL.name});
  			
  		} else {
        console.log(reply);
        newURL.id = reply;

        console.log(newURL.name);
        console.log(newURL.id);

			res.render('processURL', {processURL: newURL.id, originalURL: newURL.name});
 		}

 	});
  //res.redirect("back");
});

module.exports = router;
