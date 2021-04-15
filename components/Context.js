import { createContext, useContext } from "react";

// context wrapper with function to use context data
const DataContext = createContext();

export function ContextWrapper({ children, data }) {
  return (
    <DataContext.Provider value={{ set: data }}>
      {children}
    </DataContext.Provider>
  );
}

export function UseContextData() {
  return useContext(DataContext);
}
