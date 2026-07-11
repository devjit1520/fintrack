import { useState, useContext } from "react";
import { FinanceContext } from "../../context/FinanceContext";
import TransactionHeader from "../../components/transactions/TransactionHeader";
import TransactionStats from "../../components/transactions/TransactionStats";
import TransactionSearch from "../../components/transactions/TransactionSearch";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import TransactionTable from "../../components/transactions/TransactionTable";
import EditTransactionModal from "../../components/transactions/EditTransactionModal";
// import { AddTransactionForm } from "../../components/transactions/AddTransactionForm";
import AddTransactionForm from "../../components/transactions/AddTransactionForm";


function Transactions(){
  

  const { addTransaction } = useContext(FinanceContext);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [category, setCategory] = useState("all");

  const [sort, setSort] = useState("newest");

  const [editing, setEditing] = useState(null);

  const [showForm, setShowForm] = useState(false);

 const handleAddTransaction = (transaction) => {
  addTransaction(transaction);
  setShowForm(false);
};



  return (

    <section className="space-y-8">


     <TransactionHeader
  onAddClick={() => {
    console.log("Button clicked");
    setShowForm(true);
  }}
/>



      {
        showForm && (

          <div className="relative">

 <AddTransactionForm
  onAdd={handleAddTransaction}
  onClose={() => setShowForm(false)}
/>


            {/* <button

              onClick={() => setShowForm(false)}

              className="
              mt-4
              rounded-xl
              bg-red-500
              px-6
              py-3
              text-white
              font-semibold
              "

            >

              Close

            </button> */}


          </div>

        )
      }





      <TransactionStats />





      <div className="grid gap-6 lg:grid-cols-4">


        <div className="lg:col-span-3">


          <TransactionSearch

            search={search}

            setSearch={setSearch}

          />


        </div>





        <TransactionFilters

          filter={filter}

          setFilter={setFilter}

          category={category}

          setCategory={setCategory}

          sort={sort}

          setSort={setSort}

        />


      </div>






      <TransactionTable

        search={search}

        filter={filter}

        category={category}

        sort={sort}

        onEdit={setEditing}

      />






      {
        editing && (

          <EditTransactionModal

            transaction={editing}

            onClose={() => setEditing(null)}

          />

        )
      }



    </section>

  );

}


export default Transactions;