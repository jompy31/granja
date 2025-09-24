import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchUsers } from "../../services/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) navigate("/", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const users = await fetchUsers();
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        navigate("/", { replace: true });
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      setError("Error al conectar con el servidor. Inténtalo de nuevo.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            fontSize: "24px",
            color: "#333",
          }}
        >
          Iniciar Sesión
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
              transition: "0.3s",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #667eea")}
            onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
              transition: "0.3s",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #667eea")}
            onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
          />
          <button
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: "#667eea",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#5a67d8")
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "#667eea")}
          >
            Iniciar Sesión
          </button>
          <p style={{ fontSize: "14px", marginTop: "10px" }}>
            No tienes cuenta?{" "}
            <Link
              to="/registro"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Regístrate aquí
            </Link>
          </p>
        </form>
        {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;