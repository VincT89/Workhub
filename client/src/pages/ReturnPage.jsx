import Drawer from "../components/Drawer";
import Table from "../components/Table";
import { useState, useEffect } from "react";
import { returnsMock } from "../api/mock/returnsMock";
import { productsMock } from "../api/mock/productsMock";

// IN TABELLA: prima colonna = "Id"
const returnColumns = ["id", "cliente", "data", "motivo", "stato"];

// input stile ordini
const inputClass =
  "mt-1 w-full px-3 py-2 rounded-lg bg-white/90 border border-white/80 text-sm text-[#090c64]";

// select e quantità in stile ordini
const selectClass =
  "mt-1 w-full max-w-xs px-3 py-2 rounded-lg bg-white/90 border border-white/80 text-sm text-[#090c64]";
const qtyInputClass =
  "mt-1 w-20 px-3 py-2 rounded-lg bg-white/90 border border-white/80 text-sm text-[#090c64] text-center";

// input piccolo nel titolo (come Orders)
const headerNumberInputClass =
  "px-3 py-1 rounded-lg bg-white/90 border border-white/80 text-sm text-[#090c64] w-32";

const ReturnsPage = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [returns, setReturns] = useState(returnsMock);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // valori per form (sia modifica che nuovo reso)
  const [editValues, setEditValues] = useState({
    numeroReso: "",
    cliente: "",
    stato: "",
    motivo: "",
  });

  // prodotto/quantità usati sia per NUOVO reso che per modifica reso
  const [newProductId, setNewProductId] = useState(
    productsMock[0]?.id || ""
  );
  const [newQty, setNewQty] = useState(1);

  // toast come in Orders
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (selected && !isAdding) {
      setEditValues({
        numeroReso: selected.numeroReso || "",
        cliente: selected.cliente || "",
        stato: selected.stato || "",
        motivo: selected.motivo || "",
      });
      setIsEditing(false);
    }
  }, [selected, isAdding]);

  // auto–chiusura toast
  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 3000);
    return () => clearTimeout(t);
  }, [alert]);

  const handleRowClick = (row) => {
    setSelected(row);
    setIsAdding(false);
    setOpen(true);
  };

  const handleDeleteReturn = () => {
    if (!selected) return;

    const deletedNumber = selected.numeroReso;

    setReturns((prev) => prev.filter((r) => r.id !== selected.id));
    close();

    setAlert({
      type: "delete",
      text: `Il reso ${deletedNumber} è stato eliminato.`,
    });
  };

  const handleEditReturn = () => {
    if (!selected) return;
    // quando entro in modifica, porto in stato anche prodotto e qty
    setNewProductId(selected.productId || productsMock[0]?.id || "");
    setNewQty(selected.qty || 1);
    setIsEditing(true);
  };

  const handleSaveReturn = () => {
    // NUOVO RESO
    if (isAdding) {
      const safeQty = newQty && newQty > 0 ? newQty : 1;
      const productId = newProductId || productsMock[0]?.id || "P001";

      // NIENTE R001 automatico → lo scrivi tu, al massimo "S/N"
      const numeroReso = editValues.numeroReso.trim() || "S/N";

      const nuovoReso = {
        id: Date.now(), // id tecnico interno, non mostrato
        numeroReso,
        cliente: editValues.cliente.trim() || "Cliente sconosciuto",
        data: new Date().toISOString(),
        motivo: editValues.motivo.trim() || "Motivo da definire",
        stato: editValues.stato.trim() || "In elaborazione",
        productId,
        qty: safeQty,
      };

      setReturns((prev) => [...prev, nuovoReso]);
      setSelected(nuovoReso);
      setIsAdding(false);
      setIsEditing(false);

      setAlert({
        type: "create",
        text: `Il reso ${nuovoReso.numeroReso} è stato creato.`,
      });

      return;
    }

    // UPDATE RESO ESISTENTE
    if (!selected) return;

    const safeQtyUpdate =
      newQty && newQty > 0 ? newQty : selected.qty || 1;
    const updatedProductId =
      newProductId || selected.productId || productsMock[0]?.id || "P001";

    const updatedReturn = {
      ...selected,
      numeroReso: editValues.numeroReso.trim() || selected.numeroReso,
      cliente: editValues.cliente.trim() || selected.cliente,
      stato: editValues.stato.trim() || selected.stato,
      motivo: editValues.motivo.trim() || selected.motivo,
      productId: updatedProductId,
      qty: safeQtyUpdate,
    };

    setReturns((prev) =>
      prev.map((r) => (r.id === selected.id ? updatedReturn : r))
    );

    setSelected(updatedReturn);
    setIsEditing(false);

    setAlert({
      type: "update",
      text: `Il reso ${updatedReturn.numeroReso} è stato modificato.`,
    });
  };

  const handleAddReturn = () => {
    setIsAdding(true);
    setIsEditing(true);
    setSelected(null);
    setEditValues({
      numeroReso: "",
      cliente: "",
      stato: "In elaborazione",
      motivo: "",
    });
    setNewProductId(productsMock[0]?.id || "");
    setNewQty(1);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setSelected(null);
    setIsEditing(false);
    setIsAdding(false);
  };

  // prodotto/qty correnti (sia nuovo che modifica che visualizzazione)
  const editingProductId =
    isAdding || isEditing ? newProductId : selected?.productId;

  const editingQty = isAdding || isEditing ? newQty : selected?.qty;

  const currentProductForCard = editingProductId
    ? productsMock.find((p) => p.id === editingProductId)
    : null;

  // totale reso
  const getReturnTotal = () => {
    if (!currentProductForCard) return 0;
    const qtyNumber = Number(editingQty) || 0;
    return currentProductForCard.prezzo * qtyNumber;
  };

  // dati per la tabella: colonna "Id" ma valore = numeroReso che scrivi tu
  const returnsForTable = returns.map((r) => ({
    ...r,
    id: r.numeroReso || r.id,
  }));

  return (
    <div>
      {/* Tabella come Ordini: titolo + A-Z + Cerca + Aggiungi */}
      <Table
        title="Resi"
        data={returnsForTable}
        columns={returnColumns}
     		onRowClick={(row) => handleRowClick(row)}
        onAdd={handleAddReturn}
      />

      <Drawer
        open={open}
        onClose={close}
        title={
          selected ? (
            <div className="flex items-center gap-3">
              <span className="font-semibold">Reso</span>
              {isEditing ? (
                <input
                  className={headerNumberInputClass}
                  value={editValues.numeroReso}
                  onChange={(e) =>
                    setEditValues((prev) => ({
                      ...prev,
                      numeroReso: e.target.value,
                    }))
                  }
                />
              ) : (
                <span className="font-semibold">
                  {selected.numeroReso}
                </span>
              )}
            </div>
          ) : isAdding ? (
            "Nuovo reso"
          ) : (
            "Dettaglio reso"
          )
        }
        width="w-[700px]"
      >
        {/* NUOVO RESO */}
        {isAdding && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-6">
              {/* SINISTRA: Cliente + Data */}
              <div className="space-y-3">
                <div>
                  <b>Cliente:</b>
                  <input
                    className={inputClass}
                    value={editValues.cliente}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        cliente: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <b>Data:</b>
                  <div className={inputClass}>
                    {new Date().toLocaleString()}
                  </div>
                </div>
              </div>

              {/* DESTRA: Motivo + Stato */}
              <div className="space-y-3">
                <div>
                  <b>Motivo:</b>
                  <input
                    className={inputClass}
                    value={editValues.motivo}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        motivo: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <b>Stato:</b>
                  <input
                    className={inputClass}
                    value={editValues.stato}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        stato: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <hr className="my-4 border-white/70" />

            {/* PRODOTTO RESO – come "Articoli" degli ordini (ma uno solo) */}
            <div className="mt-2">
              <h3 className="font-semibold mb-2">Prodotto reso</h3>

              {/* select + quantità */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <select
                  className={selectClass}
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                >
                  {productsMock.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                      {p.sku ? ` (${p.sku})` : ""}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  className={qtyInputClass}
                  value={newQty}
                  onChange={(e) =>
                    setNewQty(Number(e.target.value) || 1)
                  }
                />
              </div>

              {/* card anteprima prodotto */}
              {currentProductForCard && (
                <div className="rounded-md border p-3 flex justify-between gap-3">
                  <div className="flex gap-3">
                    {currentProductForCard.img && (
                      <img
                        src={currentProductForCard.img}
                        alt={currentProductForCard.nome}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    )}

                    <div className="text-xs">
                      <div className="font-medium">
                        {currentProductForCard.nome}{" "}
                        {currentProductForCard.sku && (
                          <span className="text-[10px] text-gray-500">
                            ({currentProductForCard.sku})
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-600">
                        {currentProductForCard.categoria} •{" "}
                        {currentProductForCard.colore} •{" "}
                        {currentProductForCard.materiale}
                      </div>
                      <div className="text-[10px] text-gray-600">
                        Dimensioni: {currentProductForCard.dimensioni}
                      </div>
                      {currentProductForCard.descrizione && (
                        <p className="text-[10px] mt-1 text-gray-700">
                          {currentProductForCard.descrizione}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="mb-1">
                      <b>Q.tà:</b> {editingQty}
                    </div>
                    <div>
                      Prezzo unitario: €{" "}
                      {currentProductForCard.prezzo.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Totale reso */}
            <div className="mt-4 flex justify-between items-center">
              <span className="font-semibold">Totale reso</span>
              <span className="inline-block px-3 py-1 rounded-lg bg-white/10 font-semibold">
                € {getReturnTotal().toFixed(2)}
              </span>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={handleSaveReturn} className="custom-button">
                Salva
              </button>
            </div>
          </div>
        )}

        {/* DETTAGLIO RESO ESISTENTE */}
        {!isAdding && selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-6">
              {/* SINISTRA: Cliente + Data */}
              <div className="space-y-3">
                <div>
                  <b>Cliente:</b>{" "}
                  {isEditing ? (
                    <input
                      className={inputClass}
                      value={editValues.cliente}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          cliente: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className={inputClass}>{selected.cliente}</div>
                  )}
                </div>

                <div>
                  <b>Data:</b>{" "}
                  <div className={inputClass}>
                    {new Date(selected.data).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* DESTRA: Motivo + Stato */}
              <div className="space-y-3">
                <div>
                  <b>Motivo:</b>{" "}
                  {isEditing ? (
                    <input
                      className={inputClass}
                      value={editValues.motivo}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          motivo: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className={inputClass}>{selected.motivo}</div>
                  )}
                </div>

                <div>
                  <b>Stato:</b>{" "}
                  {isEditing ? (
                    <input
                      className={inputClass}
                      value={editValues.stato}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          stato: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className={inputClass}>{selected.stato}</div>
                  )}
                </div>
              </div>
            </div>

            <hr className="my-4 border-white/70" />

            {/* PRODOTTO RESO (modificabile quando isEditing) */}
            <div className="mt-2">
              <h3 className="font-semibold mb-2">Prodotto reso</h3>

              {isEditing && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <select
                    className={selectClass}
                    value={newProductId}
                    onChange={(e) => setNewProductId(e.target.value)}
                  >
                    {productsMock.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                        {p.sku ? ` (${p.sku})` : ""}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={1}
                    className={qtyInputClass}
                    value={newQty}
                    onChange={(e) =>
                      setNewQty(Number(e.target.value) || 1)
                    }
                  />
                </div>
              )}

              {currentProductForCard && (
                <div className="rounded-md border p-3 flex justify-between gap-3">
                  <div className="flex gap-3">
                    {currentProductForCard.img && (
                      <img
                        src={currentProductForCard.img}
                        alt={currentProductForCard.nome}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    )}

                    <div className="text-xs">
                      <div className="font-medium">
                        {currentProductForCard.nome}{" "}
                        {currentProductForCard.sku && (
                          <span className="text-[10px] text-gray-500">
                            ({currentProductForCard.sku})
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-600">
                        {currentProductForCard.categoria} •{" "}
                        {currentProductForCard.colore} •{" "}
                        {currentProductForCard.materiale}
                      </div>
                      <div className="text-[10px] text-gray-600">
                        Dimensioni: {currentProductForCard.dimensioni}
                      </div>
                      {currentProductForCard.descrizione && (
                        <p className="text-[10px] mt-1 text-gray-700">
                          {currentProductForCard.descrizione}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="mb-1">
                      <b>Q.tà:</b>{" "}
                      {isEditing ? (
                        <input
                          type="number"
                          min={1}
                          className={qtyInputClass}
                          value={newQty}
                          onChange={(e) =>
                            setNewQty(Number(e.target.value) || 1)
                          }
                        />
                      ) : (
                        <b>{editingQty}</b>
                      )}
                    </div>
                    <div>
                      Prezzo unitario: €{" "}
                      {currentProductForCard.prezzo.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Totale reso */}
            <div className="mt-4 flex justify-between items-center">
              <span className="font-semibold">Totale reso</span>
              <span className="inline-block px-3 py-1 rounded-lg bg-white/10 font-semibold">
                € {getReturnTotal().toFixed(2)}
              </span>
            </div>

            {/* Bottoni come Ordini */}
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={handleEditReturn} className="custom-button">
                Modifica
              </button>

              {isEditing && (
                <button onClick={handleSaveReturn} className="custom-button">
                  Salva
                </button>
              )}

              <button onClick={handleDeleteReturn} className="custom-button">
                Elimina
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Toast uguale agli ordini, in alto al centro */}
      {alert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-9999">
          <div
            className="px-8 py-4 rounded-2xl bg-white/95 shadow-xl border border-[#d9c9ff] text-base text-[#090c64] font-semibold tracking-wide min-w-[320px] text-center">
            {alert.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsPage;