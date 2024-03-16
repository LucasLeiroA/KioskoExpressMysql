import {pool} from '../database/conecction.js'


export const getIncial = async (req, res) => {

    const result = await pool.query("select * from estadocaja")
    console.log(result);
    return res.json(result[0]);
  };