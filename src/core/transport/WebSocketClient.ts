export default class WebSocketClient {
  private _timeout = 250;
  ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);
  }

  connect() {
    let connectInterval: ReturnType<typeof setTimeout>;

    // websocket onopen event listener
    this.ws.onopen = () => {
      console.log("connected websocket main component");

      this._timeout = 250; // reset timer to 250 on open of websocket connection 
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    // websocket onclose event listener
    this.ws.onclose = (e) => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
            10000 / 1000,
            (this._timeout + this._timeout) / 1000
        )} second.`,
        e.reason
      );

      this._timeout = this._timeout + this._timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, this._timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    this.ws.onerror = (event: Event) => {
      console.error(
        "Socket encountered error: ",
        // err.message,
        "Closing socket"
      );

      this.ws.close();
    };
  }

  check() {
    if (!this.ws || this.ws.readyState == WebSocket.CLOSED) {
      this.connect();
    } //check if websocket instance is closed, if so call `connect` function.
  }
}