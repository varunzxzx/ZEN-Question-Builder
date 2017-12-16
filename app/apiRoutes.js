const express = require('express');
let router = express.Router();

router.use(function (req, res, next) {
    try {
        req.body = JSON.parse(Object.keys(req.body)[0]);
    } catch (err) {
        req.body = req.body;
    }
    next();
});

module.exports = router;
