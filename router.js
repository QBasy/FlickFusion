const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserDB = require("./frontend/db/user");
const multer = require('multer');
const path = require('path');
const VideoDB = require("./frontend/db/video");
const CommentDB = require("./frontend/db/comment");
const randomString = require('randomstring');
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const uri = "mongodb+srv://userServer:flickfusion@webtech.w7gfa5d.mongodb.net/?retryWrites=true&w=majority&appName=test";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'video') {
            cb(null, __dirname + '/frontend/video');
        } else if (file.fieldname === 'image') {
            cb(null, __dirname + '/frontend/image');
        } else {
            cb(new Error('Invalid fieldname'), null);
        }
    },
    filename: function (req, file, cb) {
        const title = req.body.title;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = title.replace(/\s/g, '-') + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

let changePasswordLinks = [];

const secretKey = 'SCRTKey123';

async function disconnect() {
    try {
        await mongoose.disconnect();
    } catch (e) {
        console.log('Error: ', e);
    }
}
async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
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
    const user = req.user;
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

router.post('/loginByUsername', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userData = {
            username: req.body.username,
            password: req.body.password
        };

        await run().catch(console.dir);

        const user = UserDB.getUserByUsername({ username: username });
        if (await UserDB.checkPassword(username, password)) {
            await mongoose.disconnect();
            const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
            res.json({ success: true, token });
        } else {
            await mongoose.disconnect();
            res.json({ success: false, message: 'Internal Server Error' });
        }
    } catch (e) {
        await mongoose.disconnect();
        console.log('Error: ', e);
        res.json({ success: false, message: 'Internal Server Error' });
    }
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token not provided' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
}

router.get('/api/user', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const user = await UserDB.getUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error retrieving user information:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = req.user;
        res.render('profile', { user });
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get(('/getProfile'),async (req, res) => {
    const user = req.user;

    try {
        await run().catch(console.dir);
        const user = await UserDB.getUserByUsername({ username: user.username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const videos = await VideoDB.getAllVideoByUser({ user });
        await mongoose.disconnect();

        const userProfile = {
            username: user.username,
            avatar: user.avatar,
            videos: videos
        };

        res.json({ success: true, userProfile });
    } catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get(('/searchVideo'), async (req, res) => {
    const { searchInput, user } = req.body;

    try {
        const videos = VideoDB.getAllVideoByUser({ username: user });

        videos.forEach(video => {
            
        });
    } catch (e) {
        await mongoose.disconnect();
        console.log('Error: ', e);
        return res.json({ success: false });
    }
});
router.get('/video/:title', async (req, res) => {
    const user = req.user;
    const { title } = req.params;

    try {
        await run().catch(console.dir);
        const video = await VideoDB.getVideoByTitle({ title });

        if (!video) {
            console.log('FCK1');
            await mongoose.disconnect();
            return res.json({ success: false });
        }
        const username = video.author;
        const author = await UserDB.getUserByUsername({ username })
        await mongoose.disconnect();
        res.render('videoPage.ejs', { video, author });
    } catch (e) {
        console.log('FCK2');
        await mongoose.disconnect();
        console.log('Error: ', e);
        return res.json({ success: false });
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

router.post('/addVideo', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
    const { title, author } = req.body;
    const videoFile = req.files['video'][0];
    const imageFile = req.files['image'][0];

    try {
        await run().catch(console.dir);

        let videoSuccess = await VideoDB.createVideo({ title, author, imagePath: imageFile.filename, videoPath: videoFile.filename });

        if (videoSuccess) {
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

router.post('/getAllVideos', async (req, res) => {
    try {
        await run().catch(console.dir)
        const allVideos = await VideoDB.getAllVideos();

        console.log(allVideos);

        if (!Array.isArray(allVideos)) {
            console.error('Error: getAllVideos did not return an array');
            await mongoose.disconnect();
            return res.json({ allVideos });
        }

        let jsonData = [];

        const videoPromises = allVideos.map(async video => {
            const author = await UserDB.getUserByUsername({ username: video.author });
            if (!author) {
                console.error(`Error: No author found for video with author ${video.author}`);
                await mongoose.disconnect();
                return null;
            }

            const newVideo = {
                title: video.title,
                author: video.author,
                avatarUrl: author.avatar,
                cardViews: video.views,
                imageURL: ('/video' + video.imagePath),
                href: ('/video/videoPath' + video.title),
            };
            console.log(newVideo);
            await mongoose.disconnect();
            return newVideo;
        });
        await mongoose.disconnect();
        const resolvedVideos = await Promise.all(videoPromises);
        jsonData = resolvedVideos.filter(video => video !== null);

        res.json(jsonData);
    } catch (e) {
        console.error('Error: ', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get(('/profile/:username'), (req, res) => {
    const username = req.params;
    try {
        const user = UserDB.getUserByUsername({ username });
        if (!user) {
            res.redirect('/404').json({ success: false });
        }
    } catch (e) {
        console.log('Error: ', e)
        res.render('404.ejs');
    }
});

router.get(('/404'), (req, res) => {
    res.render('404.ejs');
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