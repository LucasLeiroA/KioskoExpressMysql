import { config } from "dotenv"

config();


export default{
    port:process.env.port || 3000
}

export const DB_HOST= process.env.DB_HOST || 'localhost'

export const DB_USER = process.env.DB_USER || 'sa'

export const DB_PASSWORD=process.env.DB_PASSWORD || 'lucas1248759'

export const DB_DATABASE= process.env.DB_DATABASE || 'sistemaKiosko'

export const DB_PORT= process.env.DB_PORT || '3306'
