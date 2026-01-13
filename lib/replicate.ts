import Replicate from "replicate";

if (!process.env.REPLICATE_API_TOKEN) {
    console.warn("REPLICATE_API_TOKEN is not defined in environment variables");
}

export const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || "",
});
