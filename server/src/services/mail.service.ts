import { MAIL_SENDER, EMAIL_SUBJECTS } from '../constants';

export async function sendRegistrationEmail(email: string, role: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: MAIL_SENDER,
      to: email,
      subject: EMAIL_SUBJECTS.REGISTRATION,
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
}

export async function sendResetPasswordEmail(email: string, tempPassword: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: MAIL_SENDER,
      to: email,
      subject: EMAIL_SUBJECTS.RESET_PASSWORD,
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
}