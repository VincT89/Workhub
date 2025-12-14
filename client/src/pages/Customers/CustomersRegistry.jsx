//RICORDA DI COMMENTARE IL CODICE




import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setActiveTab } from "../../store/feature/tabSlice.js";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext.jsx";
import Table from "../../components/Table";
import {
    UserListIcon,
    ShoppingBagIcon,
    ArrowCounterClockwiseIcon,
    IdentificationBadgeIcon,
    PencilSimpleIcon,
    FloppyDiskIcon,
    XCircleIcon,
    FileXlsIcon
} from "@phosphor-icons/react";
import { 
    fetchCustomerByIdAsync, 
    updateCustomerAsync,
    clearSelected,
    clearError
} from "../../store/feature/customerSlice";

import * as XLSX from "xlsx"; // <-- !! import della libreria 'xlsx' !! per far si che venga generato il file excel nelle sezioni di ordini e affiliazione del dettaglio del singolo customer bisogna installare questa libreria

const CustomersRegistry = () => {
    const { id } = useParams(); // useParams() estrae i parametri dall'URL (es: /customer/123 → id = "123")
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { theme } = useTheme(); // Prende il tema corrente (dark o light) dal contesto ThemeContext
    const { t } = useLanguage(); // Prende la lingua corrente (it o en) dal contesto LanguageContext
    
    // useSelector() legge i dati dallo stato Redux
    // selected: customer selezionato, loading: stato caricamento, error: eventuali errori
    const { selected: customer, loading, error } = useSelector(state => state.customers);
    const token = useSelector(state => state.auth?.token) || localStorage.getItem('token'); //Prende il JWT dallo stato auth o dal localStorage
    const activeTab = useSelector((state) => state.tab.activeTab); //legge il tab attivo dallo stato di redux

    const [isEditing, setIsEditing] = useState(false); //gestisce la modifica di customer
    const [editedCustomer, setEditedCustomer] = useState(null); //copia della modifica del customer 
    const [saving, setSaving] = useState(false); //salva le modifiche

    // ================== FUNZIONE CHE GENERA L'EXCEL ==================
    const exportAffiliateToExcel = () => {
        if (!customer || !customer.affiliateProgram) return;

        // CREO I DATI DA ESPORTARE
        const data = [
            {
                "Livello Tessera": customer.affiliateProgram.name || "Nessuno",
                "Punti Accumulati": customer.affiliateProgram.points || 0,
                "Numero Tessera": customer.affiliateProgram.cardNumber || "N/D",
                "Programma Fedeltà": "Attivo"
            }
        ];

        // CREO IL WORKSHEET E WORKBOOK
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Affiliazione");

        // GENERO IL FILE
        XLSX.writeFile(workbook, `Affiliazione_${customer.firstName}_${customer.lastName}.xlsx`);
    };
    // ==================================================================

    // Carica il customer quando il componente viene montato
    useEffect(() => {
        if (id && token) { // Se abbiamo un id e un token valido, carica i dati del customer
            dispatch(fetchCustomerByIdAsync({ id, token }));
        }
        
        // Cleanup quando il componente si smonta
        return () => {
            dispatch(clearSelected());  // Pulisce il customer selezionato dallo stato
        };
    }, [dispatch, id, token]); // Dipendenze: quando queste cambiano, l'effect si ri-esegue

    // Aggiorna editedCustomer quando customer cambia
    useEffect(() => {
        if (customer) {
            setEditedCustomer(customer);
        }
    }, [customer]);

    // Gestione campi del form durante la modifica
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Gestione campi annidati (location.address, etc.)
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setEditedCustomer(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setEditedCustomer(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEdit = () => setIsEditing(true);
    
    const handleCancel = () => {
        setEditedCustomer(customer);
        setIsEditing(false);
    };
    
    const handleSave = async () => {
        if (!token || !id) return;
        
        try {
            setSaving(true);
            
            await dispatch(updateCustomerAsync({ 
                id, 
                updates: editedCustomer, 
                token 
            })).unwrap();
            
            setIsEditing(false);
        } catch (err) {
            console.error("Errore aggiornamento customer:", err);
        } finally {
            setSaving(false);
        }
    };

    // Gestione errori
    useEffect(() => {
        if (error) {
            console.error("Errore customer:", error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const stats = [
        { label: t("anagrafica"), icon: UserListIcon },
        { label: t("ordini"), icon: ShoppingBagIcon },
        { label: t("affiliazione"), icon: IdentificationBadgeIcon },
    ];

    // PER ORA lasciamo array vuoti 
    const ordiniFittizi = [];

    if (loading) {
        return (
            <div className="w-full min-h-screen flex justify-center items-start p-8">
                <div>{t("caricamentoClienti")}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex justify-center items-start p-8">
                <div className="text-red-600">Errore: {error}</div>
                <button 
                    onClick={() => navigate('/customers')}
                    className="ml-4 px-4 py-2 bg-[#090c64] text-white rounded"
                >
                    {t("tornaAllaLista")}
                </button>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="w-full min-h-screen flex justify-center items-start p-8">
                <div>{t("clienteNonTrovato")}</div>
                <button 
                    onClick={() => navigate('/customers')}
                    className="ml-4 px-4 py-2 bg-[#090c64] text-white rounded"
                >
                    {t("tornaAllaLista")}
                </button>
            </div>
        );
    }

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
                                ? "bg-white text-[#090c64] font-semibold"
                                : "bg-white/40 hover:bg-white/70"
                                }`}>
                            <item.icon size={22}  weight="duotone" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* CONTENUTO */}
                <div className="w-full rounded-xl bg-white/20 backdrop-blur-sm p-6 shadow-md border border-white">
                    <h2 className="text-[#134a7b] text-lg font-bold mb-6">
                        {t("cliente")} : {customer.firstName} {customer.lastName}
                    </h2>

                    {/* ------------------------ ANAGRAFICA ------------------------ */}
                    {activeTab === t("anagrafica") && editedCustomer && (
                        <div className="flex flex-col gap-3">

                            {/* HEADER */}
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-[#134a7b] font-semibold">{t("anagrafica")}</h3>

                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center gap-1 text-sm px-3 py-1 bg-white/30 rounded-xl border border-white shadow-sm hover:bg-white transition"
                                    >
                                        <PencilSimpleIcon size={22} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" /> {t("modifica")}
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center gap-1 text-sm px-3 py-1 bg-green-200 rounded-xl border border-white shadow-sm hover:bg-green-300 transition disabled:opacity-50"
                                        >
                                            <FloppyDiskIcon size={22} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" /> 
                                            {saving ? 'Salvando...' : 'Salva'}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center gap-1 text-sm px-3 py-1 bg-red-200 rounded-xl border border-white shadow-sm hover:bg-red-300 transition"
                                        >
                                            <XCircleIcon size={22} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" /> Annulla
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* -------------------- CAMPi BACKEND -------------------- */}
                            <div className="grid grid-cols-2 gap-3">

                                {/* First Name */}
                                <div className="bg-white/20 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={editedCustomer.firstName || ''}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                            placeholder="Nome"
                                        />
                                    ) : (
                                        <span>{customer.firstName}</span>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="bg-white/20 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={editedCustomer.lastName || ''}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                            placeholder="Cognome"
                                        />
                                    ) : (
                                        <span>{customer.lastName}</span>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="bg-white/20 p-3 rounded-xl shadow-sm col-span-2">
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editedCustomer.email || ''}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                            placeholder="Email"
                                        />
                                    ) : (
                                        <span>{customer.email}</span>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="bg-white/20 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={editedCustomer.phoneNumber || ''}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                            placeholder="Telefono"
                                        />
                                    ) : (
                                        <span>{customer.phoneNumber}</span>
                                    )}
                                </div>

                                {/* Fiscal Code */}
                                <div className="bg-white/20 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="fiscalCode"
                                            value={editedCustomer.fiscalCode || ''}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                            placeholder="Codice Fiscale"
                                        />
                                    ) : (
                                        <span>{customer.fiscalCode}</span>
                                    )}
                                </div>

                                {/* Birth Date */}
                                <div className="bg-white/20 p-3 rounded-xl shadow-sm col-span-2">
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={editedCustomer.birthDate ? editedCustomer.birthDate.split('T')[0] : ''}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                        />
                                    ) : (
                                        <span>{customer.birthDate ? customer.birthDate.split('T')[0] : ''}</span>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="bg-white/20 p-3 rounded-xl shadow-sm col-span-2">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location.address"
                                            value={editedCustomer.location?.address || ''}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                            placeholder="Indirizzo"
                                        />
                                    ) : (
                                        <span>{customer.location?.address || 'N/D'}</span>
                                    )}
                                </div>

                                {/* City */}
                                <div className="bg-white/20 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location.city"
                                            value={editedCustomer.location?.city || ''}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                            placeholder="Città"
                                        />
                                    ) : (
                                        <span>{customer.location?.city || 'N/D'}</span>
                                    )}
                                </div>

                                {/* State */}
                                <div className="bg-white/20 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location.state"
                                            value={editedCustomer.location?.state || ''}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                            placeholder="Provincia"
                                        />
                                    ) : (
                                        <span>{customer.location?.state || 'N/D'}</span>
                                    )}
                                </div>

                                {/* ZIP Code */}
                                <div className="bg-white/20 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location.zipCode"
                                            value={editedCustomer.location?.zipCode || ''}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                            placeholder="CAP"
                                        />
                                    ) : (
                                        <span>{customer.location?.zipCode || 'N/D'}</span>
                                    )}
                                </div>

                                {/* Country */}
                                <div className="bg-white/20 p-3 rounded-xl shadow-sm">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location.country"
                                            value={editedCustomer.location?.country || ''}
                                            onChange={handleChange}
                                            className="bg-transparent outline-none w-full"
                                            placeholder="Paese"
                                        />
                                    ) : (
                                        <span>{customer.location?.country || 'N/D'}</span>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}

                    {/* ------------------------ ORDINI ------------------------ */}
                    {activeTab === t("ordini") && (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-[#134a7b] font-semibold text-left">{t("storicoOrdini")}</h3>
                                <button className="flex items-center gap-1 font-bold text-sm px-3 py-1 bg-white/30 rounded-xl border border-white shadow-sm hover:bg-white transition">
                                    <FileXlsIcon size={22} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" /> Excel
                                </button>
                            </div>
                            {ordiniFittizi.length > 0 ? (
                                <Table data={ordiniFittizi} columns={Object.keys(ordiniFittizi[0])} />
                            ) : (
                                <div className="bg-white/20 p-4 rounded-xl text-center">
                                    <p className="font-bold">{t("nessunOrdineTrovato")}</p>
                                </div>
                            )}
                        </div>
                    )}

                    
                    {/* ------------------------ AFFILIAZIONE ------------------------ */}
                    {activeTab === t("affiliazione") && customer.affiliateProgram && (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-[#134a7b] font-semibold">{t("affiliazione")}</h3>

                                {/* ========= BOTTONE EXCEL CHE USA LA FUNZIONE AGGIUNTA ========= */}
                                <button
                                    onClick={exportAffiliateToExcel}
                                    className="flex items-center gap-1 font-bold text-sm px-3 py-1 bg-white/30 rounded-xl border border-white shadow-sm hover:bg-white transition">
                                    <FileXlsIcon size={22} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" /> Excel
                                </button>
                                {/* ================================================================= */}
                            </div>

                            <div className="bg-white/20 p-3 rounded-xl shadow-sm">
                                <strong>{t("livelloTessera")}:</strong> {customer.affiliateProgram.name}
                            </div>

                            <div className="bg-white/20 p-3 rounded-xl shadow-sm">
                                <strong>{t("puntiAccumulati")}:</strong> {customer.affiliateProgram.points}
                            </div>

                            <div className="bg-white/20 p-3 rounded-xl shadow-sm">
                                <strong>{t("numeroTessera")}:</strong> {customer.affiliateProgram.cardNumber}
                            </div>

                            <div className="bg-white/20 p-3 rounded-xl shadow-sm">
                                <strong>{t("programmaFedelta")}:</strong> {t("attivo")}
                            </div>
                        </div>
                    )}

                    {/* Messaggio se non c'è programma fedeltà */}
                    {activeTab === t("affiliazione") && !customer.affiliateProgram && (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-[#134a7b] font-semibold">{t("affiliazione")}</h3>
                            </div>
                            <div className="bg-white/20 p-4 rounded-xl text-center">
                                <p className="font-bold">{t("nessunProgrammaFedeltaAttivo")}</p>
                                <p className="text-sm">{t("clienteNonIscrittoProgrammaFedelta")}</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CustomersRegistry;