import { useState } from "react";
import WarehouseTable from "../../components/WarehouseTable";
import DrawerAddNewProduct from "../../components/DrawerAddNewProduct";
import { Warehouse } from "@phosphor-icons/react";
import { PlusCircle } from "@phosphor-icons/react";


const WarehousePage = () => {
  const columns = ["id", "nome", "categoria", "quantita", "cap", "soglia", "stato"];

  const [drawerAddOpen, setDrawerAddOpen] = useState(false);

  const prodotti = [
    {
      id: "A001",
      nome: "LACK Tavolino",
      categoria: "Tavoli",
      cap: "20100",
      stock: {
        "Mia Sede": 10,
        "Sede Milano": 12,
        "Sede Monza": 8,
        "Sede Sesto San Giovanni": 5,
        "Sede Cologno Monzese": 3,
        "Sede Rho": 0,
        "Sede Roma": 0,
        "Sede Firenze": 0,
        "Sede Torino": 0,
        "Sede Napoli": 0
      },
      status: "disponibile"
    },
    {
      id: "B002",
      nome: "BILLY Libreria",
      categoria: "Librerie",
      cap: "20100",
      stock: {
        "Mia Sede": 22,
        "Sede Milano": 10,
        "Sede Roma": 2,
        "Sede Firenze": 8,
        "Sede Torino": 0,
        "Sede Napoli": 4,
        "Sede Bologna": 0,
        "Sede Genova": 1,
        "Sede Palermo": 3,
        "Sede Verona": 6
      },
      status: "disponibile"
    },
    {
      id: "C003",
      nome: "KALLAX Scaffale",
      categoria: "Scaffali",
      cap: "00100",
      stock: {
        "Mia Sede": 0,
        "Sede Roma": 30,
        "Sede Firenze": 5,
        "Sede Torino": 3,
        "Sede Milano": 0,
        "Sede Napoli": 12,
        "Sede Bologna": 7,
        "Sede Genova": 0,
        "Sede Palermo": 4,
        "Sede Verona": 1
      },
      status: "disponibile"
    },
    {
      id: "D004",
      nome: "POÄNG Poltrona",
      categoria: "Sedie e Poltrone",
      cap: "10100",
      stock: {
        "Mia Sede": 10,
        "Sede Roma": 0,
        "Sede Firenze": 6,
        "Sede Torino": 2,
        "Sede Milano": 4,
        "Sede Napoli": 3,
        "Sede Bologna": 1,
        "Sede Genova": 0,
        "Sede Palermo": 0,
        "Sede Verona": 7
      },
      status: "non disponibile"
    },
    {
      id: "E005",
      nome: "MALM Comò 3 cassetti",
      categoria: "Cassettiere",
      cap: "50100",
      stock: {
        "Mia Sede": 0,
        "Sede Roma": 4,
        "Sede Firenze": 12,
        "Sede Torino": 1,
        "Sede Milano": 5,
        "Sede Napoli": 0,
        "Sede Bologna": 8,
        "Sede Genova": 0,
        "Sede Palermo": 3,
        "Sede Verona": 6
      },
      status: "non disponibile"
    },
    {
      id: "F006",
      nome: "EKET Mobile componibile",
      categoria: "Soluzioni Modulari",
      cap: "20100",
      stock: {
        "Mia Sede": 80,
        "Sede Roma": 12,
        "Sede Firenze": 5,
        "Sede Torino": 6,
        "Sede Milano": 9,
        "Sede Napoli": 14,
        "Sede Bologna": 0,
        "Sede Genova": 3,
        "Sede Palermo": 10,
        "Sede Verona": 7
      },
      status: "disponibile"
    },
    {
      id: "G007",
      nome: "LURV Tappeto",
      categoria: "Tappeti",
      cap: "00100",
      stock: {
        "Mia Sede": 0,
        "Sede Roma": 3,
        "Sede Firenze": 5,
        "Sede Torino": 0,
        "Sede Milano": 7,
        "Sede Napoli": 1,
        "Sede Bologna": 2,
        "Sede Genova": 0,
        "Sede Palermo": 4,
        "Sede Verona": 0
      },
      status: "non disponibile"
    },
    {
      id: "H008",
      nome: "POÄNG Poggiapiedi",
      categoria: "Sedie e Poltrone",
      cap: "20100",
      stock: {
        "Mia Sede": 0,
        "Sede Milano": 0,
        "Sede Roma": 0,
        "Sede Firenze": 0,
        "Sede Torino": 0,
        "Sede Napoli": 0,
        "Sede Bologna": 0,
        "Sede Genova": 0,
        "Sede Palermo": 0,
        "Sede Verona": 0
      },
      status: "fuori produzione"
    },
    {
      id: "I009",
      nome: "FÄRGRIK Set piatti",
      categoria: "Cucina",
      cap: "10100",
      stock: {
        "Mia Sede": 0,
        "Sede Roma": 7,
        "Sede Firenze": 4,
        "Sede Torino": 45,
        "Sede Milano": 3,
        "Sede Napoli": 10,
        "Sede Bologna": 1,
        "Sede Genova": 0,
        "Sede Palermo": 5,
        "Sede Verona": 6
      },
      status: "disponibile"
    },
    {
      id: "J010",
      nome: "HEMNES Letto 140",
      categoria: "Letti",
      cap: "20100",
      stock: {
        "Mia Sede": 0,
        "Sede Roma": 28,
        "Sede Firenze": 3,
        "Sede Torino": 1,
        "Sede Milano": 4,
        "Sede Napoli": 8,
        "Sede Bologna": 0,
        "Sede Genova": 6,
        "Sede Palermo": 3,
        "Sede Verona": 7
      },
      status: "non disponibile"
    },
    {
      id: "K011",
      nome: "RÅSHULT Tavolo da lavoro",
      categoria: "Scrivanie",
      cap: "20100",
      stock: {
        "Mia Sede": 0,
        "Sede Roma": 18,
        "Sede Firenze": 5,
        "Sede Torino": 4,
        "Sede Milano": 7,
        "Sede Napoli": 2,
        "Sede Bologna": 1,
        "Sede Genova": 0,
        "Sede Palermo": 9,
        "Sede Verona": 6
      },
      status: "disponibile"
    },
    {
      id: "L012",
      nome: "TROFAST Sistema di stoccaggio",
      categoria: "Stoccaggio",
      cap: "20100",
      stock: {
        "Mia Sede": 0,
        "Sede Roma": 11,
        "Sede Firenze": 6,
        "Sede Torino": 2,
        "Sede Milano": 60,
        "Sede Napoli": 3,
        "Sede Bologna": 10,
        "Sede Genova": 0,
        "Sede Palermo": 5,
        "Sede Verona": 7
      },
      status: "disponibile"
    },
    {
      id: "M013",
      nome: "KLIPPAN Divano 2 posti",
      categoria: "Divani",
      cap: "20100",
      stock: {
        "Mia Sede": 15,
        "Sede Roma": 4,
        "Sede Firenze": 3,
        "Sede Torino": 5,
        "Sede Milano": 1,
        "Sede Napoli": 0,
        "Sede Bologna": 6,
        "Sede Genova": 2,
        "Sede Palermo": 0,
        "Sede Verona": 4
      },
      status: "disponibile"
    },
    {
      id: "N014",
      nome: "VINSTUR Bottiglia",
      categoria: "Accessori Cucina",
      cap: "20100",
      stock: {
        "Mia Sede": 0,
        "Sede Roma": 2,
        "Sede Firenze": 4,
        "Sede Torino": 0,
        "Sede Milano": 8,
        "Sede Napoli": 1,
        "Sede Bologna": 3,
        "Sede Genova": 0,
        "Sede Palermo": 2,
        "Sede Verona": 5
      },
      status: "non disponibile"
    },
    {
      id: "O015",
      nome: "MALM Armadio 2 ante",
      categoria: "Armadi",
      cap: "20100",
      stock: {
        "Mia Sede": 50,
        "Sede Roma": 9,
        "Sede Firenze": 7,
        "Sede Torino": 2,
        "Sede Milano": 11,
        "Sede Napoli": 4,
        "Sede Bologna": 0,
        "Sede Genova": 6,
        "Sede Palermo": 2,
        "Sede Verona": 3
      },
      status: "disponibile"
    },
    {
      id: "P016",
      nome: "NORDLI Cassettiera",
      categoria: "Cassettiere",
      cap: "20100",
      stock: {
        "Mia Sede": 0,
        "Sede Roma": 3,
        "Sede Firenze": 2,
        "Sede Torino": 5,
        "Sede Milano": 20,
        "Sede Napoli": 1,
        "Sede Bologna": 7,
        "Sede Genova": 0,
        "Sede Palermo": 4,
        "Sede Verona": 3
      },
      status: "non disponibile"
    },
    {
      id: "Q017",
      nome: "LÄTTAD Contenitore cestino",
      categoria: "Stoccaggio",
      cap: "20100",
      stock: {
        "Mia Sede": 12,
        "Sede Roma": 1,
        "Sede Firenze": 3,
        "Sede Torino": 0,
        "Sede Milano": 5,
        "Sede Napoli": 2,
        "Sede Bologna": 0,
        "Sede Genova": 4,
        "Sede Palermo": 0,
        "Sede Verona": 6
      },
      status: "disponibile"
    },
    {
      id: "R018",
      nome: "SKUBB Scatola tessile",
      categoria: "Organizzazione",
      cap: "20100",
      stock: {
        "Mia Sede": 70,
        "Sede Roma": 6,
        "Sede Firenze": 12,
        "Sede Torino": 4,
        "Sede Milano": 9,
        "Sede Napoli": 1,
        "Sede Bologna": 10,
        "Sede Genova": 0,
        "Sede Palermo": 5,
        "Sede Verona": 8
      },
      status: "disponibile"
    },
    {
      id: "S019",
      nome: "EKET Mensola",
      categoria: "Soluzioni Modulari",
      cap: "50100",
      stock: {
        "Mia Sede": 0,
        "Sede Roma": 5,
        "Sede Firenze": 25,
        "Sede Torino": 4,
        "Sede Milano": 6,
        "Sede Napoli": 2,
        "Sede Bologna": 0,
        "Sede Genova": 7,
        "Sede Palermo": 3,
        "Sede Verona": 1
      },
      status: "disponibile"
    },
    {
      id: "T020",
      nome: "LAGAN Tavolo pieghevole",
      categoria: "Tavoli",
      cap: "10100",
      stock: {
        "Mia Sede": 0,
        "Sede Roma": 7,
        "Sede Firenze": 2,
        "Sede Torino": 35,
        "Sede Milano": 3,
        "Sede Napoli": 10,
        "Sede Bologna": 4,
        "Sede Genova": 0,
        "Sede Palermo": 5,
        "Sede Verona": 6
      },
      status: "disponibile"
    }
  ];


  const summaryButtons = [
    {
      label: "Totale articoli",
      number: prodotti.length,
      icon: <Warehouse size={32} color="#090c64" weight="duotone" />,

      clickable: false
    },
    /* {
         label: "Articoli in esaurimento",
         number: prodotti.filter(p => Object.values(p.stock).reduce((a, b) => a + b, 0) < 5).length,
         icon: deliverytimeIcon,
         clickable: true,
         onClick: () => alert("Filtra articoli in esaurimento") // da sostoituire cn filtro 
     },*/
    {
      label: "Carica giacenza",
      icon: <PlusCircle size={32} color="#090c64" weight="duotone" />,
      clickable: true,
      onClick: () => setDrawerAddOpen(true)
    },
  ];

  const handleAddProduct = (newProduct) => {
    prodotti.push(newProduct); // qui puoi usare setState se rendi prodotti uno state
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
                <span className="font-bold">{btn.label}</span>
                {btn.number !== undefined && (
                  <span className="text-sm opacity-70 leading-none">{btn.number}</span>
                )}
              </span>
            </button>
          ))}
        </div>



        {/* TABELLA */}
        <WarehouseTable
          data={prodotti}
          columns={columns}
        />
{/*
        {/* LEGENDA PALLINI 
        <div className="mt-4 flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span>
            <span className="text-sm text-[#134a7b]">Disponibile</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-500 inline-block"></span>
            <span className="text-sm text-[#134a7b]">Non disponibile</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-black inline-block"></span>
            <span className="text-sm text-[#134a7b]">Fuori produzione</span>
          </div>
        </div>
*/}
        {/* DRAWER AGGIUNGI PRODOTTO */}
        <DrawerAddNewProduct
          open={drawerAddOpen}
          onClose={() => setDrawerAddOpen(false)}
          onAddProduct={handleAddProduct}
        />

      </div>
    </div>
  );
};

export default WarehousePage;