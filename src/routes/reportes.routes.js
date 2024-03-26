import { Router } from "express";
import {
  getReporte,
  getEstadoCaja,
  getSingleVenta,
  getVentaDate,
  getventasAnuladasMes,
  getClientes,
  getVentasClienteDeuda,
  getReportePagosCC,
  getPagosForDate,
  anulacionPago,
  getPagosForClientes
} from "../controllers/reportes.controller.js";

const router = Router();

router.get("/reportesMultiples", getReporte);
router.get("/reportesMultiples/EstadoCaja", getEstadoCaja);

router.get("/reportesMultiples/DetalleVenta/:url/:fechaDesde/:fechaHasta/:id/:tipoVenta", getSingleVenta);


router.get("/reportesMultiples/ventasPorFecha/:fechaDesde/:fechaHasta/:tipoVenta", getVentaDate);



router.get("/reportesMultiples/ventasAnuladas/:fechaDesde/:fechaHasta/:tipoVenta", getventasAnuladasMes);


router.get("/reportesMultiples/deudaClientes", getClientes);
router.get("/reportesMultiples/VentasClientesDeuda/:id",getVentasClienteDeuda)


// reporte Pagos Cuenta Corriente;

router.get("/reportesMultiples/pagoCuentaCorriente",getReportePagosCC)

router.get("/reportesMultiples/pagoCuentaCorriente/:fechaDesde/:fechaHasta",getPagosForDate);

router.get("/reportesMultiples/pagoCuentaCorrientePorClientes/:idCliente",getPagosForClientes);


router.get("/reportesMultiples/anulacionPago/:pagoId/:idTipoVenta/:fechaDesde/:fechaHasta",anulacionPago)

export default router;
