import React, { useRef } from "react";
import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/scss/bootstrap.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createContext } from "react";

export const SocketContext = createContext();

const DashBoardPage = lazy(() =>
  import("./Modules/ChatDashboard/DashBoard.js").then((module) => {
    if ("caches" in window) {
      caches.open("react-lazy-cache").then((cache) => {
        cache.add(module);
      });
    }
    return module;
  })
);

const ChatMessage = lazy(() =>
  import("./Modules/ChatMessage/Message.js").then((module) => {
    if ("caches" in window) {
      caches.open("react-lazy-cache").then((cache) => {
        cache.add(module);
      });
    }
    return module;
  })
);

const SuspenseCall = (props) => (
  <Suspense fallback={"loading"}>{props.children}</Suspense>
);

const ChatNavigation = () => {
  const socketRef = useRef();
  return (
    <SocketContext.Provider value={{ socketRef }}>
      <Router>
        <Routes>
          <Route
            path="/:userName"
            element={
              <SuspenseCall>
                <DashBoardPage />
              </SuspenseCall>
            }
          />
          <Route
            path="/chat"
            element={
              <SuspenseCall>
                <ChatMessage />
              </SuspenseCall>
            }
          />
        </Routes>
      </Router>
    </SocketContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ChatNavigation />);
