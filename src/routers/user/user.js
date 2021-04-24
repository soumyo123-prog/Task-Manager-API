const express = require('express');
const User = require('../../models/users');
const checkValidity = require('../../utility/updateValidation');
const auth = require('../../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

const router = new express.Router();

router.post('/users',async (req,res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user,token}); 
    } catch (error) {
        res.status(400).send(error);
    }
})

// For getting all users
router.get('/users/me',auth,async (req,res) => {
    res.send(req.user);
})

// For getting a single user by id
router.get('/users/:id',async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(e);
    }
})

// For updating a user
router.patch('/users/me',auth,async (req, res) => {
    const canUpdate = ["name","age","password","email"];
    const validUpdate = checkValidity(req,canUpdate);

    if (!validUpdate) {
        return res.status(400).send({error : "Invalid update parameters"});
    }
    
    try {
        Object.keys(req.body).forEach(el => req.user[el] = req.body[el]);
        await req.user.save();

        res.send(req.user);

    } catch (error) {
        res.status(400).send(error);
    }
})

// For deleting a user
router.delete('/users/me',auth,async (req,res) => {
    try {
        await req.user.remove();
        res.send(req.user);

    } catch (error) {
        res.status(500).send(error);
    }
})

// Logging users in
router.post('/users/login',async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();

        res.send({user : user,token});
    } catch (error) {
        res.status(400).send(error);
    }
})

// Logging users out
router.post('/users/logout',auth,async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

// Logging out of all devices
router.post('/users/logoutAll',auth,async (req,res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
})

// Uploading the avatar
const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter (req,file,cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error('Please upload files having .jpg, .png or .jpeg extentions'))
        }
        cb(undefined,true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width : 250,
        height : 250
    }).png().toBuffer();
    
    req.user.avatar = buffer;
    await req.user.save();

    res.send();
},(error,req,res,next) => {
    res.send({
        error : error.message
    })
})

// Deleting the profile picture
router.delete('/users/me/avatar',auth,async (req,res) => {
    req.user.avatar = undefined;
    await req.user.save();

    res.send();
})

// Getting profile pictures through id
router.get('/users/:id/avatar',async (req,res) => {
    try{
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch (error) {
        res.status(404).send(error);
    }
})

module.exports = router;