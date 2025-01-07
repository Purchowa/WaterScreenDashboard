import { PictureCollectionModel } from "../models/picture.model"; // Model odpowiedzialny za przechowywanie obrazków
import { PictureDataType } from "../models/config.model"; // Typ danych obrazu

export default class PicturesService {
    // Metoda do pobierania wszystkich obrazków
    public getAllPictures = async (): Promise<PictureDataType[] | null> => {
        try {
            const pictureCollection = await PictureCollectionModel.find();

            if (!pictureCollection || pictureCollection.length === 0) {
                return null; // Jeśli nie ma obrazów, zwróć null
            }

            return pictureCollection.map((collection) => collection.pictures).flat();
        } catch (error) {
            console.error("Error while getting pictures: ", error);
            throw new Error("Failed to fetch pictures");
        }
    }

    // Metoda do dodawania nowego obrazka
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

    // Metoda do usuwania obrazka
    public deletePicture = async (id: string): Promise<PictureDataType | null> => {
        try {
            // Szukamy kolekcji, która zawiera obrazek
            const pictureCollection = await PictureCollectionModel.findOne({
                "pictures._id": id // Szukamy obrazka po jego ID
            });

            if (!pictureCollection) {
                return null; // Jeśli kolekcja nie została znaleziona, zwróć null
            }

            // Usuwamy obrazek z tablicy "pictures"
            const pictureIndex = pictureCollection.pictures.findIndex(
                (picture) => picture._id.toString() === id
            );

            if (pictureIndex === -1) {
                return null; // Jeśli obrazek nie został znaleziony, zwróć null
            }

            // Usuwamy obrazek
            const deletedPicture = pictureCollection.pictures.splice(pictureIndex, 1);

            // Zapisujemy zmienioną kolekcję
            await pictureCollection.save();

            return deletedPicture[0]; // Zwracamy usunięty obrazek
        } catch (error) {
            console.error("Error while deleting picture: ", error);
            throw new Error("Failed to delete picture");
        }
    }
}
