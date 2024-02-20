const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/FlickFusion').then(() => console.log('Connected'));

const userSchema = new mongoose.Schema({
    id: String,
    username: { type: String, unique: true },
    password: String,
    email: String
});

const User = mongoose.model('User', userSchema);

module.exports = {
    userSchema, User,
    createUser: async ({ username, password, email }) => {
        try {
            let existingUser = await User.findOne({ username: username });
            if (existingUser) {
                console.log('Username already exists');
                return false;
            }
            existingUser = await User.findOne({ email: email });
            if (existingUser) {
                console.log('Email already exists');
                return false;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({ username, password: hashedPassword, email });

            await newUser.save();

            console.log('User created successfully');
            return true;
        } catch (error) {
            console.error('Error creating user:', error);
            return false;
        }
    },

    isInDB: async (username, email) => {
        try {
            let count = 0;
            count += await User.countDocuments({ username: username });
            count += await User.countDocuments({ email: email });
            return count > 0;
        } catch (e) {
            console.error('Error: ', e);
        }
    },

    getUserByUsername: async ({ username }, req, res) => {
        try {
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
            const user = await User.findOne({ username: username });

            if (!user) {
                console.log('User not found');
                return false;
            }

            const userPassword = user.password;

            const result = await bcrypt.compare(password, userPassword);
            console.log(result);
            return result
        } catch (e) {
            console.error('Error: ', e);
            return false;
        }
    }
};
