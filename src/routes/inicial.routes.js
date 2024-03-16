import { Router } from "express";
import {getIncial} from "../controllers/inicial.controller.js"

const router = Router();

router.get("/",getIncial);


export default router;