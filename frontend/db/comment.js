const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
    id: String,
    video: { type: String, unique: true },
    username: String,
    date: String,
    text: String,
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
    commentSchema, Comment,

    createComment: async ({ video, username, text }) => {
        try {
            const date = new Date().toDateString()
            const newComment = new Comment({ video, username, date , text });
            await newComment.save();
            return true;
        } catch (e){
            console.log('Error ', e);
            return false;
        }
    },

    getAllCommentsByVideo: async ({ video }) => {
        try {
            Comment.find({}, function (err, comments) {
                let commentsMap = {};

                comments.forEach(function (comment) {
                    commentsMap[comment._id] = comment;
                });
                return commentsMap;
            });
        } catch (e) {
            console.log('Error ', e);
            return {};
        }
    },

    deleteComment: async ({ video, username, date }) => {
        try {
            const result = await Comment.deleteOne({ video: video, username: username, date: date })
            return !(!result);
        } catch (e) {
            console.log('Error ', e);
            return false;
        }
    }
}