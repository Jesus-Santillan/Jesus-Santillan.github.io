const path = require("path");
const fs = require('fs');
const crypto = require('crypto');
const fs_p = require('fs/promises');
const { JSDOM } = require("jsdom");

const get_inicio = (req, res) => {
    const nonce = crypto.randomBytes(16).toString('base64');
    res.setHeader(
        'Content-Security-Policy',
        `default-src 'self'; script-src 'self' 'nonce-${nonce}';`
    );
    fs.readFile(path.join(__dirname,"../views","inicio_sesion.html"), 'utf8', (err,htmlContent) => {
        if (err) {
            console.error('Algo ocurrio con la pagina:', err);
            return;
        }
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        document.getElementById("body").innerHTML += `<script nonce="${nonce}"> window.addEventListener("load", () =>{ setInterval(() => {`+
        ' const cont = document.getElementById("cont"); const div_prt = document.createElement("div"); div_prt.classList.add("partic"); div_prt.style.left = `${Math.floor(Math.random() * 101)}%`; '+
        ' const size = Math.random()*16+10; div_prt.style.width = `${size}px`; div_prt.style.height = `${size}px`; div_prt.style.animationName = "moverArriba"; div_prt.style.animationDuration =`${Math.floor((Math.random() *28)+2)}s`; '+
        ' cont.appendChild(div_prt); div_prt.addEventListener("animationend", () => { div_prt.remove(); }); },380);}); '
        +'</script>';
        res.send(dom.serialize());
    });
}
const get_registro = (req, res) => {
    const nonce = crypto.randomBytes(16).toString('base64');
    res.setHeader(
        'Content-Security-Policy',
        `default-src 'self'; script-src 'self' 'nonce-${nonce}';`
    );
    fs.readFile(path.join(__dirname,"../views","registro.html"), 'utf8', (err,htmlContent) => {
        if (err) {
            console.error('Algo ocurrio con la pagina:', err);
            return;
        }
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        document.getElementById("body").innerHTML += `<script nonce="${nonce}"> window.addEventListener("load", () =>{ setInterval(() => {`+
        ' const cont = document.getElementById("cont"); const div_prt = document.createElement("div"); div_prt.classList.add("partic"); div_prt.style.left = `${Math.floor(Math.random() * 101)}%`; '+
        ' const size = Math.random()*16+10; div_prt.style.width = `${size}px`; div_prt.style.height = `${size}px`; div_prt.style.animationName = "moverArriba"; div_prt.style.animationDuration =`${Math.floor((Math.random() *28)+2)}s`; '+
        ' cont.appendChild(div_prt); div_prt.addEventListener("animationend", () => { div_prt.remove(); }); },380);}); '
        +'</script>';
        res.send(dom.serialize());
    });
}

const create = (req,res) => {

}

module.exports = { get_registro,get_inicio,create }
