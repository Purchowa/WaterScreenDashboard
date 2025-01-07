import Controller from "../interfaces/controller.interface";
import express, { Request, Response } from "express";
import JwtTokenService from "../modules/services/jwtToken.service";
import { authJwt } from "../middlewares/auth.middleware";
import { Error } from "mongoose";
import PicturesService from "../modules/services/pictures.service";

export default class PicturesController implements Controller {
    public path = '/dashboard';
    public router = express();

    private pictureService = new PicturesService();
    private jwtService = new JwtTokenService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.get(`${this.path}/pictures`, authJwt, this.getAllPictures);
        this.router.post(`${this.path}/pictures`, authJwt, this.addPicture);
        this.router.delete(`${this.path}/pictures/:id`, authJwt, this.deletePicture); // Dodanie trasy do usuwania obrazka
    }

    private addPicture = async (request: Request, response: Response) => {
        const pictureData = request.body;

        try {
            if (!pictureData || !pictureData.size || !pictureData.data || !pictureData.colors) {
                return response.status(400).json({ error: "Invalid picture data" });
            }

            const newPicture = await this.pictureService.addPicture(pictureData);
            return response.status(201).json(newPicture);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Internal error" });
        }
    }

    private getAllPictures = (request: Request, response: Response) => {
        this.pictureService.getAllPictures()
            .then((pictures) => {
                if (pictures) {
                    response.status(200).json(pictures);
                } else {
                    response.status(404).json({ error: "Pictures not found" });
                }
            })
            .catch((error) => {
                console.error(error);
                response.status(500).json({ error: "Internal error" });
            });
    }

    private deletePicture = async (request: Request, response: Response) => {
        const { id } = request.params;

        try {
            const deletedPicture = await this.pictureService.deletePicture(id);

            if (deletedPicture) {
                response.status(200).json({ message: "Picture deleted successfully" });
            } else {
                response.status(404).json({ error: "Picture not found" });
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({ error: "Internal error" });
        }
    }
}
