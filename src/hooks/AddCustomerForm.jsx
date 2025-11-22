import { useState } from "react";
import Drawer from "../components/Drawer"; // punta al path corretto

const AddCustomerForm = ({ onAdd }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [newCustomer, setNewCustomer] = useState({
        id: "",
        nome: "",
        indirizzo: "",
        citta: "",
        cap: "",
        provincia: "",
        email: "",
        telefono: "",
        nascita: "",
        CF: "",
        livello: "Standard",
        punti: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...newCustomer,
            id: Number(newCustomer.id),
            punti: Number(newCustomer.punti || 0),
        });

        setIsOpen(false);
        setNewCustomer({
            id: "",
            nome: "",
            indirizzo: "",
            citta: "",
            cap: "",
            provincia: "",
            email: "",
            telefono: "",
            nascita: "",
            CF: "",
            livello: "Standard",
            punti: ""
        });
    };

    return (
        <>
            {/* Bottone che apre il drawer */}
            <button
                onClick={() => setIsOpen(true)}
                className="px-3 py-2 bg-[#f4ecff] border border-white rounded-full shadow-sm text-sm text-[#090c64] hover:bg-bg-[#f4ecff] transition"
            >
                ➕ Aggiungi Cliente
            </button>

            {/* Drawer */}
            <Drawer
                open={isOpen}
                onClose={() => setIsOpen(false)}
                title="Aggiungi nuovo cliente"
                width="w-[540px]"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Griglia 2 colonne */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* 🔹 ID come PRIMO INPUT */}
                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">ID</label>
                            <input
                                name="id"
                                type="number"
                                value={newCustomer.id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Nome</label>
                            <input name="nome" value={newCustomer.nome} onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Indirizzo</label>
                            <input name="indirizzo" value={newCustomer.indirizzo} onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Città</label>
                            <input name="citta" value={newCustomer.citta} onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">CAP</label>
                            <input name="cap" value={newCustomer.cap} onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Provincia</label>
                            <input name="provincia" value={newCustomer.provincia} onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Email</label>
                            <input name="email" value={newCustomer.email} onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Telefono</label>
                            <input name="telefono" value={newCustomer.telefono} onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Data di nascita</label>
                            <input name="nascita" type="text" value={newCustomer.nascita} onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Codice Fiscale</label>
                            <input name="CF" value={newCustomer.CF} onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg" />
                        </div>

                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Livello</label>
                            <select name="livello" value={newCustomer.livello} onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg">
                                <option value="Standard">Standard</option>
                                <option value="Premium">Premium</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Punti</label>
                            <input name="punti" type="number" value={newCustomer.punti} onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg" />
                        </div>

                    </div>

                    {/* Footer bottoni */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                            Annulla
                        </button>
                        <button type="submit"
                            className="px-4 py-2 bg-[#090c64] text-white rounded ">
                            Salva Cliente
                        </button>
                    </div>
                </form>

            </Drawer>
        </>
    );
};

export default AddCustomerForm;