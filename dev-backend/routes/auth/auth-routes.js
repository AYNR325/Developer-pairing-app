const express = require('express');
const { registerUser,loginUser,logoutUser,authMiddleware,completeProfile } = require('../../controllers/auth/auth-controller');
const User = require('../../models/User');

const router=express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get("/check-auth", authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        // Fetch complete user data from database
        const completeUser = await User.findById(user.id);
        res.status(200).json({
            success: true,
            message: 'User authenticated',
            user: completeUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
});
router.put('/complete-profile',authMiddleware,completeProfile);

module.exports=router;