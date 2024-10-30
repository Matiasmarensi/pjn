// App.jsx
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
