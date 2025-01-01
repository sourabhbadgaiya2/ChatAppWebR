import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;

      const sound = new Audio(notificationSound);
      sound.play();

      setMessages([...messages, newMessage]);
    });
    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);
};

export default useListenMessages;

// CHAT GPT ERROR
// useEffect(() => {
//   const handleNewMessage = (newMessage) => {
//     newMessage.shouldShake = true;

//     const sound = new Audio(notificationSound);
//     sound.play();

//     // Use functional update for the setMessage to make sure we're using the latest state
//     setMessage((prevMessages) => [...prevMessages, newMessage]);

//     // Log the updated message state for debugging
//     console.log("Updated messages:", [...message, newMessage]);
//   };

//   socket?.on("newMessage", handleNewMessage);

//   return () => {
//     socket?.off("newMessage", handleNewMessage);
//   };
// }, [socket, setMessage]);
