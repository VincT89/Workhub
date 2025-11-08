import React from "react";
import bgImage from "../assets/bg/bg.jpg";

//import del grafico da React Pie Charts -> Link in caso serva : https://mui.com/x/react-charts/highlighting/#highlighting-series
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

//tutte le icone 
import openIcon from "../assets/icons/Open Envelope Clock.png";
import checkIcon from "../assets/icons/Instagram Check Mark.png";
import pendingIcon from "../assets/icons/Data Pending.png";
import errorIcon from "../assets/icons/Error.png";
import reportIcon from "../assets/icons/Report File.png";
import listIcon from "../assets/icons/List.png";
import personalIcon from "../assets/icons/Test Passed.png";
import webUsageState from "../store/webUsageState";



const TicketPage = () => {

    const [highlightedItem, setHighLightedItem] = React.useState(null);

    return (
        <main className="bg-white w-full min-h-screen relative overflow-hidden">
            {/* Background */}
            <img
                className="absolute top-0 left-0 w-full h-full object-cover"
                alt="Background gradient"
                src={bgImage}
            />

            {/* Overlay effetto vetro che contiene i miei elemnti */}
            <div className="absolute top-[5%] left-[10%] w-[80%] h-[90%] bg-[#fafafa20] backdrop-blur-sm rounded-[25px] border border-solid shadow-lg border-neutral-50/30 p-6">


                {/* HEADER - Statistiche principali: Ticket Aperti, test-passedTicket Risolti, test-passedTicket in attesa, test-passedTicket urgenti*/}
                <section className=" grid grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow">
                        <span className="flex items-center gap-2 font-semibold text-blue-900">
                            <img src={openIcon} alt="ticket aperti" className="w-5 h-5 object-contain" />
                            Ticket Aperti
                        </span>
                        <span className="font-bold text-lg text-blue-800">0</span>
                    </div>

                    <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow">
                        <span className="flex items-center gap-2 font-semibold text-blue-900">
                            <img src={checkIcon} alt="check icon" className="w-5 h-5 object-contain" />
                            Ticket Risolti
                        </span>
                        <span className="font-bold text-lg text-blue-800">11</span>
                    </div>

                    <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow">
                        <span className="flex items-center gap-2 font-semibold text-blue-900">
                            <img src={pendingIcon} alt="pending icon" className="w-5 h-5 object-contain" />
                            Ticket in attesa
                        </span>
                        <span className="font-bold text-lg text-blue-800">22</span>
                    </div>

                    <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow">
                        <span className="flex items-center gap-2 font-semibold text-blue-900">
                            <img src={errorIcon} alt="error icon" className="w-5 h-5 object-contain" />
                            Ticket urgenti
                        </span>
                        <span className="font-bold text-lg text-blue-800">3</span>
                    </div>
                </section>
                <div className="flex flex-col items-center justify-center w-full h-full">

                    {/* CONTENUTO PRINCIPALE: report Ticket(con futuro grafico), ticket recenti, risposte persdonali*/}

                    <section className="grid grid-cols-3 gap-6 h-[70%]">
                        {/* Grafico Report Ticket */}
                        <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 flex flex-col">
                            <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <img src={reportIcon} alt="report icon" className="w-5 h-5 object-contain" />
                                Report Ticket
                            </h2>
                            <div className="flex-1 flex items-center justify-center">

                                {/* GRAFICO />*/}
                                <div className=" flex-1 flex items-center justify-center">
                                    <PieChart
                                        {...webUsageState}
                                        highlightedItem={highlightedItem}
                                        onHighlightChange={setHighLightedItem}
                                        width={320}
                                        height={320}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ticket Recenti */}
                        <div className="col-span-2 grid grid-rows-2 gap-4">
                            <div className="bg-white/60 rounded-xl shadow p-4 h-64 overflow-y-auto overflow-hidden
                            [::-webkit-scrollbar]:w-[30px]
                            scrollbar-thumb-[#134a7b]/60
                            scrollbar-thumb-rounded-full
                            hover:scrollbar-thumb-[#134a7b]/80
                            transition
                            space-y-2 pr-2
                            [scrollbar-color:#134a7b60_transparent]">
                                <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                    <img src={listIcon} alt="list icon" className="w-5 h-5 object-contain" />

                                    Ticket Recenti
                                </h2>

                                {/*     per il momento provo a riempire con piccole sezioni */}

                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>


                                {/* se non ho niente nelle rispodte, di default possiamo lasciarlo cosi, con mex: Nessun..... ? 

                                    QUESTO ELEMENTO E CREATO STATICO SOLO PER ME O IN CASO VOGLIO DARE QUESTA RISPOSTA DEFAUL

                                    <div className="h-full flex items-center justify-center text-gray-500">
                                     Nessun ticket recente
                                    </div>
                                */}

                            </div>

                            {/* Risposte Personale */}
                            <div className="bg-white/60 rounded-xl shadow p-4 h-64 overflow-y-auto overflow-hidden
                            [::-webkit-scrollbar]:w-[30px]
                            scrollbar-thumb-[#134a7b]/60
                            scrollbar-thumb-rounded-full
                            hover:scrollbar-thumb-[#134a7b]/80
                            transition
                            space-y-2 pr-2
                            [scrollbar-color:#134a7b60_transparent]">
                                <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                    <img src={personalIcon} alt="persona icon" className="w-5 h-5 object-contain" />

                                    Risposte personale
                                </h2>

                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>
                                <div className="col-span-1 bg-white/60 rounded-xl shadow p-4 mb-3 flex flex-col">Prova</div>


                                {/* se non ho niente nelle rispodte, di default possiamo lasciarlo cosi, con mex: Nessun..... ? 

                                    QUESTO ELEMENTO E CREATO STATICO SOLO PER ME O IN CASO VOGLIO DARE QUESTA RISPOSTA DEFAUL
                                    
                                    <div className="h-full flex items-center justify-center text-gray-500">
                                     Nessun ticket recente
                                    </div>
                                */}
                            </div>

                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default TicketPage;
