import React, { useState, useEffect } from "react";
import "../../Styles/Animals.css";
import FichaAnimal from "../../components/FichaAnimal";
import FormEditar from "../../components/FormEditar";
import { fetchAnimals, deleteAnimal } from "../../services/api";
import placeholderImg from "../../assets/logo_granja.png";

const Animals = () => {
  const [animals, setAnimals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterBreed, setFilterBreed] = useState("");
  const animalsPerPage = 4;

  // Fetch animals on component mount
  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const data = await fetchAnimals();
        setAnimals(data);
      } catch (error) {
        console.error("Failed to load animals");
      }
    };
    loadAnimals();
  }, []);

  // Filter animals
  const filteredAnimals = animals.filter((animal) => {
    return (
      (!filterType || animal.type === filterType) &&
      (!filterLocation || animal.characteristics?.location === filterLocation) &&
      (!filterBreed || animal.characteristics?.breed === filterBreed)
    );
  });

  // Handle edit button click
  const handleEdit = (animal) => {
    setSelectedAnimal(animal);
    setEditing(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      await deleteAnimal(id);
      setAnimals(animals.filter((animal) => animal.id !== id));
    } catch (error) {
      console.error("Failed to delete animal");
    }
  };

  // Pagination logic
  const indexOfLastAnimal = currentPage * animalsPerPage;
  const indexOfFirstAnimal = indexOfLastAnimal - animalsPerPage;
  const currentAnimals = filteredAnimals.slice(indexOfFirstAnimal, indexOfLastAnimal);
  const totalPages = Math.ceil(filteredAnimals.length / animalsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Get unique values for filters
  const uniqueTypes = [...new Set(animals.map(a => a.type))];
  const uniqueLocations = [...new Set(animals.map(a => a.characteristics?.location))];
  const uniqueBreeds = [...new Set(animals.map(a => a.characteristics?.breed))];

  return (
    <div className="animals-wrapper">
      <div className="animals-container">
        <h1 className="animals-title">Animales</h1>
        <p className="animals-subtitle">Datos de los animales agregados</p>
        <div className="filter-container">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Todos los tipos</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
            <option value="">Todas las ubicaciones</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          <select value={filterBreed} onChange={(e) => setFilterBreed(e.target.value)}>
            <option value="">Todas las razas</option>
            {uniqueBreeds.map((breed) => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>
        </div>
        {filteredAnimals.length > 0 ? (
          <div>
            <div className="animals-grid">
              {currentAnimals.map((animal) => (
                <FichaAnimal
                  key={animal.id}
                  data={{ ...animal, image: animal.image || placeholderImg }}
                  onEdit={() => handleEdit(animal)}
                  onDelete={() => handleDelete(animal.id)}
                />
              ))}
            </div>
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Siguiente
              </button>
            </div>
          </div>
        ) : (
          <p className="no-animals">No hay animales para mostrar</p>
        )}
        {editing && selectedAnimal && (
          <FormEditar
            animal={selectedAnimal}
            animals={animals}
            setAnimals={setAnimals}
            onClose={() => {
              setEditing(false);
              setSelectedAnimal(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Animals;