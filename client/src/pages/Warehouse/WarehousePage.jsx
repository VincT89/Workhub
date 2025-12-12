import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchItems } from "../../store/feature/itemsSlice";
import { addItem } from "../../store/feature/itemsSlice";
import { useTheme } from "../../context/ThemeContext.jsx";


import WarehouseTable from "../../components/Warehouse/WarehouseTable";
import DrawerAddNewProduct from "../../components/Warehouse/DrawerAddNewProduct";
import { WarehouseIcon } from "@phosphor-icons/react";
import { PlusCircleIcon } from "@phosphor-icons/react";


const WarehousePage = () => {

  //? Prendo dispatcher e items dal Redux store
  const dispatch = useDispatch();
  const items = useSelector(state => state.items.list);
  const status = useSelector(state => state.items.status);
  const { theme } = useTheme();
   const textColor = theme === "dark" ? "text-white" : "text-[#090c64]";

  console.log("items", items)

  //? Chiamo il server quando la pagina si apre
  useEffect(() => {
    if (status === "idle") { // se lo stato è uguale ad "idle" (cioè: 
      // non ho ancora caricato i dati) esegui il dispatch,
      // così evito richieste multiple al server.
      dispatch(fetchItems());
    }
  }, [status, dispatch]);
  
  // colonne dinamiche della tabella
  const columns = ["sku", "product", "category", "pointOfSales", "stock", "stockLimit", "promo", "note", "stato"];

  // Drawer per aggiungere prodotto
  const [drawerAddOpen, setDrawerAddOpen] = useState(false);

// Box riassuntivi
  const summaryButtons = [
    {
      label: "Totale articoli",
      number: items.length,
      icon: <WarehouseIcon size={32} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />,

      clickable: false
    },
    {
      label: "Carica giacenza",
      icon: <PlusCircleIcon size={32} color={theme === "dark" ? "white" : "#090c64"} weight="duotone" />,
      clickable: true,
      onClick: () => setDrawerAddOpen(true)
    },
  ];
  //? Aggiunta prodotto al magazzino
  const handleAddProduct = (newProduct) => {
    dispatch(addItem(newProduct));
  };
  

  return (
    <div
      className="w-full min-h-screen flex justify-center items-start">
      <div className=" w-full flex flex-col gap-8">

        {/* BOX RIASSUNTIVI */}
        <div className="flex gap-4">
          {summaryButtons.map((btn, index) => (
            <button
              key={index}
              disabled={!btn.clickable}
              onClick={btn.onClick}
              className={`flex-1 rounded-xl px-4 py-3 border border-white shadow-sm transition text-[#090c64] flex items-center justify-center gap-2
                                ${btn.clickable ? "bg-[#fafafa]/10 hover:bg-[#e8defc]/30 cursor-pointer" : "bg-[#fafafa]/10 cursor-default"}`}
            >
              {btn.icon}
              <span className="inline-flex items-baseline gap-2">
                <span className={`font-bold ${textColor}`}>{btn.label}</span>
                {btn.number !== undefined && (
                  <span className={`text-sm opacity-70 leading-none ${textColor}`}>{btn.number}</span>
                )}
              </span>
            </button>
          ))}
        </div>



        {/* TABELLA */}
        <WarehouseTable
          data={items}
          columns={columns}
        />

        {/* DRAWER AGGIUNGI PRODOTTO */}
        <DrawerAddNewProduct
          open={drawerAddOpen}
          onClose={() => setDrawerAddOpen(false)}
          onAddStock={handleAddProduct}
        />

      </div>
    </div>
  );
};

export default WarehousePage;