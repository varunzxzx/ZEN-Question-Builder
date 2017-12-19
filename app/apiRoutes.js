const express = require('express');
let router = express.Router();
// const McqController = require('./controllers').MCQ
router.use(function (req, res, next) {
    try {
        req.body = JSON.parse(Object.keys(req.body)[0]);
    } catch (err) {
        req.body = req.body;
    }
    next();
});

// router.post('/delete',(req,res) => {
//     return McqController.delete(req.body.id,res);
// })
//
// router.post('/create',(req,res) => {
//     if(!req.body.question || !req.body.answer || !req.body.options) {
//         return res.status(401).json({success: false, msg: "Missing fields"})
//     }
//
//     const options = [];
//     options[0] = req.body.options;
//     const question = req.body.question;
//     const answer = parseInt(req.body.answer);
//     const images = [];
//     images[0] = req.body.images || null;
//     const data = {
//         question,
//         images,
//         options,
//         answer
//     }
//     // return res.status(200).json({success: true, msg: "Abhi tk thk h", data: data})
//     return McqController.create(data,res);
// })

module.exports = router;
