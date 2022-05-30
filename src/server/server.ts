import express from 'express';
import path from 'path';
import http from 'http';

const port: number = 3000;

class App {
  private server: http.Server;
  private port: number;

  constructor(port: number) {
    this.port = port;
    const app = express();
    app.use(express.static(path.join(__dirname, '../../client/public/')));
    // visit http://127.0.0.1:3000

    this.server = new http.Server(app);
  }

  public Start() {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port http://127.0.0.1:${this.port} !!!`);
    });
  }
}

new App(port).Start();
