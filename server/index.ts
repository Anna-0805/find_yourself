import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://find-yourself-pied.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const users: Array<{ email: string; password: string; role: string }> = [];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/register', async (req, res) => {
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
    const mailOptions = {
      from: `"VV Work Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Успішна реєстрація на VV Work! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Вітаємо на платформі VV Work!</h2>
          <p>Ви успішно зареєструвалися як <b>${role === 'employer' ? 'Роботодавець' : 'Кандидат'}</b>.</p>
          <p>Ваш логін для входу: <b>${email}</b></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ success: true, message: 'Користувача зареєстровано, лист надіслано!' });
  } catch (error: unknown) {
    console.log("Попередження SMTP (реєстрація):", error);
    res.status(201).json({ success: true, message: 'Користувача зареєстровано (режим без пошти)!' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Користувача з такою поштою не знайдено!' });
  }

  if (user.password !== password) {
    return res.status(401).json({ success: false, message: 'Невірний пароль!' });
  }

  res.status(200).json({ 
    success: true, 
    user: { email: user.email, role: user.role },
    message: 'Успішний вхід!' 
  });
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Користувача з такою поштою не знайдено!' });
  }

  const tempPassword = Math.random().toString(36).substring(2, 8);
  user.password = tempPassword;

  try {
    const mailOptions = {
      from: `"VV Work Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Відновлення пароля на VV Work 🔑',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Відновлення доступу</h2>
          <p>Ви запросили відновлення пароля для платформи VV Work.</p>
          <p>Ваш новий <b>тимчасовий пароль</b> для входу: <b style="font-size: 16px; color: #2563eb;">${tempPassword}</b></p>
          <p>Рекомендуємо змінити його у налаштуваннях профілю одразу після входу.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Тимчасовий пароль надіслано на вашу пошту!' });
  } catch (error: unknown) {
   
    console.log("Попередження SMTP (відновлення):", error);
    res.status(200).json({ 
      success: true, 
      message: `Не вдалося відправити лист. Ваш тимчасовий пароль для входу: ${tempPassword}` 
    });
  }
});

app.post('/api/change-password', (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Користувача не знайдено!' });
  }

  if (user.password !== oldPassword) {
    return res.status(400).json({ success: false, message: 'Поточний (тимчасовий) пароль введено невірно!' });
  }

  user.password = newPassword;
  res.status(200).json({ success: true, message: 'Пароль успішно змінено!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});