const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
  connect: () => {
    const MONGO_URI = process.env.MONGO_URI;
    return mongoose.connect(MONGO_URI)
      .then(() => {
        console.log('Base de datos conectada')
      })
      .catch(err => console.log(err))
  }
}
