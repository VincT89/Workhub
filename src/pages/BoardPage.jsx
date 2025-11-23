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
import { useSelector } from "react-redux";

const BoardPage = () => {
	const { theme } = useTheme();
	const { t } = useLanguage();
	const { role } = useSelector((state) => state.auth.user);

	const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";

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
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow 
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
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow 
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
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow 
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
					className={`flex items-center justify-between rounded-xl px-3 py-2 shadow 
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
					className={`flex gap-4 justify-start items-start p-4 
					bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
					border border-white/30 dark:border-white/80 rounded-xl shadow-md 
					${textColor} h-[230px]`}
				>
					<ChalkboardSimple size={28} color="#090c64" weight="duotone" />
					<h3 className="text-[14px] font-bold font-nunito">Bacheca</h3>

					{/* Bottone visibile SOLO ai supervisor */}
					{(role === "supervisor" || role === "admin") && (
						<button className="ml-auto px-4 py-2 bg-[#090c64] text-white shadow-md border border-white/20 transition-all duration-500 rounded-xl text-[14px] font-bold-nunito cursor-pointer">
							+ Aggiungi
						</button>
					)}
				</div>

				<div
					className={`flex gap-4 justify-start items-start p-4 
					bg-[#fafafa20] dark:bg-[#fafafa10] backdrop-blur-sm 
					border border-white/30 dark:border-white/80 rounded-xl shadow-md 
					${textColor} h-[230px]`}
				>
					<ShoppingCartSimple size={28} color="#090c64" weight="duotone" />
					<h3 className="text-[14px] font-bold font-nunito">
						Prodotti in esaurimento
					</h3>
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
						<Calendar size={28} color="#090c64" weight="duotone"/>
						<h3
							className={`text-[14px] font-bold font-nunito ${textColor} mb-4`}
						>
							{t("dashboard.calendario")}
						</h3>
					</div>

					<CalendarBox />
				</div>
			</div>
		</div>
	);
};

export default BoardPage;
