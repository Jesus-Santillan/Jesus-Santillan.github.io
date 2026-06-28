const {Pool} = require('pg');
require('dotenv').config();

const bd_p = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

const ptb_conn = async () => {
    try{
        const cliente = await bd_p.connect();
        console.log('Conexión exitosa con la DB');
    } catch(err) {
        console.error('Esto no salio como se esperaba, referencia de lo que sucedio: ',err.message);
    }
}

module.exports = {bd_p,ptb_conn};