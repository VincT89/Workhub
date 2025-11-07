import deleteUserIcon from "../assets/icons/Delete User Male.png";
import groupIcon from "../assets/icons/Group.png";
import qualityIcon from "../assets/icons/Quality.png";
import staffIcon from "../assets/icons/Staff.png";

import { useNavigate } from "react-router-dom";

const CustomersPage = () => {

    const navigate = useNavigate();

    const stats = [
        { label: "Clienti Attivi", value: 20, icon: groupIcon },
        { label: "Clienti Inattivi", value: 4, icon: deleteUserIcon },
        { label: "Clienti Premium", value: 12, icon: qualityIcon },
        { label: "Clienti mensili", value: 400, icon: staffIcon },
    ];


    const customers = [
        { nome: "Mario Mario", indirizzo: "Via Roma 12", email: "mariobros@super.com", telefono: "+39 333 1234567", livello: "Standard", punti: 120 },
        { nome: "Luigi Mario", indirizzo: "Via Roma 12", email: "luigibros@super.com", telefono: "+39 333 9876543", livello: "Premium", punti: 530 },
    ];

    // funzione da triggherare al click della riga con i dati di un cliente che riporta alla pagina di anagrafica del suddetto cliente
    const openCustomerDetails = (customer) => {
        navigate("/customer-registry", { state: customer }); // state serve ad immagazzinare i dati presenti nella riga della tabella e a trasportarli alla pagina CustomerRegistry dove navigate riporta l'utente al click del div 
    };

    return (
        <>
            <>
                <div
                    className="w-full min-h-screen flex justify-center items-start p-8 bg-cover bg-center bg-[url('/src/assets/bg/bg.jpg')]"> {/*div principlae con sfondo inserito tramute classi tailwind*/}
                    <div className="flex flex-col items-center gap-6 p-6 rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md border border-white bg-white/30">
                        {/* bottoni con map per non doverli scrivere uno ad uno manualmente. li rende dinamici e crea un button per ogni elemtno dell'array stats*/}
                        <div className="flex items-center gap-4 ">
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


                        {/* tabella fatta di div per garantire la compatibilità con le classi tailwind*/}
                        <div className="rounded-2xl bg-[#fafafa]/10 backdrop-blur-sm p-6 shadow-md flex flex-col gap-4 border border-white bg-white/40">
                            <h2 className="text-[#134a7b] text-lg font-bold">
                                Lista Clienti
                            </h2>

                            {/* header della tabella */}
                            <div className="grid grid-cols-6 font-bold text-[#134a7b] text-sm px-3">
                                <span>Nome completo</span>
                                <span>Indirizzo</span>
                                <span>Email</span>
                                <span>Telefono</span>
                                <span>Livello</span>
                                <span>Saldo Punti</span>
                            </div>

                            {/* lista dei clienti con map per non doverli scrivere uno ad uno manualmente. li rende dinamici e crea un div per ogni elemtno dell'array customers*/}
                            <div className="flex flex-col gap-3">
                                {customers.map((c, i) => (
                                    <div
                                        key={i}
                                        onClick={() => openCustomerDetails(c)}
                                        className="grid grid-cols-6 bg-white/80 p-3 rounded-full shadow-md cursor-pointer hover:bg-white/100 transition"
                                    >
                                        <span>{c.nome}</span>
                                        <span>{c.indirizzo}</span>
                                        <span className="truncate whitespace-nowrap overflow-hidden mr-3">{c.email}</span> {/* queste classi tailwind servono a troncare i dati troppo lunghi in caso di necessità per evitare che ci sia overflow sugli altri spazi della tabella*/}
                                        <span className="truncate whitespace-nowrap overflow-hidden">{c.telefono}</span>
                                        <span>{c.livello}</span>
                                        <span>{c.punti}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </>

        </>
    )
}

export default CustomersPage;