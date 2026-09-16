import { Router } from 'express';
import { getVacancies, createVacancy, getApplications, createApplication } from '../controllers/vacancy.controller';

const router = Router();

router.get('/vacancies', getVacancies);
router.post('/vacancies', createVacancy);
router.get('/applications', getApplications);
router.post('/applications', createApplication);

export default router;