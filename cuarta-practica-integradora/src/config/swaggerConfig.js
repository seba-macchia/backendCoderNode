const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion API de CoderHouse",
      description: "Esta es la documentación de la API de Coderhouse, antes de continuar con el proyecto, cabe destacar que en la versión original, se trabaja con autenticaciones, en este caso, cree una ruta de swagger específica para trabajar con productos y carritos sin autenticación asi se puede probar todo, con total normalidad.La documentación proporciona información sobre cómo usar las diferentes rutas y endpoints disponibles en la API. A continuación se detallan los diferentes endpoints disponibles y sus descripciones."
    },
  },
  apis: [`./src/docs/*.yaml`]
};

const specs = swaggerJSDoc(swaggerOptions);

module.exports = specs;
