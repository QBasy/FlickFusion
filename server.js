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
const mongoose = require("mongoose");
const uri = "mongodb+srv://userServer:flickfusion@webtech.w7gfa5d.mongodb.net/?retryWrites=true&w=majority&appName=WebTech";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
        console.log('Error: ', e)
    }
}

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

app.get(('/forgot'),(req, res) => {
    res.render('forgot.ejs');
});

app.get(('/restorepass/:email'), async (req, res) => {
    const { email } = req.body;
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

app.put(('/changePassword/'), async (req, res) => {
    const { email, status } = req.body;

    try {
        await run().catch(console.dir);
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
            await mongoose.disconnect();
        }
    } catch (e) {
        console.log('Error: ', e);
        await mongoose.disconnect();
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
        await run().catch(console.dir);
        if (await UserDB.checkPassword(username, password)) {
            await mongoose.disconnect();
            res.json({ success: true });
        } else {
            await mongoose.disconnect();
            res.json({ success: false });
        }
    } catch (e) {
        await mongoose.disconnect();
        console.log('Error ', e);
    }
});

app.get(('/video'), async (req, res) => {
    const { videoId } = req.URL.Query().get('VideoID');

    try {
        await run().catch(console.dir);
        const video = await VideoDB.getVideoById({ videoId });

        if (video == null) {
            await mongoose.disconnect();
            return res.json( { success: false} );
        }
        await mongoose.disconnect();
        res.render('/video.ejs', {video});
    } catch (e) {
        await mongoose.disconnect();
        console.log('Error ', e);
    }
});

app.post(('/search'), async (req,res) => {
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
        console.log('Error ', e);
    }
});

app.post(('/comment'), async (req, res) => {
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
        console.log('Error ', e);
        res.json({ success: false});
    }
});

app.post(('/addVideo'), async (req, res) => {
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
        console.log('Error ', e);
        res.json({ success: false});
    }
});

app.post(('/comment'), async (req, res) => {
    const { author , video, text } = req.body;
    try {
        await run().catch(console.dir);
        const success = await CommentDB.createComment({video, username: author, text });
        if (success) {
            await mongoose.disconnect();
            res.json({ success: true });
        } else {
            await mongoose.disconnect();
            res.json({ success: false });
        }
    } catch (e) {
        await mongoose.disconnect();
        console.log('Error ', e)
        res.json({ success: false });
    }
});

app.post(('/deleteComment'), async (req, res) => {
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
        console.log('Error ', e)
        res.json({ success: false });
    }
});

app.get(('/video/:id'), async (req,res) => {
    const id = req.params.id;
    try {
        await run().catch(console.dir);
        const video = VideoDB.getVideoById({id});

        if (video === false) {
            res.render('404.ejs');
        }
        await mongoose.disconnect();
        res.render('videoPage.ejs', video);
    } catch (e) {
        await mongoose.disconnect();
        console.log('Error: ', e);
    }
});

app.listen(process.env.PORT || port, () => {
    console.log(`app is working on port -> ${port}`);
});