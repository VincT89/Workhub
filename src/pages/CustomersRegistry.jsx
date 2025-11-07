import { useLocation } from "react-router-dom";

import deleteUserIcon from "../assets/icons/Delete User Male.png";
import groupIcon from "../assets/icons/Group.png";
import qualityIcon from "../assets/icons/Quality.png";
import staffIcon from "../assets/icons/Staff.png";

const CustomersRegistry = () => {
    const location = useLocation(); //useLocation() è una hook che ci fa accedere alla location corrente, cioè a tutte le info presenti sul percorso in cui ci troviamo
    //con questa hook possiamo leggere i dati che ci sono stati passati da CustomersPage.jsx
    const customer = location.state; //i dati passati da CustomersPage.jsx sono salvati dentro location.state, che è una proprietà dell'oggetto location che contiene suddetti dati che ci sono stati inviati tramite navigate (vedi riga 29 nel componente CustomersPage.jsx)

    const stats = [
        { label: "Clienti Attivi", value: 20, icon: groupIcon },
        { label: "Clienti Inattivi", value: 4, icon: deleteUserIcon },
        { label: "Clienti Premium", value: 12, icon: qualityIcon },
        { label: "Clienti mensili", value: 400, icon: staffIcon },
    ];

    return (
        <div className="w-full min-h-screen flex justify-center items-start p-8 bg-cover bg-center bg-[url('/src/assets/bg/bg.jpg')]">
            <div className="flex flex-col items-center gap-6 p-6 rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm shadow-md border border-white bg-white/30">

                {/* bottoni con map per non doverli scrivere uno ad uno manualmente. li rende dinamici e crea un button per ogni elemtno dell'array stats */}
                <div className="flex items-center gap-4">
                    {stats.map((item) => (
                        <button
                            key={item.label}
                            className="flex items-center gap-2 rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-2 shadow-md border border-white transition duration-200 hover:bg-white/70 cursor-pointer bg-white/40"
                        >
                            <img src={item.icon} alt={item.label} className="w-6 h-6" />
                            {item.label}
                            <span className="ml-2 font-semibold">{item.value}</span>
                        </button>
                    ))}
                </div>

                {/* sezione centrale della pagina con le tre tabelle/colonne */}
                <div className="w-full rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md border border-white bg-white/40">
        
                    <h2 className="text-[#134a7b] text-lg font-bold mb-6">
                        Cliente: {customer.nome}
                    </h2>

                    {/* griglia a 3 colonne */}
                    <div className="grid grid-cols-3 gap-6">

                        {/* colonna anagrafica */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-[#134a7b] font-semibold mb-2 text-left">Anagrafica</h3>

                            <div className="bg-white/60 p-3 rounded-full shadow-sm">{customer.nome}</div>
                            <div className="bg-white/60 p-3 rounded-full shadow-sm">{customer.indirizzo}</div>
                            <div className="bg-white/60 p-3 rounded-full shadow-sm">{customer.email}</div>
                            <div className="bg-white/60 p-3 rounded-full shadow-sm">{customer.telefono}</div>
                        </div>

                        {/* colonna storico ordini */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-[#134a7b] text-left font-semibold mb-2">Storico Ordini</h3>

                            <div className="bg-white/60 p-3 rounded-full shadow-sm">Ordine #1</div>
                            <div className="bg-white/60 p-3 rounded-full shadow-sm">Ordine #2</div>
                            <div className="bg-white/60 p-3 rounded-full shadow-sm">Ordine #3</div>
                        </div>

                        {/* colonna card punti */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-[#134a7b] font-semibold mb-2 text-left">Card Punti</h3>

                            <div className="bg-white/60 p-3 rounded-full shadow-sm">Livello: {customer.livello}</div>
                            <div className="bg-white/60 p-3 rounded-full shadow-sm">
                                Punti: {customer.punti}
                            </div>
                            
                        </div>

                    </div>

                    {/* button esportazione PDF */}
                    <div className="w-full flex justify-end mt-6">
                        <button className="px-4 py-2 bg-white/60 rounded-full shadow-sm border border-white hover:bg-white transition cursor-pointer">
                            Esporta PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomersRegistry;
