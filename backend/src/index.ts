import App from './app'
import IndexController from './controllers/index.controller';
import WaterScreenController from './controllers/waterscreen.controller';
import DashboardController from './controllers/dashboard.controller';
import WaterScreenSocketController from './controllers/waterscreen.socket-controller';
import PicturesController from "./controllers/pictures.controller";

const app = new App(
    [new IndexController(), new WaterScreenController(), new DashboardController(), new PicturesController()],
    [new WaterScreenSocketController()]
);

app.listen();
