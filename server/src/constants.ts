export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-it';
export const TOKEN_EXPIRES_IN = '1d';

export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'https://find-yourself-pied.vercel.app';

export const MAIL_SENDER = 'onboarding@resend.dev';

export const EMAIL_SUBJECTS = {
  REGISTRATION: 'Успішна реєстрація на VV Work! 🎉',
  RESET_PASSWORD: 'Відновлення пароля на VV Work 🔑',
};