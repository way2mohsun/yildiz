var express = require('express');
var router = express.Router();
var fs = require('fs');
var cloudinary = require('cloudinary');


router.get('/', function(req, res, next) {
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Public ID: <input type="text" name="title"/></p>'
    + '<p>Image: <input type="file" name="image"/></p>'
    + '<p><input type="submit" value="Upload"/></p>'
    + '</form>');
});

router.post('/', function(req, res, next) {
  stream = cloudinary.uploader.upload_stream(function(result) {
    console.log(result);
    res.send('Done:<br/> <img src="' + result.url + '"/><br/>' +
             cloudinary.image(result.public_id, { format: "png", width: 100, height: 130, crop: "fill" }));
  }, { public_id: req.body.title } );
  fs.createReadStream(req.files.image.path, {encoding: 'binary'}).on('data', stream.write).on('end', stream.end);
});

module.exports = router;