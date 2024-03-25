import {pool} from '../database/conecction.js'


export const getInicialAnulacionVentas = async (req, res) => {



      res.render('anulacionVenta/anulacionVentas.ejs')

  };



export const getVentasPorFecha = async (req,res)=>{


    const titulo = "Ventas del  "
    const fecha = req.params.fecha;

    const result = await pool.query(`select venta_id,venta_nro, EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes',
    EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio' , estadoVenta_id,tipoVenta_id,venta_montoTotal  
   from venta where venta_fecha >= '${fecha}' and venta_fecha <= '${fecha}'  and estadoVenta_id=1`);
    
   
   
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
 
    res.render('anulacionVenta/anulacionPorFecha.ejs' , {ventas:ventas,totalVentas:totalVentas,titulo,fecha,url})
 
    





}


export const getSingleVenta = async (req , res) => {

    const id_venta = req.params.id;
    const url = req.params.url;
    const fecha = req.params.fecha;
 
   const result = await pool.query(`SELECT cliente_id,EXTRACT(DAY FROM venta_fecha) AS 'venta_dia', EXTRACT(MONTH FROM venta_fecha) AS 'venta_mes', EXTRACT(YEAR FROM venta_fecha) AS 'venta_anio',venta.cliente_id, venta.venta_id,venta.venta_nro,venta.venta_fecha,venta.venta_montoTotal,detale_venta.articulo_id,detale_venta.cantidad,detale_venta.precioVenta,detale_venta.subtotal
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
 
    let idventa= items[0].venta_id;
    let venta_fecha= `${(items[0].venta_dia<10?'0':'') + items[0].venta_dia}/${(items[0].venta_mes<10?'0':'')+items[0].venta_mes}/${items[0].venta_anio}`
    if (clientId) {
    
       let clientName = (await pool.query(`select cliente_nombre,cliente_apellido from cliente where cliente_id =${clientId}`))[0]
       let nomYape = `${clientName[0].cliente_nombre} ${clientName[0].cliente_apellido}`

        res.render('anulacionVenta/anulacionDetalle.ejs',{venta:data ,id:idventa ,venta_fecha:venta_fecha, montoTotal:montoTotal,clientName:nomYape,url,fecha})
    }else{
        res.render('anulacionVenta/anulacionDetalle.ejs',{venta:data ,id:idventa , venta_fecha:venta_fecha,montoTotal:montoTotal,clientName:undefined,url,fecha})
 
    }
 
 
 
 }





 export const anulateVenta = async (req,res) => {


    let id = req.params.id;
    let fecha = req.params.fecha;
    await pool.query(`UPDATE venta SET estadoVenta_id = 2 WHERE venta_id = ${id}`)


    // traemos el total de la venta que anulamos para restar el estado de caja
    let venta = (await pool.query(`select venta_montoTotal,tipoVenta_id from venta where venta_id= ${id}`))[0]
   let montoResta = venta[0].venta_montoTotal;
   let tipoVenta = venta[0].tipoVenta_id;

   // Resta de la deuda del cliente al anular la venta de cuenta corriente
   if (tipoVenta === 2) {
      let clienteId = (await pool.query(`select cliente_id from venta where venta_id = ${id}`))[0];
      
      let clienteDeuda = (await pool.query(`select cliente_dueda from cliente where cliente_id = ${clienteId[0].cliente_id}`))[0];
      let nuevaDeuda = clienteDeuda[0].cliente_dueda - montoResta;
        
      await pool.query(`UPDATE cliente SET cliente_dueda = ${nuevaDeuda} where cliente_id = ${clienteId[0].cliente_id}`)
  } 

   // traemos el estado de caja para restar el total de la venta
   let resultEstado = (await pool.query(`select estadoCaja_total from estadocaja where estadoCaja_id= ${tipoVenta}`))[0]
   // restamos el estado de caja con el total de la venta obtenida


   let estado = resultEstado[0].estadoCaja_total;
  


   montoResta = estado - montoResta;


   await pool.query(`update estadocaja SET estadoCaja_total = ${montoResta}  WHERE estadoCaja_id = ${tipoVenta}`);

  
   
   res.redirect(`/anulacionVentas`)
 }
 