import { useEffect } from "react";
import { socket } from "./socket";

export default function SocketProvider({ children }) {

  useEffect(() => {

    console.log("Connecting socket globally...");
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };

  }, []);

  return children;
}