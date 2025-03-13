import { useState, useEffect } from "react";
import RegisterModal from "./RegisterModal";
import RowTable from "./RowTable";
import DeleteModal from "./DeleteModal";
import Leaderboard from "./leaderboard"; // ✅ Importer Leaderboard

const API_URL = "http://localhost:5001";

const TableComponent: React.FC = () => {
  const [rows, setRows] = useState<
    { id: number; name: string; registrations: string[] }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false); // ✅ Toggle Leaderboard

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate(); // ✅ Antall dager i denne måneden

  // 📌 Hent rader og registreringer
  useEffect(() => {
    fetch(`${API_URL}/rows`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Kunne ikke hente data");
        }
        return response.json();
      })
      .then(
        (data: { id: number; name: string; registrations?: string[] }[]) => {
          console.log("✅ Data hentet fra backend:", data);

          setRows(
            Array.isArray(data)
              ? data.map((row) => ({
                  id: row.id,
                  name: row.name,
                  registrations: Array.isArray(row.registrations)
                    ? row.registrations
                    : [], // ✅ Passer på at det alltid er en array
                }))
              : []
          );
        }
      )
      .catch((error) => console.error("❌ Feil ved henting av data:", error));
  }, []);

  // 📌 Legg til en ny rad
  const addRow = async () => {
    try {
      const response = await fetch(`${API_URL}/rows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `Rad ${rows.length + 1}` }),
      });

      const savedRow = await response.json();
      setRows([...rows, { ...savedRow, registrations: [] }]); // ✅ Ny rad starter uten registreringer
    } catch (error) {
      console.error("❌ Feil ved lagring av rad:", error);
    }
  };

  const deleteRow = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/rows/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Feil ved sletting av rad i databasen");
      }

      console.log(`🗑️ Rad med ID ${id} slettet fra databasen.`);

      // 🔄 Oppdater frontend ved å fjerne raden fra state
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("❌ Feil ved sletting av rad:", error);
    }
  };

  // 📌 Oppdater navnet i databasen
  const updateRowName = async (id: number, newName: string) => {
    try {
      const response = await fetch(`${API_URL}/rows/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error("Feil ved oppdatering av navn");
      }

      setRows(
        rows.map((row) => (row.id === id ? { ...row, name: newName } : row))
      );
    } catch (error) {
      console.error("❌ Feil ved oppdatering av navn:", error);
    }
  };

  // 📌 Registrere / fjerne en verdi for en dag
  const registerDay = async (rowId: number, date: string) => {
    try {
      const row = rows.find((r) => r.id === rowId);
      if (!row) return;

      const alreadyRegistered = row.registrations.includes(date);

      if (alreadyRegistered) {
        // 🔥 Slett registreringen hvis den allerede finnes
        console.log("🗑️ Fjerner registrering fra backend:", { rowId, date });

        const response = await fetch(`${API_URL}/registrations`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rowId, date }),
        });

        if (!response.ok) {
          throw new Error("Feil ved fjerning av registrering");
        }

        console.log("✅ Registrering fjernet fra backend");

        // 🔄 Oppdater frontend-tilstanden
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  registrations: row.registrations.filter((d) => d !== date),
                }
              : row
          )
        );
      } else {
        // ✅ Legg til registrering hvis den IKKE finnes fra før
        console.log("📤 Sender registrering til backend:", { rowId, date });

        const response = await fetch(`${API_URL}/registrations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rowId, date }),
        });

        if (!response.ok) {
          throw new Error("Feil ved registrering av data");
        }

        console.log("✅ Registrering bekreftet av backend");

        // 🔄 Oppdater frontend-tilstanden
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === rowId
              ? { ...row, registrations: [...row.registrations, date] }
              : row
          )
        );
      }
    } catch (error) {
      console.error("❌ Feil ved registrering:", error);
    }
  };

  return (
    <div className="container mt-4">
      {/* Kontrollknapper */}
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={addRow}>
          ➕ Legg til 🦸
        </button>
        <button
          className="btn btn-success me-2"
          onClick={() => setShowModal(true)}
        >
          Registrer din heltedåd for i dag 🍽🦸‍♀️
        </button>
        <button
          className="btn btn-danger me-2"
          onClick={() => setShowDeleteModal(true)}
        >
          🗑️ Slett rad
        </button>
        <button
          className="btn btn-info"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
        >
          📊 Historikk
        </button>
      </div>

      {/* Leaderboard */}
      {showLeaderboard && <Leaderboard />}

      {/* Tabellen */}
      {!showLeaderboard && (
        <RowTable
          rows={rows}
          daysInMonth={daysInMonth}
          registerDay={registerDay}
          updateRowName={updateRowName} // ✅ Sender funksjonen videre
        />
      )}

      {/* Modaler */}
      <RegisterModal
        rows={rows}
        showModal={showModal}
        onClose={() => setShowModal(false)}
        registerToday={(rowId) =>
          registerDay(rowId, new Date().toISOString().split("T")[0])
        } // ✅ Registrer for i dag
      />

      <DeleteModal
        rows={rows}
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        deleteRow={deleteRow} // 🔥 Send riktig funksjon som prop
      />
    </div>
  );
};

export default TableComponent;
