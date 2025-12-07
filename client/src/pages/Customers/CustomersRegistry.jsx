import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { setActiveTab } from "../../store/feature/tabSlice.js";
import Table from "../../components/Table";
import {
    UserList,
    ShoppingBag,
    ArrowCounterClockwise,
    IdentificationBadge,
    PencilSimple,
    FloppyDisk,
    XCircle,
    FileXls
} from "@phosphor-icons/react";

const CustomersRegistry = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const customer = location.state;
    const activeTab = useSelector((state) => state.tab.activeTab);

    const [isEditing, setIsEditing] = useState(false);
    const [editedCustomer, setEditedCustomer] = useState(customer);

    const stats = [
        { label: "Anagrafica", icon: UserList },
        { label: "Ordini", icon: ShoppingBag },
        { label: "Resi", icon: ArrowCounterClockwise },
        { label: "Affiliazione", icon: IdentificationBadge },
    ];

    // ORDINI FITTIZI
    const ordiniFittizi = [
        {
            id: 1,
            prodotto: "LACK Tavolino",
            dataOrdine: "2025-01-12",
            categoria: "Soggiorno",
            quantita: 1,
            prezzo: 9.99,
            totale: 9.99,
            stato: "Consegnato",
            metodoPagamento: "Carta di credito",
            codiceTracking: "IK000987654",
        },
        {
            id: 2,
            prodotto: "BILLY Libreria",
            dataOrdine: "2025-02-03",
            categoria: "Ufficio",
            quantita: 2,
            prezzo: 39.99,
            totale: 79.98,
            stato: "In transito",
            metodoPagamento: "PayPal",
            codiceTracking: "IK001123789",
        },
        {
            id: 3,
            prodotto: "MALM Cassettiera",
            dataOrdine: "2025-02-20",
            categoria: "Camera",
            quantita: 1,
            prezzo: 79.99,
            totale: 79.99,
            stato: "Preparazione",
            metodoPagamento: "Carta di credito",
            codiceTracking: "IK001998321",
        },
        {
            id: 4,
            prodotto: "POÄNG Poltrona",
            dataOrdine: "2025-03-01",
            categoria: "Soggiorno",
            quantita: 1,
            prezzo: 69.99,
            totale: 69.99,
            stato: "Consegnato",
            metodoPagamento: "Bonifico",
            codiceTracking: "IK002112455",
        },
        {
            id: 5,
            prodotto: "HEMNES Comodino",
            dataOrdine: "2025-03-15",
            categoria: "Camera",
            quantita: 1,
            prezzo: 49.99,
            totale: 49.99,
            stato: "In transito",
            metodoPagamento: "Carta di credito",
            codiceTracking: "IK002778900",
        },
    ];

    // RESI FITTIZI
    const resiFittizi = [
        {
            id: 1,
            prodotto: "MALM Cassettiera",
            dataReso: "2025-03-02",
            categoria: "Camera",
            quantita: 1,
            motivoReso: "Pezzo mancante nel kit",
            statoReso: "Accettato",
            rimborso: 79.99,
            metodoPagamento: "PayPal",
            codiceTrackingReso: "IKR001234567",
        },
        {
            id: 2,
            prodotto: "LACK Tavolino",
            dataReso: "2025-02-18",
            categoria: "Soggiorno",
            quantita: 1,
            motivoReso: "Colore diverso da quanto atteso",
            statoReso: "In elaborazione",
            rimborso: 9.99,
            metodoPagamento: "Carta di credito",
            codiceTrackingReso: "IKR000456789",
        },
    ];

    // Gestione campi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setEditedCustomer(customer);
        setIsEditing(false);
    };
    const handleSave = () => {
        console.log("Dati salvati:", editedCustomer);
        setIsEditing(false);
    };

    return (
        <div className="w-full min-h-screen flex justify-center items-start p-8">
            <div className="flex flex-col items-center gap-6 p-6 rounded-xl">

                {/* NAVBAR */}
                <div className="flex items-center gap-4">
                    {stats.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => dispatch(setActiveTab(item.label))}
                            className={`flex items-center gap-2 rounded-xl p-2 shadow-md border border-white transition duration-200 cursor-pointer ${activeTab === item.label
                                ? "bg-white text-[#134a7b] font-semibold"
                                : "bg-white/40 hover:bg-white/70"
                                }`}>
                            <item.icon size={22} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* CONTENUTO */}
                <div className="w-full rounded-xl bg-white/20 backdrop-blur-sm p-6 shadow-md border border-white">
                    <h2 className="text-[#134a7b] text-lg font-bold mb-6">
                        Cliente: {customer.nome} {customer.cognome}
                    </h2>

                    {/* ------------------------ ANAGRAFICA ------------------------ */}
                    {activeTab === "Anagrafica" && (
                        <div className="flex flex-col gap-3">

                            {/* HEADER */}
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-[#134a7b] font-semibold">Anagrafica</h3>

                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center gap-1 text-sm px-3 py-1 bg-white/70 rounded-xl border border-white shadow-sm hover:bg-white transition"
                                    >
                                        <PencilSimple size={22} color="#090c64" weight="duotone" /> Modifica
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center gap-1 text-sm px-3 py-1 bg-green-200 rounded-xl border border-white shadow-sm hover:bg-green-300 transition"
                                        >
                                            <FloppyDisk size={22} color="#090c64" weight="duotone" /> Salva
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center gap-1 text-sm px-3 py-1 bg-red-200 rounded-xl border border-white shadow-sm hover:bg-red-300 transition"
                                        >
                                            <XCircle size={22} color="#090c64" weight="duotone" /> Annulla
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* -------------------- CAMPi MANUALI -------------------- */}
                            <div className="grid grid-cols-2 gap-3">

                                {/* Nome */}
                                <div className="bg-white/60 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="nome"
                                            value={editedCustomer.nome}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{editedCustomer.nome}</span>
                                    )}
                                </div>

                                {/* Cognome */}
                                <div className="bg-white/60 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="cognome"
                                            value={editedCustomer.cognome}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{editedCustomer.cognome}</span>
                                    )}
                                </div>

                                {/* Indirizzo */}
                                <div className="bg-white/60 p-3 rounded-xl shadow-sm col-span-2">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="indirizzo"
                                            value={editedCustomer.indirizzo}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{editedCustomer.indirizzo}</span>
                                    )}
                                </div>

                                {/* Città */}
                                <div className="bg-white/60 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="citta"
                                            value={editedCustomer.citta}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{editedCustomer.citta}</span>
                                    )}
                                </div>

                                {/* Provincia */}
                                <div className="bg-white/60 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="provincia"
                                            value={editedCustomer.provincia}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{editedCustomer.provincia}</span>
                                    )}
                                </div>

                                {/* CAP */}
                                <div className="bg-white/60 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="cap"
                                            value={editedCustomer.cap}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{editedCustomer.cap}</span>
                                    )}
                                </div>

                                {/* Paese */}
                                <div className="bg-white/60 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="paese"
                                            value={editedCustomer.paese}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{editedCustomer.paese}</span>
                                    )}
                                </div>

                                {/* Telefono */}
                                <div className="bg-white/60 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="telefono"
                                            value={editedCustomer.telefono}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{editedCustomer.telefono}</span>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="bg-white/60 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editedCustomer.email}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{editedCustomer.email}</span>
                                    )}
                                </div>

                                {/* Nascita */}
                                <div className="bg-white/60 p-3 rounded-xl shadow-sm col-span-2">
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="nascita"
                                            value={editedCustomer.nascita}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{editedCustomer.nascita}</span>
                                    )}
                                </div>

                                {/* Codice fiscale */}
                                <div className="bg-white/60 p-3 rounded-xl shadow-sm col-span-2">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="CF"
                                            value={editedCustomer.CF}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{editedCustomer.CF}</span>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}

                    {/* ------------------------ ORDINI ------------------------ */}
                    {activeTab === "Ordini" && (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-[#134a7b] font-semibold text-left">Storico Ordini</h3>
                                <button className="flex items-center gap-1 text-sm px-3 py-1 bg-white/70 rounded-xl border border-white shadow-sm hover:bg-white transition">
                                    <FileXls size={22} color="#090c64" weight="duotone" /> Excel
                                </button>
                            </div>
                            <Table data={ordiniFittizi} columns={Object.keys(ordiniFittizi[0])} />
                        </div>
                    )}

                    {/* ------------------------ RESI ------------------------ */}
                    {activeTab === "Resi" && (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-[#134a7b] font-semibold text-left">Storico Resi</h3>
                                <button className="flex items-center gap-1 text-sm px-3 py-1 bg-white/70 rounded-xl border border-white shadow-sm hover:bg-white transition">
                                    <FileXls size={22} color="#090c64" weight="duotone" /> Excel
                                </button>
                            </div>
                            <Table data={resiFittizi} columns={Object.keys(resiFittizi[0])} />
                        </div>
                    )}

                    {/* ------------------------ AFFILIAZIONE ------------------------ */}
                    {activeTab === "Affiliazione" && (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-[#134a7b] font-semibold">Affiliazione</h3>
                                <button className="flex items-center gap-1 text-sm px-3 py-1 bg-white/70 rounded-xl border border-white shadow-sm hover:bg-white transition">
                                    <FileXls size={22} color="#090c64" weight="duotone" /> Excel
                                </button>
                            </div>

                            <div className="bg-white/60 p-3 rounded-xl shadow-sm">
                                Livello tessera: {customer.livello}
                            </div>

                            <div className="bg-white/60 p-3 rounded-xl shadow-sm">
                                Punti: {customer.punti}
                            </div>

                            <div className="bg-white/60 p-3 rounded-xl shadow-sm">
                                Numero tessera: {customer.tessera}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CustomersRegistry;