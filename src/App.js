import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Chart from "./components/WattUsage";
import ModifierProvider from "./components/ModifierProvider";
import DevicesProvider from "./components/DevicesProvider";

function App() {
  return (
    <ModifierProvider>
      <DevicesProvider>
        <div className="dark App w-lvw h-lvh bg-background">
          <Router>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/test" element={<Chart />}></Route>
            </Routes>
          </Router>
        </div>
      </DevicesProvider>
    </ModifierProvider>
  );
}

export default App;
