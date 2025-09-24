import React, { useState } from "react";
import "../../Styles/FichaAnimal.css";
import placeholderImg from "../../assets/logo_granja.png";

function FichaAnimal({ data, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data) return <p>No hay datos disponibles</p>;

  return (
    <div className="ficha-card" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="ficha-header">
        <h2>{data.type}</h2>
        <img
          src={data.image || placeholderImg}
          alt={data.type}
          className="ficha-image"
        />
      </div>
      <div className="ficha-body">
        <p><strong>Raza:</strong> {data.characteristics?.breed}</p>
        <p><strong>Color:</strong> {data.characteristics?.color}</p>
        <p><strong>Ubicación:</strong> {data.characteristics?.location}</p>
        {isExpanded && (
          <>
            <p><strong>Peso:</strong> {data.weight} kg</p>
            <p><strong>Alimentación:</strong> {data.feeding?.schedule} - {data.feeding?.amount}</p>
            <p><strong>Hidratación:</strong> {data.hydration?.dailyLevel}</p>
            {data.treatments?.length > 0 && (
              <div>
                <strong>Tratamientos:</strong>
                <ul>
                  {data.treatments.map((t, i) => (
                    <li key={t.id || `${data.id}-treatment-${i}`}>
                      {t.name} - {t.description}
                      {t.vaccines?.length > 0 && (
                        <ul>
                          {t.vaccines.map((v, j) => (
                            <li key={v.id || `${data.id}-vaccine-${j}`}>
                              Vacuna: {v.name} ({v.date}, {v.veterinarian})
                            </li>
                          ))}
                        </ul>
                      )}
                      {t.diseases?.length > 0 && (
                        <ul>
                          {t.diseases.map((d, j) => (
                            <li key={d.id || `${data.id}-disease-${j}`}>
                              Enfermedad: {d.name} ({d.date}, {d.description})
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.breeding && (
              <div>
                <strong>Reproducción:</strong>
                <p><strong>Apareado:</strong> {data.breeding.mated ? "Sí" : "No"}</p>
                {data.breeding.mated && <p><strong>Fecha de apareamiento:</strong> {data.breeding.mateDate}</p>}
              </div>
            )}
            {data.birth?.length > 0 && (
              <div>
                <strong>Nacimientos:</strong>
                <ul>
                  {data.birth.map((n, i) => (
                    <li key={n.id || `${data.id}-birth-${i}`}>
                      Fecha: {n.birthDate}, Qty: {n.qty}, Vivos: {n.alive}, Destete: {n.destete}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.birthDate && <p><strong>Fecha de nacimiento:</strong> {data.birthDate}</p>}
            {data.numberOfBirths !== undefined && <p><strong>Número de partos:</strong> {data.numberOfBirths}</p>}
            {data.offspringCount !== undefined && <p><strong>Cantidad de crías:</strong> {data.offspringCount}</p>}
          </>
        )}
      </div>
      <div className="ficha-actions">
        <button className="ficha-edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(); }}>Editar</button>
        <button className="ficha-delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(); }}>Eliminar</button>
      </div>
    </div>
  );
}

export default FichaAnimal;