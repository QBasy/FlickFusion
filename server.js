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
                res.status(404).json({ success: false });
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

app.listen(port, () => {
    console.log(`app is working on port -> ${port}`);
});