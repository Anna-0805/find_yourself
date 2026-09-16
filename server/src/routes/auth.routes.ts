import { Router } from 'express';
import { register, login, getMe, logout, forgotPassword, changePassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/auth/login', login);
router.get('/auth/me', getMe);
router.post('/auth/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', changePassword);

export default router;