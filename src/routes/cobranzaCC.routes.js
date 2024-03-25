import { Router } from "express";
// importar el controlador
import {getCobranzaCC , cobranzaCCTotales , detalleCobranza , cobranzaAction} from "../controllers/cobranzaCC.controller.js"



const router = Router();

router.get("/cobranzaCuentaCorriente",getCobranzaCC);
router.get("/cobranzaCuentaCorriente/CobranzaVentas/:id",cobranzaCCTotales);
router.get("/cobranzaCuentaCorriente/cobranzaDetalle/:url/:fecha/:id", detalleCobranza);
router.get("/cobranzaCuentaCorriente/pagoCuentaCorriente/:idCliente/:pago/:tipoPago",cobranzaAction );
export default router;