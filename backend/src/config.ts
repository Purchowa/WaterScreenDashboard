import { config as dotenvLoadConfig } from 'dotenv';
dotenvLoadConfig();

export const config = {
    PORT: process.env.PORT || 3100,
    MONGO_DB_URI: process.env.MONGO_DB_URI || "",
    WATERSCREEN_USER: process.env.WATERSCREEN_USER || "",
    WATERSCREEN_PASS: process.env.WATERSCREEN_PASS || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    GMAIL_SECRET: {
        login: process.env.GMAIL_LOGIN || "",
        passw: process.env.GMAIL_PASSW || ""
    },
};