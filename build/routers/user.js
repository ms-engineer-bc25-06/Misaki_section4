import { Router } from 'express';
const router = Router();
router.get('/', (_req, res) => {
    res.send('User router works!');
});
export default router;
