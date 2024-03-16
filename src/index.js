import app from "./app.js";
import './database/conecction.js'

   
app.listen(app.get('port'));

console.log("server on port", app.get('port'));
 