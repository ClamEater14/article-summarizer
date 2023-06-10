import express, { Express, NextFunction, Request, Response } from "express";
import cohere from "cohere-ai";
import dotenv from "dotenv";
import cors from "cors";
import summariesRouter from "./routes/summaries";

dotenv.config();

if (process.env.COHERE_API_KEY) {
    cohere.init(process.env.COHERE_API_KEY);
    console.log("🧠[cohere]: Cohere is ready!");
} else {
    console.error(
      "ERROR: Please provide a Cohere API key from the COHERE_API_KEY environment variable!"
    );
    process.exit(1);
}

const app: Express = express();
const port = process.env.PORT ?? 8080;

app.use(cors());
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", (_: Request, res: Response) => {
  res.send("Article Summarizer API is running!");
});

app.use("/api/summaries", summariesRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
