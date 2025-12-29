import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

let wss: WebSocketServer | null = null;

export function initializeWebSocket(server: Server): void {
  wss = new WebSocketServer({ server, path: '/api/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('[WebSocket] Client connected');

    ws.on('close', () => {
      console.log('[WebSocket] Client disconnected');
    });

    ws.on('error', (error) => {
      console.error('[WebSocket] Error:', error);
    });

    // Send a welcome message
    ws.send(JSON.stringify({ type: 'connected', message: 'Connected to VenueBit WebSocket' }));
  });

  console.log('[WebSocket] Server initialized on /api/ws');
}

export function broadcastDatafileUpdate(): void {
  if (!wss) {
    console.warn('[WebSocket] Cannot broadcast: WebSocket server not initialized');
    return;
  }

  const message = JSON.stringify({
    type: 'datafile_updated',
    timestamp: new Date().toISOString()
  });

  let clientCount = 0;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      clientCount++;
    }
  });

  console.log(`[WebSocket] Broadcasted datafile update to ${clientCount} clients`);
}
