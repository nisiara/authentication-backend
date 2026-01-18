const validationPatterns = {
  name: /^[a-zA-ZÀ-ÿ\s]{3,}$/,
  lastName: /^[a-zA-ZÀ-ÿ\s]{2,}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/}

function isValid(tipo, valor) {
  return validationPatterns[tipo].test(valor);
}

function validateField(body, field, errorMessages) {
  const value = body[field];

  if (!value || typeof value !== "string") {
    return [errorMessages.required];
  }
  
  if (!isValid(field, value)) {
    return [errorMessages.invalid];
  }

  return [];
}

function validateFields(body, fieldsConfig) {
  const errors = [];
  
  fieldsConfig.forEach(({ field, messages }) => {
    errors.push(...validateField(body, field, messages));
  });

  return errors;
}

function validRegisterBody(body) {
  const errors = validateFields(body, [
    {
      field: "name",
      messages: {
        required: "Debe ingresar un nombre.",
        invalid: "Debe ingresar un nombre válido.",
      },
    },
    {
      field: "lastName",
      messages: {
        required: "Debe ingresar un apellido.",
        invalid: "Debe ingresar un apellido válido.",
      },
    },
    {
      field: "email",
      messages: {
        required: "Debe ingresar un correo electrónico.",
        invalid: "Debe ingresar un correo electrónico válido.",
      },
    },
    {
      field: "password",
      messages: {
        required: "Debe ingresar una contraseña.",
        invalid:
          "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.",
      },
    },
  ]);

 
  if (!body.confirmPassword || typeof body.confirmPassword !== "string") {
    errors.push("Debe ingresar la confirmación de la contraseña.");
  } else if (body.confirmPassword !== body.password) {
    errors.push("No coinciden las contraseñas.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validLoginBody(body) {
  const errors = validateFields(body, [
    {
      field: "email",
      messages: {
        required: "Debe ingresar un correo electrónico.",
        invalid: "Debe ingresar un correo electrónico válido.",
      },
    },
    {
      field: "password",
      messages: {
        required: "Debe ingresar una contraseña.",
        invalid: "La contraseña no tiene el formato correcto.",
      },
    },
  ]);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validRegisterBody,
  validLoginBody,
};