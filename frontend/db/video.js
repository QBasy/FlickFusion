const mongoose = require("mongoose");
const path = __dirname + '/frontend/video/';
mongoose.connect('mongodb://localhost:27017/FlickFusion').then(() => console.log('Connected'));

const videoSchema = new mongoose.Schema({
    id: String,
    title: String,
    author: String,
    uploadDate: String,
    likes: String,
    comments: String,
    imagePath: String,
    videoPath: String,
});

const Video = mongoose.model('Video', videoSchema);

exports.createVideo = async ({ title, author, imagePath, videoPath }) => {
    try {
        const uploadDate = new Date().toDateString();
        const newVideo = new Video({ title, author, uploadDate, likes: 0, comments: 0, imagePath, videoPath });
        await newVideo.save();
        return true;
    } catch (error) {
        console.error('Error creating Video: ', error);
        return false;
    }
};

exports.getVideoById = async ({ id }) => {
    try {
        const video = await Video.findById({id});
        if (!video) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error fetching Video: ', error);
        return false;
    }
};

exports.getAllVideos = async () => {
    try {
        Video.find({}, function (err, videos) {
            let VideoMap = {};

            videos.forEach(function (video) {
                VideoMap[video._id] = video;
            });
            return VideoMap;
        });
    } catch (e) {
        console.error('Error updating Video: ', e);
    }
};

exports.updateVideoById = async ({id}, parameters) => {
    const { title, imagePath } = parameters;
    try {
        const updatedVideo = await Video.findByIdAndUpdate({ id }, { title: title , imagePath: imagePath });
        if (!updatedVideo) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error updating Video: ', error);
        return false;
    }
};

exports.deleteVideoById = async ({ id }) => {
    try {
        const deletedVideo = await Video.findByIdAndDelete({ id });
        if (!deletedVideo) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error deleting Video: ', error);
        return false;
    }
};