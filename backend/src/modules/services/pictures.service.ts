import { PictureCollectionModel } from "../schemas/pictureCollection.schema"; // Model odpowiedzialny za przechowywanie obrazków
import { PictureDataType } from "../models/picture.model"; // Typ danych obrazu

export default class PicturesService {
    public getAllPictures = async (): Promise<PictureDataType[] | null> => {
        try {
            const pictureCollection = await PictureCollectionModel.find();

            if (!pictureCollection || pictureCollection.length === 0) {
                return null;
            }

            return pictureCollection.map((collection) => collection.pictures).flat();
        } catch (error) {
            console.error("Error while getting pictures: ", error);
            throw new Error("Failed to fetch pictures");
        }
    }

    public addPicture = async (pictureData: PictureDataType): Promise<PictureDataType> => {
        try {
            const newPicture = await PictureCollectionModel.create({
                pictures: [pictureData]
            });

            return newPicture.pictures[0];
        } catch (error) {
            console.error("Error while adding picture: ", error);
            throw new Error("Failed to add picture");
        }
    }

    public deletePicture = async (id: string): Promise<PictureDataType | null> => {
        try {
            const pictureCollection = await PictureCollectionModel.findOne({
                "pictures._id": id
            });

            if (!pictureCollection) {
                return null;
            }

            const pictureIndex = pictureCollection.pictures.findIndex(
                (picture) => picture._id.toString() === id
            );

            if (pictureIndex === -1) {
                return null;
            }

            const deletedPicture = pictureCollection.pictures.splice(pictureIndex, 1);

            await pictureCollection.save();

            return deletedPicture[0];
        } catch (error) {
            console.error("Error while deleting picture: ", error);
            throw new Error("Failed to delete picture");
        }
    }
}
