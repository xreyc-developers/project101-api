const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const dotenv = require('dotenv');
dotenv.config();

// TOKEN VERIFIER
module.exports = (passport) => {
    let options = {};
    options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
    options.secretOrKey = process.env.API_PUBLIC_KEY;
    options.issuer = process.env.API_ISSUER;
    options.audience = process.env.API_AUDIENCE;
    options.expiresIn = '12h';

    passport.use(
        new JWTstrategy(options, async (jwtPayload, done) => {
            try {
                return done(null, jwtPayload);
            } catch (error) {
                done(error);
            }
        })
    );
}
