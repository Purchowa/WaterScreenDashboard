import express from 'express'
import { config } from './config'

export default class App {
    constructor(public app = express()) { }

    public listen() {
        this.app.listen(config.port, () => console.log(`App listening on the port ${config.port}`));
    }
}