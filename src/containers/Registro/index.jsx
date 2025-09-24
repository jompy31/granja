import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUser, fetchUsers } from "../../services/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const users = await fetchUsers();
      if (users.find((u) => u.username === username)) {
        setError("Usuario ya existe");
        return;
      }
      const newUser = {
        id: Date.now(),
        username,
        password,
      };
      await createUser(newUser);
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError("Error al registrar el usuario. Inténtalo de nuevo.");
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
          Registrarse
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
            onMouseOver={(e) => (e.target.style.backgroundColor = "#5a67d8")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#667eea")}
          >
            Registrarse
          </button>
          <p
            style={{ fontSize: "14px", marginTop: "10px" }}
          >
            O{" "}
            <Link
              to="/login"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Inicia sesión
            </Link>
          </p>
        </form>
        {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
        {success && (
          <p style={{ color: "green", marginTop: "15px" }}>{success}</p>
        )}
      </div>
    </div>
  );
};

export default Register;