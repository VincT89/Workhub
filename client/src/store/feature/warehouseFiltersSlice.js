/* Creo lo slice per le LOGICHE FRONTEND: 
i filtri della tabella del magazzino che non arriveranno dal backend 
ma saranno collegati al fetch in itemSlice.
warehouseFilterSlice conterrà: 
1 - lo stato iniziale dei filtri ( categoria selezionata, testo di ricerca, 
filtro “in esaurimento”, ordinamento A-Z). 
È lo stato che cambia solo quando l’utente clicca qualcosa,
NON deve essere mescolato con i dati veri
NON deve essere salvato nel backend

2 - i reducers per modificarli
3 - l’export delle actions e del reducer 

STATO INIZIALE DEI FILTRI IN WAREHOUSEPAGE.JSX:
const [selectedCategory, setSelectedCategory] = useState("Categorie");
const [searchTerm, setSearchTerm] = useState("");
const [sortAZ, setSortAZ] = useState(false);
const [lowStockFilter, setLowStockFilter] = useState(false);
*/

import { createSlice } from "@reduxjs/toolkit";

// INITIAL STATE DEI FILTRI 
const initialState = {
  selectedCategory: "Tutte le categorie",
  searchTerm: "",
  sortAZ: false,
  lowStockFilter: false,
};

const warehouseFiltersSlice = createSlice({
  name: "warehouseFilters",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    toggleSortAZ: (state) => {
      state.sortAZ = !state.sortAZ;
    },
    toggleLowStockFilter: (state) => {
      state.lowStockFilter = !state.lowStockFilter;
    },
    resetFilters: (state) => {
      state.selectedCategory = "Categorie";
      state.searchTerm = "";
      state.sortAZ = false;
      state.lowStockFilter = false;
    }
  }
});

export const {
  setSelectedCategory,
  setSearchTerm,
  toggleSortAZ,
  toggleLowStockFilter,
  resetFilters
} = warehouseFiltersSlice.actions;

export default warehouseFiltersSlice.reducer;


/*

//@ Slice 1 → itemsSlice
Gestisce:

- dati reali
- API
- CRUD

sincronizzazione con MongoDB

//@ Slice 2 → warehouseFiltersSlice
Gestisce:

- filtri
- ricerca
- ordinamento
- stato della UI

//? Il componente "WarehouseTable.jsx" combina i due slice:
Applica i filtri ai dati usando useMemo o un selector memoizzato.

Tipo di stato   Chi lo gestisce Perché va separato
- Dati veri (prodotti) --> itemsSlice: vengono dal backend, devono essere sincronizzati
- Filtri della UI --> warehouseFiltersSlice: sono temporanei, cambiano solo nella pagina

//? PERCHé DUE SLICE SEPARATI? 
Se li mescoli:
- il codice diventa confuso
- lo stato diventa enorme
- ogni volta che cambi un filtro, Redux pensa che stai cambiando i dati veri
- rischi di fare re-render inutili
- non puoi riutilizzare i filtri in altre pagine
*/