const express = require('express');
const app = express();
const port = 1337;
const path = require("path");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const randomString = require('randomstring');
const bodyParser = require("body-parser");

mongoose.connect('mongodb://localhost:27017').then(() => console.log('Connected'));


const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'webresponser@mail.ru',
        pass: 'Neverplaydotaagain1'
    }
});

const videoSchema = new mongoose.Schema({
    id: String,
    title: String,
    author: String,
    uploadDate: new Date(),
    likes: String,
    comments: String,
    imagePath: String,
    videoPath: String,
});

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String
});
const User = mongoose.model('User', userSchema);
const Video = mongoose.model('Video', videoSchema);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('frontend'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'frontend'));

//main().catch(console.error);

app.get(('/'),(req, res) => {
    res.render('index.ejs');
});

app.get(('/starter'), (req, res) => {
    res.render('starter.ejs');
});

app.get(('/login'),(req, res) => {
    res.render('login.ejs');
});

app.get(('/register'),(req, res) => {
    res.render('register.ejs');
});

app.post(('/registerUser'), async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const newUser = {
            username: username,
            email: email,
            password: password,
            registration_date: new Date(),
            other_info: ""
        }
        try {
            await User.create({ newUser });
        } catch (e) {
            console.log('Error: ', e);
        } finally {
            res.render('index.ejs', { email });
        }
    } catch(e) {
        console.log('Error: ', e );
    }
});

app.get(('/forgot'),(req, res) => {
    res.render('forgot.ejs');
});

app.get(('/restorepass/:email'), async (req, res) => {
    const { email } = req.body;
    const restoreCode = randomString.generate({ length: 5, charset: 'numeric' });

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.restoreCode = restoreCode;
        await user.save();

        await transporter.sendMail({
            from: 'webresponser@mail.ru',
            to: email,
            subject: 'Password Restoration Code',
            text: `Your password restoration code is: ${restoreCode}`
        });

        res.render('restorepass.ejs', {restoreCode});
    } catch (e) {
        console.log('Error: ', e);
    }
});

app.put(('/changePassword/'), async (req, res) => {
    const { email, status } = req.body;

    try {
        if (!status) {
            return res.status(404);
        }
    } catch (e) {
        console.log('Error: ', e);
    }
});

app.get(('/about'), (req, res) => {
    res.render('about.ejs');
});

app.get(('/feedback'), (req, res) => {
    res.render('feedback.ejs');
});

app.post(('/sendFeedback'), async (req, res) => {
    const { email, feedback } = req.body;

    try {
        await transporter.sendMail({
            from: email,
            to: 'webresponser@mail.ru',
            subject: 'Feedback',
            text: feedback
        });

        res.render('thanks.ejs');
    } catch(e) {
        console.log('Error: ', e)
    }
});

app.post('/createUser', async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const newUser = new User({ name, password, email });

        await newUser.save();

        res.status(201).json(newUser);
    } catch (e) {
        console.log('Error: ', e);
        res.status(500);
    }
});

app.post(('/loginByEmail'), async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.json({ success: false });
        }
        res.json({success: true });
    } catch (e) {
        console.log('Error ', e);
    }
});

app.get(('/video'), async (req, res) => {
    const { videoId } = req.URL.Query().get('VideoID');

    try {
        const video = await Video.findOne({ videoId });

        if (video == null) {
            return res.json( { success: false} );
        }
        res.render('/video.ejs', {video});
    } catch (e) {
        console.log('Error ', e);
    }
});

app.listen(port, () => {
    console.log(`app is working on port -> ${port}`);
});