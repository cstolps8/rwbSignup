const express = require('express');

const { check, validationResult } = require('express-validator');

const router = express.Router();

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
    .withMessage('A valid email address is required'),
  check('phoneNumber')
    .trim()
    .isMobilePhone()
    .withMessage('A phone number is required'),
  check('dateOfParty')
    .isDate()
    .escape()
    .withMessage('A date is required'),

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
          pageTitle: 'FeedbackResults',
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
        return response.redirect('/fbResult');
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

    return router;
};
