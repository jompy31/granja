import React, { useState, useEffect } from "react";
import FormularioAgregarAnimal from "../../components/FormularioAgregarAnimal/index";
import FormEditar from "../../components/FormEditar/index";
import FormularioAgregarUsuario from "../../components/FormularioAgregarUsuario/index";
import FormEditarUsuario from "../../components/FormularioEditarUsuario/index";
import Saludo from "../../components/Saludo";
import { fetchAnimals, fetchUsers, deleteUser } from "../../services/api";
import "../../Styles/Home.css";

const Home = () => {
  const [animals, setAnimals] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingAnimal, setEditingAnimal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [editingUser, setEditingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddAnimalModalOpen, setIsAddAnimalModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Fetch animals and users on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [animalsData, usersData] = await Promise.all([
          fetchAnimals(),
          fetchUsers(),
        ]);
        setAnimals(animalsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to load data");
      }
    };
    loadData();
  }, []);

  // Calculate summary for animal dashboard
  const animalSummary = animals.reduce((acc, animal) => {
    acc[animal.type] = (acc[animal.type] || 0) + 1;
    return acc;
  }, {});

  // Handle user deletion
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error.message);
    }
  };

  return (
    <div className="home-container">
      <Saludo />
      <h1 style={{ display: "flex", justifyContent: "center" }}>
        Panel de Administración
      </h1>

      {/* Animal Management */}
      <button
        className="add-animal-btn"
        onClick={() => setIsAddAnimalModalOpen(true)}
      >
        Agregar Animal
      </button>
      <FormularioAgregarAnimal
        setAnimals={setAnimals}
        isOpen={isAddAnimalModalOpen}
        onClose={() => setIsAddAnimalModalOpen(false)}
      />
      <div className="dashboard-table">
        <h2>Resumen de Animales</h2>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(animalSummary).map(([type, count]) => (
              <tr key={type}>
                <td>{type}</td>
                <td>{count}</td>
              </tr>
            ))}
            {Object.keys(animalSummary).length === 0 && (
              <tr>
                <td colSpan="2">No hay animales registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {editingAnimal && selectedAnimal && (
        <FormEditar
          animal={selectedAnimal}
          animals={animals}
          setAnimals={setAnimals}
          onClose={() => setEditingAnimal(false)}
        />
      )}

      {/* User Management */}
      <button
        className="add-user-btn"
        onClick={() => setIsAddUserModalOpen(true)}
        style={{ marginTop: "20px" }}
      >
        Agregar Usuario
      </button>
      <FormularioAgregarUsuario
        setUsers={setUsers}
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
      <div className="dashboard-table">
        <h2>Resumen de Usuarios</h2>
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setEditingUser(true);
                    }}
                    style={{
                      marginRight: "10px",
                      padding: "5px 10px",
                      backgroundColor: "#667eea",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ff4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="2">No hay usuarios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {editingUser && selectedUser && (
        <FormEditarUsuario
          user={selectedUser}
          setUsers={setUsers}
          onClose={() => setEditingUser(false)}
        />
      )}
    </div>
  );
};

export default Home;