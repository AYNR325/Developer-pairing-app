const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match-controller');

// Search for developers
router.get('/', matchController.searchDevelopers);

// Send connection request
router.post('/request', matchController.sendConnectionRequest);

// Accept connection request
router.post('/request/:requestId/accept', matchController.acceptConnectionRequest);

// Reject connection request
router.post('/request/:requestId/reject', matchController.rejectConnectionRequest);

// Remove connection
router.delete('/connection/:connectionId', matchController.removeConnection);

// Get pending connection requests
router.get('/requests/:userId', matchController.getPendingRequests);

// Get user connections
router.get('/connections/:userId', matchController.getConnections);

module.exports = router; 