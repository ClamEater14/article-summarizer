import { Router, Request, Response } from "express";
import { query, validationResult } from "express-validator";
import { extract } from "@extractus/article-extractor";
import cohere from "cohere-ai";
import { ArticleSummary } from "../interfaces/ArticleSummary";
import HttpStatusCode from "../constants/HttpStatusCode";

const summariesRouter = Router();

// params
const URL_QUERY_PARAM = "url";

const INVALID_URL_MSG = "url must be a valid URL!";
const ARTICLE_NOT_FOUND_MSG = "Cannot find article with this URL!";
const ARTICLE_MISSING_CONTENT_MSG = "Article is missing content!";
const ARTICLE_CANNOT_BE_SUMMARIZED_MSG = "Article cannot be summarized!";

summariesRouter.get(
  "/",
  query(URL_QUERY_PARAM, INVALID_URL_MSG).exists().trim().isURL({
    protocols: ["http", "https"]
  }),
  (req: Request, res: Response<ArticleSummary | string>) => {
    try {
      validationResult(req).throw();
    } catch (_: any) {
      res.status(HttpStatusCode.BAD_REQUEST).send(INVALID_URL_MSG);
      return;
    }
    const url = req.query[URL_QUERY_PARAM] as string;
    
    extract(url).then(async (articleData) => {
      if (articleData == null) {
        res.status(HttpStatusCode.NOT_FOUND).send(ARTICLE_NOT_FOUND_MSG);
        return;
      }

      if (!articleData.content) {
        res.status(HttpStatusCode.NOT_FOUND).send(ARTICLE_MISSING_CONTENT_MSG);
        return;
      }

      const summaryResponse = await cohere.summarize({
        text: articleData.content,
        length: "auto",
        format: "auto",
        model: "summarize-xlarge",
        additional_command: "",
        temperature: 0.3,
      });

      if (!summaryResponse) {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .send(ARTICLE_CANNOT_BE_SUMMARIZED_MSG);
        return;
      }

      res.send({
        title: articleData.title ?? "",
        summary: summaryResponse.body.summary,
      });
    });
  }
);

export default summariesRouter;