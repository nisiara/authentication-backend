const fs = require('fs');
const path = require('path'); 

// const USERS_FILE = path.join(__dirname, '..', data, 'users.json');
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');


function readUsers() {
  try {
    const users = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(users);
  } catch (error) {
    console.error('Error al leer los usuarios del archivo users.json', error);
    return []
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al guardar el archivo users.json', error);
    throw new Error('No se pudo guardar el archivo users.json');
  }
}

module.exports = {
  readUsers,
  writeUsers,
};