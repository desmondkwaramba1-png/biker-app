require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const registerDeliverySockets = require('./src/sockets/deliverySocket');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/deliveries', require('./src/routes/deliveries'));
app.use('/api/earnings', require('./src/routes/earnings'));

registerDeliverySockets(io);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
