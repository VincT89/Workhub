import Table from "../../components/Table";
import { useState } from "react";
import FilterByCard from "../../components/Customer/FilterByCard";
import AddCustomerForm from "../../components/Customer/AddCustomerForm";
import { useNavigate } from "react-router-dom";

const CustomersPage = () => {
  const initialCustomers = [
    {
      id: 1,
      nome: "Mario Mario",
      indirizzo: "Via Roma 12",
      citta: "Roma",
      cap: "00100",
      provincia: "RM",
      email: "mariobros@super.com",
      telefono: "+39 333 1234567",
      Nascita: "1985-06-01",
      CF: "MRAMRA85H01H501Z",
      livello: "Standard",
      punti: 120,
    },
    {
      id: 2,
      nome: "Luigi Mario",
      indirizzo: "Via Roma 12",
      citta: "Roma",
      cap: "00100",
      provincia: "RM",
      email: "luigibros@super.com",
      telefono: "+39 333 9876543",
      Nascita: "1987-09-15",
      CF: "MRALGU87P15H501C",
      livello: "Premium",
      punti: 530,
    },
    {
      id: 3,
      nome: "Homer Simpson",
      indirizzo: "Evergreen Terrace 123",
      citta: "Springfield",
      cap: "54321",
      provincia: "SP",
      email: "homer@simpson.com",
      telefono: "+1 555 1234567",
      Nascita: "1970-05-12",
      CF: "SMPHMR70E12Z404B",
      livello: "Premium",
      punti: 220,
    },
    {
      id: 4,
      nome: "Marge Simpson",
      indirizzo: "Evergreen Terrace 123",
      citta: "Springfield",
      cap: "54321",
      provincia: "SP",
      email: "marge@simpson.com",
      telefono: "+1 555 9876543",
      Nascita: "1973-03-19",
      CF: "SMPMRG73C19Z404K",
      livello: "Premium",
      punti: 130,
    },
    {
      id: 5,
      nome: "Bart Simpson",
      indirizzo: "Evergreen Terrace 123",
      citta: "Springfield",
      cap: "54321",
      provincia: "SP",
      email: "bart@simpson.com",
      telefono: "+1 555 2223334",
      Nascita: "2005-04-01",
      CF: "SMPBRT05D01Z404T",
      livello: "Standard",
      punti: 620,
    },
    {
      id: 6,
      nome: "Lisa Simpson",
      indirizzo: "Evergreen Terrace 123",
      citta: "Springfield",
      cap: "54321",
      provincia: "SP",
      email: "lisa@simpson.com",
      telefono: "+1 555 1112223",
      Nascita: "2007-05-09",
      CF: "SMPLSI07E09Z404S",
      livello: "Standard",
      punti: 900,
    },
    {
      id: 7,
      nome: "Peter Griffin",
      indirizzo: "Via Milano 30",
      citta: "Milano",
      cap: "20100",
      provincia: "MI",
      email: "peter@griffin.com",
      telefono: "+39 333 7654321",
      Nascita: "1978-07-20",
      CF: "GRFPTR78L20F205T",
      livello: "Premium",
      punti: 350,
    },
    {
      id: 8,
      nome: "Lois Griffin",
      indirizzo: "Via Milano 30",
      citta: "Milano",
      cap: "20100",
      provincia: "MI",
      email: "lois@griffin.com",
      telefono: "+39 333 6543210",
      Nascita: "1980-10-05",
      CF: "GRFLIS80R05F205J",
      livello: "Premium",
      punti: 430,
    },
  ];

  const [customers, setCustomers] = useState(initialCustomers);
  const [cardFilter, setCardFilter] = useState("");

  const filteredCustomers = customers.filter((c) =>
    cardFilter ? c.livello === cardFilter : true
  );

  const handleAddCustomer = (customer) => {
    setCustomers((prev) => [...prev, customer]);
  };

  const navigate = useNavigate();

  return (
     <Table
        data={filteredCustomers}
        columns={Object.keys(customers[0])}
        customToolbar={() => (
          <>
            <FilterByCard onFilter={setCardFilter} />
            <AddCustomerForm onAdd={handleAddCustomer} />
          </>
      )}
       onRowClick={(cliente) => navigate("/customers/registry", { state: cliente })}
      />
  );
};

export default CustomersPage;