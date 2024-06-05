const chai = require('chai');
const expect = chai.expect;
const request = require('supertest-session');
const app = require('../index.js');

describe('Cart Router', function() {
  let agent;

  // Aumentar el tiempo de espera para las pruebas
  this.timeout(5000);

  before(async () => {
    // Crear un agente de supertest-session
    agent = request(app);

    // Iniciar sesión como un usuario administrador y guardar la sesión
    await agent
      .post('/api/sessions/login')
      .send({ email: 'jose@mail.com', password: '1234' });
  });

  it('debería devolver todos los carritos', async () => {
    // Realizar una solicitud para obtener todos los carritos con la sesión autenticada
    const res = await agent.get('/api/carts/allCarts');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('carts').that.is.an('array');
  });

  it('debería crear un nuevo carrito', async () => {
    // Realizar una solicitud para crear un nuevo carrito con la sesión autenticada
    const res = await agent.post('/api/carts/createCart');
    console.log('Contenido obtenido:', res.body); // Mostrar el carrito nuevo por pantalla
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('cart').that.is.an('object');
    expect(res.body.cart).to.have.property('_id');
  });

  it('debería agregar un producto al carrito', async () => {
    const cartId = '6659b2eccd71c920d4cbeeb7'; 
    const productId = '665c819b7fc8165b27141977'; 
    const res = await agent
      .post(`/api/carts/addProdToCart/${cartId}/${productId}`)
      .send({ quantity: 1 });
    console.log('Contenido obtenido:', res.body); // Mostrar contenido obtenido por pantalla
    // Ajusta estas aserciones según lo esperado para esta ruta y usuario
    expect(res.status).to.equal(201); // Cambia a 201
    expect(res.body).to.be.an('object');
  });
});