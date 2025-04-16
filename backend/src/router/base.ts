import { Router } from "express";
import { authRouter } from "./auth";
import { mainRouter } from "./main";

const router = Router();

router.use('/auth',authRouter);
router.use('/main',mainRouter);

export const baseRouter = router;