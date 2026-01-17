const validationPatterns = {
  name: /^[a-zA-ZÀ-ÿ\s]{3,}$/,
  lastName: /^[a-zA-ZÀ-ÿ\s]{2,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{9}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

function isValid(tipo, valor) {
  return validationPatterns[tipo].test(valor);
}

function validRegisterBody(body) {
  const errors = [];

  if (!body.email || typeof body.email !== "string") {
    errors.push("Debe ingresar un correo electrónico.");
  } else if (!isValid("email", body.email)) {
    errors.push("Debe ingresar un correo electrónico válido.");
  } else if (!body.password || typeof body.password !== "string") {
    errors.push("Debe ingresar una contraseña.");
  } else if (!isValid("password", body.password)) {
    errors.push(
      "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validLoginBody(body) {
  const errors = [];

  if (!body.email || typeof body.email !== "string") {
    errors.push("Debe ingresar un correo electrónico.");
  } else if (!isValid("email", body.email)) {
    errors.push("Debe ingresar un correo electrónico válido.");
  } else if (!body.password || typeof body.password !== "string") {
    errors.push("Debe ingresar una contraseña.");
  } else if (!isValid("password", body.password)) {
    errors.push(
      "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validRegisterBody,
  validLoginBody,
};