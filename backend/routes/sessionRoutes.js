const express = require("express");
const { getSessionById , getMySessions , deleteSession, createSession } = require('../controllers/sessionController');
const {protect} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', protect , createSession);
router.get('/my-sessions', protect , getMySessions);
router.get('/:id', protect , getSessionById);
router.delete('/:id', protect , deleteSession);

module.exports = router;  