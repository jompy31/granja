import React, { useState, useEffect, useMemo } from "react";
import "../../Styles/FormAddAnimal.css";
import { createAnimal } from "../../services/api";
import vacaImg from "../../assets/vaca.jpg";
import cerdoImg from "../../assets/cerdo.jpg";
import gallinaImg from "../../assets/gallina.jpg";
import ovejaImg from "../../assets/oveja.jpg";
import conejImg from "../../assets/conejo.jpg"

function FormularioAgregarAnimal({ setAnimals, isOpen, onClose }) {
  const tiposAnimales = ["Vaca", "Cerdo", "Gallina", "Oveja", "Conejo"];
  const ubicaciones = ["Bloque A", "Bloque B", "Bloque C", "Bloque D", "Bloque E", "Bloque F", "Bloque G", "Bloque H", "Bloque I", "Bloque J", "Bloque K", "Corral A", "Gallinero", "Pollera"];
  const imagenes = useMemo(() => ({
    Vaca: vacaImg,
    Cerdo: cerdoImg,
    Gallina: gallinaImg,
    Oveja: ovejaImg,
    Conejo: conejImg,
  }), []);

  const [tipos, setTipos] = useState("");
  const [raza, setRaza] = useState("");
  const [color, setColor] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [peso, setPeso] = useState("");
  const [alimentacionHorario, setAlimentacionHorario] = useState("");
  const [alimentacionCantidad, setAlimentacionCantidad] = useState("");
  const [hidratacion, setHidratacion] = useState("");
  const [tratamientos, setTratamientos] = useState([]);
  const [currentTratamiento, setCurrentTratamiento] = useState({
    name: "",
    description: "",
    vaccines: [],
    diseases: [],
  });
  const [vacunaNombre, setVacunaNombre] = useState(""); // Para nuevo tratamiento
  const [vacunaFecha, setVacunaFecha] = useState("");
  const [vacunaVeterinario, setVacunaVeterinario] = useState("");
  const [enfermedadNombre, setEnfermedadNombre] = useState(""); // Para nuevo tratamiento
  const [enfermedadFecha, setEnfermedadFecha] = useState("");
  const [enfermedadDesc, setEnfermedadDesc] = useState("");
  const [addVaccineStates, setAddVaccineStates] = useState([]); // Estados per-tratamiento para agregar vacunas a guardados
  const [addDiseaseStates, setAddDiseaseStates] = useState([]); // Similar para enfermedades
  const [reproduccion, setReproduccion] = useState(false);
  const [fechaApareo, setFechaApareo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [numPartos, setNumPartos] = useState("");
  const [numCrias, setNumCrias] = useState("");
  const [nacimientos, setNacimientos] = useState([]);
  const [nacimientoFecha, setNacimientoFecha] = useState("");
  const [nacimientoQty, setNacimientoQty] = useState("");
  const [nacimientoVivos, setNacimientoVivos] = useState("");
  const [nacimientoDestete, setNacimientoDestete] = useState("");
  const [imagenSeleccionada, setImagenSeleccionada] = useState("");
  const [errors, setErrors] = useState({});

  // Inicializar estados para agregar a tratamientos guardados cuando cambie la lista
  useEffect(() => {
    setAddVaccineStates(prev => Array(tratamientos.length).fill(null).map((_, i) => prev[i] || { name: "", date: "", veterinarian: "" }));
    setAddDiseaseStates(prev => Array(tratamientos.length).fill(null).map((_, i) => prev[i] || { name: "", date: "", description: "" }));
  }, [tratamientos]);

  // Automatically set image based on animal type
  useEffect(() => {
  if (tipos && imagenes[tipos]) {
    setImagenSeleccionada(imagenes[tipos]);
  } else {
    setImagenSeleccionada("");
  }
}, [tipos, imagenes]);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!tipos) newErrors.tipos = "El tipo es requerido";
    if (!raza) newErrors.raza = "La raza es requerida";
    if (!color) newErrors.color = "El color es requerido";
    if (!ubicacion) newErrors.ubicacion = "La ubicación es requerida";
    if (!peso || peso <= 0) newErrors.peso = "El peso debe ser mayor a 0";
    if (!alimentacionHorario) newErrors.alimentacionHorario = "El horario es requerido";
    if (!alimentacionCantidad) newErrors.alimentacionCantidad = "La cantidad es requerida";
    if (!hidratacion) newErrors.hidratacion = "La hidratación es requerida";
    if (!fechaNacimiento) newErrors.fechaNacimiento = "La fecha de nacimiento es requerida";
    if (reproduccion && !fechaApareo) newErrors.fechaApareo = "La fecha de apareamiento es requerida";
    if (numPartos && numPartos < 0) newErrors.numPartos = "El número de partos no puede ser negativo";
    if (numCrias && numCrias < 0) newErrors.numCrias = "El número de crías no puede ser negativo";
    return newErrors;
  };

  // Add vaccine to current (new) treatment with ID
  const addVacuna = () => {
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

  // Add disease to current (new) treatment with ID
  const addEnfermedad = () => {
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

  // Save current treatment with ID
  const addTratamiento = () => {
    if (currentTratamiento.name && currentTratamiento.description) {
      setTratamientos((prev) => [
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

  // Update treatment field (for saved treatments)
  const updateTreatment = (index, field, value) => {
    setTratamientos((prev) => {
      const newT = [...prev];
      newT[index][field] = value;
      return newT;
    });
  };

  // Update vaccine in saved treatment
  const updateVaccine = (treatmentIndex, vaccineIndex, field, value) => {
    setTratamientos((prev) => {
      const newT = [...prev];
      newT[treatmentIndex].vaccines[vaccineIndex][field] = value;
      return newT;
    });
  };

  // Remove vaccine from saved treatment
  const removeVaccine = (treatmentIndex, vaccineIndex) => {
    setTratamientos((prev) => {
      const newT = [...prev];
      newT[treatmentIndex].vaccines = newT[treatmentIndex].vaccines.filter((_, i) => i !== vaccineIndex);
      return newT;
    });
  };

  // Add vaccine to saved treatment with ID
  const addVaccineToTreatment = (treatmentIndex) => {
    const state = addVaccineStates[treatmentIndex];
    if (state.name && state.date && state.veterinarian) {
      setTratamientos((prev) => {
        const newT = [...prev];
        newT[treatmentIndex].vaccines = [
          ...(newT[treatmentIndex].vaccines || []),
          { id: String(Date.now()), name: state.name, date: state.date, veterinarian: state.veterinarian },
        ];
        return newT;
      });
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

  // Update disease in saved treatment
  const updateDisease = (treatmentIndex, diseaseIndex, field, value) => {
    setTratamientos((prev) => {
      const newT = [...prev];
      newT[treatmentIndex].diseases[diseaseIndex][field] = value;
      return newT;
    });
  };

  // Remove disease from saved treatment
  const removeDisease = (treatmentIndex, diseaseIndex) => {
    setTratamientos((prev) => {
      const newT = [...prev];
      newT[treatmentIndex].diseases = newT[treatmentIndex].diseases.filter((_, i) => i !== diseaseIndex);
      return newT;
    });
  };

  // Add disease to saved treatment with ID
  const addDiseaseToTreatment = (treatmentIndex) => {
    const state = addDiseaseStates[treatmentIndex];
    if (state.name && state.date && state.description) {
      setTratamientos((prev) => {
        const newT = [...prev];
        newT[treatmentIndex].diseases = [
          ...(newT[treatmentIndex].diseases || []),
          { id: String(Date.now()), name: state.name, date: state.date, description: state.description },
        ];
        return newT;
      });
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

  // Remove a treatment
  const removeTratamiento = (index) => {
    setTratamientos((prev) => prev.filter((_, i) => i !== index));
  };

  // Add birth with ID
  const addNacimiento = () => {
    if (nacimientoFecha && nacimientoQty && nacimientoVivos && nacimientoDestete) {
      setNacimientos((prev) => [
        ...prev,
        { id: String(Date.now()), birthDate: nacimientoFecha, qty: nacimientoQty, alive: nacimientoVivos, destete: nacimientoDestete },
      ]);
      setNacimientoFecha("");
      setNacimientoQty("");
      setNacimientoVivos("");
      setNacimientoDestete("");
    } else {
      setErrors((prev) => ({
        ...prev,
        nacimiento: "Todos los campos de nacimiento son requeridos",
      }));
    }
  };

  // Update birth field
  const updateNacimiento = (index, field, value) => {
    setNacimientos((prev) => {
      const newN = [...prev];
      newN[index][field] = value;
      return newN;
    });
  };

  // Remove birth
  const removeNacimiento = (index) => {
    setNacimientos((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      console.log('Form validation errors:', formErrors);
      return;
    }

    // Include current treatment if it has data, with ID
    const finalTratamientos = [...tratamientos];
    if (currentTratamiento.name && currentTratamiento.description) {
      finalTratamientos.push({
        id: String(Date.now()),
        name: currentTratamiento.name,
        description: currentTratamiento.description,
        vaccines: [...currentTratamiento.vaccines],
        diseases: [...currentTratamiento.diseases],
      });
    }

    const newAnimal = {
      id: String(Date.now()),
      type: tipos,
      image: imagenSeleccionada,
      characteristics: {
        breed: raza,
        color: color,
        location: ubicacion,
      },
      feeding: {
        schedule: alimentacionHorario,
        amount: alimentacionCantidad,
      },
      hydration: {
        dailyLevel: hidratacion,
      },
      weight: parseFloat(peso) || 0,
      treatments: finalTratamientos,
      breeding: {
        mated: reproduccion,
        mateDate: reproduccion ? fechaApareo : null,
      },
      birth: nacimientos,
      birthDate: fechaNacimiento,
      numberOfBirths: parseInt(numPartos) || 0,
      offspringCount: parseInt(numCrias) || 0,
    };

    try {
      console.log('Submitting new animal:', newAnimal);
      const createdAnimal = await createAnimal(newAnimal);
      setAnimals((prev) => [...prev, createdAnimal]);
      alert("Animal agregado correctamente!");
      console.log('Animal added to state:', createdAnimal);
      // Reset form
      setTipos("");
      setRaza("");
      setColor("");
      setUbicacion("");
      setPeso("");
      setAlimentacionHorario("");
      setAlimentacionCantidad("");
      setHidratacion("");
      setTratamientos([]);
      setCurrentTratamiento({ name: "", description: "", vaccines: [], diseases: [] });
      setVacunaNombre("");
      setVacunaFecha("");
      setVacunaVeterinario("");
      setEnfermedadNombre("");
      setEnfermedadFecha("");
      setEnfermedadDesc("");
      setAddVaccineStates([]);
      setAddDiseaseStates([]);
      setReproduccion(false);
      setFechaApareo("");
      setFechaNacimiento("");
      setNumPartos("");
      setNumCrias("");
      setNacimientos([]);
      setNacimientoFecha("");
      setNacimientoQty("");
      setNacimientoVivos("");
      setNacimientoDestete("");
      setImagenSeleccionada("");
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
      console.error('Failed to add animal:', error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h3>Agregar Animal</h3>
          {/* Tipo */}
          <div>
            <select value={tipos} onChange={(e) => setTipos(e.target.value)}>
              <option value="">Seleccionar tipo</option>
              {tiposAnimales.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.tipos && <p className="error">{errors.tipos}</p>}
          </div>

          {/* Imagen automática */}
          {imagenSeleccionada && (
            <div>
              <img src={imagenSeleccionada} alt="preview" width="120" />
            </div>
          )}

          {/* Raza, color, ubicación */}
          <div>
            <input
              value={raza}
              onChange={(e) => setRaza(e.target.value)}
              placeholder="Raza"
            />
            {errors.raza && <p className="error">{errors.raza}</p>}
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
            <select
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            >
              <option value="">Seleccionar ubicación</option>
              {ubicaciones.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            {errors.ubicacion && <p className="error">{errors.ubicacion}</p>}
          </div>

          {/* Peso */}
          <div>
            <input
              type="number"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Peso (kg)"
            />
            {errors.peso && <p className="error">{errors.peso}</p>}
          </div>

          {/* Alimentación */}
          <div>
            <input
              value={alimentacionHorario}
              onChange={(e) => setAlimentacionHorario(e.target.value)}
              placeholder="Horario alimentación"
            />
            {errors.alimentacionHorario && (
              <p className="error">{errors.alimentacionHorario}</p>
            )}
          </div>
          <div>
            <input
              value={alimentacionCantidad}
              onChange={(e) => setAlimentacionCantidad(e.target.value)}
              placeholder="Cantidad alimentación"
            />
            {errors.alimentacionCantidad && (
              <p className="error">{errors.alimentacionCantidad}</p>
            )}
          </div>

          {/* Hidratación */}
          <div>
            <input
              value={hidratacion}
              onChange={(e) => setHidratacion(e.target.value)}
              placeholder="Hidratación diaria"
            />
            {errors.hidratacion && <p className="error">{errors.hidratacion}</p>}
          </div>

          {/* Tratamientos */}
          <div>
            <h4>Nuevo Tratamiento</h4>
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
            <button type="button" onClick={addVacuna}>
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
            <button type="button" onClick={addEnfermedad}>
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
            <button type="button" onClick={addTratamiento}>
              Guardar tratamiento
            </button>
            {errors.tratamiento && <p className="error">{errors.tratamiento}</p>}
            <h4>Tratamientos guardados</h4>
            <ul>
              {tratamientos.map((t, i) => (
                <li key={t.id || i}>
                  <input
                    value={t.name}
                    onChange={(e) => updateTreatment(i, "name", e.target.value)}
                    placeholder="Nombre tratamiento"
                  />
                  <input
                    value={t.description}
                    onChange={(e) => updateTreatment(i, "description", e.target.value)}
                    placeholder="Descripción tratamiento"
                  />
                  <button
                    type="button"
                    onClick={() => removeTratamiento(i)}
                    style={{ marginLeft: "10px" }}
                  >
                    Eliminar
                  </button>
                  <h5>Vacunas</h5>
                  {t.vaccines?.length > 0 && (
                    <ul>
                      {t.vaccines.map((v, j) => (
                        <li key={v.id || j}>
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
                          <button
                            type="button"
                            onClick={() => removeVaccine(i, j)}
                          >
                            Eliminar vacuna
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
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
                  {t.diseases?.length > 0 && (
                    <ul>
                      {t.diseases.map((d, j) => (
                        <li key={d.id || j}>
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
                            placeholder="Descripción enfermedad"
                          />
                          <button
                            type="button"
                            onClick={() => removeDisease(i, j)}
                          >
                            Eliminar enfermedad
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
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
                      placeholder="Descripción nueva enfermedad"
                    />
                    <button type="button" onClick={() => addDiseaseToTreatment(i)}>
                      Agregar nueva enfermedad
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Nacimientos */}
          <div>
            <h4>Nacimientos</h4>
            <input
              type="date"
              value={nacimientoFecha}
              onChange={(e) => setNacimientoFecha(e.target.value)}
              placeholder="Fecha nacimiento"
            />
            <input
              value={nacimientoQty}
              onChange={(e) => setNacimientoQty(e.target.value)}
              placeholder="Cantidad total"
            />
            <input
              value={nacimientoVivos}
              onChange={(e) => setNacimientoVivos(e.target.value)}
              placeholder="Vivos"
            />
            <input
              type="date"
              value={nacimientoDestete}
              onChange={(e) => setNacimientoDestete(e.target.value)}
              placeholder="Fecha destete"
            />
            <button type="button" onClick={addNacimiento}>
              Agregar nacimiento
            </button>
            {errors.nacimiento && <p className="error">{errors.nacimiento}</p>}
            <ul>
              {nacimientos.map((n, i) => (
                <li key={n.id || i}>
                  <input
                    type="date"
                    value={n.birthDate}
                    onChange={(e) => updateNacimiento(i, "birthDate", e.target.value)}
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
                  />
                  <button type="button" onClick={() => removeNacimiento(i)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Reproducción */}
          <div>
            <label>
              <input
                type="checkbox"
                checked={reproduccion}
                onChange={() => setReproduccion(!reproduccion)}
              />
              Apareado
            </label>
            {reproduccion && (
              <div>
                <input
                  type="date"
                  value={fechaApareo}
                  onChange={(e) => setFechaApareo(e.target.value)}
                />
                {errors.fechaApareo && <p className="error">{errors.fechaApareo}</p>}
              </div>
            )}
          </div>

          {/* Fechas y reproducción */}
          <div>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              placeholder="Fecha nacimiento"
            />
            {errors.fechaNacimiento && (
              <p className="error">{errors.fechaNacimiento}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              value={numPartos}
              onChange={(e) => setNumPartos(e.target.value)}
              placeholder="Número partos"
            />
            {errors.numPartos && <p className="error">{errors.numPartos}</p>}
          </div>
          <div>
            <input
              type="number"
              value={numCrias}
              onChange={(e) => setNumCrias(e.target.value)}
              placeholder="Cantidad crías"
            />
            {errors.numCrias && <p className="error">{errors.numCrias}</p>}
          </div>

          <div>
            <button type="submit">Agregar Animal</button>
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

export default FormularioAgregarAnimal;