import { Router } from "express";
import {getPageCliente , addClient , deleteClient ,updateClient , editClient ,searchClient } from "../controllers/registrarCliente.controller.js"
import {body} from 'express-validator';



const router = Router();

router.get("/registrarCliente",getPageCliente);


router.post("/registrarCliente/add",[

    body('nombre' , 'ingrese el nombre')
    .exists()
    .not()
    .isEmpty(),
    body('apellido','ingrese el apellido')
    .exists()
    .not()
    .isEmpty(),
    body('dniCliente','ingrese el numero del DNI')
    .exists()
    .isNumeric(),



], addClient)

router.get("/registrarCliente/delete/:id",deleteClient)



router.get("/registrarCliente/update/:id",updateClient);

router.post("/registrarCliente/update/:id",[

    body('nombre' , 'ingrese el nombre')
    .exists()
    .not()
    .isEmpty(),
    body('apellido','ingrese el apellido')
    .exists()
    .not()
    .isEmpty(),
    body('dniCliente','ingrese el numero del DNI')
    .exists()
    .isNumeric(),


],editClient);



router.post("/registrarCliente/filter",searchClient);
export default router;