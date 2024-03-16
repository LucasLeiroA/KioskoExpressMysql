import {pool} from "../database/conecction.js"

export const getReporte = (req,res) => {

  

   res.render('reportesMultiples/reporteMultiple.ejs')

}

export const getSingleVenta = async (req , res) => {

   const id_venta = req.params.id;
   const url = req.params.url;
   const fecha = req.params.fecha;

  const result = await pool.query(`SELECT cliente_id,EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes', EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio',venta.cliente_id, venta.venta_nro,venta.venta_fecha,venta.venta_montoTotal,detale_venta.articulo_id,detale_venta.cantidad,detale_venta.precioVenta,detale_venta.subtotal
  FROM venta
  INNER JOIN detale_venta ON venta.venta_id = detale_venta.venta_id where venta.venta_id = ${parseInt(id_venta)};`);

   const items = result[0];


   var data = [];
   let montoTotal = 0;
   for (const i of items) {
      const productName = await pool.query(`
      select articulo_nombre from articulo where articulo_id = ${i.articulo_id}`);
      let pro = productName[0];
      montoTotal = montoTotal + i.subtotal;
      let newData = {
         'articulo':pro[0].articulo_nombre,
         subtotal:i.subtotal,
         venta_nro:i.venta_nro,
         venta_montoTotal:i.venta_montoTotal,
         cantidad:i.cantidad,
         precioVenta:i.precioVenta,
      } 
      data.push(newData)
   }
   let clientId = items[0].cliente_id;


   let venta_fecha= `${(items[0].venta_dia<10?'0':'') + items[0].venta_dia}/${(items[0].venta_mes<10?'0':'')+items[0].venta_mes}/${items[0].venta_anio}`
   if (clientId) {
   
      let clientName = (await pool.query(`select cliente_nombre,cliente_apellido from cliente where cliente_id =${clientId}`))[0]
      let nomYape = `${clientName[0].cliente_nombre} ${clientName[0].cliente_apellido}`
      console.log(nomYape);
       res.render('reportesMultiples/reporteDetalleVenta.ejs',{venta:data  ,venta_fecha:venta_fecha, montoTotal:montoTotal,clientName:nomYape,url,fecha})
   }else{
       res.render('reportesMultiples/reporteDetalleVenta.ejs',{venta:data  , venta_fecha:venta_fecha,montoTotal:montoTotal,clientName:undefined,url,fecha})

   }



}


export const getVentaDate = async (req, res) => {
   const titulo = "Ventas del  "
   const fecha = req.params.fecha;
   const result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
   EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
  from venta where venta_fecha >= '${fecha}' and venta_fecha <= '${fecha}'`);
   const url= "ventasPorFecha"

   const ventas = result[0];
   let totalVentas = 0;
   ventas.map((e) => {
  
      totalVentas = totalVentas + e.venta_montoTotal;
     switch (e.tipoVenta_id) {
        case 1:
           e.tipoVenta_id = e.tipoVenta_id.toString() 
           e.tipoVenta_id = "Contado"
           break;
        case 2:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Cuenta Corriente"
        break;
        case 3:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Transferencia/Tarjeta"
        break;  
     }
     switch (e.estadoVenta_id) {
        case 1:
           e.estadoVenta_id = e.estadoVenta_id.toString() 
           e.estadoVenta_id = "Habilitada"
           break;
        case 2:
        e.estadoVenta_id = e.estadoVenta_id.toString() 
        e.estadoVenta_id = "Anulada"
        break;
     }
     e.fechaTotal =  `${e.venta_dia}/${e.venta_mes}/${e.venta_anio}`
     

   }) 

   res.render('reportesMultiples/reporteVentasTotales.ejs' , {ventas:ventas,totalVentas:totalVentas,titulo,fecha,url})

   
}


export const getVentasContadoDate = async(req,res) =>{


   const titulo = "Ventas en Contado del  "
   const fecha = req.params.fecha;
   const result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
   EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
  from venta where venta_fecha >= '${fecha}' and venta_fecha <= '${fecha}' and tipoVenta_id = 1`);
   const url ="VentasPorFechaContado"
   const ventas = result[0];
   let totalVentas = 0;

   ventas.map((e) => {
  
      totalVentas = totalVentas + e.venta_montoTotal;
     switch (e.tipoVenta_id) {
        case 1:
           e.tipoVenta_id = e.tipoVenta_id.toString() 
           e.tipoVenta_id = "Contado"
           break;
        case 2:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Cuenta Corriente"
        break;
        case 3:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Transferencia/Tarjeta"
        break;  
     }
     switch (e.estadoVenta_id) {
        case 1:
           e.estadoVenta_id = e.estadoVenta_id.toString() 
           e.estadoVenta_id = "Habilitada"
           break;
        case 2:
        e.estadoVenta_id = e.estadoVenta_id.toString() 
        e.estadoVenta_id = "Anulada"
        break;
     }
     e.fechaTotal =  `${e.venta_dia}/${e.venta_mes}/${e.venta_anio}`
     

   }) 

   res.render('reportesMultiples/reporteVentasTotales.ejs' , {ventas:ventas,totalVentas:totalVentas,titulo,fecha,url})

}

export const getVentasTransferenciaDate = async(req,res) =>{
   const titulo = "Ventas en Transferencia del  "
   const fecha = req.params.fecha;
   const result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
   EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
  from venta where venta_fecha >= '${fecha}' and venta_fecha <= '${fecha}' and tipoVenta_id = 3`);
   const url ="VentasPorFechaTransferencia"
   const ventas = result[0];
   let totalVentas = 0;

   ventas.map((e) => {
  
      totalVentas = totalVentas + e.venta_montoTotal;
     switch (e.tipoVenta_id) {
        case 1:
           e.tipoVenta_id = e.tipoVenta_id.toString() 
           e.tipoVenta_id = "Contado"
           break;
        case 2:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Cuenta Corriente"
        break;
        case 3:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Transferencia/Tarjeta"
        break;  
     }
     switch (e.estadoVenta_id) {
        case 1:
           e.estadoVenta_id = e.estadoVenta_id.toString() 
           e.estadoVenta_id = "Habilitada"
           break;
        case 2:
        e.estadoVenta_id = e.estadoVenta_id.toString() 
        e.estadoVenta_id = "Anulada"
        break;
     }
     e.fechaTotal =  `${e.venta_dia}/${e.venta_mes}/${e.venta_anio}`
     

   }) 

   res.render('reportesMultiples/reporteVentasTotales.ejs' , {ventas:ventas,totalVentas:totalVentas,titulo,fecha,url})
}


export const getVentaCC = async(req,res) =>{
   const titulo = "Ventas en Cuenta Corriente del  "
   const fecha = req.params.fecha;
   const result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
   EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
  from venta where venta_fecha >= '${fecha}' and venta_fecha <= '${fecha}' and tipoVenta_id = 2`);
   const url ="VentasPorFechaCuentaCorriente"
   const ventas = result[0];
   let totalVentas = 0;

   ventas.map((e) => {
  
      totalVentas = totalVentas + e.venta_montoTotal;
     switch (e.tipoVenta_id) {
        case 1:
           e.tipoVenta_id = e.tipoVenta_id.toString() 
           e.tipoVenta_id = "Contado"
           break;
        case 2:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Cuenta Corriente"
        break;
        case 3:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Transferencia/Tarjeta"
        break;  
     }
     switch (e.estadoVenta_id) {
        case 1:
           e.estadoVenta_id = e.estadoVenta_id.toString() 
           e.estadoVenta_id = "Habilitada"
           break;
        case 2:
        e.estadoVenta_id = e.estadoVenta_id.toString() 
        e.estadoVenta_id = "Anulada"
        break;
     }
     e.fechaTotal =  `${e.venta_dia}/${e.venta_mes}/${e.venta_anio}`
     

   }) 

   res.render('reportesMultiples/reporteVentasTotales.ejs' , {ventas:ventas,totalVentas:totalVentas,titulo,fecha,url})
}


export const getVentasMes = async(req,res) =>{
   const titulo = "Ventas del  "
   const fecha = req.params.mes;
   const mes = fecha.split("-");
   
   let lastDayMonth = new Date(parseInt(mes[0]),parseInt(mes[1]), 0).getDate(); 

   const result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
   EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
  from venta where venta_fecha >= '${fecha}-01' and venta_fecha <= '${fecha}-${lastDayMonth}'`);

   const ventas = result[0];
   const url= "ventasPorMes"

   let venta_fecha;
   let totalVentas = 0;
   ventas.map((e) => {
  
      totalVentas = totalVentas + e.venta_montoTotal;
     switch (e.tipoVenta_id) {
        case 1:
           e.tipoVenta_id = e.tipoVenta_id.toString() 
           e.tipoVenta_id = "Contado"
           break;
        case 2:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Cuenta Corriente"
        break;
        case 3:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Transferencia/Tarjeta"
        break;  
     }
     switch (e.estadoVenta_id) {
        case 1:
           e.estadoVenta_id = e.estadoVenta_id.toString() 
           e.estadoVenta_id = "Habilitada"
           break;
        case 2:
        e.estadoVenta_id = e.estadoVenta_id.toString() 
        e.estadoVenta_id = "Anulada"
        break;
     }
     for (const i of ventas) {
      e.fechaTotal =  `${e.venta_dia}/${e.venta_mes}/${e.venta_anio}`
       
     }
     

   }) 

  
   res.render('reportesMultiples/reporteVentasTotales.ejs' , {ventas:ventas,totalVentas:totalVentas,titulo,fecha,url})


}

export const getVentasMesContado = async(req,res) => {

   const titulo = "Ventas Contado del mes    "
   const fecha = req.params.mes;
   const mes = fecha.split("-");
   
   let lastDayMonth = new Date(parseInt(mes[0]),parseInt(mes[1]), 0).getDate(); 

   const result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
   EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
  from venta where venta_fecha >= '${fecha}-01' and venta_fecha <= '${fecha}-${lastDayMonth}' and tipoVenta_id = 1`);


   const ventas = result[0];
   const url= "ventasPorMesContado"

   let venta_fecha;
   let totalVentas = 0;
   ventas.map((e) => {
  
      totalVentas = totalVentas + e.venta_montoTotal;
     switch (e.tipoVenta_id) {
        case 1:
           e.tipoVenta_id = e.tipoVenta_id.toString() 
           e.tipoVenta_id = "Contado"
           break;
        case 2:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Cuenta Corriente"
        break;
        case 3:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Transferencia/Tarjeta"
        break;  
     }
     switch (e.estadoVenta_id) {
        case 1:
           e.estadoVenta_id = e.estadoVenta_id.toString() 
           e.estadoVenta_id = "Habilitada"
           break;
        case 2:
        e.estadoVenta_id = e.estadoVenta_id.toString() 
        e.estadoVenta_id = "Anulada"
        break;
     }
     for (const i of ventas) {
      e.fechaTotal =  `${e.venta_dia}/${e.venta_mes}/${e.venta_anio}`
       
     }
     

   }) 

  
   res.render('reportesMultiples/reporteVentasTotales.ejs' , {ventas:ventas,totalVentas:totalVentas,titulo,fecha,url})



}

export const getVentasMesTransferencia = async(req,res) => {

   const titulo = "Ventas Transferencia del mes    "
   const fecha = req.params.mes;

   const mes = fecha.split("-");
   
   let lastDayMonth = new Date(parseInt(mes[0]),parseInt(mes[1]), 0).getDate(); 

   const result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
   EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
  from venta where venta_fecha >= '${fecha}-01' and venta_fecha <= '${fecha}-${lastDayMonth}' and tipoVenta_id = 3`);

   const ventas = result[0];
   const url= "ventasPorMesContadoTransfencia"

   let venta_fecha;
   let totalVentas = 0;
   ventas.map((e) => {
  
      totalVentas = totalVentas + e.venta_montoTotal;
     switch (e.tipoVenta_id) {
        case 1:
           e.tipoVenta_id = e.tipoVenta_id.toString() 
           e.tipoVenta_id = "Contado"
           break;
        case 2:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Cuenta Corriente"
        break;
        case 3:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Transferencia/Tarjeta"
        break;  
     }
     switch (e.estadoVenta_id) {
        case 1:
           e.estadoVenta_id = e.estadoVenta_id.toString() 
           e.estadoVenta_id = "Habilitada"
           break;
        case 2:
        e.estadoVenta_id = e.estadoVenta_id.toString() 
        e.estadoVenta_id = "Anulada"
        break;
     }
     for (const i of ventas) {
      e.fechaTotal =  `${e.venta_dia}/${e.venta_mes}/${e.venta_anio}`
       
     }
     

   }) 

  
   res.render('reportesMultiples/reporteVentasTotales.ejs' , {ventas:ventas,totalVentas:totalVentas,titulo,fecha,url})



}


export const getventasmesCC = async(req,res) =>{


   const titulo = "Ventas Cuenta Corriente del Mes    "
   const fecha = req.params.mes;

   const mes = fecha.split("-");
   
   let lastDayMonth = new Date(parseInt(mes[0]),parseInt(mes[1]), 0).getDate(); 

   const result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
   EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
  from venta where venta_fecha >= '${fecha}-01' and venta_fecha <= '${fecha}-${lastDayMonth}' and tipoVenta_id = 2`);

   const ventas = result[0];
   const url= "ventasPormesCuentaCorriente"

   let venta_fecha;
   let totalVentas = 0;
   ventas.map((e) => {
  
      totalVentas = totalVentas + e.venta_montoTotal;
     switch (e.tipoVenta_id) {
        case 1:
           e.tipoVenta_id = e.tipoVenta_id.toString() 
           e.tipoVenta_id = "Contado"
           break;
        case 2:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Cuenta Corriente"
        break;
        case 3:
        e.tipoVenta_id = e.tipoVenta_id.toString() 
        e.tipoVenta_id = "Transferencia/Tarjeta"
        break;  
     }
     switch (e.estadoVenta_id) {
        case 1:
           e.estadoVenta_id = e.estadoVenta_id.toString() 
           e.estadoVenta_id = "Habilitada"
           break;
        case 2:
        e.estadoVenta_id = e.estadoVenta_id.toString() 
        e.estadoVenta_id = "Anulada"
        break;
     }
     for (const i of ventas) {
      e.fechaTotal =  `${e.venta_dia}/${e.venta_mes}/${e.venta_anio}`
       
     }
     

   }) 

  
   res.render('reportesMultiples/reporteVentasTotales.ejs' , {ventas:ventas,totalVentas:totalVentas,titulo,fecha,url})
}