const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017').then(() => console.log('Connected'));

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

exports.createUser = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const newUser = new Video({ name, password, email });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getVideoById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Video.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateVideoById = async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    try {
        const updatedUser = await Video.findByIdAndUpdate(id, newData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteVideoById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await Video.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};