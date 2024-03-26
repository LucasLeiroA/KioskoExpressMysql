import { pool } from "../database/conecction.js";
import { validationResult } from "express-validator";


var fecha = new Date();
var day = fecha.getDate();
var mes = fecha.getMonth();
var anio = fecha.getFullYear();

var today = `${day}/${mes}/${anio}`;


// Obteniedo el ultimo numero de factura

  // optemos el ultimo numero de factura

  var lastFacNum = (
    await pool.query(
      `SELECT venta_nro FROM venta ORDER BY venta_nro DESC LIMIT 1`
    )
  )[0];

  //validando para que si trae un null se iguale a 0 por si es el primer registro
  if (lastFacNum == "") {
    lastFacNum = 1;
  } else {
    lastFacNum = parseInt(JSON.stringify(lastFacNum[0].venta_nro)) + 1;
  }



export const getVentas = async (req, res) => {
  const result = await pool.query(
    "select * from categoria inner join articulo on categoria.categoria_id = articulo.categoria_id"
  );

  res.render("venta/venta.ejs", {
    data: result[0],
    fecha: today,
    errormessage: false,
    lastFacNum
  });
};

export const search = async (req, res) => {
  const artSearch = req.body.busqueda;
  const result = await pool.query(
    `select * from categoria inner join articulo on categoria.categoria_id = articulo.categoria_id where articulo_nombre LIKE '${artSearch}%'`
  );

  res.render("venta/venta.ejs", {
    data: result[0],
    fecha: today,
    errormessage: false,
    lastFacNum
  });
};

export const searchClient = async (req, res) => {
  const clientSearch = req.body.cliente;
  const result = await pool.query(
    `select * from cliente where cliente_nombre LIKE '${clientSearch}%'`
  );
  res.render("venta/ventaClients.ejs", { clientes: result[0] });
};

export const addVenta = async (req, res) => {
  const tipoVenta = req.params.tipoVenta;
  const clienteDni = req.params.dniCliente;
  const montoTotal = req.params.montoTotal;
  const idProduc = req.params.idProducto.split(",");
  const quantity = req.params.quantityProduct.split(",");
  var validacionStock = true;
  //     traemos los parametros de la URL
 





  // restamos la cantidad de la venta de los productos en el stock;

   for (let i = 0; i < idProduc.length; i++) {

    // traemos los cantidad de stock de los articulos utilizados en la venta;
    const stockArticulo = ((await pool.query(`select articulo_cantidad from articulo where articulo_id = ${idProduc[i]}`))[0])[0].articulo_cantidad;
    let newQuantity = stockArticulo - parseInt(quantity[i]);


    if (quantity[i] > stockArticulo) {
      validacionStock = false; 
      break;   
    }
    // Modificamos la cantidad de stock del articulo en la DB

    
  }

  const error = validationResult(req);
    if (!error.isEmpty()) {
      const valores = req.body;
      const validaciones = error.array();
  
      return res.render("venta/venta.ejs", {
        validaciones: validaciones,
        valores: valores,
      });
    }




if (validacionStock === false) {
  const valores = req.body;
  const validaciones = [
    {
      type: "field",
      value: "",
      msg: "Stock superado del producto para la Venta",
      path: "usuario",
      location: "body",
    },
  ];


  const result = await pool.query(
    "select * from categoria inner join articulo on categoria.categoria_id = articulo.categoria_id"
  );



  return res.render("venta/venta.ejs", {
    data: result[0],
    fecha: today,
    errormessage: false,
    validaciones: validaciones,
    valores: valores,
    lastFacNum
  });


  
}else{
    if (
    (tipoVenta === "2" && clienteDni) ||
    tipoVenta === "1" ||
    tipoVenta === "3" 
  ) {
 
    

    // insertando la nueva venta
    if (parseInt(tipoVenta) == 2) {
      var idCliente = (
        await pool.query(
          `select cliente_id from cliente where cliente_dni =${clienteDni}`
        )
      )[0];
      idCliente = idCliente[0].cliente_id;

      await pool.query(
        `insert into venta(venta_fecha,venta_nro,venta_montoTotal,estadoVenta_id,tipoVenta_id,cliente_id) values(current_date(),${lastFacNum},${montoTotal},1,${parseInt(
          tipoVenta
        )},${idCliente})`
      );
      let deuda = (
        await pool.query(
          `select cliente_dueda from cliente where cliente_id =${idCliente}`
        )
      )[0];

      deuda = parseInt(deuda[0].cliente_dueda) + parseInt(montoTotal);
      await pool.query(
        `UPDATE cliente SET cliente_dueda = ${deuda} where cliente_id = ${idCliente}`
      );
    } else {
      await pool.query(
        `insert into venta(venta_fecha,venta_nro,venta_montoTotal,estadoVenta_id,tipoVenta_id) values(current_date(),${lastFacNum},${montoTotal},1,${parseInt(
          tipoVenta
        )})`
      );
    }

    //restamos la cantidad del stock
    for (let i = 0; i < idProduc.length; i++) {

      // traemos los cantidad de stock de los articulos utilizados en la venta;
      const stockArticulo = ((await pool.query(`select articulo_cantidad from articulo where articulo_id = ${idProduc[i]}`))[0])[0].articulo_cantidad;
      let newQuantity = stockArticulo - parseInt(quantity[i]);
  
  
      await pool.query(`UPDATE articulo SET articulo_cantidad =${newQuantity} where articulo_id =${idProduc[i]} `)

      // Modificamos la cantidad de stock del articulo en la DB
  
      
    }
    

    // Modificacion del estado de caja

    // Traemos el valor actual del estado para luego modificarlo.

    let montoEstadoCaja = (
      await pool.query(
        `select estadoCaja_total from estadocaja where estadoCaja_id =${parseInt(
          tipoVenta
        )}`
      )
    )[0];
    montoEstadoCaja =
      montoEstadoCaja[0].estadoCaja_total + parseInt(montoTotal);

    // Moficamos el nuevo valor de estado de caja
    await pool.query(
      `update estadocaja SET estadoCaja_total = ${montoEstadoCaja}  WHERE estadoCaja_id = ${parseInt(
        tipoVenta
      )}`
    );

    let lastVenta = (
      await pool.query(
        `SELECT venta_id FROM venta ORDER BY venta_id DESC LIMIT 1`
      )
    )[0];

    lastVenta = lastVenta[0].venta_id;

    if (lastVenta == "") {
      lastVenta = 1;
    } else {
      lastVenta;
    }
    var products = [];

  

    for (let i = 0 ; i < idProduc.length ; i++) {
    
        let product = (
        await pool.query(
          `select * from articulo where articulo_id = ${parseInt(idProduc[i])}`
        )
      )[0];
            
    
            

      products.push(product[0]);
      
      await pool.query(
        `insert into detale_venta (fechaCreacion,venta_id,articulo_id,precioVenta,cantidad,subtotal) values(current_date(),${lastVenta},${parseInt(
          idProduc[i]
        )},${product[0].articulo_precioVenta},${parseInt(quantity[i])},${
          product[0].articulo_precioVenta * parseInt(quantity[i])
        })`
      );
     
     
    }
   
    return res.redirect("/ventas");


  } else {
    const result = await pool.query(
      "select * from categoria inner join articulo on categoria.categoria_id = articulo.categoria_id"
    );
 
  
    return res.render("venta/venta.ejs", {
      data: result[0],
      fecha: today,
      errormessage: true,
      lastFacNum
    });
  }
}




  // array para guardas todos los productos del carrito

  //obteniendo el ultimo numero de factura
};
