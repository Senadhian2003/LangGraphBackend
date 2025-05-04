import express, { Request, Response } from "express";
import { langGraph } from "./lang-graph/app";
import { HumanMessage } from "@langchain/core/messages";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/chat", async (req: Request, res: Response) => {
  const { query } = req.body;

  console.log("Received message:", query);
  const config = { configurable: { thread_id: "2"}}
  const message = new HumanMessage(query);
  const response = await langGraph.invoke({ messages: [message] }, config);
  console.log("Response:", response);
  res.send({
    response: response.messages[response.messages.length - 1].content,
  });
});

app.post("/chat/:threadId", (req: Request, res: Response) => {
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
