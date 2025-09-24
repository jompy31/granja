import React, { useState } from "react";
import { updateUser } from "../../services/api";

const FormEditarUsuario = ({ user, setUsers, onClose }) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState(user.password);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...user,
        username,
        password,
      };
      const response = await updateUser(user.id, updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? response : u))
      );
      setError("");
      onClose();
    } catch (error) {
      setError("Error al actualizar el usuario. Inténtalo de nuevo.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2>Editar Usuario</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              style={{
                padding: "10px",
                backgroundColor: "#667eea",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px",
                backgroundColor: "#ccc",
                color: "#333",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default FormEditarUsuario;