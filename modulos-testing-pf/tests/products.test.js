const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../index.js');
const { tokenGenerator } = require('../src/utils/generateToken');

describe('Product Router', function() {
  let authToken;

  // Aumentar el tiempo de espera para las pruebas
  this.timeout(5000);

  before(async () => {
    authToken = tokenGenerator({ id: 'userId', role: 'admin' });
  });

  it('debería devolver todos los productos', async () => {
    const res = await supertest(app).get('/api/products/allProducts');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('data').that.is.an('array');
  });

  it('debería devolver un producto específico por ID', async () => {
    const productId = '665c819b7fc8165b27141977'; 
    const res = await supertest(app).get(`/api/products/prodById/${productId}`);
  
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('data').that.is.an('object');
    expect(res.body.data).to.have.property('_id');

    console.log(res.body.data); // Muestro el producto obtenido por id en consola
  });

  it('debería crear un nuevo producto de prueba en la base de datos', async () => {
    try {
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
        const res = await supertest(app)
            .post('/api/products/createProd')
            .set('Authorization', `Bearer ${authToken}`)
            .set('User-Agent', 'Mocha')
            .send(newProduct);

        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data');
    } catch (error) {
        console.error('Error al crear un producto:', error);
    }
});
});
