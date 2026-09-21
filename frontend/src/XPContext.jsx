import { createContext, useState, useEffect } from "react";
import axios from "axios"; // 1. CRITICAL: Don't forget the import!

export const XpContext = createContext();

export const XpProvider = ({ children }) => {
  const [xp, setXp] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem("totalXP");
    return saved ? parseInt(saved) : 0;
  });
  
  // 2. Sync State with User Login
  // If the user object in localStorage has an XP, use that (prevents reset to 0)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.xp !== undefined) {
      setXp(storedUser.xp);
    }
  }, []);

  // Save XP to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("totalXP", xp);
  }, [xp]);

  const addXp = async (amount) => {
    const newXp = xp + amount;
    setXp(newXp); 

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id || storedUser?._id;

    if (userId) {
      try {
        await axios.patch(`http://localhost:5000/api/users/${userId}`, {
          xp: newXp
        });
        
        // 3. Keep the user object in localStorage updated too
        const updatedUser = { ...storedUser, xp: newXp };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
      } catch (err) {
        console.error("Error syncing XP to database:", err);
      }
    }
  };

  return (
    <XpContext.Provider value={{ xp, addXp }}>
      {children}
    </XpContext.Provider>
  );
};