const multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({

    destination: function(req, file, callback) {
        callback(null, './public/uploads')
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-'+(Date.now()) + path.extname(file.originalname));
    }
    })


var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            req.fileValidationError = "Only Image Allowed";
            return callback(null, false, req.fileValidationError)
        }
        callback(null, true)
    }
});
 
module.exports = upload;