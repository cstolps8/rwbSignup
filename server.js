const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser'); // middleware

const FeedbackService = require('./services/FeedbackService')
const SpeakerService = require('./services/SpeakerService')
const LoginService = require('./services/LoginService');

const feedbackService = new FeedbackService('./data/feedback.json')
const speakerService = new SpeakerService('./data/speakers.json')
const loginService = new LoginService('./data/login.json')

const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;
const www = process.env.WWW || './';

// trust nginx
app.set('trust proxy', 1)

app.use(cookieSession({
    name: 'session',
    keys: ['collin', 'random']
}))

app.use(bodyParser.urlencoded({ extended: true }))

// parse json data
app.use(bodyParser.json({ extended: true }))

app.set('view engine', 'ejs')
// views 
app.set('views', path.join(__dirname, './views'))

app.locals.siteName = 'Collin Stolpa'

// loading middleware
app.use(express.static(path.join(__dirname, './static')));

// never throw from middleware and routes
// throwing from async invocation (app.get) is not good always throw errors from next function
// app.get('/throw', (req, res, next)=>{
//     setTimeout(()=> {
//        return next( new Error("something threw"))
//     },5000)
// })


app.use(async (req, res, next) => {
    try {
        const names = await speakerService.getNames();
        res.locals.speakerNames = names;
        return next()
    } catch (err) {
        return next(err)
    }
})

app.use(express.static(www));
console.log(`serving ${www}`);


// points to the routes folder
// routes are defined at the top ^
app.use('/', routes({
    loginService,
    feedbackService,
    speakerService,

}))


// speakers page
// app.get('/speakers', (req, res) => {
//     res.sendFile(path.join(__dirname, './static/speakers.html'));
// });


// errors should render at the end of all the middleware 
app.use((req, res, next) => {
    return next(createError(404, 'File not found'))
});

// express has built in error handling 
app.use((err, req, res, next) => {
    res.locals.message = err.message
    console.log(err)
    const status = err.status || 500
    res.locals.status = status
    res.status(status)
    res.render('error')
})

app.listen(port, () => console.log(`listening on http://localhost: ${port}`));
