import { useState } from "react";

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
        setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...newCustomer,
            id: Date.now(), // ID univoco al volo
            punti: Number(newCustomer.punti),
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
        <div>
            {/* BUTTON TOOL */}
            <button
                onClick={() => setIsOpen(true)}
                className="px-3 py-2 bg-green-200 border border-white rounded-full shadow-sm text-sm hover:bg-green-300 transition"
            >
                ➕ Aggiungi Cliente
            </button>

            {/* POPUP / MODAL */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4 text-[#134a7b]">
                            Nuovo Cliente
                        </h3>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                            {Object.keys(newCustomer).map((key) => {
                                if (key === "id") return null;

                                return (
                                    <div key={key} className="grid grid-cols-2">
                                        <label className="text-sm text-[#134a7b] capitalize">
                                            {key}
                                        </label>

                                        <input
                                            type={key === "nascita" ? "date" : "text"}
                                            name={key}
                                            value={newCustomer[key]}
                                            onChange={handleChange}
                                            className="px-3 py-2 border rounded-lg bg-gray-50"
                                        />
                                    </div>
                                );
                            })}

                            {/* SELECT LIVELLO */}
                            <label className="text-sm text-[#134a7b]">Livello</label>
                            <select
                                name="livello"
                                value={newCustomer.livello}
                                onChange={handleChange}
                                className="px-3 py-2 border rounded-lg bg-gray-50"
                            >
                                <option value="Standard">Standard</option>
                                <option value="Premium">Premium</option>
                            </select>

                            {/* BUTTONS */}
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-3 py-2 bg-red-200 rounded-lg hover:bg-red-300"
                                >
                                    Annulla
                                </button>

                                <button
                                    type="submit"
                                    className="px-3 py-2 bg-green-200 rounded-lg hover:bg-green-300"
                                >
                                    Salva
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddCustomerForm;
