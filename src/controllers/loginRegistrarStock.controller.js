// import { getConecction } from "../database/conecction.js";
import {pool} from '../database/conecction.js'
import { validationResult } from "express-validator";

export const getLogin = async (req, res) => {
  return res.render("login/loginRegistrarStock.ejs");
};

export const logged = async (req, res) => {

  const result = await pool.query("select * from usuario where usuario_id = 1");


  const data = result[0]


  const adminUser = data[0];

  const inputUser = req.body.usuario;
  const inputPassword = req.body.contrasena;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    const valores = req.body;
    const validaciones = error.array();

    return res.render("login/loginRegistrarStock.ejs", {
      validaciones: validaciones,
      valores: valores,
    });
  }

  if (
    inputUser == adminUser.usuario_nombre &&
    inputPassword == adminUser.usuario_password
  ) {
    return res.redirect("/registrarStock");
  } else {
    const valores = req.body;
    const validaciones = [
      {
        type: "field",
        value: "",
        msg: "Usuario o Contraseña Incorrectos",
        path: "usuario",
        location: "body",
      },
    ];

    return res.render("login/loginRegistrarStock.ejs", {
      validaciones: validaciones,
      valores: valores,
    });
  }
};

