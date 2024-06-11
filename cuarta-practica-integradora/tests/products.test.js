const chai = require('chai');
const expect = chai.expect;
const request = require('supertest-session');
const app = require('../index.js');


describe('======== Product Router Tests ==========', function() {
  let agent;
  let createdProductId;

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

  it('debería devolver todos los productos', async () => {
    // Realizar una solicitud para obtener todos los productos con la sesión autenticada
    const res = await agent.get('/api/products/allProducts');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('data').that.is.an('array');
  });

  it('debería devolver un producto específico por ID', async () => {
    const productId = '665c819b7fc8165b27141977'; 
    const res = await agent.get(`/api/products/prodById/${productId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('data').that.is.an('object');
    expect(res.body.data).to.have.property('_id');
  });

  it('debería crear un nuevo producto de prueba en la base de datos', async () => {
    const newProduct = {
      title: 'Producto Prueba',
      description: 'Descripción del nuevo producto',
      price: 100,
      thumbnail: 'https://via.placeholder.com/150',
      code: '123456789',
      stock: 10,
      status: true,
      category: 'Prueba',
    };
    const res = await agent
      .post('/api/products/createProd')
      .send(newProduct);
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('data');
    createdProductId = res.body.data._id; // Almacenar el ID del producto creado
  });

});
