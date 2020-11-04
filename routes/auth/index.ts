import express from 'express';
import { signup, login, isLoggedIn } from './auth';
import { verifyToken } from 'routes/middlewares/verifyToken';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/isLoggedIn', verifyToken, isLoggedIn);

export default router;