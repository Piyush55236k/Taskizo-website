import { Chat, Project } from "./Schema.js";
import { v4 as uuid } from "uuid";

const SocketHandler = (socket) => {
  // 👨‍💻 Freelancer joining the chat room
  socket.on("join-chat-room", async ({ projectId, freelancerId }) => {
    try {
      const project = await Project.findById(projectId);
      if (project?.freelancerId?.toString() === freelancerId) {
        socket.join(projectId);
        
        socket.broadcast.to(projectId).emit("user-joined-room");

        let chats = await Chat.findById(projectId);
        if (!chats) {
          chats = new Chat({
            _id: projectId,
            messages: [],
          });
          await chats.save();
        }

        socket.emit("messages-updated", { chats });
      }
    } catch (err) {
      console.error("❌ Error in join-chat-room:", err.message);
    }
  });

  // 👨‍💼 Client joining the chat room
  socket.on("join-chat-room-client", async ({ projectId }) => {
    try {
      const project = await Project.findById(projectId);
      if (["Assigned", "Completed"].includes(project?.status)) {
        socket.join(projectId);
        
        socket.broadcast.to(projectId).emit("user-joined-room");

        let chats = await Chat.findById(projectId);
        if (!chats) {
          chats = new Chat({
            _id: projectId,
            messages: [],
          });
          await chats.save();
        }

        socket.emit("messages-updated", { chats });
      }
    } catch (err) {
      console.error("❌ Error in join-chat-room-client:", err.message);
    }
  });

  // 🔁 Update messages in real-time
  socket.on("update-messages", async ({ projectId }) => {
    try {
      const chat = await Chat.findById(projectId);
      
      socket.emit("messages-updated", { chat });
    } catch (error) {
      console.error("❌ Error updating messages:", error.message);
    }
  });

  // 📨 Handle new message
  socket.on("new-message", async ({ projectId, senderId, message, time }) => {
    try {
      await Chat.findByIdAndUpdate(
        projectId,
        {
          $push: {
            messages: {
              id: uuid(),
              text: message,
              senderId,
              time,
            },
          },
        },
        { new: true }
      );

      const chat = await Chat.findById(projectId);
      

      socket.emit("messages-updated", { chat });
      socket.broadcast.to(projectId).emit("message-from-user");
    } catch (error) {
      console.error("❌ Error adding new message:", error.message);
    }
  });
};

export default SocketHandler;
