const express = require('express')

const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

const router = express.Router()

module.exports = params => {

    const { speakerService } = params;

    // home page  
    router.get('/', async (req, res, next) => {
        try {
            const artwork = await speakerService.getAllArtwork();
            const topSpeakers = await speakerService.getList();
            return res.render('layout', { pageTitle: 'Welcome', template: 'index', topSpeakers, artwork })

        } catch (error) {
            return next(error)
        }

    });

    router.use('/speakers', speakersRoute(params))
    router.use('/feedback', feedbackRoute(params))

    return router;

}


