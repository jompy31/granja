import React, { useState, useEffect, useMemo } from "react";
import "../../Styles/FormEditar.css";
import { updateAnimal } from "../../services/api";
import vacaImg from "../../assets/vaca.jpg";
import cerdoImg from "../../assets/cerdo.jpg";
import gallinaImg from "../../assets/gallina.jpg";
import ovejaImg from "../../assets/oveja.jpg";
import conejImg from "../../assets/conejo.jpg"

function FormEditar({ animal, animals, setAnimals, onClose }) {
  const imagenesMap = useMemo(() => ({
    Vaca: vacaImg,
    Cerdo: cerdoImg,
    Gallina: gallinaImg,
    Oveja: ovejaImg,
    Conejo: conejImg,
  }), []);

  const [type, setType] = useState(animal.type || "");
  const [breed, setBreed] = useState(animal.characteristics?.breed || "");
  const [color, setColor] = useState(animal.characteristics?.color || "");
  const [location, setLocation] = useState(animal.characteristics?.location || "");
  const [weight, setWeight] = useState(animal.weight || "");
  const [image, setImage] = useState(animal.image || "");
  const [birthDate, setBirthDate] = useState(animal.birthDate || "");
  const [numberOfBirths, setNumberOfBirths] = useState(animal.numberOfBirths || "");
  const [offspringCount, setOffspringCount] = useState(animal.offspringCount || "");
  const [breeding, setBreeding] = useState(animal.breeding?.mated || false);
  const [mateDate, setMateDate] = useState(animal.breeding?.mateDate || "");
  const [treatments, setTreatments] = useState(animal.treatments || []);
  const [currentTratamiento, setCurrentTratamiento] = useState({
    name: "",
    description: "",
    vaccines: [],
    diseases: [],
  });
  const [vacunaNombre, setVacunaNombre] = useState(""); // Solo para nuevo tratamiento
  const [vacunaFecha, setVacunaFecha] = useState("");
  const [vacunaVeterinario, setVacunaVeterinario] = useState("");
  const [enfermedadNombre, setEnfermedadNombre] = useState(""); // Solo para nuevo tratamiento
  const [enfermedadFecha, setEnfermedadFecha] = useState("");
  const [enfermedadDesc, setEnfermedadDesc] = useState("");
  const [addVaccineStates, setAddVaccineStates] = useState([]); // Per-tratamiento para agregar a existentes
  const [addDiseaseStates, setAddDiseaseStates] = useState([]);
  const [nacimientos, setNacimientos] = useState(animal.birth || []);
  const [errors, setErrors] = useState({});

  // Update image when type changes
 useEffect(() => {
    setImage(imagenesMap[type] || "");
  }, [type, imagenesMap]);

  // Inicializar estados para agregar a tratamientos existentes
  useEffect(() => {
    setAddVaccineStates(prev => Array(treatments.length).fill(null).map((_, i) => prev[i] || { name: "", date: "", veterinarian: "" }));
    setAddDiseaseStates(prev => Array(treatments.length).fill(null).map((_, i) => prev[i] || { name: "", date: "", description: "" }));
  }, [treatments]);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!type) newErrors.type = "El tipo es requerido";
    if (!breed) newErrors.breed = "La raza es requerida";
    if (!color) newErrors.color = "El color es requerido";
    if (!location) newErrors.location = "La ubicación es requerida";
    if (!weight || weight <= 0) newErrors.weight = "El peso debe ser mayor a 0";
    if (!birthDate) newErrors.birthDate = "La fecha de nacimiento es requerida";
    if (breeding && !mateDate) newErrors.mateDate = "La fecha de apareamiento es requerida";
    if (numberOfBirths < 0) newErrors.numberOfBirths = "El número de partos no puede ser negativo";
    if (offspringCount < 0) newErrors.offspringCount = "El número de crías no puede ser negativo";
    return newErrors;
  };

  // Add vaccine to new treatment with ID
  const addVaccine = () => {
    if (vacunaNombre && vacunaFecha && vacunaVeterinario) {
      setCurrentTratamiento((prev) => ({
        ...prev,
        vaccines: [
          ...prev.vaccines,
          { id: String(Date.now()), name: vacunaNombre, date: vacunaFecha, veterinarian: vacunaVeterinario },
        ],
      }));
      setVacunaNombre("");
      setVacunaFecha("");
      setVacunaVeterinario("");
    } else {
      setErrors((prev) => ({
        ...prev,
        vacuna: "Nombre, fecha y veterinario de vacuna son requeridos",
      }));
    }
  };

  // Add disease to new treatment with ID
  const addDisease = () => {
    if (enfermedadNombre && enfermedadFecha && enfermedadDesc) {
      setCurrentTratamiento((prev) => ({
        ...prev,
        diseases: [
          ...prev.diseases,
          { id: String(Date.now()), name: enfermedadNombre, date: enfermedadFecha, description: enfermedadDesc },
        ],
      }));
      setEnfermedadNombre("");
      setEnfermedadFecha("");
      setEnfermedadDesc("");
    } else {
      setErrors((prev) => ({
        ...prev,
        enfermedad: "Nombre, fecha y descripción de enfermedad son requeridos",
      }));
    }
  };

  // Save new treatment with ID
  const addTreatment = () => {
    if (currentTratamiento.name && currentTratamiento.description) {
      setTreatments((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          name: currentTratamiento.name,
          description: currentTratamiento.description,
          vaccines: [...currentTratamiento.vaccines],
          diseases: [...currentTratamiento.diseases],
        },
      ]);
      setCurrentTratamiento({ name: "", description: "", vaccines: [], diseases: [] });
      setErrors((prev) => ({ ...prev, tratamiento: undefined }));
    } else {
      setErrors((prev) => ({
        ...prev,
        tratamiento: "Nombre y descripción de tratamiento son requeridos",
      }));
    }
  };

  // Update existing treatment
  const updateTreatment = (index, field, value) => {
    const newTreatments = [...treatments];
    newTreatments[index][field] = value;
    setTreatments(newTreatments);
  };

  // Remove treatment
  const removeTreatment = (index) => {
    setTreatments((prev) => prev.filter((_, i) => i !== index));
  };

  // Add vaccine to existing treatment with ID and per-state
  const addVaccineToTreatment = (treatmentIndex) => {
    const state = addVaccineStates[treatmentIndex];
    if (state.name && state.date && state.veterinarian) {
      const newTreatments = [...treatments];
      newTreatments[treatmentIndex].vaccines = [
        ...(newTreatments[treatmentIndex].vaccines || []),
        { id: String(Date.now()), name: state.name, date: state.date, veterinarian: state.veterinarian },
      ];
      setTreatments(newTreatments);
      setAddVaccineStates((prev) => {
        const newS = [...prev];
        newS[treatmentIndex] = { name: "", date: "", veterinarian: "" };
        return newS;
      });
    } else {
      setErrors((prev) => ({
        ...prev,
        vacuna: "Nombre, fecha y veterinario de vacuna son requeridos",
      }));
    }
  };

  // Update vaccine in a specific treatment
  const updateVaccine = (treatmentIndex, vaccineIndex, field, value) => {
    const newTreatments = [...treatments];
    newTreatments[treatmentIndex].vaccines[vaccineIndex][field] = value;
    setTreatments(newTreatments);
  };

  // Remove vaccine from a specific treatment
  const removeVaccine = (treatmentIndex, vaccineIndex) => {
    const newTreatments = [...treatments];
    newTreatments[treatmentIndex].vaccines = newTreatments[treatmentIndex].vaccines.filter((_, i) => i !== vaccineIndex);
    setTreatments(newTreatments);
  };

  // Add disease to existing treatment with ID and per-state
  const addDiseaseToTreatment = (treatmentIndex) => {
    const state = addDiseaseStates[treatmentIndex];
    if (state.name && state.date && state.description) {
      const newTreatments = [...treatments];
      newTreatments[treatmentIndex].diseases = [
        ...(newTreatments[treatmentIndex].diseases || []),
        { id: String(Date.now()), name: state.name, date: state.date, description: state.description },
      ];
      setTreatments(newTreatments);
      setAddDiseaseStates((prev) => {
        const newS = [...prev];
        newS[treatmentIndex] = { name: "", date: "", description: "" };
        return newS;
      });
    } else {
      setErrors((prev) => ({
        ...prev,
        enfermedad: "Nombre, fecha y descripción de enfermedad son requeridos",
      }));
    }
  };

  // Update disease in a specific treatment
  const updateDisease = (treatmentIndex, diseaseIndex, field, value) => {
    const newTreatments = [...treatments];
    newTreatments[treatmentIndex].diseases[diseaseIndex][field] = value;
    setTreatments(newTreatments);
  };

  // Remove disease from a specific treatment
  const removeDisease = (treatmentIndex, diseaseIndex) => {
    const newTreatments = [...treatments];
    newTreatments[treatmentIndex].diseases = newTreatments[treatmentIndex].diseases.filter((_, i) => i !== diseaseIndex);
    setTreatments(newTreatments);
  };

  // Handle birth updates
  const addNacimiento = () => setNacimientos([...nacimientos, { id: String(Date.now()), birthDate: "", qty: "", alive: "", destete: "" }]);
  const updateNacimiento = (index, field, value) => {
    const newNacimientos = [...nacimientos];
    newNacimientos[index][field] = value;
    setNacimientos(newNacimientos);
  };
  const removeNacimiento = (index) => setNacimientos(nacimientos.filter((_, i) => i !== index));

  // Handle form submission
  const handleSave = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Include current treatment if it has data, with ID
    const finalTreatments = [...treatments];
    if (currentTratamiento.name && currentTratamiento.description) {
      finalTreatments.push({
        id: String(Date.now()),
        name: currentTratamiento.name,
        description: currentTratamiento.description,
        vaccines: [...currentTratamiento.vaccines],
        diseases: [...currentTratamiento.diseases],
      });
    }

    const updatedAnimal = {
      ...animal,
      id: String(animal.id),
      type,
      characteristics: { breed, color, location },
      weight: parseFloat(weight) || 0,
      image,
      birthDate,
      numberOfBirths: parseInt(numberOfBirths) || 0,
      offspringCount: parseInt(offspringCount) || 0,
      breeding: { mated: breeding, mateDate: breeding ? mateDate : null },
      treatments: finalTreatments,
      birth: nacimientos,
    };

    try {
      const updated = await updateAnimal(animal.id, updatedAnimal);
      console.log('Animal updated in state:', updated);
      setAnimals(animals.map((a) => (a.id === animal.id ? updated : a)));
      alert("Animal actualizado correctamente");
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Editar Animal</h3>
        <form onSubmit={handleSave}>
          <div>
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Tipo"
            />
            {errors.type && <p className="error">{errors.type}</p>}
          </div>
          {image && (
            <div>
              <img src={image} alt="preview" style={{ width: "120px", marginTop: "10px" }} />
            </div>
          )}
          <div>
            <input
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Raza"
            />
            {errors.breed && <p className="error">{errors.breed}</p>}
          </div>
          <div>
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Color"
            />
            {errors.color && <p className="error">{errors.color}</p>}
          </div>
          <div>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ubicación"
            />
            {errors.location && <p className="error">{errors.location}</p>}
          </div>
          <div>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Peso (kg)"
            />
            {errors.weight && <p className="error">{errors.weight}</p>}
          </div>
          <div>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            {errors.birthDate && <p className="error">{errors.birthDate}</p>}
          </div>
          <div>
            <input
              type="number"
              value={numberOfBirths}
              onChange={(e) => setNumberOfBirths(e.target.value)}
              placeholder="Número de partos"
            />
            {errors.numberOfBirths && <p className="error">{errors.numberOfBirths}</p>}
          </div>
          <div>
            <input
              type="number"
              value={offspringCount}
              onChange={(e) => setOffspringCount(e.target.value)}
              placeholder="Cantidad de crías"
            />
            {errors.offspringCount && <p className="error">{errors.offspringCount}</p>}
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={breeding}
                onChange={() => setBreeding(!breeding)}
              />
              Apareado
            </label>
            {breeding && (
              <div>
                <input
                  type="date"
                  value={mateDate}
                  onChange={(e) => setMateDate(e.target.value)}
                />
                {errors.mateDate && <p className="error">{errors.mateDate}</p>}
              </div>
            )}
          </div>
          <h4>Nuevo Tratamiento</h4>
          <div>
            <input
              value={currentTratamiento.name}
              onChange={(e) => setCurrentTratamiento({ ...currentTratamiento, name: e.target.value })}
              placeholder="Nombre tratamiento"
            />
            <input
              value={currentTratamiento.description}
              onChange={(e) => setCurrentTratamiento({ ...currentTratamiento, description: e.target.value })}
              placeholder="Descripción tratamiento"
            />
            <h5>Vacunas del tratamiento</h5>
            <input
              value={vacunaNombre}
              onChange={(e) => setVacunaNombre(e.target.value)}
              placeholder="Nombre vacuna"
            />
            <input
              type="date"
              value={vacunaFecha}
              onChange={(e) => setVacunaFecha(e.target.value)}
            />
            <input
              value={vacunaVeterinario}
              onChange={(e) => setVacunaVeterinario(e.target.value)}
              placeholder="Veterinario"
            />
            <button type="button" onClick={addVaccine}>
              Agregar vacuna
            </button>
            {errors.vacuna && <p className="error">{errors.vacuna}</p>}
            <ul>
              {currentTratamiento.vaccines.map((v, i) => (
                <li key={v.id || i}>
                  {v.name} - {v.date} - {v.veterinarian}
                </li>
              ))}
            </ul>
            <h5>Enfermedades del tratamiento</h5>
            <input
              value={enfermedadNombre}
              onChange={(e) => setEnfermedadNombre(e.target.value)}
              placeholder="Nombre enfermedad"
            />
            <input
              type="date"
              value={enfermedadFecha}
              onChange={(e) => setEnfermedadFecha(e.target.value)}
            />
            <input
              value={enfermedadDesc}
              onChange={(e) => setEnfermedadDesc(e.target.value)}
              placeholder="Descripción enfermedad"
            />
            <button type="button" onClick={addDisease}>
              Agregar enfermedad
            </button>
            {errors.enfermedad && <p className="error">{errors.enfermedad}</p>}
            <ul>
              {currentTratamiento.diseases.map((d, i) => (
                <li key={d.id || i}>
                  {d.name} - {d.date} - {d.description}
                </li>
              ))}
            </ul>
            <button type="button" onClick={addTreatment}>
              Guardar tratamiento
            </button>
            {errors.tratamiento && <p className="error">{errors.tratamiento}</p>}
          </div>
          <h4>Tratamientos guardados</h4>
          {treatments.map((t, i) => (
            <div key={t.id || i} style={{ marginBottom: "10px" }}>
              <input
                value={t.name}
                onChange={(e) => updateTreatment(i, "name", e.target.value)}
                placeholder="Nombre tratamiento"
              />
              <input
                value={t.description}
                onChange={(e) => updateTreatment(i, "description", e.target.value)}
                placeholder="Descripción"
              />
              <button type="button" onClick={() => removeTreatment(i)}>
                Eliminar tratamiento
              </button>
              <h5>Vacunas</h5>
              {t.vaccines?.map((v, j) => (
                <div key={v.id || j} style={{ marginBottom: "5px" }}>
                  <input
                    value={v.name}
                    onChange={(e) => updateVaccine(i, j, "name", e.target.value)}
                    placeholder="Nombre vacuna"
                  />
                  <input
                    type="date"
                    value={v.date}
                    onChange={(e) => updateVaccine(i, j, "date", e.target.value)}
                  />
                  <input
                    value={v.veterinarian}
                    onChange={(e) => updateVaccine(i, j, "veterinarian", e.target.value)}
                    placeholder="Veterinario"
                  />
                  <button type="button" onClick={() => removeVaccine(i, j)}>
                    Eliminar
                  </button>
                </div>
              ))}
              <div>
                <input
                  value={addVaccineStates[i]?.name || ""}
                  onChange={(e) => {
                    const newS = [...addVaccineStates];
                    newS[i] = { ...newS[i], name: e.target.value };
                    setAddVaccineStates(newS);
                  }}
                  placeholder="Nombre nueva vacuna"
                />
                <input
                  type="date"
                  value={addVaccineStates[i]?.date || ""}
                  onChange={(e) => {
                    const newS = [...addVaccineStates];
                    newS[i] = { ...newS[i], date: e.target.value };
                    setAddVaccineStates(newS);
                  }}
                />
                <input
                  value={addVaccineStates[i]?.veterinarian || ""}
                  onChange={(e) => {
                    const newS = [...addVaccineStates];
                    newS[i] = { ...newS[i], veterinarian: e.target.value };
                    setAddVaccineStates(newS);
                  }}
                  placeholder="Veterinario"
                />
                <button type="button" onClick={() => addVaccineToTreatment(i)}>
                  Agregar nueva vacuna
                </button>
              </div>
              <h5>Enfermedades</h5>
              {t.diseases?.map((d, j) => (
                <div key={d.id || j} style={{ marginBottom: "5px" }}>
                  <input
                    value={d.name}
                    onChange={(e) => updateDisease(i, j, "name", e.target.value)}
                    placeholder="Nombre enfermedad"
                  />
                  <input
                    type="date"
                    value={d.date}
                    onChange={(e) => updateDisease(i, j, "date", e.target.value)}
                  />
                  <input
                    value={d.description}
                    onChange={(e) => updateDisease(i, j, "description", e.target.value)}
                    placeholder="Descripción"
                  />
                  <button type="button" onClick={() => removeDisease(i, j)}>
                    Eliminar
                  </button>
                </div>
              ))}
              <div>
                <input
                  value={addDiseaseStates[i]?.name || ""}
                  onChange={(e) => {
                    const newS = [...addDiseaseStates];
                    newS[i] = { ...newS[i], name: e.target.value };
                    setAddDiseaseStates(newS);
                  }}
                  placeholder="Nombre nueva enfermedad"
                />
                <input
                  type="date"
                  value={addDiseaseStates[i]?.date || ""}
                  onChange={(e) => {
                    const newS = [...addDiseaseStates];
                    newS[i] = { ...newS[i], date: e.target.value };
                    setAddDiseaseStates(newS);
                  }}
                />
                <input
                  value={addDiseaseStates[i]?.description || ""}
                  onChange={(e) => {
                    const newS = [...addDiseaseStates];
                    newS[i] = { ...newS[i], description: e.target.value };
                    setAddDiseaseStates(newS);
                  }}
                  placeholder="Descripción enfermedad"
                />
                <button type="button" onClick={() => addDiseaseToTreatment(i)}>
                  Agregar nueva enfermedad
                </button>
              </div>
            </div>
          ))}
          <h4>Nacimientos</h4>
          {nacimientos.map((n, i) => (
            <div key={n.id || i} style={{ marginBottom: "5px" }}>
              <input
                type="date"
                value={n.birthDate}
                onChange={(e) => updateNacimiento(i, "birthDate", e.target.value)}
                placeholder="Fecha nacimiento"
              />
              <input
                value={n.qty}
                onChange={(e) => updateNacimiento(i, "qty", e.target.value)}
                placeholder="Cantidad total"
              />
              <input
                value={n.alive}
                onChange={(e) => updateNacimiento(i, "alive", e.target.value)}
                placeholder="Vivos"
              />
              <input
                type="date"
                value={n.destete}
                onChange={(e) => updateNacimiento(i, "destete", e.target.value)}
                placeholder="Fecha destete"
              />
              <button type="button" onClick={() => removeNacimiento(i)}>
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" onClick={addNacimiento}>
            Agregar Nacimiento
          </button>
          <div>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose} style={{ marginLeft: "10px" }}>
              Cancelar
            </button>
            {errors.submit && <p className="error">{errors.submit}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormEditar;