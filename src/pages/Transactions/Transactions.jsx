import { useState } from "react";

import TransactionHeader from "../../components/transactions/TransactionHeader";
import TransactionStats from "../../components/transactions/TransactionStats";
import TransactionSearch from "../../components/transactions/TransactionSearch";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import TransactionTable from "../../components/transactions/TransactionTable";
import EditTransactionModal from "../../components/transactions/EditTransactionModal";

function Transactions() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [editing, setEditing] = useState(null);

  return (
    <section className="space-y-8">
      <TransactionHeader />

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


{editing && (
  <EditTransactionModal
    transaction={editing}
    onClose={() => setEditing(null)}
  />
)}
    </section>
  );
}

export default Transactions;