import Config from 'core/Config';
import WebSocketClient from 'core/transport/WebSocketClient';

class OrderBookWebSocketClient extends WebSocketClient {
  constructor() {
    super(Config.webSocketUrl);
  }
}

export const orderBookWebSocketClient = new OrderBookWebSocketClient();