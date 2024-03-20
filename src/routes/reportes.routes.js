import { Router } from "express";
import {getReporte , getEstadoCaja, getSingleVenta , getVentaDate ,getVentasMes,getVentasContadoDate ,getVentasTransferenciaDate , getVentasMesContado,getVentasMesTransferencia,getVentaCC,getventasmesCC,getventasAnuladasMes} from '../controllers/reportes.controller.js'

const router = Router();


router.get("/reportesMultiples" , getReporte);
router.get("/reportesMultiples/EstadoCaja",getEstadoCaja)
router.get("/reportesMultiples/DetalleVenta/:url/:fecha/:id" , getSingleVenta)
router.get("/reportesMultiples/ventasPorFecha/:fecha",getVentaDate )
router.get("/reportesMultiples/ventasPorFechaContado/:fecha",getVentasContadoDate )
router.get("/reportesMultiples/VentasPorFechaTransferencia/:fecha",getVentasTransferenciaDate )
router.get("/reportesMultiples/VentasPorFechaCuentaCorriente/:fecha",getVentaCC )
router.get("/reportesMultiples/ventasPorMes/:mes",getVentasMes )
router.get("/reportesMultiples/ventasPorMesContado/:mes",getVentasMesContado)
router.get("/reportesMultiples/ventasPorMesContadoTransfencia/:mes",getVentasMesTransferencia)
router.get("/reportesMultiples/ventasPormesCuentaCorriente/:mes",getventasmesCC)
router.get("/reportesMultiples/ventasAnuladas/:mes",getventasAnuladasMes)

export default router;