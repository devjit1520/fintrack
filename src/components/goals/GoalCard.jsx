import { useState } from "react";
import { Pencil, Trash2, Calendar } from "lucide-react";

import Card from "../common/Card";
import useGoal from "../../hooks/useGoal";
import EditGoalModal from "./EditGoalModal";

function GoalCard({ goal }) {

  const { deleteGoal } = useGoal();

  const [editing, setEditing] = useState(false);


  // FIX: support old + new goal fields
  const targetAmount =
    Number(goal.targetAmount || goal.target || goal.amount || 0);


  const savedAmount =
    Number(goal.savedAmount || goal.saved || 0);



  const progress = targetAmount > 0
    ? Math.min(
        (savedAmount / targetAmount) * 100,
        100
      )
    : 0;



  const daysRemaining = goal.deadline
    ? Math.max(
        0,
        Math.ceil(
          (new Date(goal.deadline) - new Date()) /
          (1000 * 60 * 60 * 24)
        )
      )
    : null;



  return (
    <>

    <Card>

      <div className="flex items-start justify-between">


        <div>

          <h2 className="text-2xl font-bold text-white">
            {goal.title}
          </h2>


          <p className="mt-1 text-slate-400">
            {goal.category || "Savings Goal"}
          </p>


        </div>



        <div className="flex gap-2">


          <button
            onClick={()=>setEditing(true)}
            className="
            rounded-lg
            bg-blue-500/20
            p-2
            text-blue-400
            hover:bg-blue-500/30
            "
          >
            <Pencil size={18}/>
          </button>



          <button

          onClick={()=>{

            if(
              window.confirm(
                "Delete this goal?"
              )
            ){

              deleteGoal(goal.id);

            }

          }}

          className="
          rounded-lg
          bg-red-500/20
          p-2
          text-red-400
          hover:bg-red-500/30
          "

          >

            <Trash2 size={18}/>

          </button>


        </div>


      </div>




      <div className="mt-6 flex justify-between">


        <div>

          <p className="text-slate-400">
            Saved
          </p>


          <h3 className="text-2xl font-bold text-green-400">

            ₹{savedAmount.toLocaleString("en-IN")}

          </h3>


        </div>




        <div className="text-right">

          <p className="text-slate-400">
            Target
          </p>


          <h3 className="text-2xl font-bold text-cyan-400">

            ₹{targetAmount.toLocaleString("en-IN")}

          </h3>


        </div>


      </div>





      <div className="mt-6 h-4 rounded-full bg-slate-800">


        <div

        className="
        h-full
        rounded-full
        bg-gradient-to-r
        from-cyan-500
        to-blue-500
        transition-all
        duration-700
        "

        style={{
          width:`${progress}%`
        }}

        />

      </div>




      <div className="mt-3 flex items-center justify-between">


        <span className="text-sm text-slate-400">

          {progress.toFixed(0)}% Completed

        </span>



        {
          progress >= 100 ? (

            <span className="
            rounded-full
            bg-green-500/20
            px-3 py-1
            text-green-400
            ">
              Goal Achieved 🎉
            </span>

          ) : (

            <span className="
            flex items-center
            gap-2
            text-sm
            text-yellow-400
            ">

              <Calendar size={15}/>

              {daysRemaining ?? "--"} Days Left

            </span>

          )

        }


      </div>


    </Card>




    <EditGoalModal

      open={editing}

      goal={goal}

      onClose={()=>setEditing(false)}

    />


    </>

  );

}


export default GoalCard;