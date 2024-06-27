const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config(); // Cargar variables de entorno desde .env

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL, // Usar la URL de conexión de la base de datos desde el archivo .env
  ssl: { rejectUnauthorized: false } // Agregar esta línea si es necesario para Render.com
});

/* COMANDOS:
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
service postgresql status

Iniciar:
sudo service postgresql start

Entrar 
sudo su - postgres
psql

Cambiar contraseña del usuario postgres:
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
*/

const app = express();


app.use(cors())
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})