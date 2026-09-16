import { Router } from 'express';
import { register, login, getMe, logout, forgotPassword, changePassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login); 
router.get('/me', getMe);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', changePassword);

export default router;