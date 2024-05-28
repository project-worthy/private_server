import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
function App() {
  return (
    <div className="dark App w-lvw h-lvh bg-background">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
