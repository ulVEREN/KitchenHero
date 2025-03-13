import React from "react";

type Props = {
  rows: { id: number; name: string }[];
  showModal: boolean;
  onClose: () => void;
  deleteRow: (id: number) => void;
};

const DeleteModal: React.FC<Props> = ({
  rows,
  showModal,
  onClose,
  deleteRow,
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
            <h5 className="modal-title">Slett en rad</h5>
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
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteRow(row.id)}
                  >
                    Slett
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

export default DeleteModal;
