const express = require("express");
import{ langGraph } from "./lang-graph/app";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/chat", (req, res) => {
  const { query } = req.body;

  console.log("Received message:", query);

  const response = langGraph.invoke(`Tell me something about ${query}`);

  res.send({
    response : response,
  });
});


app.post("/chat/:threadId", (req, res) => {
  const { threadId } = req.params;
  const { query } = req.body;

  console.log(`Received message for thread ${threadId}:`, query);

  res.send({
    reply: `You said in thread ${threadId}: ${query}`,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
