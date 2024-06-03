const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../index.js');
const { tokenGenerator } = require('../src/utils/generateToken');

describe('Cart Router', function() {
  let userToken;

  // Aumentar el tiempo de espera para las pruebas
  this.timeout(5000);

  before(async () => {
    // Generar un token de prueba para un usuario normal o premium
    userToken = tokenGenerator({ id: 'userId', role: 'admin' }); 
  });

  it('debería devolver todos los carritos', async () => {
    const res = await supertest(app)
      .get('/api/carts/allCarts')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('carts').that.is.an('array');
  });

  it('debería crear un nuevo carrito', async () => {
    const res = await supertest(app)
      .post('/api/carts/createCart')
      .set('Authorization', `Bearer ${userToken}`);
  
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('cart').that.is.an('object');
    expect(res.body.cart).to.have.property('_id');
  });

  it('debería agregar un producto al carrito', async () => {
    const cartId = '66291fd6deaf74281866de97'; 
    const productId = '665c7b2f1724c1eeaf999566'; 
    const res = await supertest(app)
      .post(`/api/swagger/addProdToCart/${cartId}/${productId}`)
      .send({ quantity: 1 }) 
      .set('Authorization', `Bearer ${userToken}`);
  
    // Ajusta estas aserciones según lo esperado para esta ruta y usuario
    expect(res.status).to.equal(201); // Cambia a 201
    expect(res.body).to.be.an('object');
});
  
});
