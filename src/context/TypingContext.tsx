import React, { createContext, useContext, useState } from "react";

const TypingContext = createContext({
  streamed: {} as Record<string, boolean>,
  markStreamed: (id: string) => {},
});

export const TypingProvider = ({ children }) => {
  const [streamed, setStreamed] = useState<Record<string, boolean>>({});

  const markStreamed = (id: string) => {
    setStreamed((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <TypingContext.Provider value={{ streamed, markStreamed }}>
      {children}
    </TypingContext.Provider>
  );
};

export const useTyping = () => useContext(TypingContext);
