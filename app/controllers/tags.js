const Tags = require('../models').Tags;

module.exports = {
    list(req,res) {
        Tags.findAll({
            attributes: ['tag']
        })
        .then(tags => res.status(200).json({success: true, tags: tags}))
        .catch(err => res.status(200).json({success: true, msg: err}))
    }
}