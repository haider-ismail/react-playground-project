import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Styles
import "./styles/tailwind.output.css";

// Helpers
import ResultsProvider from "./views/Results/context/results.provider";

// Components
import Home from "./views/Home/Home";
import Header from "./components/Header";
const Results = React.lazy(() => import("./views/Results/Results"));

const App: React.FunctionComponent = () => (
  // <React.StrictMode>
  <ResultsProvider>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/results"
          element={
            <Suspense
              fallback={
                <div className="results-listing__container bg-gray-800 px-6 py-8 rounded-md">
                  <h2 className="text-white text-2xl mb-4">Fetching results</h2>
                </div>
              }
            >
              <Results />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </ResultsProvider>
  // </React.StrictMode>
);

export default App;
