import App from './app'
import IndexController from './controllers/index.controller';

const app = new App([
    new IndexController()
]);

app.listen();