const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid').v4;

const { readUsers, writeUsers } = require('../utils/file-storage');


async function registerUser(name, lastName, email, password) {
  const users = readUsers();

  const existingUser = users.find( user => user.email === email);
  if (existingUser) {
    throw new Error('El usuario ya está registrado.');
  }

  const hashedPassword = await bycrypt.hash(password, 10);
  const newUser = {
    id: uuid(),
    name,
    lastName,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  return { id: newUser.id, name: newUser.name, lastName: newUser.lastName, email: newUser.email, createdAt: newUser.createdAt };
}

async function loginUser(email, password) {
  const users = readUsers();

  const user = users.find( user => user.email === email);
  if (!user) {
    throw new Error('Correo electrónico o contraseña incorrectos.');
  }

  const isPasswordValid = await bycrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Correo electrónico o contraseña incorrectos.');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user: { id: user.id, email: user.email, name: user.name, lastName: user.lastName } };
}

function getUserById(userId) {
  const users = readUsers();
  const user = users.find(user => user.id === userId);
  if(!user) {
    throw new Error('Usuario no encontrado.');
  }
  return { id: user.id, email: user.email, name: user.name, lastName: user.lastName };
}      

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
