import {pool} from '../database/conecction.js'



var fecha  = new Date()
var day = fecha.getDate();
var mes = fecha.getMonth();
var anio = fecha.getFullYear();

var today = `${day}/${mes}/${anio}`

export const getVentas = async (req,res) => {

  
    const result = await pool.query('select * from categoria inner join articulo on categoria.categoria_id = articulo.categoria_id'); 
  
 
    res.render('venta/venta.ejs' , {data: result[0] ,fecha:today,errormessage:false })
  
   
}


export const search = async (req , res) =>{

    const artSearch = req.body.busqueda;
    const result = await pool.query(`select * from categoria inner join articulo on categoria.categoria_id = articulo.categoria_id where articulo_nombre LIKE '${artSearch}%'`)
   
    res.render('venta/venta.ejs' , {data: result[0] , fecha:today ,errormessage:false })
}


export const searchClient = async(req , res) =>{

    const clientSearch = req.body.cliente;
    const result = await pool.query(`select * from cliente where cliente_nombre LIKE '${clientSearch}%'`);
    res.render('venta/ventaClients.ejs',{clientes:result[0]})

}


export const addVenta = async (req ,res ) => {

    const tipoVenta = req.params.tipoVenta;
    const clienteDni = req.params.dniCliente;
    const montoTotal = (req.params.montoTotal)
    const idProduc = (req.params.idProducto).split(",")
    const quantity = (req.params.quantityProduct).split(",")
    
   
    //     traemos los parametros de la URL
 
    if ( (tipoVenta === "2" && clienteDni) || tipoVenta === "1" || tipoVenta === "3") {

        
    let lastFacNum = (await pool.query(`SELECT venta_nro FROM venta ORDER BY venta_nro DESC LIMIT 1`))[0]; 
    
    //validando para que si trae un null se iguale a 0 por si es el primer registro
    if (lastFacNum == "") {

        lastFacNum = 1
    

    }else{
        lastFacNum = parseInt(JSON.stringify(lastFacNum[0].venta_nro))  + 1 
    }
   

    // insertando la nueva venta 
    if (parseInt(tipoVenta)  == 2) {
  
        var idCliente = ((await pool.query(`select cliente_id from cliente where cliente_dni =${clienteDni}`))[0])
     await pool.query(`insert into venta(venta_fecha,venta_nro,venta_montoTotal,estadoVenta_id,tipoVenta_id,cliente_id) values(current_date(),${lastFacNum},${montoTotal},1,${parseInt(tipoVenta) },${idCliente[0].cliente_id})`);
    }else{
        await pool.query(`insert into venta(venta_fecha,venta_nro,venta_montoTotal,estadoVenta_id,tipoVenta_id) values(current_date(),${lastFacNum},${montoTotal},1,${parseInt(tipoVenta) })`);
        
    }

  let lastVenta = (await pool.query(`SELECT venta_id FROM venta ORDER BY venta_id DESC LIMIT 1`))[0];

    if (lastVenta == "") {

        lastVenta = 1


    }else{
        lastVenta = parseInt(JSON.stringify(lastVenta[0].venta_id))
    }
        var products =  []

    for (let i = 0; i < idProduc.length; i++) {
    
    let product = (await pool.query(`select * from articulo where articulo_id = ${idProduc[i]}`))[0];

    products.push(product)
        
        
      await pool.query(`insert into detale_venta (fechaCreacion,venta_id,articulo_id,precioVenta,cantidad,subtotal) values(current_date(),${lastVenta},${parseInt(idProduc[i])},${product[0].articulo_precioVenta},${parseInt(quantity[i]) },${(product[0].articulo_precioVenta)*parseInt(quantity[i])})`);
    
      return res.redirect("/ventas") 
  }
   
    }else{
    

    const result = await pool.query('select * from categoria inner join articulo on categoria.categoria_id = articulo.categoria_id'); 
  

    return res.render('venta/venta.ejs' , {data: result.recordset ,fecha:today,errormessage:true })
  
   }

    // array para guardas todos los productos del carrito

    //obteniendo el ultimo numero de factura
    

  
  
    


}