const uuid = require("uuid").v4;
const authenticationService = require("../services/authentication-service");
const { validRegisterBody, validLoginBody} = require("../utils/validation");

function sendSuccessResponse(res, message, data = {}) {
  res.json({
    success: true,
    message,
    time: new Date().toISOString(),
    data,
  });
}

function sendErrorResponse(res, message, statusCode) {
  res.status(statusCode).json({
    success: false,
    message,
    time: new Date().toISOString(),
    taskId: uuid(),
  });
}

async function registerUser(req, res) {
  try {
    const { name, lastName, email, password } = req.body;
    const validation = validRegisterBody(req.body);
    if (!validation.isValid) {
      return sendErrorResponse(res, validation.errors.join(", "), 400);
    }
    const newUser = await authenticationService.registerUser(name, lastName, email, password);
    sendSuccessResponse(res, "Usuario registrado exitosamente", { user: newUser });
  } catch (error) {
    if (error.message === "El usuario ya está registrado.") {
      return sendErrorResponse(res, error.message, 409);
    } else {
      return sendErrorResponse(res, "Error interno del servidor", 500);
    }
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const validation = validLoginBody(req.body);

    if (!validation.isValid) {
      return sendErrorResponse(res, validation.errors.join(", "), 400);
    }
    const { token, user } = await authenticationService.loginUser(email, password)

    sendSuccessResponse(res, "Inicio de sesión exitoso", { token, user })
  } 
  catch (error) {
    if( error.message === "Usuario no encontrado.") {
      sendErrorResponse(res, "Usuario no encontrado", 404);
    } else if (error.message === "Contraseña incorrecta.") {
      sendErrorResponse(res, "Contraseña incorrecta.", 401);
    } else {
      sendErrorResponse(res, "Error en el servidor", 500);
    }
  }
}

async function getMe(req, res) {
  try {
    const loguedUser = await authenticationService.getUserById(req.user.id);
    sendSuccessResponse(res, "Usuario obtenido exitosamente", { user: loguedUser });
  } catch (error) {
    if (error.message === "Usuario no encontrado.") {
      return sendErrorResponse(res, error.message, 404);
    } else sendErrorResponse(res, "Error en el servidor", 500);
  }
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
}
