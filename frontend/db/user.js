const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017').then(() => console.log('Connected'));

const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    password: String,
    email: String
});

const User = mongoose.model('User', userSchema);

module.exports = {
    userSchema, User,
    createUser: async ({ name, password, email }) => {
        try {
            if (!User.findOne({ username: name })) {
                console.log("Shit");
                return false;
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({ username: name, password: hashedPassword, email: email });
            await newUser.save();
            return true;
        } catch (error) {
            console.error('Error creating user:', error);
        }
    },

    isInDB: async (user) => {
        try {
            const count = await User.countDocuments({ user: user });
            return count > 0;
        } catch (e) {
            console.error('Error: ', e);
        }
    },

    getUserByUsername: async ({ username }, req, res) => {
        try {
            console.log('HEHE')
            const user = await User.findOne({ username: username });
            if (!(User.countDocuments({ username: username }) > 0)) {
                return false;
            }
            res.json(user);
        } catch (e) {
            console.error('Error: ', e);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    },

    getUserById: async (req, res) => {
        const {id} = req.params;
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteUserByUsername: async (username) => {
        try {
            const deletedUser = await User.findOneAndDelete({ username: username });
            if (!deletedUser) {
                console.error('User not found');
            }
            console.log('User ', username, ' deleted from database');
        } catch (e) {
            console.error('Error deleting user:', e);
        }
    },

    checkPassword: async (username, password) => {
        try {
            const user = User.findOne({ username: username });

            if (!user) {
                console.log('User not found');
                return false;
            }
            console.log('2')
            return await bcrypt.compare(password, user.password);
        } catch (e) {
            console.error('Error: ', e);
            return false;
        }
    }
};
