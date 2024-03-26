import { Router } from "express";
import { getProducts , saveProduct ,deleteProduct,updateProduct,editProduct ,search,createDB} from "../controllers/registrarStock.controller.js";
import {body} from 'express-validator';

const router = Router();



router.get("/registrarStock", getProducts);


router.post("/registrarStock/add",[

    body('articulo' , 'ingrese un articulo')
    .exists()
    .not()
    .isEmpty(),
    body('cantidad','ingrese la cantidad')
    .exists()
    .isNumeric(),
    body('precioCompra','ingrese el precio de compra')
    .exists()
    .isNumeric(),
    body('precioVenta', 'ingrese el precio de venta')
    .exists()
    .isNumeric(),


],saveProduct);

router.get("/registrarStock/delete/:id",deleteProduct);

router.get("/registrarStock/update/:id",updateProduct);

router.post("/registrarStock/update/:id",[

    body('articulo' , 'ingrese un articulo')
    .exists()
    .not()
    .isEmpty(),
    body('cantidad','ingrese la cantidad')
    .exists()
    .isNumeric(),
    body('precioCompra','ingrese el precio de compra')
    .exists()
    .isNumeric(),
    body('precioVenta', 'ingrese el precio de venta')
    .exists()
    .isNumeric(),


],editProduct);


router.post("/registrarStock/filter",search);
router.get("/crearBaseDeDatos",createDB)

export default router;
