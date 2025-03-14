import React, { useState } from "react";

type Props = {
  rows: { id: number; name: string; registrations?: string[] }[];
  daysInMonth: number;
  registerDay: (rowId: number, day: string) => void;
  updateRowName: (id: number, newName: string) => void;
};

const RowTable: React.FC<Props> = ({
  rows,
  daysInMonth,
  registerDay,
  updateRowName,
}) => {
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [newName, setNewName] = useState("");

  // 📌 Beregn totalt antall registreringer per rad
  const rowTotals = rows.map((row) => ({
    id: row.id,
    total: row.registrations?.length ?? 0,
  }));

  // 📌 Finn de tre beste
  const sortedTotals = [...rowTotals].sort((a, b) => b.total - a.total);
  const topThree = sortedTotals.slice(0, 3).map((row) => row.id);

  // 📌 Medaljefarger
  const getMedalColor = (id: number) => {
    if (id === topThree[0]) return "#FFD700"; // 🥇 Gull
    if (id === topThree[1]) return "silver"; // 🥈 Sølv
    if (id === topThree[2]) return "#dca570"; // 🥉 Bronse
    return "transparent";
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Navn</th>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
            <th>Totalt</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const total = row.registrations?.length ?? 0;

            return (
              <tr key={row.id}>
                {/* ✅ Navn kan redigeres */}
                <td>
                  {editingRow === row.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={() => {
                        updateRowName(row.id, newName);
                        setEditingRow(null);
                      }}
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingRow(row.id);
                        setNewName(row.name);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {row.name}
                    </span>
                  )}
                </td>

                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = new Date();
                  day.setDate(i + 1);
                  const dayStr = day.toISOString().split("T")[0];

                  const isRegistered = (row.registrations ?? []).includes(
                    dayStr
                  );

                  return (
                    <td
                      key={i}
                      className={`text-center ${
                        isRegistered ? "table-success" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => registerDay(row.id, dayStr)}
                    >
                      {isRegistered ? "🦸" : ""}
                    </td>
                  );
                })}
                {/* ✅ Gull, sølv og bronse */}
                <td
                  className="text-center fw-bold"
                  style={{ backgroundColor: getMedalColor(row.id) }}
                >
                  {total > 0 ? total : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RowTable;
