import { useContext } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "components/Navbar";
import { ThemeContext } from "components/ThemeProvdier";
import cs from "utils/className";

import Scheduler from "./pages/scheduler";

function App() {
  const theme = useContext(ThemeContext);
  return (
    <>
      <div className={cs.join("flex flex-col w-full h-full", theme)}>
        <Router>
          <Navbar />
          <section className="flex-1">
            <Routes>
              <Route path="/deviceMap" element={<Scheduler />}></Route>
              <Route path="/" element={<Scheduler />}></Route>
              <Route path="/settings" element={<Scheduler />}></Route>
            </Routes>
          </section>
        </Router>
      </div>
    </>
  );
}

export default App;
