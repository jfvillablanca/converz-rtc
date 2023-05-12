import dotenv from "dotenv";
dotenv.config();

export const ENVIRONMENT = process.env.NODE_ENV;

export const PORT = (process.env.PORT || 3000) as number;
