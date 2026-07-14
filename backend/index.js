// Les importations et déclarations des variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
//const session = require("express-session");
const passport = require("./config/passport");

const { connectDB } = require("./config/prisma");
const userRoutes = require("./routes/userRoutes");


const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à PostgreSQL
connectDB();

// Middlewares
app.use(cors());

app.use(express.json());

// Configuration de la session utilisée par Passport
/*app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);*/

// Initialisation de Passport
app.use(passport.initialize());
//app.use(passport.session());


// Route de test
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// Les routes
app.use("/api/user", userRoutes);



// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



