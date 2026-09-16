import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_EXPIRES_IN } from '../constants';
import { users } from '../services/db.service';
import { sendRegistrationEmail, sendResetPasswordEmail } from '../services/mail.service';

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Заповніть усі поля!' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Користувач із такою поштою вже існує!' });
  }

  users.push({ email, password, role });

  try {
    await sendRegistrationEmail(email, role);
    return res.status(201).json({ success: true, message: 'Користувача зареєстровано, лист надіслано!' });
  } catch (error: unknown) {
    console.log("Попередження розсилки (реєстрація):", error);
    return res.status(201).json({ success: true, message: 'Користувача зареєстровано (режим без пошти)!' });
  }
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Користувача з такою поштою не знайдено!' });
  }

  if (user.password !== password) {
    return res.status(401).json({ success: false, message: 'Невірний пароль!' });
  }

  const payload = { email: user.email, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN as any });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ success: true, user: payload, message: 'Успішний вхід!' });
};

export const getMe = (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Не авторизовано' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ success: true, user: decoded });
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Недійсний токен' });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return res.status(200).json({ success: true, message: 'Успішний вихід!' });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Користувача з такою поштою не знайдено!' });
  }

  const tempPassword = Math.random().toString(36).substring(2, 8);
  user.password = tempPassword;

  try {
    await sendResetPasswordEmail(email, tempPassword);
    return res.status(200).json({ success: true, message: 'Тимчасовий пароль надіслано на вашу пошту!' });
  } catch (error: unknown) {
    console.log("Попередження розсилки (відновлення):", error);
    return res.status(200).json({ 
      success: true, 
      message: `Не вдалося відправити лист. Ваш тимчасовий пароль для входу: ${tempPassword}` 
    });
  }
};

export const changePassword = (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Користувача не знайдено!' });
  }

  if (user.password !== oldPassword) {
    return res.status(400).json({ success: false, message: 'Поточний (тимчасовий) пароль введено невірно!' });
  }

  user.password = newPassword;
  return res.status(200).json({ success: true, message: 'Пароль успішно змінено!' });
};