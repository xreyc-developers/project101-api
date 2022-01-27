const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const dotenv = require('dotenv');
const db = require('../../config/database/db');

dotenv.config();

// REGISTER
exports.registerUser = async (req, res) => {
    const { name, email, password, role_id, birthdate, gender } = req.body;
    const currDateTime = new Date();
    const birthDateFomated = new Date(birthdate);
    const saltRounds = 10;

    // CHECK IF USER ALREADY EXIST
    const getUserByEmail = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    if(getUserByEmail.rows.length !== 0) {
        return res.status(500).json({
            status: 500,
            message: 'Email already used',
            user: {
                email: req.body.email
            }
        })
    }

    // ENCRYPT PASSWORD
    bcrypt.hash(password, saltRounds, async function(err, hash) {
        // CREATE USER
        await db.query('INSERT INTO users (name, email, password, created_on) VALUES ($1, $2, $3, $4)',
            [name, email, hash, currDateTime]
        );
        // GET CREATED USER
        const getCreatedUser = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
        const createdUserId = getCreatedUser.rows[0].user_id;
        // CREATE ROLE
        await db.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
            [createdUserId, role_id]
        );
        // CREATE USER DETALS
        await db.query('INSERT INTO user_details (ud_user_id, ud_fullname, ud_email, ud_birthdate, ud_gender) VALUES ($1, $2, $3, $4, $5)',
            [createdUserId, name, email, birthDateFomated, gender]
        );

        return res.status(200).json({
            status: 200,
            message: 'Successfully saved',
            user: {
                email: req.body.email
            }
        })
    });
}

// LOGIN
exports.loginUser = async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                return res.status(500).json({
                    status: 500,
                    message: info.message
                })
            }

            req.logIn(user, { session: false }, async (error) => {
                // CHECK FOR ERROR
                if (error) return next(error);
                // SET CUSTOM PARAMETERS
                const payload = { 
                    user_id: user.user_id,
                    email: user.email,
                    role: ['registered']
                };
                const verifyOptions = {
                    issuer: process.env.API_ISSUER,
                    audience: process.env.API_AUDIENCE,
                    expiresIn: '12h'
                };
                const access_token = jwt.sign(payload, process.env.API_PUBLIC_KEY, verifyOptions);
                // RETURN TOKEN
                const now = new Date();
                return res.json({
                    access_token,
                    email: user.email,
                    iat: Math.floor(now/1000),
                    exp: Math.floor(now.setHours(now.getHours() + 12)/1000)
                });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
}