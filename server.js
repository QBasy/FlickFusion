const express = require('express');
const rateLimit = require("express-rate-limit");
const app = express();
const port = 1337;
const path = require("path");
const nodemailer = require('nodemailer');
const randomString = require('randomstring');
const bodyParser = require("body-parser");
const UserDB = require("./frontend/db/user");
const VideoDB = require("./frontend/db/video");
const CommentDB = require("./frontend/db/comment");

let changePasswordLinks = [];

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'webresponser@mail.ru',
        pass: 'Neverplaydotaagain1'
    }
});

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 100
});

app.use(limiter);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('frontend'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'frontend'));

app.get(('/'),(req, res) => {
    res.render('starter.ejs');
});

app.get(('/index'), (req, res) => {
    res.render('index.ejs');
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
            await res.json({ success: true });
        } catch (e) {
            console.log('Error: ', e);
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
        } else {
            changePasswordLinks.push({email, })
            await transporter.sendMail({
                from: email,
                to: 'webresponser@mail.ru',
                subject: 'Feedback',
                text: link
            });
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

app.get(('/loginByUsername'), async (req, res) => {
    const { username, password } = req.body;

    try {
        if (await UserDB.checkPassword(username, password)) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (e) {
        console.log('Error ', e);
    }
});

app.get(('/video'), async (req, res) => {
    const { videoId } = req.URL.Query().get('VideoID');

    try {
        const video = await VideoDB.getVideoById({ videoId });

        if (video == null) {
            return res.json( { success: false} );
        }
        res.render('/video.ejs', {video});
    } catch (e) {
        console.log('Error ', e);
    }
});

app.post(('/search'), async (req,res) => {
    const { title } = req.query;
    try {
        let videos = [];
        const videoFound = await VideoDB.getAllVideos();
        for (const video in videoFound) {
            if (video.title.includes(title)) {
                videos.push(video);
            }
        }
        res.json(videos);
    } catch (e) {
        console.log('Error ', e);
    }
});

app.post(('/comment'), async (req, res) => {
    const { text, username, video } = req.body;
    try {
        let success = await CommentDB.createComment({ video, username, text });
        if (success) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (e) {
        console.log('Error ', e);
        res.json({ success: false});
    }
});

app.post(('/addVideo'), async (req, res) => {
    const { title, author, imagePath, videoPath } = req.body;
    try {
        let success = await VideoDB.createVideo({ title, author, imagePath, videoPath });
        if (success) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (e) {
        console.log('Error ', e);
        res.json({ success: false});
    }
});

app.post(('/comment'), async (req, res) => {
    const { author , video, text } = req.body;
    try {
        const success = await CommentDB.createComment({video, username: author, text });
        if (success) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (e) {
        console.log('Error ', e)
        res.json({ success: false });
    }
});

app.post(('/deleteComment'), async (req, res) => {
    const { author , video, text } = req.body;
    try {
        const success = await CommentDB.deleteComment({video, username: author, text });
        if (success) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (e) {
        console.log('Error ', e)
        res.json({ success: false });
    }
});

app.get(('/video/:id'), (req,res) => {
    const id = req.params.id;
    const video = VideoDB.getVideoById({ id });

    if (video === false) {
        res.render('404.ejs');
    }

    res.render('videoPage.ejs', video);
});

app.listen(port, () => {
    console.log(`app is working on port -> ${port}`);
});