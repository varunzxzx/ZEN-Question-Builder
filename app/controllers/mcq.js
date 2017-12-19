const MCQ = require('../models').MCQ;

module.exports = {
    create(data, res) {
        return MCQ
            .create({
                question: data.question,
                image: data.image,
                options: data.options,
                answer: data.answer
            })
            .then(todo => res.status(201).send(todo))
            .catch(error => res.status(400).send(error));
    },
    list(req, res) {
        return MCQ
            .all()
            .then(todos => res.status(200).send(todos))
            .catch(error => res.status(400).send(error));
    },
    delete(id,res) {
        return MCQ
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