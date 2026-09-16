import { INITIAL_VACANCIES } from '../mockData';

export const users: Array<{ email: string; password: string; role: string }> = [];
export const vacancies = [...INITIAL_VACANCIES];
export const applications: Array<{
  id: string;
  vacancyTitle: string;
  coverLetter: string;
  resumeName: string;
  createdAt: string;
}> = [];