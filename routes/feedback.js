
const express = require('express')

const { check, validationResult } = require('express-validator')

const router = express.Router()

const validations = [
    check('name')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('A name is required'),
    check('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('A email is required'),
    check('phoneNumber')
        .trim()
        .isMobilePhone()
        .withMessage('A phone number is required'),
    check('dateOfParty')
        .isDate()
        .escape()
        .withMessage('A date is required'),
]

module.exports = params => {

    const { feedbackService } = params;

    router.get('/', async (req, res, next) => {
        try {
            const feedback = await feedbackService.getList();
            const errors = req.session.feedback ? req.session.feedback.errors : false
            const successMsg = req.session.feedback ? req.session.feedback.message : false

            req.session.feedback = {}

            /*
            *
            * page title: renders the html page title
            * template: is the ejs file under /pages/feedback.ejs
            * feedback: is the get list functionality called in services/FeedbackService.js
            * 
            */
            return res.render('layout', { pageTitle: 'Feedback', template: 'feedback', feedback, errors, successMsg })
        } catch (error) {
            return next(error)
        }
    });


    router.post('/', validations, async (req, res, next) => {
        try {
            // this is where we process the data from the form 
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                req.session.feedback = {
                    errors: errors.array()
                };
                //  redirect to go back to the feedback page
                return res.redirect('/feedback')
            }
            // get all the sanitized data from the feedback form
            const { name, email, phoneNumber, dateOfParty } = req.body
            console.log(req.body)
            await feedbackService.addEntry(name, email, phoneNumber, dateOfParty)
            req.session.feedback = {
                message: 'Thank you for your feedback'
            }
            //  redirect to go back to the feedback page
            return res.redirect('/feedback')
            // console.log(req.body)
            // return res.send(`feedback from posted`)

        } catch (error) {
            return next(error)
        }
    });

    router.post('/api', validations, async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({ errors: errors.array() })
            }

            const { name, email, phoneNumber, dateOfParty } = req.body
            await feedbackService.addEntry(name, email, phoneNumber, dateOfParty)
            const feedback = await feedbackService.getList();
            return res.json({ feedback })

        } catch (error) {
            return next(error)
        }
    });

    return router;

}