import React from "react";
import Navigator from "./app/navigation/Navigation";
import { ThemeProvider } from './app/context/ThemeContext';



export default function App() {
  return (
  <ThemeProvider>
  <Navigator />
  </ThemeProvider>
  );
}
