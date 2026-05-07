const registerDeliverySockets = (io) => {
  io.on('connection', (socket) => {
    socket.on('biker:join', ({ deliveryId }) => {
      socket.join(`delivery:${deliveryId}`);
    });

    socket.on('customer:watch', ({ deliveryId }) => {
      socket.join(`delivery:${deliveryId}`);
    });

    socket.on('biker:location', ({ deliveryId, lat, lng }) => {
      socket.to(`delivery:${deliveryId}`).emit('biker:location', { lat, lng });
    });

    socket.on('delivery:status', ({ deliveryId, status }) => {
      io.to(`delivery:${deliveryId}`).emit('delivery:status', { status });
    });

    socket.on('disconnect', () => {});
  });
};

module.exports = registerDeliverySockets;
