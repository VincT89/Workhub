import Drawer from "../components/Drawer";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import { ordersMock } from "../api/mock/ordersMock";
import { productsMock } from "../api/mock/productsMock";

// colonne tabella ordini
const orderColumns = [
	"numero",
	"cliente",
	"data",
	"stato",
	"vettore",
	"consegna",
	"pagamento",
	"totale",
	"punti",
];

// input piccolo per il numero ordine nel titolo
const headerNumberInputClass =
	"px-3 py-1 rounded-lg bg-white/90 border border-white/80 text-sm text-[#090c64] w-32";

const OrdersPage = () => {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState(null);
	const [orders, setOrders] = useState(() => {
		const saved = localStorage.getItem("orders");
		if (saved) return JSON.parse(saved);
		return ordersMock;
	});

	const [isEditing, setIsEditing] = useState(false);
	const [isAdding, setIsAdding] = useState(false);

	const [editValues, setEditValues] = useState({
		numero: "",
		sigla: "",
		cliente: "",
		totale: "",
		stato: "",
		pagamento: "",
		vettore: "",
		consegna: "",
	});

	const [newItems, setNewItems] = useState([]);
	const [newItemProductId, setNewItemProductId] = useState(
		productsMock[0]?.id || ""
	);
	const [newItemQty, setNewItemQty] = useState(1);

	const [alert, setAlert] = useState(null);

	// stile comune per input (cliente, data, vettore, ecc.)
	const inputClass =
		"mt-1 w-full px-3 py-2 rounded-lg bg-white/90 border border-white/80 text-sm text-[#090c64]";

	// stile coerente per select articoli
	const selectClass =
		"mt-1 w-full max-w-xs px-3 py-2 rounded-lg bg-white/90 border border-white/80 text-sm text-[#090c64]";

	// stile coerente per input quantità
	const qtyInputClass =
		"mt-1 w-20 px-3 py-2 rounded-lg bg-white/90 border border-white/80 text-sm text-[#090c64] text-center";

	useEffect(() => {
		localStorage.setItem("orders", JSON.stringify(orders));
	}, [orders]);

	useEffect(() => {
		if (selected) {
			setEditValues({
				numero: selected.numero || "",
				sigla: selected.sigla || "",
				cliente: selected.cliente || "",
				totale:
					selected.totale === undefined || selected.totale === null
						? ""
						: String(selected.totale),
				stato: selected.stato || "",
				pagamento: selected.pagamento || "",
				vettore: selected.vettore || "",
				consegna: selected.consegna || "",
			});

			setNewItems(selected.items || []);
			setIsEditing(false);
			setIsAdding(false);
		}
	}, [selected]);

	useEffect(() => {
		if (!alert) return;
		const t = setTimeout(() => setAlert(null), 3000);
		return () => clearTimeout(t);
	}, [alert]);

	const handleRowClick = (row) => {
		setSelected(row);
		setOpen(true);
		setIsEditing(false);
		setIsAdding(false);
	};

	const handleDeleteOrder = () => {
		if (!selected) return;

		const deletedNumber = selected.numero;

		setOrders((prev) => prev.filter((order) => order.id !== selected.id));
		close();

		setAlert({
			type: "delete",
			text: `L'ordine #${deletedNumber} è stato eliminato.`,
		});
	};

	const handleEditOrder = () => {
		if (!selected) return;
		setIsEditing(true);
		setIsAdding(false);
	};

	const calculateTotalFromItems = (items) => {
		return (items || []).reduce((sum, it) => {
			const product = productsMock.find((p) => p.id === it.productId);
			if (!product) return sum;
			const qtyNumber = Number(it.qty) || 0;
			return sum + product.prezzo * qtyNumber;
		}, 0);
	};

	const calculatePointsForOrder = (order) => {
		const items = order.items || [];

		// Se ci sono articoli: 10 punti per ogni pezzo/card
		if (items.length > 0) {
			const totalQty = items.reduce(
				(sum, it) => sum + (Number(it.qty) || 0),
				0
			);
			return totalQty * 10;
		}

		// Se NON ci sono articoli → 0 punti
		return 0;
	};

	const handleSaveOrder = () => {
		// NUOVO ordine
		if (isAdding) {
			const parsedTotaleAdd = parseFloat(
				(editValues.totale || "").replace(",", ".")
			);
			let newTotaleAdd = isNaN(parsedTotaleAdd) ? 0 : parsedTotaleAdd;

			const totalFromItemsAdd = calculateTotalFromItems(newItems);
			if (newItems.length > 0) {
				newTotaleAdd = totalFromItemsAdd;
			}

			const nuovoOrdine = {
				id: Date.now(),
				// numero NON lo inserisci tu → se vuoto diventa "S/N"
				numero: editValues.numero.trim() || "S/N",
				sigla: editValues.sigla.trim() || "OC1/24",
				cliente: editValues.cliente.trim() || "Cliente sconosciuto",
				totale: newTotaleAdd,
				data: new Date().toISOString(),
				stato: editValues.stato.trim() || "Memorizzato",
				pagamento: editValues.pagamento.trim() || "—",
				vettore: editValues.vettore.trim() || "—",
				consegna: editValues.consegna.trim() || "—",
				marketplace: "—",
				items: newItems,
			};

			setOrders((prev) => [...prev, nuovoOrdine]);
			setSelected(nuovoOrdine);
			setIsAdding(false);
			setIsEditing(false);

			setAlert({
				type: "create",
				text: `L'ordine #${nuovoOrdine.numero} è stato creato.`,
			});

			return;
		}

		// UPDATE ordine esistente
		if (!selected) return;

		const parsedTotale = parseFloat(
			(editValues.totale || "").replace(",", ".")
		);
		let newTotale = isNaN(parsedTotale) ? selected.totale : parsedTotale;

		const totalFromItems = calculateTotalFromItems(newItems);
		if (newItems.length > 0) {
			newTotale = totalFromItems;
		}

		const updatedOrder = {
			...selected,
			numero: editValues.numero.trim() || selected.numero,
			sigla: editValues.sigla.trim() || selected.sigla,
			cliente: editValues.cliente.trim() || selected.cliente,
			totale: newTotale,
			stato: editValues.stato.trim() || selected.stato,
			pagamento: editValues.pagamento.trim() || selected.pagamento,
			vettore: editValues.vettore.trim() || selected.vettore,
			consegna: editValues.consegna.trim() || selected.consegna,
			items: newItems,
		};

		setOrders((prev) =>
			prev.map((order) => (order.id === selected.id ? updatedOrder : order))
		);

		setSelected(updatedOrder);
		setIsEditing(false);

		setAlert({
			type: "update",
			text: `L'ordine #${updatedOrder.numero} è stato modificato.`,
		});
	};

	const handleAddOrder = () => {
		setIsAdding(true);
		setIsEditing(true);
		setSelected(null);
		setEditValues({
			numero: "",
			cliente: "—",
			totale: "",
			stato: "—",
			pagamento: "—",
			vettore: "—",
			consegna: "—",
			sigla: "",
		});
		setNewItems([]);
		setNewItemProductId(productsMock[0]?.id || "");
		setNewItemQty(1);
		setOpen(true);
	};

	const close = () => {
		setOpen(false);
		setSelected(null);
		setIsEditing(false);
		setIsAdding(false);
	};

	const handleAddItemToNewOrder = () => {
		if (!newItemProductId) return;

		const qty = parseInt(newItemQty, 10) || 1;

		setNewItems((prev) => {
			const existing = prev.find((it) => it.productId === newItemProductId);
			if (existing) {
				return prev.map((it) =>
					it.productId === newItemProductId ? { ...it, qty: it.qty + qty } : it
				);
			}
			return [...prev, { productId: newItemProductId, qty }];
		});

		setNewItemQty(1);
	};

	const findProduct = (id) => productsMock.find((p) => p.id === id);

	const handleChangeItemQty = (index, newQty) => {
		const safeQty = newQty < 1 ? 1 : newQty;
		setNewItems((prev) =>
			prev.map((it, i) => (i === index ? { ...it, qty: safeQty } : it))
		);
	};

	const totalForCurrentOrder =
		isEditing || isAdding
			? calculateTotalFromItems(newItems)
			: selected?.totale ?? 0;

	const ordersWithPoints = orders.map((order) => ({
		...order,
		punti: calculatePointsForOrder(order),
	}));

	return (
		<div className="p-6">
			<Table
				title="Ordini"
				data={ordersWithPoints}
				columns={orderColumns}
				onRowClick={(row) => handleRowClick(row)}
				onAdd={handleAddOrder}
			/>

			<Drawer
				open={open}
				onClose={close}
				title={
					selected ? (
						<div className="flex items-center gap-3">
							<span className="font-semibold">Ordine</span>
							{isEditing ? (
								<input
									className={headerNumberInputClass}
									value={editValues.numero}
									onChange={(e) =>
										setEditValues((prev) => ({
											...prev,
											numero: e.target.value,
										}))
									}
								/>
							) : (
								<span className="font-semibold">#{selected.numero}</span>
							)}
						</div>
					) : isAdding ? (
						"Nuovo ordine"
					) : (
						"Dettaglio ordine"
					)
				}
				width="w-[700px]"
			>
				{/* NUOVO ORDINE */}
				{isAdding && (
					<div className="space-y-4 text-sm">
						<div className="grid grid-cols-2 gap-6">
							<div className="space-y-3">
								<div>
									<b>Cliente:</b>
									<input
										className={inputClass}
										value={editValues.cliente}
										onChange={(e) =>
											setEditValues((prev) => ({
												...prev,
												cliente: e.target.value,
											}))
										}
									/>
								</div>
								<div>
									<b>Data:</b>
									<div className={inputClass}>
										{new Date().toLocaleString()}
									</div>
								</div>
								<div>
									<b>Stato:</b>
									<input
										className={inputClass}
										value={editValues.stato}
										onChange={(e) =>
											setEditValues((prev) => ({
												...prev,
												stato: e.target.value,
											}))
										}
									/>
								</div>
							</div>

							<div className="space-y-3">
								<div>
									<b>Vettore:</b>
									<input
										className={inputClass}
										value={editValues.vettore}
										onChange={(e) =>
											setEditValues((prev) => ({
												...prev,
												vettore: e.target.value,
											}))
										}
									/>
								</div>
								<div>
									<b>Pagamento:</b>
									<input
										className={inputClass}
										value={editValues.pagamento}
										onChange={(e) =>
											setEditValues((prev) => ({
												...prev,
												pagamento: e.target.value,
											}))
										}
									/>
								</div>
								<div>
									<b>Consegna:</b>
									<input
										className={inputClass}
										value={editValues.consegna}
										onChange={(e) =>
											setEditValues((prev) => ({
												...prev,
												consegna: e.target.value,
											}))
										}
									/>
								</div>
							</div>
						</div>

						<hr className="my-4 border-white/70" />

						{/* ARTICOLI NUOVO ORDINE */}
						<div className="mt-2">
							<h3 className="font-semibold mb-2">Articoli</h3>

							<div className="flex flex-wrap items-center gap-2 mb-3">
								<select
									className={selectClass}
									value={newItemProductId}
									onChange={(e) => setNewItemProductId(e.target.value)}
								>
									{productsMock.map((p) => (
										<option key={p.id} value={p.id}>
											{p.nome}
											{p.sku ? ` (${p.sku})` : ""}
										</option>
									))}
								</select>

								<input
									type="number"
									min={1}
									className={qtyInputClass}
									value={newItemQty}
									onChange={(e) => setNewItemQty(e.target.value)}
								/>

								<button
									type="button"
									onClick={handleAddItemToNewOrder}
									className="custom-button px-3 py-1 text-xs"
								>
									Aggiungi articolo
								</button>
							</div>

							<ul className="space-y-2">
								{newItems.map((it, idx) => {
									const p = findProduct(it.productId);
									return (
										<li key={idx} className="rounded-md border p-3">
											<div className="flex justify-between gap-3">
												<div className="flex gap-3">
													{p?.img && (
														<img
															src={p.img}
															alt={p.nome}
															className="w-16 h-16 rounded-md object-cover"
														/>
													)}

													<div>
														<div className="font-medium text-xs">
															{p?.nome}{" "}
															{p?.sku && (
																<span className="text-[10px] text-gray-500">
																	({p.sku})
																</span>
															)}
														</div>
														<div className="text-[10px] text-gray-600">
															{p?.categoria} • {p?.colore} • {p?.materiale}
														</div>
														<div className="text-[10px] text-gray-600">
															Dimensioni: {p?.dimensioni}
														</div>
													</div>
												</div>

												<div className="text-right text-xs">
													<div className="mb-1">
														Q.tà:{" "}
														<input
															type="number"
															min={1}
															className={qtyInputClass}
															value={it.qty}
															onChange={(e) =>
																handleChangeItemQty(
																	idx,
																	Number(e.target.value) || 1
																)
															}
														/>
													</div>
													<div>Prezzo: € {p?.prezzo?.toFixed(2)}</div>
												</div>
											</div>

											{p?.descrizione && (
												<p className="text-xs mt-2 text-gray-700">
													{p.descrizione}
												</p>
											)}
										</li>
									);
								})}
								{newItems.length === 0 && (
									<li className="text-xs text-gray-500">
										Nessun articolo aggiunto.
									</li>
								)}
							</ul>
						</div>

						<div className="mt-4 flex justify-between items-center">
							<span className="font-semibold">Totale ordine</span>
							<span className="inline-block px-3 py-1 rounded-lg bg-white/10 font-semibold">
								€ {calculateTotalFromItems(newItems).toFixed(2)}
							</span>
						</div>

						<div className="mt-6 flex justify-end gap-3">
							<button onClick={handleSaveOrder} className="custom-button">
								Salva
							</button>
						</div>
					</div>
				)}

				{/* DETTAGLIO ORDINE ESISTENTE */}
				{!isAdding && selected && (
					<div className="space-y-4 text-sm">
						<div className="grid grid-cols-2 gap-6">
							<div className="space-y-3">
								<div>
									<b>Cliente:</b>{" "}
									{isEditing ? (
										<input
											className={inputClass}
											value={editValues.cliente}
											onChange={(e) =>
												setEditValues((prev) => ({
													...prev,
													cliente: e.target.value,
												}))
											}
										/>
									) : (
										<div className={inputClass}>{selected.cliente}</div>
									)}
								</div>
								<div>
									<b>Data:</b>{" "}
									<div className={inputClass}>
										{new Date(selected.data).toLocaleString()}
									</div>
								</div>
								<div>
									<b>Stato:</b>{" "}
									{isEditing ? (
										<input
											className={inputClass}
											value={editValues.stato}
											onChange={(e) =>
												setEditValues((prev) => ({
													...prev,
													stato: e.target.value,
												}))
											}
										/>
									) : (
										<div className={inputClass}>{selected.stato}</div>
									)}
								</div>
							</div>

							<div className="space-y-3">
								<div>
									<b>Vettore:</b>{" "}
									{isEditing ? (
										<input
											className={inputClass}
											value={editValues.vettore}
											onChange={(e) =>
												setEditValues((prev) => ({
													...prev,
													vettore: e.target.value,
												}))
											}
										/>
									) : (
										<div className={inputClass}>{selected.vettore}</div>
									)}
								</div>
								<div>
									<b>Pagamento:</b>{" "}
									{isEditing ? (
										<input
											className={inputClass}
											value={editValues.pagamento}
											onChange={(e) =>
												setEditValues((prev) => ({
													...prev,
													pagamento: e.target.value,
												}))
											}
										/>
									) : (
										<div className={inputClass}>{selected.pagamento}</div>
									)}
								</div>
								<div>
									<b>Consegna:</b>{" "}
									{isEditing ? (
										<input
											className={inputClass}
											value={editValues.consegna}
											onChange={(e) =>
												setEditValues((prev) => ({
													...prev,
													consegna: e.target.value,
												}))
											}
										/>
									) : (
										<div className={inputClass}>{selected.consegna}</div>
									)}
								</div>
							</div>
						</div>

						<hr className="my-4 border-white/70" />

						{/* ARTICOLI ORDINE ESISTENTE */}
						<div>
							<h3 className="font-semibold mb-2">Articoli</h3>

							{isEditing && (
								<div className="flex flex-wrap items-center gap-2 mb-3">
									<select
										className={selectClass}
										value={newItemProductId}
										onChange={(e) => setNewItemProductId(e.target.value)}
									>
										{productsMock.map((p) => (
											<option key={p.id} value={p.id}>
												{p.nome}
												{p.sku ? ` (${p.sku})` : ""}
											</option>
										))}
									</select>

									<input
										type="number"
										min={1}
										className={qtyInputClass}
										value={newItemQty}
										onChange={(e) => setNewItemQty(e.target.value)}
									/>

									<button
										type="button"
										onClick={handleAddItemToNewOrder}
										className="custom-button px-3 py-1 text-xs"
									>
										Aggiungi articolo
									</button>
								</div>
							)}

							<ul className="space-y-2">
								{(isEditing ? newItems : selected.items || []).map(
									(it, idx) => {
										const p = findProduct(it.productId);
										return (
											<li key={idx} className="rounded-md border p-3">
												<div className="flex justify-between gap-3">
													<div className="flex gap-3">
														{p?.img && (
															<img
																src={p.img}
																alt={p.nome}
																className="w-16 h-16 rounded-md object-cover"
															/>
														)}

														<div>
															<div className="font-medium">
																{p?.nome}{" "}
																{p?.sku && (
																	<span className="text-xs text-gray-500">
																		({p.sku})
																	</span>
																)}
															</div>

															<div className="text-xs text-gray-600">
																{p?.categoria} • {p?.colore} • {p?.materiale}
															</div>
															<div className="text-xs text-gray-600">
																Dimensioni: {p?.dimensioni}
															</div>
														</div>
													</div>
													<div className="text-right text-xs">
														<div className="mb-1">
															Q.tà:{" "}
															{isEditing ? (
																<input
																	type="number"
																	min={1}
																	className={qtyInputClass}
																	value={it.qty}
																	onChange={(e) =>
																		handleChangeItemQty(
																			idx,
																			Number(e.target.value) || 1
																		)
																	}
																/>
															) : (
																<b>{it.qty}</b>
															)}
														</div>
														<div>Prezzo: € {p?.prezzo?.toFixed(2)}</div>
													</div>
												</div>
												{p?.descrizione && (
													<p className="text-xs mt-2 text-gray-700">
														{p.descrizione}
													</p>
												)}
											</li>
										);
									}
								)}
							</ul>
						</div>

						<div className="mt-4 flex justify-between items-center">
							<span className="font-semibold">Totale ordine</span>
							<span className="inline-block px-3 py-1 rounded-lg bg-white/10 font-semibold">
								€ {Number(totalForCurrentOrder).toFixed(2)}
							</span>
						</div>

						<div className="mt-6 flex justify-end gap-3">
							<button onClick={handleEditOrder} className="custom-button">
								Modifica
							</button>

							{isEditing && (
								<button onClick={handleSaveOrder} className="custom-button">
									Salva
								</button>
							)}

							<button onClick={handleDeleteOrder} className="custom-button">
								Elimina
							</button>
						</div>
					</div>
				)}
			</Drawer>

			{alert && (
				<div className="fixed top-6 left-1/2 -translate-x-1/2 z-9999">
					<div className="px-8 py-4 rounded-2xl bg-white/95 shadow-xl border border-[#d9c9ff] text-base text-[#090c64] font-semibold tracking-wide min-w-[320px] text-center">
						{alert.text}
					</div>
				</div>
			)}
		</div>
	);
};

export default OrdersPage;
