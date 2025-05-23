import express, { Request, response, Response } from "express";
import { langGraph } from "./lang-graph/app.js";
import { BaseMessage, HumanMessage, RemoveMessage, filterMessages} from "@langchain/core/messages";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { pool } from "./pg-sql/pg-connection.js";
import {v4 as uuidv4} from "uuid";

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});


app.post("/chat", async (req: Request, res: Response) => {
  const { query, threadId } = req.body;

  console.log("Received message:", query);
  console.log("Received threadId:", threadId);
  const config = { configurable: { thread_id: threadId } };
  const message = new HumanMessage({
    id: uuidv4(),
    content: query,
  });
 
  const response = await langGraph.invoke({ messages: [message] }, config);
  console.log("Response:", response.messages[response.messages.length - 1].content);
  res.send({
    response: response.messages[response.messages.length - 1].content,
  });
});

app.post("/chat/:threadId", async(req: Request, res: Response) => {
  const { threadId } = req.params;
  const checkpointer = new PostgresSaver(pool);
  const config = { configurable: { thread_id: threadId } };
  // const messages = checkpointer.list(config)
  console.log(`Received thread ${threadId}`);
  // const messages =  await checkpointer.get(config);
  let messages =  (await langGraph.getState(config)).values.messages;

  const filteredMesagesResponse = filterMessages(messages, {
    includeTypes : ["human", "ai"],
  })

  const filteredMesagesWithAiResponseResponse = filteredMesagesResponse.filter((message: BaseMessage) => !!message.content );

  console.log("Messages:", messages);

  console.log("Filtered Messages:", filteredMesagesResponse);
  
  // for await (const message of messages) {
  //   console.log(message);
  // }


  res.send({
    response: filteredMesagesWithAiResponseResponse,
  })
});

app.put("/chat/:threadId", async(req: Request, res: Response) => {
  const { threadId } = req.params;
  console.log(`Received thread ${threadId}`);
  const {messageId, updateQuery} = req.body;
  console.log(`Received messageId: ${messageId}\n Received updateQuery: ${updateQuery}`);
  const config = { configurable: { thread_id: threadId } };
  

  let messages =  (await langGraph.getState(config)).values.messages;
  console.log("Messages before update:", messages);
  const targetMessageIndex = messages.findIndex((msg: BaseMessage) => msg.id === messageId);
  if (targetMessageIndex === -1) {
     res.status(404).json({ error: "Message not found" });
  }
   
  const targetMessage = messages[targetMessageIndex];
  const messagesToDelete = messages.slice(targetMessageIndex + 1);
    
    console.log(`Found target message at index ${targetMessageIndex}`);
    console.log(`Will delete ${messagesToDelete.length} messages after it`);

    // Delete all messages that come after the target message
    for (const msgToDelete of messagesToDelete) {
      await langGraph.updateState(config, { 
        messages: new RemoveMessage({ id: msgToDelete.id }) 
      });
    }

    // Now delete the target message itself (we'll replace it with updated version)

    const humanMessage : BaseMessage = new HumanMessage({
      id: messageId,
      content: updateQuery,
    })

    await langGraph.updateState(config, { 
      messages: [humanMessage] 
    });

    const response =  await langGraph.invoke({}, config);

     // Create the updated message
   


  // const updatedMessage = messages?.find((message: BaseMessage) => message.id === messageId);
  // updatedMessage.content = "Updated message"
  // await langGraph.updateState(config, { messages: updatedMessage });
  // messages =  (await langGraph.getState(config)).values.messages;
  // console.log("Updated Messages:", messages);

  
  
  res.send({
    response: response,
  })
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
