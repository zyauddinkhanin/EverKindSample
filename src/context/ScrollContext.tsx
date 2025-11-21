import { createContext, useContext, useRef } from "react";
import { ScrollView } from "react-native";

const ScrollContext = createContext({
  scrollToEndRef: { current: null as ScrollView | null },
});

export const ScrollProvider = ({ children }) => {
  const scrollToEndRef = useRef<ScrollView>(null);

  return (
    <ScrollContext.Provider value={{ scrollToEndRef }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
