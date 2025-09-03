import express from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import { validate, schemas } from '../middlewares/validation';

const router = express.Router();

// POST /auth/register
router.post('/register', validate(schemas.register), register);

// POST /auth/login
router.post('/login', validate(schemas.login), login);

// GET /auth/me
router.get('/me', authenticate, getMe);

export default router;
