const Question = require('../models').Question;
const QuestionAttr = require('../models').QuestionAttr;
const Tags = require('../models').Tags;
const QuestionTag = require('../models').QuestionTag

const addTags = (x,id,taglist,callback) => {
    if(x<taglist.length) {
        let tagName = taglist[x];
        Tags.findOne({
            where: {
                tag: tagName
            }
        })
            .then(tag => {
                console.log(tag);
                console.log(tagName)
                console.log(id)
                if(!tag) {
                    Tags.create({
                        tag: tagName
                    }).then(tags => {
                        QuestionTag.create({
                            tag_id: tags.id,
                            question_id: id
                        }).then(questionTag => {addTags(x+1,id,taglist,callback)})
                            .catch(err => {console.log(err)})
                    })
                } else {
                    QuestionTag.create({
                        tag_id: tag.id,
                        question_id: id
                    }).then(questionTag => {addTags(x+1,id,taglist,callback)})
                        .catch(err => {console.log(err)})
                }
            })
    } else {
        callback();
    }
}

module.exports = {
    create(question, questionAttr, tags, res) {
        Question
            .create(question)
            .then(question => {
                QuestionAttr.create({
                    question_id: question.id,
                    options: questionAttr.options || null,
                    correct: questionAttr.correct || null,
                    answer: questionAttr.answer || null,
                    col1: questionAttr.col1 || null,
                    col2: questionAttr.col2 || null,
                    matchAnswer: questionAttr.matchAnswer || null,
                    images: questionAttr.images || null
                })
                    .then(questionAttr => {
                        let tagLength = tags.length;
                        addTags(0,questionAttr.id,tags,() => res.status(201).json({success: true,msg: "Successfully posted"}))
                    })
            })
            .catch(error => {console.log(error)});
    },
    list(req, res) {
        return Question
            .findAll({
                where: {
                    type: req.body.type,
                },
                include: [{
                    model: QuestionAttr,
                    as: 'questionAttrs',
                }],
            })
            .then(todos => res.status(200).send(todos))
            .catch(error => {console.log(error);return res.status(400).send(error)});
    },
    delete(id,res) {
        return Question
            .findById(id)
            .then(todo => {
                if (!todo) {
                    return res.status(400).send({
                        message: 'Todo Not Found',
                    });
                }
                return todo
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
};