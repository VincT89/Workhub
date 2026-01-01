import Table from "../../components/Table";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import FilterByCard from "../../components/Customer/FilterByCard";
import AddCustomerForm from "../../components/Customer/AddCustomerForm";
import {
	fetchCustomersAsync,
	createCustomerAsync,
	clearError,
} from "../../store/feature/customerSlice";

const CustomersPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useLanguage();

	// Prendi i dati dallo stato Redux
	const {
		list: customers,
		loading,
		error,
	} = useSelector((state) => state.customers); // list: customers -> creo un alias di list e lo chiamo customers
	const token =
		useSelector((state) => state.auth?.token) || localStorage.getItem("token"); // cerco prima il token di autenticazione nello stato di Redux, se non lo trovo e quindi  il valore è falsy, allora lo cerco nel localStorage

	const [cardFilter, setCardFilter] = useState("");

	// Carica i customers all'avvio
	useEffect(() => {
		if (token) {
			dispatch(fetchCustomersAsync(token)); //con dispatch invio l'azione per caricare customers
		}
	}, [dispatch, token]); //quando una di queste dipendenze cambia, riesegue lo useEffect

	// Filtra i customers per livello della tessera
	const filteredCustomers = customers.filter((c) =>
		cardFilter ? c.affiliateProgram?.name === cardFilter : true
	);

	const handleAddCustomer = async (newCustomer) => {
		if (!token) {
			alert(t("tokenNonDisponibileEffettuaLogin"));
			return;
		}

		try {
			// Il form deve ora passare i dati nel formato backend
			await dispatch(
				createCustomerAsync({
					newCustomer: newCustomer,
					token,
				})
			).unwrap();
		} catch (err) {
			console.error("Errore creazione customer:", err);
		}
	};

	// Gestione errori
	useEffect(() => {
		if (error) {
			console.error("Errore customers:", error);
			// Puoi mostrare un alert o un toast
			dispatch(clearError());
		}
	}, [error, dispatch]);

	// Prepara le colonne per la table in base alla struttura backend
	const getTableColumns = () => {
		if (customers.length === 0) return [];

		// Colonne base che vogliamo mostrare
		return [
			"firstName",
			"lastName",
			"email",
			"phoneNumber",
			"fiscalCode",
			"affiliateProgram.name",
		];
	};

	const columnLabels = {
		firstName: t("nome"),
		lastName: t("cognome"),
		email: t("email"),
		phoneNumber: t("telefono"),
		fiscalCode: t("cf"),
		"affiliateProgram.name": t("tesseraFedelta"),
	};

	// Prepara i dati per la table
	const getTableData = () => {
		return filteredCustomers.map((customer) => ({
			// Mostriamo solo i campi rilevanti nella table
			_id: customer._id,
			firstName: customer.firstName,
			lastName: customer.lastName,
			email: customer.email,
			phoneNumber: customer.phoneNumber,
			fiscalCode: customer.fiscalCode,
			"affiliateProgram.name": customer.affiliateProgram?.name || "Nessuno",
		}));
	};

	if (loading) {
		return (
			<div className="w-full min-h-screen p-8 flex justify-center items-center">
				<div className="text-[#090c64]">{t("caricamentoClienti")}</div>
			</div>
		);
	}

	return (
		<div className="w-full min-h-screen p-8 text-[#090c64]">
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					Errore: {error}
				</div>
			)}

			<Table
				data={getTableData()}
        columns={getTableColumns()}
        columnLabels={columnLabels}
				customToolbar={() => (
					<>
						<FilterByCard onFilter={setCardFilter} />
						<AddCustomerForm onAdd={handleAddCustomer} />
					</>
				)}
				onRowClick={(row) => navigate(`/customer/${row._id}`)}
				sortLogic={(a, b) => {
					return a.firstName.localeCompare(b.firstName);
				}}
			/>
		</div>
	);
};

export default CustomersPage;