import {pool} from '../database/conecction.js';



export const getCobranzaCC = async (req,res) =>{

    const cliente = (await pool.query(`select * from cliente where cliente_dueda > 0`))[0]

  

    res.render("cobranzaCuentaCorriente/cobranzaCC.ejs" , { data:cliente })

}



export const cobranzaCCTotales = async (req,res) =>{


    const id = req.params.id;

    const nombre = (await pool.query(`select * from cliente where cliente_id=${id}`))[0]
 
  const nombreCompleto = nombre[0].cliente_nombre+"  "+nombre[0].cliente_apellido;


  const titulo = "Ventas Realizadas a  "+nombreCompleto+"       "; 
  const result = (await pool.query(`
  select * , EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
     EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio'  from venta INNER JOIN	cliente ON venta.cliente_id = cliente.cliente_id where cliente.cliente_dueda > 0  and venta.estadoVenta_id=1 and cliente.cliente_id=${id};`))[0]

let deudaTotal = ((await pool.query(`select cliente_dueda from cliente where cliente_id = ${id} `))[0])[0].cliente_dueda;




 const  url ="CobranzaVentas";


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

 res.render('cobranzaCuentaCorriente/cobranzaVentaTotales.ejs' , {ventas:result,titulo,fecha:id,totalVentas:totalVentas,url ,deudaTotal})

}

export const detalleCobranza = async (req,res) => {
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
   
        res.render('cobranzaCuentaCorriente/cobranzaDetalle.ejs',{venta:data  ,venta_fecha:venta_fecha, montoTotal:montoTotal,clientName:nomYape,url,fecha})
    }else{
        res.render('cobranzaCuentaCorriente/cobranzaDetalle.ejs',{venta:data  , venta_fecha:venta_fecha,montoTotal:montoTotal,clientName:undefined,url,fecha})
 
    }
}

export const cobranzaAction = async (req,res)=>{


   // Traemos los parametros mediante la URL;

   const clienteId = parseInt(req.params.idCliente)  
   const pago = parseInt(req.params.pago)
   const tipoPago = parseInt(req.params.tipoPago)

   // Restamos la deuda del cliente;

   // Traemos la deuda actual para luego restarla con el pago;
   const deuda = ((await pool.query(`SELECT cliente_dueda FROM cliente where cliente_id = ${clienteId}`))[0])[0].cliente_dueda;
   const newDeuda = deuda - pago;

   // Ingresamos la nueva deuda a la DB;
   await pool.query(`UPDATE cliente SET cliente_dueda = ${newDeuda}  where cliente_id = ${clienteId}`);



   // Modificacion del estado de caja;

   // Traemos el estado de caja en Cuenta Corriente para luego restarle el pago;

   const estadoCajaCC = ((await pool.query(`select estadoCaja_total from estadoCaja where estadoCaja_id = 2`))[0])[0].estadoCaja_total;

   const nuevoEstadoCajaCC = estadoCajaCC - pago;

   // Ingresamos el nuevo estado de cuenta corriente con el pago restado;

   await pool.query(`UPDATE estadocaja SET estadoCaja_total = ${nuevoEstadoCajaCC} where estadoCaja_id = 2; `)

   // Tramos el estado de caja en el tipo de pago que se seleccion para luego sumarle el pago;

   const estadoCajaVenta = ((await pool.query(`select estadoCaja_total from estadoCaja where estadoCaja_id = ${tipoPago}`))[0])[0].estadoCaja_total;

   const nuevoEstadoCajaVenta = estadoCajaVenta + pago;

   // Ingresamos el nuevo estado de caja sumando con el pago;

   await pool.query(`UPDATE estadocaja SET estadoCaja_total = ${nuevoEstadoCajaVenta} where estadoCaja_id = ${tipoPago}`)


   // registramos el pago en la DB

   await pool.query(`insert into pagos_cuentacorriente (pagoCuentaCorrriente_montoPago,pagoCuentaCorrriente_fecha,cliente_id,tipoVenta_id,estadoVenta_id) VALUES (${pago},current_date(),${clienteId},${tipoPago},1) `)


   res.redirect("/cobranzaCuentaCorriente")

}