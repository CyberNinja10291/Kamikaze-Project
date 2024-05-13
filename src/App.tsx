import "./App.css";

import { ContextProvider } from "./contexts/ContextProvider";
import("@solana/wallet-adapter-react-ui/styles.css");
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TokenCreator from "./pages/TokenCreator";
import Navbar from "./components/NavBar";
import TokenManager from "./pages/TokenManager";
import { ChakraProvider } from "@chakra-ui/react";
function App() {
  return (
    <>
      <Router>
        <ChakraProvider>
          <ContextProvider>
            <Navbar />
            <div>
              <Routes>
                <Route path="/" element={<TokenCreator />} />
                <Route path="/tokens/create" element={<TokenCreator />} />
                <Route path="/tokens/manage" element={<TokenManager />} />
              </Routes>
            </div>
          </ContextProvider>
        </ChakraProvider>
      </Router>
    </>
  );
}

export default App;
