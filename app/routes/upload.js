var fs = require('fs');
const path = require('path')
var FroalaEditor = require('../externals/wysiwyg-editor/lib/froalaEditor.js');

let upload = (req,res) => {
    FroalaEditor.Image.upload(req, '../../public/uploads/', function(err, data) {
        // Return data.
        if (err) {
            return res.status(400).send(JSON.stringify(err));
        }
        data.link = data.link.substr(12,data.link.length)
        console.log(data);
        return res.status(200).send(data);
    });
}

module.exports = upload;