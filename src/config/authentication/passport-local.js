const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const db = require('../database/db');
dotenv.config();

// LOGIN
module.exports = (passport) => {
    passport.use('login',
        new localStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            },
            (email, password, done) => {
                try {
                    (async () => {
                        // CHECK USER
                        const response = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
                        if(response.rows.length === 0) {
                            return done(null, false, { message: 'Invalid email or password' });
                        }
                        const user = response.rows[0];

                        // VALIDATE PASSWORD
                        bcrypt.compare(password, user.password, function(err, result) {
                            if(result) {
                                return done(null, user, { message: 'Logged in Successfully' });
                            } else {
                                return done(null, false, { message: 'Invalid email or password' });
                            }
                        });
                    })();
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
}