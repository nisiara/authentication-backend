const jwt = require('jsonwebtoken');
const uuid = require("uuid").v4;

const JWT_SECRET = process.env.JWT_SECRET

function validateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      status: 'error',
      message: 'Token ausente',
      time: new Date().toISOString(),
      taskId: uuid(),
    }); 
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();

  }
  catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado',
      time: new Date().toISOString(),
      taskId: uuid,
    });
  }
}



module.exports = { validateToken };