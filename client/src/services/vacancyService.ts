import { API_URL } from './constants';

export async function getVacancies() {
  const response = await fetch(`${API_URL}/vacancies`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Не вдалося завантажити вакансії');
  return data.vacancies; 
}

export async function createVacancy(vacancyData: {
  title: string;
  category: string;
  salary: string;
  country?: string;
  company?: string;
  description?: string;
}) {
  const response = await fetch(`${API_URL}/vacancies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vacancyData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Не вдалося зберегти вакансію');
  return data.vacancy;
}