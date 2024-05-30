import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import ModifierProvider from "./components/ModifierProvider";

function App() {
  return (
    <ModifierProvider>
      <div className="dark App w-lvw h-lvh bg-background">
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </Router>
      </div>
    </ModifierProvider>
  );
}

export default App;
