import { Router } from "express";
import { getLogin ,logged} from "../controllers/loginRegistrarStock.controller.js";
import {body} from 'express-validator';
const router = Router();


router.get('/loginRegistrarStock',getLogin)
router.post('/loginRegistrarStock/logged',[
    body('usuario' , 'Debe ingresar el Usuario')
    .exists()
    .not()
    .isEmpty(),
    body('contrasena' , 'Debe ingresar una Contraseña')
    .exists()
    .not()
    .isEmpty()
],logged)



export default router;