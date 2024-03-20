import express from 'express';
import config from './config.js';
import registrarStock from './routes/registrarStock.routes.js'
import loginRegistrarStock from './routes/loginRegistrarStock.routes.js'
import ventas from './routes/ventas.routes.js'
import reportes from './routes/reportes.routes.js'
import incialRoute from './routes/inicial.routes.js'
import anulacionVenta from './routes/anulacionVenta.routes.js'
import registrarCliente from './routes/registrarCliente.routes.js'
import cors from 'cors';


import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
//midellwares
app.use((req, res, next) => {

    // Dominio que tengan acceso (ej. 'http://example.com')
       res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Metodos de solicitud que deseas permitir
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
       res.setHeader('Access-Control-Allow-Headers', '*');
    
    next();
    })
    
app.use(express.json());   
app.use(express.urlencoded({extended:false}))
app.use(cors())

//settings
app.use(express.static(path.join(__dirname,'public')));
app.set("port" , config.port)

app.set('views',path.join(__dirname,'views'))


//routes
app.use(registrarStock);
app.use(loginRegistrarStock)
app.use(ventas)
app.use(reportes)
app.use(incialRoute)
app.use(anulacionVenta)
app.use(registrarCliente)
export default app;
