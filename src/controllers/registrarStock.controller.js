import {pool} from '../database/conecction.js'
import { validationResult } from "express-validator";



export const getProducts = async (req,res) => {

    
    const result = await pool.query('select * from categoria inner join articulo on categoria.categoria_id = articulo.categoria_id');
    let data = result[0]
    res.render('registrarStock/articulos.ejs' , {data})
    
}

export const saveProduct = async (req,res) => {

   
    const result = await pool.query('select * from categoria inner join articulo on categoria.categoria_id = articulo.categoria_id');
    var dataArticulo = result[0];

    const error = validationResult(req);
    if (!error.isEmpty()) {
        const valores = req.body;
        const validaciones = error.array()
        return res.render('registrarStock/articulos.ejs' , {data: dataArticulo,validaciones:validaciones,valores:valores})
       
    }
    
    try {
        
        let articulo = req.body.articulo;
        let cantidad = req.body.cantidad;
        let categoria = req.body.categoria;
        let precioCompra = req.body.precioCompra;
        let precioVenta=req.body.precioVenta;
        
        console.log(categoria);

         await pool.query(`insert into articulo (articulo_nombre,articulo_cantidad,categoria_id,articulo_precioCompra,articulo_precioVenta) values ("${articulo}",${cantidad},${categoria},${precioCompra},${precioVenta})`);
      
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
    res.redirect('/registrarStock')

}
export const deleteProduct = async(req,res) =>{

    let idArticulo = req.params.id;

  await pool.query(`DELETE FROM articulo WHERE articulo_id =${idArticulo}`)

   res.redirect('/registrarStock')
}

export const updateProduct = async(req,res) =>{

    let idProduct = req.params.id;

   const result = await pool.query(`select * from categoria inner join articulo on categoria.categoria_id = articulo.categoria_id where articulo_id=${idProduct}`);
    const data=result[0];
    res.render('registrarStock/articulos_edit.ejs',{data:data})

}

export const editProduct = async(req,res)=>{


    let idArticulo = req.params.id;
    const dataUnique = (await pool.query(`select * from categoria inner join articulo on categoria.categoria_id = articulo.categoria_id where articulo.articulo_id=${idArticulo}`))[0];
    
    console.log(dataUnique);
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const valores = req.body;
        const validaciones = error.array()
        return res.render('registrarStock/articulos_edit.ejs' , {data:dataUnique,validaciones:validaciones,valores:valores})
       
    }

    

    
    let articulo = req.body.articulo;
    let cantidad = req.body.cantidad;
    let precioCompra = req.body.precioCompra;
    let precioVenta = req.body.precioVenta;

    
    const result = await pool.query(`UPDATE articulo SET articulo_nombre ='${articulo}', articulo_cantidad=${cantidad},articulo_precioCompra=${precioCompra},articulo_precioVenta=${precioVenta} WHERE articulo_id=${idArticulo}`)

  
    res.redirect('/registrarStock')

}

export const search = async (req , res) =>{

    const artSearch = req.body.busqueda;
    const result = await pool.query(`select * from categoria inner join articulo on categoria.categoria_id = articulo.categoria_id where articulo_nombre LIKE '${artSearch}%'`)
  
  
  
  
    res.render('registrarStock/articulos.ejs' , {data: result[0]})
}

export const createDB = async(req,res)=>{
    await pool.query(`
    create table usuario(
        usuario_id int not null auto_increment,
        usuario_nombre varchar(80),
        usuario_password varchar(80),
        primary key(usuario_id)

    )
    
    create table categoria(
            
            categoria_id int not null auto_increment,
            categoria_tipo varchar(80),
            primary key(categoria_id)
    );
    
    
    create table articulo(
        
        articulo_id int not null auto_increment,
        categoria_id int not null,
        articulo_precioCompra int,
        articulo_precioVenta int,
        articulo_cantidad int,
        articulo_nombre varchar(100),
        primary key(articulo_id),
        foreign key(categoria_id)references categoria(categoria_id)
    );
        
    create table cliente(
        
        cliente_id int not null auto_increment,
        cliente_nombre varchar(80),
        cliente_apellido varchar(80),
        cliente_dni int,
        cliente_dueda int,
        primary key(cliente_id)
    
    );
    
    create table estadoVenta(
    
        estadoVenta_id int not null auto_increment,
        estado	varchar(50),
        primary key(estadoVenta_id)
    
    );
    
    
    create table tipoVenta(
        
        tipoVenta_id int not null auto_increment,
        tipoVenta varchar(50),
        primary key(tipoVenta_id)
        
    );
    SET @fecha = CURDATE();
    
    create table venta(
    
        venta_id int not null auto_increment,
        cliente_id int,
        venta_nro int,
        venta_fecha date,
        venta_montoTotal int,
        estadoVenta_id int,
        tipoVenta_id int,
        primary key(venta_id),
        foreign key(cliente_id)references cliente(cliente_id),
        foreign key(estadoVenta_id)references estadoventa(estadoVenta_id),
        foreign key(tipoVenta_id)references tipoventa(tipoVenta_id)
           
    );
    
    
    
    create table detale_venta(
    
        detalleVenta_id int not null auto_increment,
        venta_id int,
        articulo_id int,
        precioVenta int,
        cantidad int,
        subtotal int,    
        fechaCreacion date,
        primary key(detalleVenta_id),
        foreign key(venta_id)references venta(venta_id),
        foreign key(articulo_id)references articulo(articulo_id)
    );
    
    create table pagos_cuentaCorriente(
    
        pagoCuentaCorrriente_id int not null auto_increment,
        pagoCuentaCorrriente_montoPago int,
        pagoCuentaCorrriente_fecha date,
        estadoVenta_id int,
        cliente_id int,
        tipoVenta_id int,
        primary key(pagoCuentaCorrriente_id),
        foreign key(cliente_id)references cliente(cliente_id),
        foreign key(tipoVenta_id)references tipoventa(tipoVenta_id),
        foreign key(estadoVenta_id)references estadoventa(estadoVenta_id)
    );
    
    
    
    
    insert into estadocaja (estadoCaja_tipo,estadoCaja_total) values ('contado',0);
    insert into estadocaja (estadoCaja_tipo,estadoCaja_total) values ('CC',0);
    insert into estadocaja (estadoCaja_tipo,estadoCaja_total) values ('transferencia',0);
    
    
    
    
    insert into usuario	(usuario_nombre,usuario_password) values ('lucasleiro','lucas1248759');
    insert into usuario	(usuario_nombre,usuario_password) values ('holelmiami','hotel580');
    
    
    insert into categoria (categoria_tipo) values("bebidas");
    insert into categoria (categoria_tipo) values ("cigarrilos");
    insert into categoria (categoria_tipo) values ("comestibles");
    insert into categoria (categoria_tipo) values ("golosinas");
    
    
    
    insert into estadoVenta(estado) values('habilitada');
    insert into estadoVenta(estado) values('inhabilitada');
    
    insert into tipoVenta(tipoVenta) values('efectivo');
    insert into tipoVenta(tipoVenta) values('cuenta corriente');
    insert into tipoVenta(tipoVenta) values('transferencia');
    
    `)
    
}
