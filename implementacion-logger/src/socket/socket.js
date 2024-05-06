const Chat = require('../db/models/chat.model.js');

// SOCKET SERVER
const socketService = (socket, io) => {
    console.log(`Nuevo cliente conectado ${socket.id}`);

    socket.on('all-messages', async () => {
        const messages = await Chat.find();
        io.emit('message-all', messages);
    });

    socket.on('new-message', async (data) => {
        const newMessage = new Chat(data);
        await newMessage.save();
        const messages = await Chat.find();
        io.emit('message-all', messages);
    });
};

module.exports = socketService;
