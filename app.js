const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const session=require('express-session')
const flash=require('express-flash')

//importing the models and db config
const User = require('./models/user');
const mongoose=require('./config/db');

const viewsPath = path.join(__dirname, "./views");
const hbs = require('hbs');
app.set("view engine", "hbs");
app.set("views", viewsPath);

const port = process.env.PORT;
app.use(flash());
app.use(session({secret: process.env.SECRET,resave: true,saveUninitialized: true,}));
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get(['','/login'], (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
   
    try {
        const user = await User.findOne({ username, password });

        if (!user) {
            req.flash('error', 'Invalid credentials.');
            return res.redirect('/login');
        }

        if (user.role === 'student') {
            res.render("studentdashboard",{user:user.username,role:user.role});
            // return res.redirect('/student/dashboard');
        } else if (user.role === 'teacher') {
            res.render("teacherdashboard",{user:user.username,role:user.role});
        } else if (user.role === 'principal') {
            res.render("principledashboard",{user:user.username,role:user.role});
        } else if (user.role === 'admin') {
            res.render("admindashboard",{user:user.username,role:user.role});
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

app.get("/register",(req,res)=>{
    res.render("register");
})
app.post("/register",async(req,res)=>{
    const { username, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash('error', 'Username already exists. Please choose a different one.');
            res.redirect('/register');
        } else {
            const newUser = new User({ username, password,role });
            await newUser.save();
           
            req.flash('error', 'Register Successful go to login.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
app.get('/student/dashboard', (req, res) => {
    res.render("studentdashboard");
});

app.get('/teacher/dashboard', (req, res) => {
    res.render("teacherdashboard");
});

app.get('/principal/dashboard', (req, res) => {
    res.render("principledashboard");
});

app.get('/admin/dashboard', (req, res) => {
    res.render("admindashboard");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
