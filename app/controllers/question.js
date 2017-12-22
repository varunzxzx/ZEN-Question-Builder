const Question = require('../models').Question;
const QuestionAttr = require('../models').QuestionAttr;
const Tags = require('../models').Tags;
module.exports = {
    create(question, questionAttr, tags, res) {
        return Question
            .create(question)
            .then(question => {
                QuestionAttr.create({
                    questionId: question.id,
                    options: questionAttr.options || null,
                    correct: questionAttr.correct || null,
                    answer: questionAttr.answer || null,
                    col1: questionAttr.col1 || null,
                    col2: questionAttr.col2 || null,
                    matchAnswer: questionAttr.matchAnswer || null,
                    images: questionAttr.images || null
                })
                .then(questionAttr => {
                    tags.map(tagName => {
                        Tags.findOne({
                            where: {
                                tag: tagName
                            }
                        })
                            .then(tag => {
                                console.log(tag);
                                console.log(tagName)
                                console.log(questionAttr.questionId)
                                let tmp = []
                                tmp.push(questionAttr.questionId)
                                if(!tag) {
                                    Tags.create({
                                        tag: tagName,
                                        questionId: tmp
                                    }).then(tag => res.status(201).json(tag))
                                        .catch(err => res.status(401).json({success: false, msg: err}))
                                } else {
                                    let tmpQuestionId = tag.questionId;
                                    tmpQuestionId.push(question.id)
                                    tag.update({
                                        questionId: tmpQuestionId
                                    })
                                    .then(tag => res.status(201).json(tag))
                                }
                            })
                            .catch((err) => res.status(401).json({success: false, msg: err}))
                    })
                })
            })
            .catch(error => res.status(400).send(error));
    },
    list(req, res) {
        return Question
            .findAll({
                include: [{
                    model: QuestionAttr,
                    as: 'questionAttrs',
                }],
            })
            .then(todos => res.status(200).send(todos))
            .catch(error => res.status(400).send(error));
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