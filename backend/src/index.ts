import App from './app'
import IndexController from './controllers/index.controller';
import WaterScreenController from './controllers/waterscreen.controller';
import WaterScreenSocketController from './controllers/waterscreen.socket-controller';

const app = new App(
    [new IndexController(), new WaterScreenController()],
    [new WaterScreenSocketController()]
);

app.listen();