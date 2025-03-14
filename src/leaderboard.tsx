import { useState, useEffect } from "react";

const API_URL = "https://kitchenherobackend.onrender.com"; // Backend-URL

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<
    { id: number; name: string; total: number }[]
  >([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default: inneværende måned
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetch(`${API_URL}/leaderboard?year=${selectedYear}&month=${selectedMonth}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("📊 Leaderboard-data hentet:", data);
        setLeaderboard(data);
      })
      .catch((error) =>
        console.error("❌ Feil ved henting av leaderboard:", error)
      );
  }, [selectedMonth, selectedYear]);

  return (
    <div className="container mt-4">
      <h3>📊 Leaderboard</h3>
      <div className="d-flex align-items-center mb-3">
        <label className="me-2">Velg måned:</label>
        <select
          className="form-select w-auto"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("no-NO", { month: "long" })}
            </option>
          ))}
        </select>
        <label className="ms-3 me-2">Velg år:</label>
        <input
          type="number"
          className="form-control w-auto"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        />
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>Plass</th>
            <th>Navn</th>
            <th>Registreringer</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length > 0 ? (
            leaderboard.map((row, index) => (
              <tr key={row.id}>
                <td>#{index + 1}</td>
                <td>{row.name}</td>
                <td>{row.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                Ingen registreringer funnet for denne måneden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
