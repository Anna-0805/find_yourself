import { Request, Response } from 'express';
import { vacancies, applications } from '../services/db.service';

export const getVacancies = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, vacancies });
};

export const createVacancy = (req: Request, res: Response) => {
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
  return res.status(201).json({ success: true, vacancy: newVacancy, message: 'Вакансію успішно опубліковано на сервері!' });
};

export const getApplications = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, applications });
};

export const createApplication = (req: Request, res: Response) => {
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
  return res.status(201).json({ success: true, application: newApplication, message: 'Відгук успішно збережено на сервері!' });
};