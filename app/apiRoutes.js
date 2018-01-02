const express = require('express');
let router = express.Router();
const QuestionController = require('./controllers').Question
const TagsController = require('./controllers').Tags
const upload = require('./routes/upload');
router.use(function (req, res, next) {
    try {
        req.body = JSON.parse(Object.keys(req.body)[0]);
    } catch (err) {
        req.body = req.body;
    }
    next();
});

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/getTags',(req,res) => {
    return TagsController.list(req,res)
})

router.post('/delete',(req,res) => {
    return QuestionController.delete(req.body.id,res);
})

router.post('/list',(req,res) => {
    if(!req.body.type) {
        console.log("returning")
        return res.status(401).json({success: false, msg: "Missing fields"})
    }
    return QuestionController.list(req,res);
})

router.post('/create',(req,res) => {
    if(!req.body.question || !req.body.type || !req.body.tags.length) {
        console.log("returning")
        console.log(req.body)
        return res.status(401).json({success: false, msg: "Missing fields", req: req.body})
    }
    console.log(req.body)
    const question = {
        question: req.body.question,
        type: req.body.type,
        images: req.body.images || null
    }
    let questionAttr = {}
    if(question.type === "mcq") {
        if(!req.body.options.length || !req.body.correct.length) return res.status(401).json({success: false, msg: "Missing fields"})
        questionAttr.options = req.body.options;
        questionAttr.correct = req.body.correct;
    } else if(question.type === "shortanswer") {
        if(!req.body.answer) return res.status(401).json({success: false, msg: "Missing fields"})
        questionAttr.answer = req.body.answer
    } else {
        if(!req.body.col1.length || !req.body.col2.length) return res.status(402).json({success: false, msg: "Missing fields"})
        questionAttr.col1 = req.body.col1;
        questionAttr.col2 = req.body.col2;
        questionAttr.matchAnswer = req.body.matchAnswer
    }
    questionAttr.images = req.body.imagesAns
    const tags = req.body.tags;
    // return res.status(200).json({success: true, msg: "Abhi tk thk h", data: data})
    return QuestionController.create(question, questionAttr, tags, res);
})

router.post('/upload', upload);

module.exports = router;
