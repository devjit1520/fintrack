import {
  Pencil,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function TransactionTable({
  search = "",
  filter = "all",
  category = "all",
  sort = "newest",
  onEdit,
}) {
  const { transactions, deleteTransaction } = useFinance();


  let filteredTransactions = [...transactions].filter((item)=>{

    const title =
      item.title?.toLowerCase() || "";

    const cat =
      item.category?.toLowerCase() || "";

    const text =
      search.toLowerCase();


    return (
      (title.includes(text) ||
      cat.includes(text))
      &&
      (filter==="all" ||
      item.type===filter)
      &&
      (category==="all" ||
      item.category===category)
    );

  });



  filteredTransactions.sort((a,b)=>{

    if(sort==="highest")
      return Number(b.amount)-Number(a.amount);


    if(sort==="lowest")
      return Number(a.amount)-Number(b.amount);


    if(sort==="oldest")
      return new Date(a.date)-new Date(b.date);


    return new Date(b.date)-new Date(a.date);

  });



  return (

<Card
className="
rounded-3xl
border
border-slate-200
bg-white
p-8
shadow-xl

dark:border-slate-700
dark:bg-slate-900

overflow-hidden
"
>



{/* Header */}

<div className="
mb-8
flex
items-center
justify-between
">


<div>

<h2 className="
text-3xl
font-bold
text-slate-900
dark:text-white
">

Transactions

</h2>


<p className="
text-slate-500
dark:text-slate-400
">

Manage all your income and expenses

</p>

</div>



<div
className="
rounded-full
bg-blue-100
px-5
py-2
font-semibold
text-blue-700

dark:bg-blue-500/20
dark:text-blue-300
"
>

{filteredTransactions.length} Records

</div>


</div>





{
filteredTransactions.length===0 ?

(

<div className="
flex
h-64
items-center
justify-center
text-slate-500
">

No Transactions Found

</div>

)

:

(


<div
className="
max-h-[520px]
overflow-y-auto
overflow-x-hidden

rounded-2xl
border
border-slate-200

dark:border-slate-700
"
>


<table
className="
w-full
table-fixed
"
>



<thead
className="
sticky
top-0
z-10
bg-slate-100

dark:bg-slate-800
"
>

<tr>


<th className="
w-[28%]
px-5
py-5
text-left
text-sm
text-slate-600
dark:text-slate-300
">

Transaction

</th>


<th className="
w-[15%]
px-5
py-5
text-left
text-sm
text-slate-600
dark:text-slate-300
">

Category

</th>


<th className="
w-[15%]
px-5
py-5
text-left
text-sm
text-slate-600
dark:text-slate-300
">

Type

</th>


<th className="
w-[15%]
px-5
py-5
text-left
text-sm
text-slate-600
dark:text-slate-300
">

Date

</th>



<th className="
w-[12%]
px-5
py-5
text-right
text-sm
text-slate-600
dark:text-slate-300
">

Amount

</th>



<th className="
w-[15%]
px-5
py-5
text-center
text-sm
text-slate-600
dark:text-slate-300
">

Actions

</th>


</tr>


</thead>




<tbody>


{
filteredTransactions.map((item)=>(


<tr
key={item.id}
className="
border-b
border-slate-200
hover:bg-slate-50

dark:border-slate-800
dark:hover:bg-slate-800/50
"
>



{/* Transaction */}

<td className="
px-5
py-5
">

<div className="
flex
items-center
gap-3
">


<div
className={`
flex
h-11
w-11
shrink-0
items-center
justify-center
rounded-2xl

${
item.type==="income"

?
"bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"

:

"bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"

}

`}
>


{
item.type==="income"

?

<ArrowUpCircle size={22}/>

:

<ArrowDownCircle size={22}/>

}


</div>




<div className="
min-w-0
">

<h3 className="
truncate
font-semibold
text-slate-900

dark:text-white
">

{item.title}

</h3>


</div>


</div>

</td>





{/* Category */}

<td className="px-5">

<span
className="
rounded-full
bg-slate-100
px-4
py-2
text-sm
font-medium
text-slate-700

dark:bg-slate-700
dark:text-slate-200
"
>
{item.category}
</span>

</td>





{/* Type */}

<td className="px-5">


<span
className={`
rounded-full
px-3
py-1
text-xs
font-bold

${
item.type==="income"

?
"bg-green-100 text-green-700"

:

"bg-red-100 text-red-700"

}

`}
>

{item.type}

</span>


</td>





{/* Date */}

<td className="
px-5
text-slate-600
dark:text-slate-300
">


{
new Date(item.date)
.toLocaleDateString(
"en-IN",
{
day:"2-digit",
month:"short",
year:"numeric"
}
)
}


</td>





{/* Amount */}

<td
className={`
px-5
text-right
font-bold

${
item.type==="income"

?
"text-green-500"

:

"text-red-500"

}

`}
>

{item.type==="income"?"+":"-"}
₹{Number(item.amount)
.toLocaleString("en-IN")}


</td>





{/* Actions */}

<td className="
px-5
">


<div className="
flex
justify-center
gap-2
">


<button

onClick={()=>onEdit(item)}

className="
rounded-xl
bg-blue-100
p-3
text-blue-600
hover:bg-blue-600
hover:text-white
transition
"
>

<Pencil size={17}/>

</button>




<button

onClick={()=>{

if(confirm("Delete this transaction?"))
deleteTransaction(item.id)

}}

className="
rounded-xl
bg-red-100
p-3
text-red-600
hover:bg-red-600
hover:text-white
transition
"
>

<Trash2 size={17}/>

</button>



</div>


</td>



</tr>


))
}



</tbody>


</table>


</div>


)

}


</Card>

  );
}


export default TransactionTable;