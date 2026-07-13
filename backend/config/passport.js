const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Configuration de la stratégie Google OAuth
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("===== Profil Google =====");
                console.log(profile);

                return done(null, profile);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);


// Sérialisation de l'utilisateur dans la session
passport.serializeUser((user, done) => {
    done(null, user);
});


// Désérialisation de l'utilisateur depuis la session
passport.deserializeUser((user, done) => {
    done(null, user);
});


module.exports = passport;