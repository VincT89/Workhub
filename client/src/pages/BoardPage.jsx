import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import CalendarBox from "../components/CalendarBox";
import {
	Warehouse,
	ShoppingCartSimple,
	UserCircleCheck,
	ChalkboardSimple,
	Package,
	WarningOctagon,
	Calendar,
} from "@phosphor-icons/react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
	setLowStockProducts,
	setBoardPosts,
} from "../store/feature/boardSlice";
import Table from "../components/Table";
import Drawer from "../components/Drawer";

const BoardPage = () => {
	const { theme } = useTheme();
	const { t } = useLanguage();
	const { role } = useSelector((state) => state.auth.user);

	const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";

	const dispatch = useDispatch();

	const lowStockProducts = useSelector((state) => state.board.lowStockProducts);
	const boardPosts = useSelector((state) => state.board.boardPosts);

	useEffect(() => {
		dispatch(
			setLowStockProducts([
				{ name: "Penna", qty: 3 },
				{ name: "Quaderno", qty: 1 },
			])
		);
	}, [dispatch]);

	useEffect(() => {
		dispatch(
			setBoardPosts([
				{ title: "Nuova riunione", date: "2025-11-22" },
				{ title: "Aggiornamento magazzino", date: "2025-11-21" },
			])
		);
	}, [dispatch]);

	const columns =
		lowStockProducts.length > 0 ? Object.keys(lowStockProducts[0]) : [];

	const boardColumns = boardPosts.length > 0 ? Object.keys(boardPosts[0]) : [];

	// State per il Drawer 
	const [drawerOpen, setDrawerOpen] = useState(false);  // drawer visibile o no
	const [newPostTitle, setNewPostTitle] = useState(""); // titolo nuovo evento
	const [newPostDate, setNewPostDate] = useState("");  // data nuovo evento

	// Funzione che salva il nuovo evento inserito
	const handleSavePost = (e) => {    
		e.preventDefault();

		const newPost = {
			title: newPostTitle,
			date: newPostDate,
		};

		dispatch(setBoardPosts([...boardPosts, newPost]));

		setDrawerOpen(false);
		setNewPostTitle("");
  		setNewPostDate("");
	};

	return (
		<div
			className="w-full h-full flex flex-col gap-8 overflow-y-auto 
			[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
		>
			{/* Riga 1: i 5 box - con un div che li contiene tutti, e a seguire i singoli box-div */}
			<div className="grid grid-cols-5 gap-4 mb-2 w-full transition-colors duration-500">
				<div
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow  mt-2
					bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
					border border-white/30 dark:border-white/80 ${textColor}`}
				>
					<div className="flex items-center gap-2">
						<Warehouse size={28} color="#090c64" weight="duotone" />
						<span className="font-bold text-[14px]">Depositi</span>
					</div>
					<span className="text-sm opacity-70 leading-none font-semibold">
						5
					</span>
				</div>

				<div
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow  mt-2
					bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
					border border-white/30 dark:border-white/80 ${textColor}`}
				>
					<div className="flex items-center gap-2">
						<ShoppingCartSimple size={28} color="#090c64" weight="duotone" />
						<span className="font-bold text-[14px]">Prodotti</span>
					</div>
					<span className="text-sm opacity-70 leading-none font-semibold">
						2000
					</span>
				</div>

				<div
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow  mt-2
					bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
					border border-white/30 dark:border-white/80 ${textColor}`}
				>
					<div className="flex items-center gap-2">
						<Package size={28} color="#090c64" weight="duotone" />
						<span className="font-bold text-[14px]">Ordini in uscita</span>
					</div>
					<span className="text-sm opacity-70 leading-none font-semibold">
						20
					</span>
				</div>

				<div
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow  mt-2
					bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
					border border-white/30 dark:border-white/80 ${textColor}`}
				>
					<div className="flex items-center gap-2">
						<WarningOctagon size={28} color="#090c64" weight="duotone" />
						<span className="font-bold text-[14px]">Articoli sotto soglia</span>
					</div>
					<span className="text-sm opacity-70 leading-none font-semibold">
						10
					</span>
				</div>

				{/* {role === "supervisor" && ( intero <div />} */}
				<div
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow  mt-2
					bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
					border border-white/30 dark:border-white/80 ${textColor}`}
				>
					<div className="flex items-center gap-2">
						<UserCircleCheck size={28} color="#090c64" weight="duotone" />
						<span className="font-bold text-[14px] ">Personale attivo</span>
					</div>
					<span className="text-sm opacity-70 leading-none font-semibold">
						50
					</span>
				</div>
			</div>

			{/* Riga 2: 2 box - con un div che li contiene tutti, e a seguire i singoli box-div  */}
			<div className="grid grid-cols-2 gap-6 mb-6 w-full transition-colors duration-500">
				<div
					className={`flex flex-col gap-4 p-4 
  bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
  border border-white/30 dark:border-white/80 rounded-xl shadow-md 
  ${textColor}`}
				>
					{/* HEADER BACHECA */}
					<div className="flex items-start gap-4 w-full">
						<ChalkboardSimple size={28} color="#090c64" weight="duotone" />

						<h3 className="text-[14px] font-bold font-nunito">Bacheca</h3>

						{/* Bottone visibile SOLO ai supervisor o admin */}
						{(role === "supervisor" || role === "admin") && (
							<button
							onClick={() => setDrawerOpen(true)}  // apre il drawer
							className="ml-auto px-4 py-2 bg-[#090c64] text-white shadow-md border border-white/20 transition-all duration-500 rounded-xl text-[14px] font-bold-nunito cursor-pointer">
								+ Aggiungi
							</button>
						)}
					</div>

					{/* TABELLA */}
					<div className="w-full h-full overflow-hidden">
						<Table data={boardPosts} columns={boardColumns} />
					</div>
				</div>

				<div
					className={`flex flex-col gap-4 p-4 
  bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
  border border-white/30 dark:border-white/80 rounded-xl shadow-md 
  ${textColor}`}
				>
					{/* HEADER */}
					<div className="flex items-center gap-4">
						<ShoppingCartSimple size={28} color="#090c64" weight="duotone" />

						<h3 className="text-[14px] font-bold font-nunito">
							Prodotti in esaurimento
						</h3>
					</div>

					{/* TABELLA */}
					<div className="w-full overflow-hidden h-full mt-3">
						<Table data={lowStockProducts} columns={columns} />
					</div>
				</div>
			</div>

			{/* Riga 3: 1 box - Calendario */}
			<div
				className="bg-[#fafafa20] dark:bg-[#fafafa20] backdrop-blur-sm border border-white/30 dark:border-white/80
  rounded-xl p-6 shadow-md flex items-start gap-4 mb-2 min-h-[700px]"
			>
				{/* Contenuto */}
				<div className="flex-1 flex flex-col">
					<div className="flex gap-4 justify-start items-start">
						<Calendar size={28} color="#090c64" weight="duotone" />
						<h3
							className={`text-[14px] font-bold font-nunito ${textColor} mb-4`}
						>
							{t("dashboard.calendario")}
						</h3>
					</div>

					<CalendarBox />
				</div>
			</div>

			<Drawer 
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				title="Aggiungi nuovo evento">

				{/* Form di 2 input  e 2 bottoni (Annulla e Salva) */}
				<form onSubmit={handleSavePost} className="flex flex-col gap-4">

					<div className="flex flex-col">
						<label htmlFor="title" className={`text-sm font-bold mb-1 ${textColor}`}>Titolo</label>
						<input 
						type="text" 
						value={newPostTitle}
						onChange={(e) => setNewPostTitle(e.target.value)}
						placeholder="Inserisci evento..."
      					required
						className={`px-3 py-2 rounded-xl bg-[#fafafa20] dark:bg-[#fafafa10] border border-white/30 dark:border-white/80 ${textColor} focus:outline-none focus:ring-2 focus:ring-[#090c64]`}
						/>
					</div>

					<div className="flex flex-col">
						<label htmlFor="date" className={`text-sm font-bold mb-1 ${textColor}`}>Data</label>
						<input 
						type="text" 
						value={newPostDate}
						onChange={(e) => setNewPostDate(e.target.value)}
						placeholder="Inserisci data..."
						required
						className={`px-3 py-2 rounded-xl bg-[#fafafa20] dark:bg-[#fafafa10] border border-white/30 dark:border-white/80 ${textColor} focus:outline-none focus:ring-2 focus:ring-[#090c64]`}
						/>
					</div>	

					<div className="flex justify-end gap-3 mt-4">
						<button
						type="button"
						onClick={() => setDrawerOpen(false)}
						className="custom-button-light"
						>
						Annulla
						</button>

						<button
						type="submit"
						className="custom-button"
						>
						Salva
						</button>

					</div>

				</form>
			</Drawer>

		</div>
		
		
	);
};

export default BoardPage;