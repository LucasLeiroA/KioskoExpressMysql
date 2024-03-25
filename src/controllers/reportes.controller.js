import {pool} from "../database/conecction.js"

export const getReporte = (req,res) => {

  

   res.render('reportesMultiples/reporteMultiple.ejs')

}


export const getEstadoCaja = async (req,res) =>{

   let estados = (await pool.query(`select estadoCaja_total from estadocaja`))[0]


   res.render('reportesMultiples/reporteEstadoCaja.ejs' ,{estados})
}

export const getSingleVenta = async (req , res) => {

   const id_venta = req.params.id;
   const url = req.params.url;
   const fechaDesde = req.params.fechaDesde;
   const fechaHasta= req.params.fechaHasta;
   var tipoVenta = req.params.tipoVenta;

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
     
       res.render('reportesMultiples/reporteDetalleVenta.ejs',{venta:data  ,venta_fecha:venta_fecha, montoTotal:montoTotal,clientName:nomYape,url,fechaDesde ,fechaHasta,tipoVenta,clientId})
   }else{
       res.render('reportesMultiples/reporteDetalleVenta.ejs',{venta:data  , venta_fecha:venta_fecha,montoTotal:montoTotal,clientName:undefined,url,fechaDesde,fechaHasta,tipoVenta,clientId})

   }



}


export const getVentaDate = async (req, res) => {


   const titulo = "Ventas del  "
   const fechaDesde = req.params.fechaDesde;
   const fechaHasta = req.params.fechaHasta;
   var tipoVenta = parseInt(req.params.tipoVenta)
   
   var result;

   const fecha = fechaDesde+"    al   "+fechaHasta



   if (tipoVenta === 0) {

     result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
   EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
   from venta where venta_fecha >= '${fechaDesde}' and venta_fecha <= '${fechaHasta}' and estadoVenta_id=1`);
   
   }
   else{
   
       result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
   EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
   from venta where venta_fecha >= '${fechaDesde}' and venta_fecha <= '${fechaHasta}' and estadoVenta_id=1 and tipoVenta_id=${tipoVenta}`);
   
   }

  
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

   res.render('reportesMultiples/reporteVentasTotales.ejs' , {ventas:ventas,totalVentas:totalVentas,titulo,fechaDesde,fechaHasta,url,tipoVenta})

   
}


export const getventasAnuladasMes = async (req,res) =>{

   // Traemos todas las ventas anuladas

   const titulo = "Ventas Anuladas del  "
   const fechaDesde = req.params.fechaDesde;
   const fechaHasta = req.params.fechaHasta;
   var tipoVenta = parseInt(req.params.tipoVenta)
   
   var result;

   const fecha = fechaDesde+"    al   "+fechaHasta



   if (tipoVenta === 0) {

     result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
   EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
   from venta where venta_fecha >= '${fechaDesde}' and venta_fecha <= '${fechaHasta}' and estadoVenta_id=2`);
   
   }
   else{
   
       result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
   EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
   from venta where venta_fecha >= '${fechaDesde}' and venta_fecha <= '${fechaHasta}' and estadoVenta_id=2 and tipoVenta_id=${tipoVenta}`);
   
   }

  
  const url= "ventasAnuladas"

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

   res.render('reportesMultiples/reporteVentasTotales.ejs' , {ventas:ventas,totalVentas:totalVentas,titulo,fechaDesde,fechaHasta,url,tipoVenta})
}


export const getClientes = async(req,res) =>{


   const result = (await pool.query(`select * from cliente where cliente_dueda > 0`))[0];

   res.render("reportesMultiples/reporteCliente.ejs" , {data:result})
}

export const getVentasClienteDeuda = async (req,res) =>{

   const id = parseInt(req.params.id);



     const nombre = (await pool.query(`select * from cliente where cliente_id=${id}`))[0]
  
   const nombreCompleto = nombre[0].cliente_nombre+"  "+nombre[0].cliente_apellido;
   var fechaDesde = "none"
   var fechaHasta ="none"
   var tipoVenta="none"

   const titulo = "Ventas Realizadas a  "+nombreCompleto+"       "; 
   const result = (await pool.query(`
   select * , EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
      EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio'  from venta INNER JOIN	cliente ON venta.cliente_id = cliente.cliente_id where cliente.cliente_dueda > 0  and venta.estadoVenta_id=1 and cliente.cliente_id=${id};`))[0]


   
  const  url ="VentasClientesDeuda";


  let totalVentas = 0;
  result.map((e) => {
 
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

  res.render('reportesMultiples/reporteVentasTotales.ejs' , {ventas:result,titulo,id,totalVentas:totalVentas,url ,fechaHasta ,fechaDesde,tipoVenta})

}



export const getReportePagosCC = async (req,res) =>{

   const clienteConDeuda = (await pool.query(`select * from cliente inner join pagos_cuentacorriente on cliente.cliente_id = pagos_cuentacorriente.pagoCuentaCorrriente_id where pagos_cuentacorriente.estadoVenta_id = 1`))[0]

   res.render("pagosCuentaCorriente/pagosCCincial.ejs" , {data:clienteConDeuda})

}

export const getPagosForDate = async(req,res) =>{

   const fechaDesde = req.params.fechaDesde;
   const fechaHasta = req.params.fechaHasta;



   const pagoForDate = (await pool.query(`select pagos_cuentacorriente.tipoVenta_id, pagoCuentaCorrriente_montoPago ,cliente_nombre,cliente_apellido, pagoCuentaCorrriente_id , tipoVenta ,estado, EXTRACT(DAY FROM pagoCuentaCorrriente_fecha) AS 'venta_dia', EXTRACT(MONTH FROM pagoCuentaCorrriente_fecha) AS 'venta_mes', EXTRACT(YEAR FROM pagoCuentaCorrriente_fecha) AS 'venta_anio' from pagos_cuentacorriente 
   INNER JOIN cliente ON pagos_cuentacorriente.cliente_id = cliente.cliente_id INNER JOIN 
   tipoventa ON pagos_cuentacorriente.tipoVenta_id = tipoventa.tipoVenta_id INNER JOIN
   estadoventa ON pagos_cuentacorriente.estadoVenta_id = estadoventa.estadoVenta_id
   where pagoCuentaCorrriente_fecha >= '${fechaDesde}' and pagoCuentaCorrriente_fecha <= '${fechaHasta}' and pagos_cuentacorriente.estadoVenta_id = 1 `))[0]

   pagoForDate.map((e)=>{
      e.cliente_nombre=e.cliente_nombre+" "+e.cliente_apellido;
      e.fechaTotal =  `${e.venta_dia}/${e.venta_mes}/${e.venta_anio}`

   })

   res.render("pagosCuentaCorriente/pagosTotalesCC.ejs" , {pagos:pagoForDate})

}

export const getPagosForClientes = async (req,res) =>{


   res.send("HOla desde pagos por clientes")
}


export const anulacionPago = async (req,res) =>{

   let pagoId = req.params.pagoId;
   let idTipoventa = req.params.idTipoVenta;

   
   // cambiamos el estado del pago a Inhabilitado
   await pool.query(`UPDATE pagos_cuentacorriente SET estadoVenta_id	= 2 where pagoCuentaCorrriente_id = ${parseInt(pagoId)}`)

   // recuperamos el monto del pago para luego restado o sumarlo en el estado de caja;

   let montoPago = ((await pool.query(`select pagoCuentaCorrriente_montoPago from pagos_cuentacorriente where pagoCuentaCorrriente_id = ${pagoId}`))[0])[0].pagoCuentaCorrriente_montoPago;

   //en el estado de cuentaCorriente necesitamos sumarle el pago ya que se anulo
   let estadoCajaCC = ((await pool.query(`select estadoCaja_total from estadocaja where estadoCaja_id = 2`))[0])[0].estadoCaja_total;
   
   // insertamos la actualizacion de estado caja CC con el pago
   let newEstadoCC = estadoCajaCC + montoPago;
   await pool.query(`UPDATE estadocaja SET estadoCaja_total = ${newEstadoCC} where estadoCaja_id = 2;`)

  
  
   //en los demas estado necesitas restar el pago 
   let estadoCaja = ((await pool.query(`select estadoCaja_total from estadocaja where estadoCaja_id = ${idTipoventa}`))[0])[0].estadoCaja_total;
  
  // insertamos la resta del estado de caja ya sea contado o transferencia a DB
   let newEstado = estadoCaja - montoPago;
   await pool.query(`UPDATE estadocaja SET estadoCaja_total = ${newEstado} where estadoCaja_id = ${idTipoventa}`)




   res.redirect("/reportesMultiples/pagoCuentaCorriente")

} 