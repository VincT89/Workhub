import Table from "../../components/Table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterByCard from "../../components/Customer/FilterByCard";
import AddCustomerForm from "../../components/Customer/AddCustomerForm";

const CustomersPage = () => {

  const navigate = useNavigate();


  const initialCustomers = [
    {
      id: 1,
      nome: "Mario",
      cognome: "Mario",
      indirizzo: "Via Roma 12",
      citta: "Roma",
      cap: "00100",
      provincia: "RM",
      paese: "Italia",
      email: "mariobros@super.com",
      telefono: "+39 333 1234567",
      nascita: "1985-06-01",
      CF: "MRAMRA85H01H501Z",
      livello: "Standard",
      punti: 120,
      tessera: "A001"
    },
    {
      id: 2,
      nome: "Luigi",
      cognome: "Mario",
      indirizzo: "Via Roma 12",
      citta: "Roma",
      cap: "00100",
      provincia: "RM",
      paese: "Italia",
      email: "luigibros@super.com",
      telefono: "+39 333 9876543",
      nascita: "1987-09-15",
      CF: "MRALGU87P15H501C",
      livello: "Premium",
      punti: 530,
      tessera: "A002"
    },
    {
      id: 3,
      nome: "Homer",
      cognome: "Simpson",
      indirizzo: "Evergreen Terrace 123",
      citta: "Springfield",
      cap: "54321",
      provincia: "SP",
      paese: "USA",
      email: "homer@simpson.com",
      telefono: "+1 555 1234567",
      nascita: "1970-05-12",
      CF: "SMPHMR70E12Z404B",
      livello: "Premium",
      punti: 220,
      tessera: "A003"
    },
    {
      id: 4,
      nome: "Marge",
      cognome: "Simpson",
      indirizzo: "Evergreen Terrace 123",
      citta: "Springfield",
      cap: "54321",
      provincia: "SP",
      paese: "USA",
      email: "marge@simpson.com",
      telefono: "+1 555 9876543",
      nascita: "1973-03-19",
      CF: "SMPMRG73C19Z404K",
      livello: "Premium",
      punti: 130,
      tessera: "A004"
    },
    {
      id: 5,
      nome: "Bart",
      cognome: "Simpson",
      indirizzo: "Evergreen Terrace 123",
      citta: "Springfield",
      cap: "54321",
      provincia: "SP",
      paese: "USA",
      email: "bart@simpson.com",
      telefono: "+1 555 2223334",
      nascita: "2005-04-01",
      CF: "SMPBRT05D01Z404T",
      livello: "Standard",
      punti: 620,
      tessera: "A005"
    },
    {
      id: 6,
      nome: "Lisa",
      cognome: "Simpson",
      indirizzo: "Evergreen Terrace 123",
      citta: "Springfield",
      cap: "54321",
      provincia: "SP",
      paese: "USA",
      email: "lisa@simpson.com",
      telefono: "+1 555 1112223",
      nascita: "2007-05-09",
      CF: "SMPLSI07E09Z404S",
      livello: "Standard",
      punti: 900,
      tessera: "A006"
    },
    {
      id: 7,
      nome: "Peter",
      cognome: "Griffin",
      indirizzo: "Via Milano 30",
      citta: "Milano",
      cap: "20100",
      provincia: "MI",
      paese: "Italia",
      email: "peter@griffin.com",
      telefono: "+39 333 7654321",
      nascita: "1978-07-20",
      CF: "GRFPTR78L20F205T",
      livello: "Premium",
      punti: 350,
      tessera: "A007"
    },
    {
      id: 8,
      nome: "Lois",
      cognome: "Griffin",
      indirizzo: "Via Milano 30",
      citta: "Milano",
      cap: "20100",
      provincia: "MI",
      paese: "Italia",
      email: "lois@griffin.com",
      telefono: "+39 333 6543210",
      nascita: "1980-10-05",
      CF: "GRFLIS80R05F205J",
      livello: "Premium",
      punti: 430,
      tessera: "A008"
    }
  ];


  const [customers, setCustomers] = useState(initialCustomers);
  const [cardFilter, setCardFilter] = useState("");

  const filteredCustomers = customers.filter((c) =>
    cardFilter ? c.livello === cardFilter : true
  );

  const handleAddCustomer = (customer) => {
    setCustomers((prev) => [...prev, customer]);
  };

  return (
    <div className="w-full min-h-screen p-8  text-[#090c64]">
      <Table
        data={filteredCustomers}
        columns={Object.keys(customers[0])}
        customToolbar={() => (
          <>
            <FilterByCard onFilter={setCardFilter} />
            <AddCustomerForm onAdd={handleAddCustomer} />
          </>
        )}
        onRowClick={(row) => navigate(`/customer/${row.id}`, { state: row })}
      />
    </div>
  );
};

export default CustomersPage;