import {pool} from '../database/conecction.js'
import { validationResult } from "express-validator";


export const getPageCliente = async (req,res) =>{

    const result = (await pool.query(`select * from cliente`))[0];


    res.render('registrarCliente/registrarCliente.ejs' , {data:result})

}


export const addClient = async (req,res) => {

    const result = (await pool.query(`select * from cliente`))[0];

    const error = validationResult(req);
    if (!error.isEmpty()) {
        const valores = req.body;
        const validaciones = error.array()
        return res.render('registrarCliente/registrarCliente.ejs' , {data: result,validaciones:validaciones,valores:valores})
       
    }


    try {
        
        let nombre = req.body.nombre;
        let apellido = req.body.apellido;
        let dni = req.body.dniCliente;
        
        

         await pool.query(`insert into cliente (cliente_nombre,cliente_apellido,cliente_dni) values ("${nombre}","${apellido}",${dni})`);
      
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
    
    res.redirect('/registrarCliente')

}

export const deleteClient = async (req,res) =>{



    const id = req.params.id;

    await pool.query(`DELETE FROM cliente WHERE cliente_id =${id}`)

    res.redirect('/registrarCliente')


}


export const updateClient = async(req,res) =>{

    let id = req.params.id;

   const result = await pool.query(`select * from cliente where cliente_id=${id}`);
    const data=result[0];

    res.render('registrarCliente/cliente_edit.ejs',{data:data})

}



export const editClient = async(req,res)=>{
 
    let id = req.params.id;
    const data = await pool.query(`select * from cliente where cliente_id=${id}`);
    const dataUnique =data[0];
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const valores = req.body;
        const validaciones = error.array()
        return res.render('registrarCliente/cliente_edit.ejs' , {data:dataUnique ,validaciones:validaciones,valores:valores})
       
    }

    

    
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let dni = req.body.dniCliente;

    
    const result = await pool.query(`UPDATE cliente SET cliente_nombre ='${nombre}', cliente_apellido='${apellido}',cliente_dni=${dni} WHERE cliente_id=${id}`)

  
    res.redirect('/registrarCliente')

}



export const searchClient = async (req , res) =>{

    const clientSearch = req.body.busqueda;
    const result = await pool.query(`select * from cliente where cliente_apellido LIKE '${clientSearch}%'`)
  
  
  
  
    res.render('registrarCliente/registrarCliente.ejs' , {data: result[0]})
}
