require('dotenv').config();
const uuid = require("uuid").v4;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authenticationRoutes = require('./routes/authentication-routes');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando' });
});

app.use("/api", authenticationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    error: 'Algo salió mal en el servidor.',
    time: new Date().toISOString(),
    task_id: uuid(),
  }); 
})

// Start the server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});