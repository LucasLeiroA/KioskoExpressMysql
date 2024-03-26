import {createPool} from 'mysql2/promise';

import {DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE,DB_PORT} from '../config.js'


export  const pool =  createPool({
  
  host:DB_HOST,
  user:DB_USER,
  password:DB_PASSWORD,
  database:DB_DATABASE,
  port:DB_PORT
})






// connection.connect((err)=>{
//   if(err) throw err;
//   console.log("Conexion Exitosa");
// })



// const dbSettings = {
    
//     user:DB_USER,
//     password:DB_PASSWORD,
//     server:DB_HOST,
//     database:DB_DATABASE,
//     options:{
//         encrypt:false,
//         trustServerCertificate:true
//     },
//     port: 1433

// }

// export async function getConecction(){
    
//   try {
//     const pool = await sql.connect(dbSettings);
//     return pool
//   } catch (err) {
//     console.log(err);
//   }
// }


