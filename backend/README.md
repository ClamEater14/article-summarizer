# Article Summarizer (Backend)

This is the backend, written using TypeScript, Node.js, express, and Cohere's "Summarize" feature.

## API

**Endpoint:** `/api/summaries`

Returns the article title and its summary. Summary may not reflect the actual article due to obstacles such as paywalls and ads. Invalid URLs will return a `400` error, while any problems with summarizing the article will return a `404` error.

| Parameter | Description
|-----------|------------
|`url`|The URL of the article. URL must be valid and lead to an article. 

## Running the Backend
1. In the `backend` directory of the main repo, create a `.env` file with the following contents (`PORT` is optional and is defaulted to `8080`):
```env
COHERE_API_KEY=YOUR_COHERE_API_KEY_HERE
PORT=8080
```
2. In a console window, change the current directory to this directory. For example, assuming you are in the `article-summarizer` repo/directory:
```
cd ./backend
```
3. Run the following to install all dependencies:
```
npm install
```
4. Run the following to start the backend:
```
npm run start
```
5. Wait until you see the output showing something like the following before accessing the endpoints on your browser:
```
🧠[cohere]: Cohere is ready!
⚡️[server]: Server is running at http://localhost:8080
```
6. Press `Ctrl + C` or `Cmd + C` to stop the backend.