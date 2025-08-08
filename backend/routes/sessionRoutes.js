const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const sessionController = require('../controllers/sessionController');

// Public route (no auth) for published sessions
router.get('/published/all', sessionController.getPublishedSessions);
// Route protects: user must be logged in
router.use(auth);

// Authenticated user routes
router.post('/', sessionController.createSession);          // create session
router.get('/', sessionController.getMySessions);           // get user's all sessions
router.get('/:id', sessionController.getSessionById);       // get session by id
router.put('/:id', sessionController.updateSession);        // update session
router.delete('/:id', sessionController.deleteSession);     // delete session


module.exports = router;
