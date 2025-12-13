import OrdersTable from "../components/Orders/OrdersTable";
//useState→x creare e gestire i dati
//useEffect→x fare qualcosa dopo che il componente è montato
import { useState, useEffect, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
	createOrder,
	fetchOrders,
	deleteOrder,
} from "../store/feature/orderSlice";

import { fetchProducts } from "../store/feature/productsSlice";
import { fetchPointsOfSalesAsync } from "../store/feature/pointOfSalesSlice";
import { fetchCustomersAsync } from "../store/feature/customerSlice";
import { TrashIcon } from "@phosphor-icons/react";
import { useTheme } from "../context/ThemeContext";

const OrderPage = () => {
	// nomi delle colonne
	const orderColumns = [
		"prodotto",
		"quantità totale",
		"data",
		"stato",
		"corriere",
		"totale",
	];

	// stato per il drawer "Nuovo ordine"
	const [drawerOpen, setDrawerOpen] = useState(false);

	//→ tiene la lista dei clienti aggiunti al nuovo ordine
	//→ Aggiungi cliente
	const [clientRows, setClientRows] = useState([]);

	//→ ricorda quale prodotto hai selezionato nella select
	//→ seleziona prodotto
	const [selectedProductId, setSelectedProductId] = useState("");

	//→ punti vendita
	const [selectedPointOfSaleId, setSelectedPointOfSaleId] = useState("");

	const { theme } = useTheme(); //dark mode

	const products = useSelector((state) => state.products.list);
	const pointOfSales = useSelector((state) => state.pos.list); //punti vendita
	const customers = useSelector((state) => state.customers.list);
	const orders = useSelector((state) => state.orders.items);

	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);

	useEffect(() => {
		if (!token) return;

		dispatch(fetchOrders({ token }));
		dispatch(fetchProducts(token));
		dispatch(fetchPointsOfSalesAsync({ token }));
		dispatch(fetchCustomersAsync(token));
	}, [dispatch, token]);

	//→ Aggiunge una nuova riga alla lista clientRows
	const handleAddClientRow = () => {
		setClientRows((prev) => [...prev, { customerId: "", qty: "" }]);
	};

	//→ serve per modificare una singola riga dei clienti
	const handleClientChange = (index, field, value) => {
		setClientRows((prev) =>
			prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
		);
	};

	// DATI ADATTATI PER LA TABELLA (DAL BACKEND) - useMemo in modo che venga ricalcolato solo quando "orders" cambia
	const ordersForTable = useMemo(() => {
		return orders.map((o) => {
			const prodottoDettaglio = o.product;
			const prezzoUnitario = prodottoDettaglio?.price || 0;

			const clienti = o.clients.map((c) => ({
				...c.client,
				qty: c.quantity,
				totale: c.quantity * prezzoUnitario,

				puntiOrdine: c.puntiOrdine,
				puntiTotali: c.puntiTotali,
				ordiniTotali: c.ordiniTotali,
			}));

			const totale = clienti.reduce((sum, c) => sum + (c.totale || 0), 0);

			return {
				_id: o._id,
				prodotto: prodottoDettaglio?.name,
				"quantità totale": o.totalQuantity,
				data: new Date(o.createdAt).toLocaleDateString("it-IT"),
				stato: o.stato || "In lavorazione",
				corriere: o.corriere || "Bartolini",
				totale: Number(totale.toFixed(2)),
				prodottoDettaglio,
				clienti,
			};
		});
	}, [orders]);

	//Bottone → Crea (dentro nuovo ordine) → Drawer
	const handleCreateOrder = (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const totalQuantity = Number(formData.get("totalQuantity")) || 0;

		// PAYLOAD PER IL BACKEND (Joi)
		const orderPayload = {
			pointOfSales: selectedPointOfSaleId,
			product: selectedProductId,
			totalQuantity,
			clients: clientRows
				.filter((row) => row.customerId && row.qty !== "")
				.map((row) => ({
					client: row.customerId,
					quantity: Number(row.qty),
				})),
		};

		dispatch(createOrder({ orderData: orderPayload, token })).then(() => {
			dispatch(fetchOrders({ token }));
		});

		// Chiudo drawer e resetto tutto
		setDrawerOpen(false);
		setClientRows([]);
		setSelectedProductId("");
		setSelectedPointOfSaleId("");
		e.target.reset();
	};

	// CESTINO/ELIMINA
	const handleDeleteOrder = (orderId) => {
		dispatch(deleteOrder({ id: orderId, token }));
	};

	return (
		<div className="w-full px-6 pb-6 flex flex-col gap-6">
			{/* DRAWER NUOVO ORDINE */}
			{drawerOpen && (
				<div className="p-6 flex flex-col gap-4 rounded-xl border border-white/30 shadow-md backdrop-blur-sm bg-white/20 transition duration-500">
					<h3 className="text-lg font-bold text-[#090c64]">Nuovo Ordine</h3>

					<form onSubmit={handleCreateOrder} className="grid grid-cols-2 gap-4">
						{/* SELECT PUNTI VENDITA */}
						<select
							name="pointOfSaleId"
							required
							className="p-2 border rounded-xl"
							value={selectedPointOfSaleId}
							onChange={(e) => setSelectedPointOfSaleId(e.target.value)}
						>
							<option value=""> Seleziona punto vendita</option>
							{pointOfSales?.map((pv) => (
								<option key={pv._id} value={pv._id}>
									{pv.name}
								</option>
							))}
						</select>

						{/* SELECT PRODOTTO */}
						<select
							name="productId"
							required
							className="p-2 border rounded-xl "
							value={selectedProductId}
							onChange={(e) => setSelectedProductId(e.target.value)}
						>
							<option value="">Seleziona prodotto</option>
							{products?.map((p) => (
								<option key={p._id} value={p._id}>
									{p.name}
								</option>
							))}
						</select>

						{/* QUANTITÀ TOTALE */}
						<input
							name="totalQuantity"
							type="number"
							min="0"
							placeholder="Quantità totale"
							required
							className="p-2 border rounded-xl"
						/>

						{/* SEZIONE CLIENTI */}
						<div className="col-span-2 flex items-center justify-between mt-2">
							<span className="text-sm font-semibold ">
								Clienti e relative quantità
							</span>
							<button
								type="button"
								onClick={handleAddClientRow}
								className="px-3 py-1 text-xs bg-[#090c64] text-white rounded-lg cursor-pointer hover:bg-[#0c0f7a] transition custom-button text-[13px] "
							>
								Aggiungi cliente
							</button>
						</div>

						{clientRows.map((row, index) => (
							<div key={index} className="col-span-2 grid grid-cols-2 gap-2">
								<select
									value={row.customerId}
									onChange={(e) =>
										handleClientChange(index, "customerId", e.target.value)
									}
									className="p-2 border rounded text-sm"
								>
									<option value="">Seleziona cliente</option>
									{customers?.map((c) => (
										<option key={c._id} value={c._id}>
											{c.firstName} {c.lastName} ({c.location?.city})
										</option>
									))}
								</select>

								<input
									type="number"
									min="0"
									value={row.qty}
									onChange={(e) =>
										handleClientChange(index, "qty", e.target.value)
									}
									placeholder="Quantità per questo cliente"
									className="p-2 border rounded text-sm"
								/>
							</div>
						))}

						<div className="col-span-2 flex justify-end gap-2 mt-2">
							<button
								type="button"
								onClick={() => {
									setDrawerOpen(false);
									setClientRows([]);
									setSelectedProductId("");
									setSelectedPointOfSaleId("");
								}}
								className="px-4 py-2 border rounded-xl cursor-pointer transition"
							>
								Annulla
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-[#090c64] text-white rounded-xl cursor-pointer transition custom-button text-[14px] "
							>
								Crea
							</button>
						</div>
					</form>
				</div>
			)}

			{/* TABELLA ORDINI */}
			<OrdersTable
				data={ordersForTable}
				columns={orderColumns}
				customToolbar={
					<button
						type="button"
						onClick={() => setDrawerOpen((prev) => !prev)}
						className=" bg-[#090c64] text-white rounded-xl shadow-md cursor-pointer hover:bg-[#0c0f7a] transition custom-button text-[14px]"
					>
						Nuovo Ordine
					</button>
				}
				actionLabel="Azioni"
				actions={[
					{
						name: "delete",
						icon: (
							<TrashIcon
								size={28}
								color={theme === "dark" ? "#ff4d4d" : "#ff0000"}
								weight="duotone"
							/>
						),
						onClick: (row) => handleDeleteOrder(row._id),
					},
				]}
			/>
		</div>
	);
};

export default OrderPage;
