// seedAdmin.js
// Script sencillo para insertar un SuperAdmin en tu base MongoDB.
// Uso:
// 1) Establece la variable de entorno MONGO_URI (puedes copiarla de tu backend .env)
//    En PowerShell:
//      $env:MONGO_URI = 'mongodb+srv://...'
// 2) node seedAdmin.js
// Opcional: editar EMAIL y PASSWORD abajo si quieres otros valores

const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

const MONGO_URI = process.env.MONGO_URI || ''
if (!MONGO_URI) {
  console.error('Error: MONGO_URI no está definida. Exporta la variable antes de ejecutar.');
  process.exit(1)
}

// Ajusta según tu colección / estructura si es necesario
const DB_NAME = undefined // usa la BD definida en la URI si la hay
const COLLECTION = 'users'

const EMAIL = 'super@visita.cocha'
const PASSWORD = 'admin123'

async function main(){
  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  try{
    await client.connect()
    const db = DB_NAME ? client.db(DB_NAME) : client.db()
    const users = db.collection(COLLECTION)

    const exists = await users.findOne({ email: EMAIL })
    if (exists){
      console.log('Usuario ya existe en la BD:', EMAIL)
      console.log('ID:', exists._id)
      return
    }

    const hash = await bcrypt.hash(PASSWORD, 10)
    const doc = {
      email: EMAIL,
      password: hash,
      roles: ['SuperAdmin'],
      firstName: 'Super',
      lastName: 'Cocha',
      name: 'Super Cocha',
      mustChangePassword: false,
      createdAt: new Date()
    }

    const res = await users.insertOne(doc)
    console.log('Usuario creado correctamente. _id =', res.insertedId)
    console.log(`Credenciales: ${EMAIL} / ${PASSWORD}`)
  }catch(err){
    console.error('Error al conectar/insertar:', err)
  }finally{
    await client.close()
  }
}

main()
