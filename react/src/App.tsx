import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "components/Navbar";
import Test from "pages/Test";
import cs from "utils/className";

import Scheduler from "./pages/scheduler";

function App() {
  return (
    <>
      <div className={cs.join("flex flex-col w-full h-full bg-background")}>
        <Router>
          <Navbar />
          <section className="flex-1">
            <Routes>
              <Route path="/deviceMap" element={<Scheduler />}></Route>
              <Route path="/" element={<Scheduler />}></Route>
              <Route path="/settings" element={<Scheduler />}></Route>
              <Route path="/test" element={<Test />}></Route>
            </Routes>
          </section>
        </Router>
      </div>
    </>
  );
}

export default App;
