import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Codificar email y password en Base64
    const credentials = btoa(`${usuario}:${password}`);
    const authHeader = `Basic ${credentials}`;
    localStorage.setItem("authHeader", authHeader); // Guardar en localStorage
    console.log(authHeader); // Debe mostrar algo como "Basic YWRtaW46cGFzc3dvcmQ="

    navigate("/", { replace: true }); // Redirigir sin estado
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="max-w-sm w-full bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Acceder</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario PJN"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-200 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-200 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
