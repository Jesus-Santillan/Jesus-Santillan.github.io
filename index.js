const http = require("node:http");
const app = require("./src/app");
const {bd_p,ptb_conn} =require("./bd/bd.js");

require("dotenv").config();

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT);

// Listeners
server.on("listening", async () => {
    try{
        await ptb_conn();
        console.log("server started");
    } catch(err) {
        console.error('something gets wrong: ',err.message);
    }
});
server.keepAliveTimeout = 30 * 1000; // 30 seconds
server.headersTimeout = 35 * 1000; // 35 seconds

server.on("error", (error) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});