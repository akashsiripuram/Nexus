import 'dotenv/config';
import { WebSocketServer } from 'ws';

dotenv.config();
const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT, host: '0.0.0.0' });


// Store active connections and rooms
const rooms = new Map();
const clients = new Map();

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      handleMessage(ws, message);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    handleDisconnect(ws);
  });
});

function handleMessage(ws, message) {
  switch (message.type) {
    case 'join':
      handleJoin(ws, message.payload);
      break;
    case 'chat':
      handleChat(ws, message.payload);
      break;
    case 'leave':
      handleLeave(ws, message.payload);
      break;
    case 'typing':
      handleTyping(ws, message.payload);
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
}

function handleJoin(ws, payload) {
  const { roomId, senderId, receiverId, senderName, receiverName } = payload;

  clients.set(ws, { 
    roomId, senderId, receiverId, senderName, receiverName
  });

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(ws);

  // Check if receiver is already connected
  const receiverClient = Array.from(clients.entries())
    .find(([_, c]) => c.senderId === receiverId);

  if (receiverClient) {
    // auto-join receiver if not already in room
    rooms.get(roomId).add(receiverClient[0]);
    clients.get(receiverClient[0]).roomId = roomId;
    
    broadcastToRoom(roomId, {
      type: "userJoined",
      name: senderName,
      users: Array.from(rooms.get(roomId))
        .map(c => clients.get(c)?.senderName)
        .filter(Boolean)
    });
  }

  console.log(`${senderName} joined room ${roomId}`);
}


function handleChat(ws, payload) {
  const { message, roomId, senderId, receiverId, senderName, receiverName } = payload;
  const client = clients.get(ws);
  
  if (!client || client.roomId !== roomId) {
    return;
  }
  
  const chatMessage = {
    type: 'chat',
    message: message,
    senderId: senderId,
    receiverId: receiverId,
    senderName: senderName,
    receiverName: receiverName,
    timestamp: new Date().toISOString()
  };
  
  broadcastToRoom(roomId, chatMessage);
  console.log(`Chat message from ${senderName} (${senderId}) to ${receiverName} (${receiverId}) in room ${roomId}: ${message}`);
}

function handleLeave(ws, payload) {
  const { roomId, senderId, receiverId, senderName, receiverName } = payload;
  handleDisconnect(ws, roomId, senderName);
}

function handleTyping(ws, payload) {
  const { roomId, isTyping } = payload;
  const client = clients.get(ws);
  
  if (!client || client.roomId !== roomId) {
    return;
  }
  
  broadcastToRoom(roomId, {
    type: 'typing',
    isTyping: isTyping,
    name: client.senderName
  }, ws);
}

function handleDisconnect(ws, roomId = null, name = null) {
  const client = clients.get(ws);
  
  if (client) {
    const clientRoomId = roomId || client.roomId;
    const clientName = name || client.senderName;
    
    // Remove from room
    if (rooms.has(clientRoomId)) {
      rooms.get(clientRoomId).delete(ws);
      
      // If room is empty, remove it
      if (rooms.get(clientRoomId).size === 0) {
        rooms.delete(clientRoomId);
        console.log(`Room ${clientRoomId} is empty, removing it`);
      } else {
        // Notify others in the room
        const roomClients = rooms.get(clientRoomId);
        const users = Array.from(roomClients).map(client => clients.get(client)?.senderName).filter(Boolean);
        
        broadcastToRoom(clientRoomId, {
          type: 'userLeft',
          name: clientName,
          users: users
        });
      }
    }
    
    // Remove client
    clients.delete(ws);
    
    console.log(`${clientName} left room ${clientRoomId}`);
  }
}

function broadcastToRoom(roomId, message, excludeWs = null) {
  if (!rooms.has(roomId)) {
    return;
  }
  
  const roomClients = rooms.get(roomId);
  roomClients.forEach(client => {
    if (client !== excludeWs && client.readyState === 1) { // 1 = WebSocket.OPEN
      try {
        client.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message to client:', error);
        // Remove the problematic client
        handleDisconnect(client);
      }
    }
  });
}

// Log server status
console.log('WebSocket server running on port 8080');
console.log('Ready to handle real-time chat connections...');
