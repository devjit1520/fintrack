import { useRef } from "react";
import { motion } from "framer-motion";

import {
  Database,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  FileSpreadsheet,
  ShieldCheck,
} from "lucide-react";

import useFinance from "../../hooks/useFinance";
import useBudget from "../../hooks/useBudget";
import useGoal from "../../hooks/useGoal";


function DataManagement() {

  const fileInput = useRef(null);


  const {
    transactions,
    setTransactions,
  } = useFinance();


  const {
    budgets,
    setBudgets,
  } = useBudget();


  const {
    goals,
    setGoals,
  } = useGoal();



  // Backup JSON
  const backupJSON = () => {


    const data = {

      transactions,
      budgets,
      goals,

      exportedAt:
        new Date().toISOString(),

    };


    const blob = new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type:"application/json"
      }
    );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href=url;

    link.download=
      "FinTrack_Backup.json";


    link.click();


    URL.revokeObjectURL(url);

  };




  // CSV Export

  const exportCSV = ()=>{


    if(!transactions.length){

      alert(
        "No transactions found."
      );

      return;

    }


    const headers=[
      "Title",
      "Category",
      "Type",
      "Amount",
      "Date"
    ];


    const rows =
      transactions.map(item=>[

        item.title,
        item.category,
        item.type,
        item.amount,
        item.date

      ]);



    const csv=[

      headers.join(","),

      ...rows.map(
        row=>row.join(",")
      )

    ].join("\n");



    const blob =
      new Blob(
        [csv],
        {
          type:"text/csv"
        }
      );



    const url =
      URL.createObjectURL(blob);



    const link =
      document.createElement("a");



    link.href=url;

    link.download=
      "FinTrack_Transactions.csv";


    link.click();


    URL.revokeObjectURL(url);

  };





  // Restore backup

  const restoreBackup=(e)=>{


    const file =
      e.target.files[0];


    if(!file)return;



    const reader =
      new FileReader();



    reader.onload=(event)=>{


      try{


        const data =
          JSON.parse(
            event.target.result
          );



        setTransactions(
          data.transactions || []
        );


        setBudgets(
          data.budgets || []
        );


        setGoals(
          data.goals || []
        );


        alert(
          "Backup restored successfully"
        );


      }
      catch{


        alert(
          "Invalid backup file"
        );

      }


    };



    reader.readAsText(file);


  };





  const clearAll=()=>{


    const confirmDelete =
      window.confirm(
        "Delete all FinTrack data?"
      );


    if(!confirmDelete)
      return;



    setTransactions([]);

    setBudgets([]);

    setGoals([]);



    localStorage.clear();



    alert(
      "All data removed"
    );

  };





  const resetDemo=()=>{


    if(
      window.confirm(
        "Reload application?"
      )
    ){

      window.location.reload();

    }

  };






  const actions=[

    {
      title:"Backup JSON",
      icon:Download,
      action:backupJSON,
      style:
      "from-cyan-500 to-blue-600"
    },


    {
      title:"Export CSV",
      icon:FileSpreadsheet,
      action:exportCSV,
      style:
      "from-green-500 to-emerald-600"
    },


    {
      title:"Restore Backup",
      icon:Upload,
      action:()=>fileInput.current.click(),
      style:
      "from-blue-500 to-indigo-600"
    },


    {
      title:"Clear All Data",
      icon:Trash2,
      action:clearAll,
      style:
      "from-red-500 to-rose-600"
    },


    {
      title:"Reload App",
      icon:RotateCcw,
      action:resetDemo,
      style:
      "from-yellow-500 to-orange-600"
    }

  ];






return (

<motion.div

initial={{
opacity:0,
y:25
}}

animate={{
opacity:1,
y:0
}}

className="
relative
overflow-hidden
rounded-3xl

border
border-slate-200
dark:border-white/10

bg-white
dark:bg-white/5

p-8

shadow-xl

backdrop-blur-xl

"

>


<div
className="
absolute
-right-20
-top-20
h-60
w-60
rounded-full
bg-cyan-500/20
blur-3xl
"
/>



<div className="
relative
mb-8
flex
items-center
gap-3
">


<div className="
rounded-2xl
bg-cyan-500/20
p-3
">

<Database
className="text-cyan-400"
/>

</div>


<div>

<h2 className="
text-2xl
font-bold

text-slate-900
dark:text-white
">

Data Management

</h2>


<p className="
text-sm
text-slate-500
dark:text-slate-400
">

Protect and manage your financial data

</p>


</div>


</div>





<div className="
mb-6
flex
items-center
gap-3
rounded-2xl
bg-cyan-500/10
p-4
">


<ShieldCheck
className="text-cyan-400"
/>


<p className="
text-sm
text-slate-600
dark:text-slate-300
">

Your data is stored locally and securely.

</p>


</div>





<div className="
grid
gap-4
md:grid-cols-2
">


{actions.map((item)=>{


const Icon=item.icon;


return (

<motion.button

key={item.title}

whileHover={{
scale:1.03,
y:-3
}}

whileTap={{
scale:.97
}}

onClick={item.action}

className={`
flex
items-center
gap-4
rounded-2xl

bg-gradient-to-r
${item.style}

p-5

font-semibold

text-white

shadow-lg

transition

`}

>


<div className="
rounded-xl
bg-white/20
p-3
">


<Icon
size={24}
/>


</div>


{item.title}


</motion.button>


)


})}


</div>





<input

ref={fileInput}

type="file"

hidden

accept=".json"

onChange={restoreBackup}

/>


</motion.div>


)

}


export default DataManagement;