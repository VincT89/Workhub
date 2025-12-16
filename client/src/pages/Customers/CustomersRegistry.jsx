// RICORDA DI COMMENTARE IL CODICE

import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
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

import * as XLSX from "xlsx";

const CustomersRegistry = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { theme } = useTheme();
    const { t } = useLanguage();

    const { selected: customer, loading, error } = useSelector(state => state.customers);
    const token = useSelector(state => state.auth?.token) || localStorage.getItem("token");

    const [isEditing, setIsEditing] = useState(false);
    const [editedCustomer, setEditedCustomer] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    /* ================== EXCEL AFFILIAZIONE ================== */
    const exportAffiliateToExcel = () => {
        if (!customer || !customer.affiliateProgram) return;

        const data = [{
            "Livello Tessera": customer.affiliateProgram.name || "Nessuno",
            "Punti Accumulati": customer.affiliateProgram.points || 0,
            "Numero Tessera": customer.affiliateProgram.cardNumber || "N/D",
            "Programma Fedeltà": "Attivo"
        }];

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Affiliazione");
        XLSX.writeFile(workbook, `Affiliazione_${customer.firstName}_${customer.lastName}.xlsx`);
    };
    /* ======================================================== */

    /* ================== EXCEL ORDINI ================== */
    const exportOrdersToExcel = () => {
        if (!customer || !customer.orders?.length) return;

        const data = customer.orders.map(order => ({
            "ID Ordine": order._id || "N/D",
            "Prodotto": order.product?.name || "N/D",
            "Quantità": order.quantity || 0,
            "Prezzo": order.price || 0,
            "Data Ordine": order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "N/D"
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ordini");

        XLSX.writeFile(
            workbook,
            `Ordini_${customer.firstName}_${customer.lastName}.xlsx`
        );
    };
    /* ======================================================== */
    useEffect(() => {
        if (id && token) {
            dispatch(fetchCustomerByIdAsync({ id, token }));
        }

        return () => dispatch(clearSelected());
    }, [dispatch, id, token]);

    useEffect(() => {
        if (customer) setEditedCustomer(customer);
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
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

    const handleSave = async () => {
        if (!token || !id) return;

        try {
            setSaving(true);

            const payload = {
                firstName: editedCustomer.firstName,
                lastName: editedCustomer.lastName,
                email: editedCustomer.email,
                phoneNumber: editedCustomer.phoneNumber,
                fiscalCode: editedCustomer.fiscalCode,
                birthDate: editedCustomer.birthDate,
                location: editedCustomer.location
            };

            await dispatch(updateCustomerAsync({
                id,
                updates: payload,
                token
            })).unwrap();

            setIsEditing(false);
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 3000);

        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };



    useEffect(() => {
        if (error) {
            console.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    if (loading) {
        return (
            <div className="w-full min-h-screen flex justify-center items-start p-8">
                {t("caricamentoClienti")}
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="w-full min-h-screen flex justify-center items-start p-8">
                {t("clienteNonTrovato")}
            </div>
        );
    }

    return (
        <div className="w-full h-auto mt-20 flex gap-6 px-8 pb-8">

            {/* ================= SINISTRA — ANAGRAFICA ================= */}
            <div className=" w-1/2 h-auto bg-white/20 p-8 rounded-xl shadow-md border border-white relative">

                {/* FEEDBACK SALVATAGGIO */}

                {showSaved && (
                    <div className="absolute top-3 right-3 bg-green-200 text-green-900 px-4 py-2 rounded-xl shadow-md text-sm">
                        ✔️ {t("modificheSalvate")}
                    </div>
                )}

                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[#134a7b] font-semibold">{t("anagrafica")}</h3>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1 px-3 py-1 bg-white/30 rounded-xl border border-white shadow-sm cursor-pointer"
                        >
                            <PencilSimpleIcon size={20} /> {t("modifica")}
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-1 px-3 py-1 bg-green-200 rounded-xl border border-white shadow-sm disabled:opacity-50 cursor-pointer dark:text-[#090c64]"
                            >
                                <FloppyDiskIcon size={20} /> {t("salva")}
                            </button>
                            <button
                                onClick={() => {
                                    setEditedCustomer(customer);
                                    setIsEditing(false);
                                }}
                                className="flex items-center gap-1 px-3 py-1 bg-red-200 rounded-xl border border-white shadow-sm cursor-pointer dark:text-[#090c64]"
                            >
                                <XCircleIcon size={20} /> {t("annulla")}
                            </button>
                        </div>
                    )}
                </div>

                {/* ================= CAMPI ANAGRAFICA ================= */}
                <div className="grid grid-cols-2 gap-3">

                    {/* Nome */}
                    <div className="bg-white/20 p-3 rounded-xl">
                        {isEditing ? (
                            <input
                                name="firstName"
                                value={editedCustomer.firstName || ""}
                                onChange={handleChange}
                                className="bg-transparent outline-none w-full"
                                placeholder="Nome"
                            />
                        ) : (
                            <span>{customer.firstName}</span>
                        )}
                    </div>

                    {/* Cognome */}
                    <div className="bg-white/20 p-3 rounded-xl">
                        {isEditing ? (
                            <input
                                name="lastName"
                                value={editedCustomer.lastName || ""}
                                onChange={handleChange}
                                className="bg-transparent outline-none w-full"
                                placeholder="Cognome"
                            />
                        ) : (
                            <span>{customer.lastName}</span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="bg-white/20 p-3 rounded-xl col-span-2">
                        {isEditing ? (
                            <input
                                name="email"
                                value={editedCustomer.email || ""}
                                onChange={handleChange}
                                className="bg-transparent outline-none w-full"
                                placeholder="Email"
                            />
                        ) : (
                            <span>{customer.email}</span>
                        )}
                    </div>

                    {/* Telefono */}
                    <div className="bg-white/20 p-3 rounded-xl">
                        {isEditing ? (
                            <input
                                name="phoneNumber"
                                value={editedCustomer.phoneNumber || ""}
                                onChange={handleChange}
                                className="bg-transparent outline-none w-full"
                                placeholder="Telefono"
                            />
                        ) : (
                            <span>{customer.phoneNumber}</span>
                        )}
                    </div>

                    {/* Codice fiscale */}
                    <div className="bg-white/20 p-3 rounded-xl">
                        {isEditing ? (
                            <input
                                name="fiscalCode"
                                value={editedCustomer.fiscalCode || ""}
                                onChange={handleChange}
                                className="bg-transparent outline-none w-full"
                                placeholder="Codice fiscale"
                            />
                        ) : (
                            <span>{customer.fiscalCode}</span>
                        )}
                    </div>

                    {/* Data nascita */}
                    <div className="bg-white/20 p-3 rounded-xl col-span-2">
                        {isEditing ? (
                            <input
                                type="date"
                                name="birthDate"
                                value={
                                    editedCustomer.birthDate
                                        ? editedCustomer.birthDate.split("T")[0]
                                        : ""
                                }
                                onChange={handleChange}
                                className="bg-transparent outline-none w-full"
                            />
                        ) : (
                            <span>
                                {customer.birthDate
                                    ? customer.birthDate.split("T")[0]
                                    : "N/D"}
                            </span>
                        )}
                    </div>

                    {/* Indirizzo */}
                    <div className="bg-white/20 p-3 rounded-xl col-span-2">
                        {isEditing ? (
                            <input
                                name="location.address"
                                value={editedCustomer.location?.address || ""}
                                onChange={handleChange}
                                className="bg-transparent outline-none w-full"
                                placeholder="Indirizzo"
                            />
                        ) : (
                            <span>{customer.location?.address || "N/D"}</span>
                        )}
                    </div>

                    {/* Città */}
                    <div className="bg-white/20 p-3 rounded-xl">
                        {isEditing ? (
                            <input
                                name="location.city"
                                value={editedCustomer.location?.city || ""}
                                onChange={handleChange}
                                className="bg-transparent outline-none w-full"
                                placeholder="Città"
                            />
                        ) : (
                            <span>{customer.location?.city || "N/D"}</span>
                        )}
                    </div>

                    {/* Provincia */}
                    <div className="bg-white/20 p-3 rounded-xl">
                        {isEditing ? (
                            <input
                                name="location.state"
                                value={editedCustomer.location?.state || ""}
                                onChange={handleChange}
                                className="bg-transparent outline-none w-full"
                                placeholder="Provincia"
                            />
                        ) : (
                            <span>{customer.location?.state || "N/D"}</span>
                        )}
                    </div>

                    {/* CAP */}
                    <div className="bg-white/20 p-3 rounded-xl">
                        {isEditing ? (
                            <input
                                name="location.zipCode"
                                value={editedCustomer.location?.zipCode || ""}
                                onChange={handleChange}
                                className="bg-transparent outline-none w-full"
                                placeholder="CAP"
                            />
                        ) : (
                            <span>{customer.location?.zipCode || "N/D"}</span>
                        )}
                    </div>

                    {/* Paese */}
                    <div className="bg-white/20 p-3 rounded-xl">
                        {isEditing ? (
                            <input
                                name="location.country"
                                value={editedCustomer.location?.country || ""}
                                onChange={handleChange}
                                className="bg-transparent outline-none w-full"
                                placeholder="Paese"
                            />
                        ) : (
                            <span>{customer.location?.country || "N/D"}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= DESTRA — ORDINI + AFFILIAZIONE ================= */}
            <div className="w-1/2 flex flex-col gap-6">

                {/* ================= ORDINI ================= */}
                <div className="bg-white/20 p-6 rounded-xl shadow-md border border-white">
                    <div className="flex justify-between mb-3">
                        <h3 className="text-[#134a7b] font-semibold">{t("storicoOrdini")}</h3>
                        <button
                            onClick={exportOrdersToExcel}
                            className="flex items-center gap-1 px-3 py-1 bg-white/30 rounded-xl border border-white cursor-pointer"
                        >
                            <FileXlsIcon size={20} /> Excel
                        </button>

                    </div>

                    {customer.orders?.length ? (
                        customer.orders.map((order, idx) => (
                            <div key={idx} className="bg-white/20 p-3 rounded-xl mb-2">
                                <strong>{t("prodotto")}:</strong> {order.product?.name || "N/D"} <br />
                                <strong>{t("prezzo")}:</strong>{" "}
                                {order.product?.price
                                    ? `${order.product.price} €`
                                    : "N/D"} <br />
                                <strong>{t("quantità")}:</strong> {order.quantity || 0} <br />
                                <strong>{t("puntoVendita")}:</strong>{" "}
                                {order.pointOfSales?.name || "N/D"} <br />
                                <strong>{t("data")}:</strong>{" "}
                                {order.createdAt
                                    ? new Date(order.createdAt).toLocaleDateString()
                                    : "N/D"}
                            </div>
                        ))
                    ) : (
                        <div className="bg-white/20 p-3 rounded-xl text-center">
                            {t("nessunOrdineTrovato")}
                        </div>
                    )}
                </div>

                {/* ================= AFFILIAZIONE ================= */}
                {customer.affiliateProgram && (
                    <div className="bg-white/20 p-6 rounded-xl shadow-md border border-white">
                        <div className="flex justify-between mb-3">
                            <h3 className="text-[#134a7b] font-semibold">{t("affiliazione")}</h3>
                            <button
                                onClick={exportAffiliateToExcel}
                                className="flex items-center gap-1 px-3 py-1 bg-white/30 rounded-xl border border-white cursor-pointer"
                            >
                                <FileXlsIcon size={20} /> Excel
                            </button>
                        </div>

                        <div className="bg-white/20 p-3 rounded-xl">
                            <strong>{t("livelloTessera")}:</strong> {customer.affiliateProgram.name}
                        </div>
                        {customer.affiliateProgram.name === "standard" && (
                            <div className="bg-white/80 text-[#134a7b] p-3 rounded-xl text-sm">
                               {t("alRaggiungimentoDei")} <strong>10 {t("ordini")}</strong>, {t("laTesseraPassaAutomaticamenteDa")} <strong>Standard</strong> a <strong>Premium</strong>.
                            </div>
                        )}

                        <div className="bg-white/20 p-3 rounded-xl">
                            <strong>{t("puntiAccumulati")}:</strong> {customer.affiliateProgram.points}
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl">
                            <strong>{t("numeroTessera")}:</strong> {customer.affiliateProgram.cardNumber}
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl">
                            <strong>{t("programmaFedelta")}:</strong> {t("attivo")}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

};

export default CustomersRegistry;