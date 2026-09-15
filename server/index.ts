import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const users: Array<{ email: string; password: string; role: string }> = [];

const vacancies = [
  {
    id: "1",
    title: "Водій міжнародних рейсів (СЕ)",
    category: "Водії",
    salary: "2200 - 2800 €",
    country: "Польща, Німеччина",
    company: "TransEU Logis",
    description: "Потрібен водій категорії СЕ для роботи на нових тягачах Euro 6. Офіційне працевлаштування."
  },
  {
    id: "2",
    title: "QA Automation Engineer (TypeScript)",
    category: "IT",
    salary: "3500 - 4500 €",
    country: "Дистанційно (ЄС)",
    company: "TechSolutions Europe",
    description: "Шукаємо сильного QA розробника для автоматизації UI/API тестів на нашому масштабному проєкті."
  }
];

app.get('/api/vacancies', (req, res) => {
  res.status(200).json({ success: true, vacancies });
});

app.post('/api/vacancies', (req, res) => {
  const { title, category, salary, country, company, description } = req.body;

  if (!title || !category || !salary) {
    return res.status(400).json({ success: false, message: 'Заповніть обовʼязкові поля!' });
  }

  const newVacancy = {
    id: String(vacancies.length + 1),
    title,
    category,
    salary,
    country: country || 'Країни ЄС',
    company: company || 'Приватна компанія',
    description: description || ''
  };

  vacancies.unshift(newVacancy);
  res.status(201).json({ success: true, vacancy: newVacancy, message: 'Вакансію успішно опубліковано на сервері!' });
});


const applications: Array<{
  id: string;
  vacancyTitle: string;
  coverLetter: string;
  resumeName: string;
  createdAt: string;
}> = [];

app.post('/api/applications', (req, res) => {
  const { vacancyTitle, coverLetter, resumeName } = req.body;

  if (!vacancyTitle) {
    return res.status(400).json({ success: false, message: 'Назва вакансії обовʼязкова!' });
  }

  const newApplication = {
    id: String(applications.length + 1),
    vacancyTitle,
    coverLetter: coverLetter || 'Без супровідного листа',
    resumeName: resumeName || 'resume.pdf',
    createdAt: new Date().toLocaleString('uk-UA')
  };

  applications.unshift(newApplication); 
  res.status(201).json({ success: true, application: newApplication, message: 'Відгук успішно збережено на сервері!' });
});

app.get('/api/applications', (req, res) => {
  res.status(200).json({ success: true, applications });
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
    const response = await fetch('https://resend.com', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', 
        to: email, 
        subject: 'Успішна реєстрація на VV Work! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Вітаємо на платформі VV Work!</h2>
            <p>Ви успішно зареєструвалися як <b>${role === 'employer' ? 'Роботодавець' : 'Кандидат'}</b>.</p>
            <p>Ваш логін для входу: <b>${email}</b></p>
          </div>
        `,
      }),
    });

    if (!response.ok) throw new Error('Помилка відправки через Resend API');

    res.status(201).json({ success: true, message: 'Користувача зареєстровано, лист надіслано!' });
  } catch (error: unknown) {
    console.log("Попередження розсилки (реєстрація):", error);
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
    const response = await fetch('https://resend.com', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
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
      }),
    });

    if (!response.ok) throw new Error('Помилка відправки відновлення через Resend');

    res.status(200).json({ success: true, message: 'Тимчасовий пароль надіслано на вашу пошту!' });
  } catch (error: unknown) {
    console.log("Попередження розсилки (відновлення):", error);
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
  console.log(`Сервер запустищено на порту ${PORT}`);
});
