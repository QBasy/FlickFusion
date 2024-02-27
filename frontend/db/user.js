const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const {Int32} = require("mongodb");


const userSchema = new mongoose.Schema({
    id: String,
    username: { type: String, unique: true },
    password: String,
    subCount: String,
    avatar: String,
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

            const newUser = new User({ username, password: hashedPassword, subCount: 0, avatar: "default.png", email });

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

    getUserByUsername: async ({ username })  => {
        try {
            const user = await User.findOne({ username: username });
            if (user === null) {
                console.log('LOOOL')
                return null;
            }
            console.log(user);
            return user;
        } catch (e) {
            console.error('Error: ', e);
            return null;
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

    getUserById: async (user) => {
        const { id } = user;
        try {
            const user = await User.findById(id);
            if (!user) {
                return false;
            }
            return user;
        } catch (error) {
            console.error('Error fetching user:', error);
            return false;
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

            if (user.username !== username) {
                console.log('User not found');
                return false;
            }

            const userPassword = user.password;

            const result = await bcrypt.compare(password, userPassword);
            console.log(result);
            return result === true;
        } catch (e) {
            console.error('Error: ', e);
            return false;
        }
    }
};
