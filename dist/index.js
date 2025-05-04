"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = require("./lang-graph/app");
const messages_1 = require("@langchain/core/messages");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
    res.send("Hello World!");
});
app.post("/chat", async (req, res) => {
    const { query } = req.body;
    console.log("Received message:", query);
    const config = { configurable: { thread_id: "2" } };
    const message = new messages_1.HumanMessage(query);
    const response = await app_1.langGraph.invoke({ messages: [message] }, config);
    console.log("Response:", response);
    res.send({
        response: response.messages[response.messages.length - 1].content,
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
