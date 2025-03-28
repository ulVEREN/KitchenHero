import { useState, useEffect } from "react";
import RegisterModal from "./RegisterModal";
import RowTable from "./RowTable";
import DeleteModal from "./DeleteModal";
import Leaderboard from "./leaderboard";
import ConfirmModal from "./ConfirmModal";

const API_URL = "https://kitchenherobackend.onrender.com";

const TableComponent: React.FC = () => {
  const [rows, setRows] = useState<
    { id: number; name: string; registrations: string[] }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  useEffect(() => {
    fetch(`${API_URL}/rows`)
      .then((response) => {
        if (!response.ok) throw new Error("Kunne ikke hente data");
        return response.json();
      })
      .then((data) => {
        console.log("✅ Data hentet fra backend:", data);
        setRows(
          Array.isArray(data)
            ? data.map((row) => ({
                id: row.id,
                name: row.name,
                registrations: Array.isArray(row.registrations)
                  ? row.registrations
                  : [],
              }))
            : []
        );
      })
      .catch((error) => console.error("❌ Feil ved henting av data:", error));
  }, []);

  const addRow = async () => {
    try {
      const response = await fetch(`${API_URL}/rows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `Rad ${rows.length + 1}` }),
      });

      const savedRow = await response.json();
      setRows([...rows, { ...savedRow, registrations: [] }]);
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
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("❌ Feil ved sletting av rad:", error);
    }
  };

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

  const registerDay = async (rowId: number, date: string) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return;

    const alreadyRegistered = row.registrations.includes(date);
    const formattedDate = new Date(date).toLocaleDateString("no-NO");

    const action = async () => {
      try {
        if (alreadyRegistered) {
          const response = await fetch(`${API_URL}/registrations`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rowId, date }),
          });

          if (!response.ok)
            throw new Error("Feil ved fjerning av registrering");

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
          const response = await fetch(`${API_URL}/registrations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rowId, date }),
          });

          if (!response.ok) throw new Error("Feil ved registrering");

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
      } finally {
        setShowConfirmModal(false);
      }
    };

    const message = alreadyRegistered
      ? `Er du sikker på at du vil fjerne heltedåd for ${row.name} den ${formattedDate}?`
      : `Er du sikker på at du vil registrere heltedåd for ${row.name} den ${formattedDate}?`;

    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  return (
    <div className="container mt-4">
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
          {showLeaderboard ? "📆 Denne måned" : "📊 Historikk"}
        </button>
      </div>

      {showLeaderboard && <Leaderboard />}

      {!showLeaderboard && (
        <RowTable
          rows={rows}
          daysInMonth={daysInMonth}
          registerDay={registerDay}
          updateRowName={updateRowName}
        />
      )}

      <RegisterModal
        rows={rows}
        showModal={showModal}
        onClose={() => setShowModal(false)}
        registerToday={(rowId) =>
          registerDay(rowId, new Date().toISOString().split("T")[0])
        }
      />

      <DeleteModal
        rows={rows}
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        deleteRow={deleteRow}
      />

      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmAction}
        message={confirmMessage}
      />
    </div>
  );
};

export default TableComponent;
