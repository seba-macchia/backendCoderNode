const mongoose = require('mongoose');

module.exports = {
  connect: () => {
    return mongoose.connect('mongodb+srv://macchiasebastianprog:coder1234@codercluster.ictmdpz.mongodb.net/')
    .then(() => {
      console.log('Base de datos conectada')
    })
    .catch(err => console.log(err))
  }
}