const { Pizza, Comment } = require('../models');

const commentController = {
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findByIdAndUpdate(
                { _id: params.pizzaId },
                { $push: { comments: _id } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(400).json({ message: 'No pizza was found with that ID' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment) {
                res.status(404).json({ message: 'No comment with that ID was found' });
                return;
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId }},
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No Pizza with this ID was found' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    }
};

module.exports = commentController;