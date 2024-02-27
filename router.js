const express = require('express');
const router = express.Router();
const session = require('express-session');
const UserDB = require("./frontend/db/user");
const VideoDB = require("./frontend/db/video");
const CommentDB = require("./frontend/db/comment");
const randomString = require('randomstring');
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const uri = "mongodb+srv://userServer:flickfusion@webtech.w7gfa5d.mongodb.net/?retryWrites=true&w=majority&appName=WebTech";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

let changePasswordLinks = [];

router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
        console.log('Error: ', e)
    }
}

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'webresponser@mail.ru',
        pass: 'Neverplaydotaagain1'
    }
});

router.get('/', (req, res) => {
    res.render('starter.ejs');
});

router.get('/index', (req, res) => {
    const user = req.session.user;
    res.render('index.ejs', { user });
});

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

router.get('/register', (req, res) => {
    res.render('register.ejs');
});

router.post('/registerUser', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        await run().catch(console.dir);
        try {
            if (await UserDB.isInDB(username, email)) {
                await res.json({ success: false });
                return;
            }
            await UserDB.createUser({
                username: username,
                password: password,
                email: email,
            });
            await mongoose.disconnect();
            await res.json({ success: true });
        } catch (e) {
            console.log('Error: ', e);
            await mongoose.disconnect();
        }
    } catch(e) {
        console.log('Error: ', e );
        await mongoose.disconnect();
    }
});

router.get('/forgot', (req, res) => {
    res.render('forgot.ejs');
});

router.get('/restorepass/:email', async (req, res) => {
    const { email } = req.params;
    const restoreCode = randomString.generate({ length: 5, charset: 'numeric' });

    try {
        await run().catch(console.dir);
        const user = await UserDB.getUserById(email);
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
        await mongoose.disconnect();
        res.render('restorepass.ejs', {restoreCode});
    } catch (e) {
        console.log('Error: ', e);
        await mongoose.disconnect();
    }
});

router.put('/changePassword', async (req, res) => {
    const { email, status } = req.body;

    try {
        await run().catch(console.dir);
        if (!status) {
            return res.status(404);
        } else {
            changePasswordLinks.push({email, })
            let link;
            await transporter.sendMail({
                from: email,
                to: 'webresponser@mail.ru',
                subject: 'Feedback',
                text: link
            });
            await mongoose.disconnect();
        }
    } catch (e) {
        console.log('Error: ', e);
        await mongoose.disconnect();
    }
});

router.get('/about', (req, res) => {
    res.render('about.ejs');
});

router.get('/feedback', (req, res) => {
    res.render('feedback.ejs');
});

router.post('/sendFeedback', async (req, res) => {
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

router.get('/loginByUsername', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userData = {
            username: req.body.username,
            password: req.body.password
        };
        await run().catch(console.dir);
        if (await UserDB.checkPassword(username, password)) {
            await mongoose.disconnect();
            req.session.user = userData;
            res.redirect('/profile');
        } else {
            await mongoose.disconnect();
            res.json({ success: false });
        }
    } catch (e) {
        await mongoose.disconnect();
        console.log('Error: ', e);
    }
});

router.get('/profile', async (req, res) => {
    const user = req.session.user;
    res.render('profile.ejs', { user });
});

router.get('/video/:id', async (req, res) => {
    const user = req.session.user;
    const { videoId } = req.params.id;

    try {
        await run().catch(console.dir);
        const video = await VideoDB.getVideoById({ videoId });

        if (!video) {
            await mongoose.disconnect();
            return res.json({ success: false });
        }
        await mongoose.disconnect();
        res.render('videoPage.ejs', { video, user });
    } catch (e) {
        await mongoose.disconnect();
        console.log('Error: ', e);
    }
});

router.post('/search', async (req,res) => {
    const user = req.session.user;
    const { title } = req.query;
    try {
        await run().catch(console.dir);
        let videos = [];
        const videoFound = await VideoDB.getAllVideos();
        for (const video in videoFound) {
            if (video.title.includes(title)) {
                videos.push(video);
            }
        }
        await mongoose.disconnect();
        res.json(videos);
    } catch (e) {
        await mongoose.disconnect();
        console.log('Error: ', e);
    }
});

router.post('/comment', async (req, res) => {
    const user = req.session.user;
    const { text, username, video } = req.body;
    try {
        await run().catch(console.dir);
        let success = await CommentDB.createComment({ video, username, text });
        if (success) {
            await mongoose.disconnect();
            res.json({ success: true });
        } else {
            await mongoose.disconnect();
            res.json({ success: false });
        }
    } catch (e) {
        await mongoose.disconnect();
        console.log('Error: ', e);
        res.json({ success: false });
    }
});

router.post('/addVideo', async (req, res) => {
    const user = req.session.user;
    const { title, author, imagePath, videoPath } = req.body;
    try {
        await run().catch(console.dir);
        let success = await VideoDB.createVideo({ title, author, imagePath, videoPath });
        if (success) {
            await mongoose.disconnect();
            res.json({ success: true });
        } else {
            await mongoose.disconnect();
            res.json({ success: false });
        }
    } catch (e) {
        console.log('Error: ', e);
        res.json({ success: false });
    }
});



router.post('/deleteComment', async (req, res) => {
    const { author , video, text } = req.body;
    try {
        await run().catch(console.dir);
        const success = await CommentDB.deleteComment({video, username: author, text });
        if (success) {
            await mongoose.disconnect();
            res.json({ success: true });
        } else {
            await mongoose.disconnect();
            res.json({ success: false });
        }
    } catch (e) {
        await mongoose.disconnect();
        console.log('Error: ', e)
        res.json({ success: false });
    }
});

module.exports = router;
