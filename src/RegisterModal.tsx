import React from "react";

type Props = {
  rows: { id: number; name: string; registrations: string[] }[]; // ✅ Endret `count` til `registrations`
  showModal: boolean;
  onClose: () => void;
  registerToday: (rowId: number) => void;
};

const RegisterModal: React.FC<Props> = ({
  rows,
  showModal,
  onClose,
  registerToday,
}) => {
  if (!showModal) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Registrer verdi</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <ul className="list-group">
              {rows.map((row) => (
                <li
                  key={row.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {row.name}
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => registerToday(row.id)}
                  >
                    Registrer
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Lukk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
