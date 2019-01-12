let connection;
const listeners = [];

function createSocket() {
  if (connection) return;

  if (typeof WebSocket === "function") {
    connection = new WebSocket("ws://localhost:40511");

    connection.onclose = () => {
      connection = null;
      setTimeout(createSocket, 2000);
    };

    connection.onmessage = event => {
      listeners.forEach(listener => listener(JSON.parse(event.data)));
    };
  }
}

function subscribe(cb) {
  if (!connection) {
    createSocket();
  }

  listeners.push(cb);
}

function unsubscribe(cb) {
  const index = listeners.findIndex(item => item === cb);

  listeners.splice(index, 1);
}

export { subscribe, unsubscribe };
