import dotenv from "dotenv";
dotenv.config();

export const ENVIRONMENT = process.env.NODE_ENV;
const isProduction = ENVIRONMENT === "production";

export const PORT = (process.env.PORT || 3000) as number;

export const URL = isProduction ? undefined : "http://localhost:5173";
