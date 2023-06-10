import { FormEvent, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { Button, Container, Form } from "react-bootstrap";
import { ArticleSummary } from "./interfaces/ArticleSummary";
import { DEVELOPMENT_API_URL, API_PORT } from "./config";

async function fetchSummary(
  url: string
): Promise<[boolean, ArticleSummary | string]> {
  console.log(
    "Fetch " +
      `${DEVELOPMENT_API_URL}:${API_PORT}/api/summaries?url=${encodeURIComponent(
        url
      )}`
  );
  return await fetch(
    `${DEVELOPMENT_API_URL}:${API_PORT}/api/summaries?url=${encodeURIComponent(
      url
    )}`
  )
    .then(async (res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(await res.text());
      }
    })
    .then((jsonObj): [boolean, ArticleSummary] => {
      const summary: ArticleSummary = jsonObj as ArticleSummary;
      return [true, summary];
    })
    .catch((message): [boolean, string] => [false, message as string]);
}

function App() {
  const [processing, setProcessing] = useState(false);
  const [resultTitle, setResultTitle] = useState<string | undefined>(undefined);
  const [resultSummary, setResultSummary] = useState<string | undefined>(
    undefined
  );
  const [inputURL, setInputURL] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(`Submitted article URL: ${inputURL}`);
    console.log("Processing...");
    setProcessing(true);
    setResultTitle(undefined);
    setResultSummary(undefined);
    if (inputURL) {
      console.log("Fetching...");
      const [success, result] = await fetchSummary(inputURL);
      console.log(success ? "SUCCESS!" : "FAILURE!");
      setResultTitle(
        success
          ? (result as ArticleSummary).title
          : "Hmm... something went wrong. 🤔"
      );
      setResultSummary(
        success ? (result as ArticleSummary).summary : result.toString()
      );
    } else {
      console.log("Nothing happened");
    }
    setProcessing(false);
  }

  function onArticleURLChanged(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("URL input changed");
    setInputURL(e.currentTarget.value?.toString() ?? "");
  }

  return (
    <Container
      className="min-vh-100 d-flex flex-column justify-content-center"
      fluid="md"
    >
      <h1 className="text-center bold">Article Summarizer</h1>
      <h2 className="text-center">
        Understand any article in less than a minute!
      </h2>
      <p className="text-center">
        <b>Note: Not all websites will work as intended!</b>
      </p>
      <Form className="my-3 p-3 border rounded-4" onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="articleURL">
          <Form.Label>Article URL</Form.Label>
          <Form.Control
            onChange={onArticleURLChanged}
            type="url"
            required
            disabled={processing}
            placeholder="Insert article URL here..."
          />
        </Form.Group>
        <Button disabled={processing} variant="primary" type="submit">
          Summarize It!
        </Button>
      </Form>
      {processing ? (
        <p>
          Now fetching:{" "}
          <a target="_blank" rel="noreferrer noopener" href={inputURL}>
            {inputURL}
          </a>
        </p>
      ) : null}
      {resultTitle ? (
        <h1 className="text-center bold text-break my-3 pb-3 border-bottom">
          {resultTitle}
        </h1>
      ) : null}
      {resultSummary ? <p className="break-newline">{resultSummary}</p> : null}
    </Container>
  );
}

export default App;
