import { Router } from "express";
// importar el controlador
import {getInicialAnulacionVentas,getVentasPorFecha,getSingleVenta,anulateVenta} from "../controllers/anulacionVenta.controller.js"



const router = Router();

router.get("/anulacionVentas",getInicialAnulacionVentas);
router.get("/anulacionVentas/fecha/:fecha",getVentasPorFecha)
router.get("/anulacionVentas/Detalle/:url/:fecha/:id" , getSingleVenta)
router.get("/anulacionVentas/anulada/:fecha/:id",anulateVenta)
export default router;