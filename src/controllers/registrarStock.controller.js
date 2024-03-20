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


