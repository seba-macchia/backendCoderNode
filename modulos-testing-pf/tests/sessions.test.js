const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../index.js');
const { tokenGenerator } = require('../src/utils/generateToken');

describe('Session Router', function() {
  let authToken;

  // Aumentar el tiempo de espera para las pruebas
  this.timeout(5000);

  before(async () => {
    authToken = tokenGenerator({ id: 'userId', role: 'admin' });
  });

  it('debería registrar un nuevo usuario', async () => {
    const newUser = {
      name: 'Nombre de Usuario',
      lastname: 'Apellido de Usuario',
      email: 'correo@mail.com',
      password: '1234',
      age: 20,
      role: 'user', 
      resetPasswordToken: 'token', 
      resetPasswordExpires: new Date() 
    };
  
    const res = await supertest(app)
      .post('/api/sessions/register')
      .send(newUser);
  
    // Verifica el código de estado 302 para la redirección
    expect(res.status).to.equal(302);
    // Verifica que la redirección sea a la ruta deseada
    expect(res.header).to.have.property('location').that.equals('/');
  });
  
  it('debería iniciar sesión con credenciales válidas', async () => {
    const credentials = {
      email: 'jose@mail.com',
      password: '1234',
    };
  
    const res = await supertest(app)
      .post('/api/sessions/login')
      .send(credentials);
  
    // Verifica el código de estado 302 para la redirección
    expect(res.status).to.equal(302);
    // Verifica que la redirección sea a la ruta deseada
    expect(res.header).to.have.property('location').that.equals('/api/products');
  });
  
  it('debería cerrar sesión correctamente', async () => {
    const res = await supertest(app)
      .post('/api/sessions/logout')
      .set('Authorization', `Bearer ${authToken}`);
  
    // Verifica el código de estado 302 para la redirección
    expect(res.status).to.equal(302);
    // Verifica que la redirección sea a la ruta deseada
    expect(res.header).to.have.property('location').that.equals('/login');
  });

});
