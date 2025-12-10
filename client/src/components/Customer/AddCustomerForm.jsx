//RICORDA DI COMMENTARE IL CODICE

import { useState } from "react";
import Drawer from "../Drawer";

const AddCustomerForm = ({ onAdd }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Stato iniziale con la struttura BACKEND
    const [newCustomer, setNewCustomer] = useState({
        email: "",
        firstName: "",
        lastName: "",
        location: {
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
        },
        birthDate: "",
        fiscalCode: "",
        phoneNumber: "",
        affiliateProgram: {
        "name": "standard"
    }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Gestione campi annidati (location)
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setNewCustomer(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setNewCustomer(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Il backend assegnerà automaticamente _id e createdAt
        onAdd(newCustomer);

        // Reset form
        setIsOpen(false);
        setNewCustomer({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            fiscalCode: "",
            birthDate: "",
            location: {
                address: "",
                city: "",
                state: "",
                zipCode: "",
                country: "Italia"
            }
        });
    };

    return (
        <>
            {/* Bottone che apre il drawer */}
            <button
                onClick={() => setIsOpen(true)}
                className="px-3 py-2 bg-[#090c64] font-bold border border-white rounded-xl shadow-sm text-sm text-white cursor-pointer transition"
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

                        {/* 🔹 Nome (firstName) */}
                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Nome*</label>
                            <input
                                name="firstName"
                                type="text"
                                value={newCustomer.firstName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>

                        {/* 🔹 Cognome (lastName) */}
                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Cognome*</label>
                            <input 
                                name="lastName" 
                                value={newCustomer.lastName} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required 
                            />
                        </div>

                        {/* 🔹 Email */}
                        <div className="col-span-2">
                            <label className="text-sm text-[#090c64] block mb-1">Email*</label>
                            <input 
                                name="email" 
                                type="email" 
                                value={newCustomer.email} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required 
                            />
                        </div>

                        {/* 🔹 Telefono (phoneNumber) */}
                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Telefono*</label>
                            <input 
                                name="phoneNumber" 
                                value={newCustomer.phoneNumber} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required 
                            />
                        </div>

                        {/* 🔹 Codice Fiscale (fiscalCode) */}
                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Codice Fiscale*</label>
                            <input 
                                name="fiscalCode" 
                                value={newCustomer.fiscalCode} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required 
                            />
                        </div>

                        {/* 🔹 Data di nascita (birthDate) */}
                        <div className="col-span-2">
                            <label className="text-sm text-[#090c64] block mb-1">Data di nascita*</label>
                            <input 
                                name="birthDate" 
                                type="date" 
                                value={newCustomer.birthDate} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required 
                            />
                        </div>

                        {/* 🔹 Indirizzo (location.address) */}
                        <div className="col-span-2">
                            <label className="text-sm text-[#090c64] block mb-1">Indirizzo*</label>
                            <input 
                                name="location.address" 
                                value={newCustomer.location.address} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required 
                            />
                        </div>

                        {/* 🔹 Città (location.city) */}
                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Città*</label>
                            <input 
                                name="location.city" 
                                value={newCustomer.location.city} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required 
                            />
                        </div>

                        {/* 🔹 Provincia (location.state) */}
                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Provincia*</label>
                            <input 
                                name="location.state" 
                                value={newCustomer.location.state} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required 
                            />
                        </div>

                        {/* 🔹 CAP (location.zipCode) */}
                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">CAP*</label>
                            <input 
                                name="location.zipCode" 
                                value={newCustomer.location.zipCode} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required 
                            />
                        </div>

                        {/* 🔹 Paese (location.country) */}
                        <div>
                            <label className="text-sm text-[#090c64] block mb-1">Paese*</label>
                            <input 
                                name="location.country" 
                                value={newCustomer.location.country} 
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required 
                            />
                        </div>

                    </div>

                    {/* Informazione sul programma fedeltà */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <strong>Nota:</strong> Il programma fedeltà verrà assegnato automaticamente dopo la creazione del cliente.
                        </p>
                    </div>

                    {/* Footer bottoni */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button 
                            type="button" 
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
                        >
                            Annulla
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-[#090c64] text-white rounded-xl hover:bg-[#1a1f8c] transition"
                        >
                            Salva Cliente
                        </button>
                    </div>
                </form>

            </Drawer>
        </>
    );
};

export default AddCustomerForm;