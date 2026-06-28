// Imports
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
const apiRoutes = require('./routes/api.SEMK.routes');
const sanitizer = require("perfect-express-sanitizer");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(express.json());

function rateLimitAndTimeout(req, res, next) { // -
  const ip = req.ip; 
  requestCounts[ip] = (requestCounts[ip] || 0) + 1; // Update request count for the current IP
  if (requestCounts[ip] > rateLimit) { // Check if request count exceeds the rate limit
    return res.status(429).json({
      code: 429,
      status: "Error",
      message: "el limite de peticiones ha sido superado. Intenta mas tarde",
      data: null,
    });
  }
  req.setTimeout(15000, () => { // Handle timeout error
    res.status(504).json({
      code: 504,
      status: "Error",
      message: "El tiempo de la conexion ha expirado :b .",
      data: null,
    });
    req.abort(); 
  });

  next(); 
}
const verifyToken = (req, res, next) => { // -
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'failed authorization' });
  }
  const token = authHeader.split(' ')[1];
  try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified; 
      next(); 
  } catch (err) {
      return res.status(400).json({ error: 'invalid token or expired.' });
  }
};
const limitPayloadSize = (req, res, next) => { // -
  const MX_PAYL_SIZE = 1024 * 1024; // 1MB
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > MX_PAYL_SIZE) {
    return res.status(413).json({ error: 'payload limit exceeded, wait a second to continue' });
  }
  next();
}
const sanitizer_ena = (req, res, next) => { // -
  sanitizer.clean({ xss: true, noSql: false, sql: true, sqlLevel: 5 });
  next();
}
  

//libs app uses
app.use(helmet());
app.use(morgan("combined")); 
app.use(cors({origin: 'http://localhost:3000', optionsSuccessStatus: 200 })); 
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(sanitizer.clean({ xss: true, noSql: false, sql: true, sqlLevel: 5 }));
//app.use(verifyToken);
app.use(limitPayloadSize);
app.use(sanitizer_ena);
app.use(rateLimitAndTimeout);
app.disable("x-powered-by"); 



// Route configuration
const rateLimit = 20; // Max requests per minute
const interval = 60 * 1000; // Time window in milliseconds

const services=[{
    route: "auth/registro",
    target: "http://localhost:3000/auth/registro"
},
{
    route: "auth/inicio",
    target: "http://localhost:3000/auth/inicio"    
}];

const requestCounts = {};
setInterval(() => {
    Object.keys(requestCounts).forEach((ip) => {
      requestCounts[ip] = 0; 
    });
  }, interval);


services.forEach(({ route, target }) => {
    const proxyOptions = {
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${route}`]: "",
      },
    };
  
    app.use(route, rateLimitAndTimeout,limitPayloadSize,sanitizer_ena,verifyToken,createProxyMiddleware(proxyOptions));
  });

app.use('/', apiRoutes);

app.use((_req, res) => {// not-found
  res.status(404).json({
    code: 404,
    status: "Error",
    message: "Route not found.",
    data: null,
  });
 });




module.exports = app;
