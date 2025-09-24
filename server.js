const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./src/components/json/animales.json'); // Ruta a tu JSON
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const port = process.env.PORT || 3001; // Usa el puerto de Render o 3001 local
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});