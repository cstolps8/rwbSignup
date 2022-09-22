const express = require('express');

const { check, validationResult } = require('express-validator');

const router = express.Router();

const validations = [
    check('entry')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('An entry id is missing'),

];


module.exports = params => {
    const { fbResultService } = params;

    router.get('/', async (request, response, next) => {
        try {
            const fbResult = await fbResultService.getList();

            const errors = request.session.fbResult ? request.session.fbResult.errors : false;

            const successMessage = request.session.fbResult ? request.session.fbResult.message : false;

            request.session.fbResult = {};

            return response.render('layout', {
                pageTitle: 'Feedback Results',
                template: 'fbResult',
                fbResult,
                errors,
                successMessage,
            });
        } catch (err) {
            return next(err);
        }
    });

    router.post('/', validations, async (request, response, next) => {
        try {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                request.session.fbResult = {
                    errors: errors.array(),
                };
                return response.redirect('/fbResult');
            }

            const { entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts } = request.body;
            await fbResultService.addEntry(entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts);
            request.session.fbResult = {
                message: 'Thank you for your fbResult!',
            };
            return response.redirect('/feedback');
        } catch (err) {
            return next(err);
        }
    });

    router.post('/api', validations, async (request, response, next) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.json({ errors: errors.array() });
            }
            const { entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts } = request.body;
            await fbResultService.addEntry(entry, name, email, phoneNumber, dateOfParty, receivePromos, receiveTexts);
            const fbResult = await fbResultService.getList();
            return response.json({ fbResult, successMessage: 'Thank you for your fbResult!' });
        } catch (err) {
            return next(err);
        }
    });

    router.delete('/api/delete/:entry', validations, async (request, response, next) => {
        try {
            // const errors = validationResult(request);
            // if (!errors.isEmpty()) {
            //     return response.json({ errors: errors.array() });
            // }
            const { entry } = request.params;
            console.log("router " + entry)
            await fbResultService.removeEntry(entry);
            const fbResult = await fbResultService.getList();
            return response.json({ fbResult, successMessage: 'Thank you for your fbResult!' });
        } catch (err) {
            return next(err);
        }
    });


    router.get('/api/exportResults/', async (request, response, next) => {

        var excel = await fbResultService.exportToExcel()
        console.log("exel file= " + excel)
        return response.download(excel, 'Results.xlsx', function (err) {
            if (err) {
                console.log(err);
            }

        });

    });

    return router;
};
