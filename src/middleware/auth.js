const User = require('../models/users');
const jwt = require('jsonwebtoken');

const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        const verified = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findOne({
            _id : verified._id, 
            'tokens.token' : token
        });
        
        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();

    } catch (e) {
        res.status(401).send({
            error : "User not authenticated!"
        })
    }
}

module.exports = auth;