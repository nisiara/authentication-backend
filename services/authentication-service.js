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
    throw new Error('Usuario no encontrado.');
  }

  const isPasswordValid = await bycrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Contraseña incorrecta.');
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


async function getGitHubAccessToken(code) {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;
  const redirect_uri = process.env.GITHUB_REDIRECT_URI;

  if(!client_id || !client_secret) {
    throw new Error('Credenciales de GitHub no configuradas.');
  }

  
  const tokenRequestBody = new URLSearchParams({
    client_id,
    client_secret,
    code: code
  });

  if (redirect_uri) {
    tokenRequestBody.append('redirect_uri', redirect_uri);
  }

  const response = await fetch(process.env.GITHUB_AUTH_ACCESS_TOKEN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: tokenRequestBody
  });

  if (!response.ok) {
    throw new Error('Error al obtener el token de acceso de GitHub.');
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`Error de GitHub: ${data.error_description}`);
  }

  const access_token = data.access_token;

  /* const gitHubUser = await getGitHubUser(access_token);

  const users = readUsers();
  const user = users.find( user => user.email === gitHubUser.email);

  if (!user) {
    user = {
      id: uuid(),
      name: gitHubUser.name || gitHubUser.login,
      lastName: '',
      email: gitHubUser.email,
      password: '',
      githubId: gitHubUser.id,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
  }

  
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  
  return { 
    token, 
    user: { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      lastName: user.lastName 
    } 
  }; */

  return access_token;
}

async function getGitHubUser(access_token) {
  const response = await fetch(process.env.GITHUB_AUTH_USER_URL, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el usuario de GitHub.');
  }

  const githubUser = await response.json();
  return githubUser;
}

async function loginWithGitHub(code) {
  const accessToken = await getGitHubAccessToken(code);
  const gitHubUser = await getGitHubUser(accessToken);

  const email = gitHubUser.email || `${gitHubUser.id}@github.com`;

  const users = readUsers();
  let user = users.find( user => user.email === email);

  if (!user) {
    user = {
      id: uuid(),
      name: gitHubUser.name || gitHubUser.login,
      lastName: '',
      email: email,
      password: '',
      gitHubId: gitHubUser.id,
      createdAt: new Date().toISOString(),
    }

    users.push(user)
    writeUsers(users)
  }
  
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

  
  return { 
    token, 
    user: { 
      id: user.id, 
      email: user.email,
      name: user.name,
      lastName: user.lastName
    } 
  }; 
}


module.exports = {
  loginWithGitHub,
  getGitHubAccessToken,
  getGitHubUser,
  registerUser,
  loginUser,
  getUserById,
};
