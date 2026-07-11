import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

function GoalModal({ open, onClose, onGoalAdded }) {

  // const [goalName, setGoalName] = useState("");

  const [goal, setGoal] = useState({
    title: "",
    amount: "",
    deadline: "",
  });


  const handleChange = (e) => {
    setGoal({
      ...goal,
      [e.target.name]: e.target.value,
    });
  };


//   const handleSave = () => {

//     if (!goal.title || !goal.amount) {
//       alert("Please fill all required fields");
//       return;
//     }


//    const newGoal = {
//   id: Date.now(),
//   title: goal.title,
//   amount: Number(goal.amount),
//   savedAmount: 0,
//   deadline: goal.deadline,

//   status: "Active",   // add this

//   createdAt: new Date().toISOString(),
// };


//     // Get old goals
//     const oldGoals =
//       JSON.parse(localStorage.getItem("goals")) || [];


//     // Add new goal
//     const updatedGoals = [
//       ...oldGoals,
//       newGoal
//     ];


//     // Save permanently
//     localStorage.setItem(
//       "goals",
//       JSON.stringify(updatedGoals)
//     );


//     // Update dashboard instantly
//     if(onGoalAdded){
//       onGoalAdded(newGoal);
//     }


//     setGoal({
//       title:"",
//       amount:"",
//       deadline:"",
//     });


//     alert("Goal Saved Successfully!");

//     onClose();

//   };

const handleSave = () => {

  if (!goal.title || !goal.amount) {
    alert("Please fill all fields");
    return;
  }


  // const newGoal = {
  //   id: Date.now(),
  //   title: goal.title,
  //   amount: Number(goal.amount),
  //   savedAmount: 0,
  //   deadline: goal.deadline,
  //   status: "Active",
  //   createdAt: new Date().toISOString(),
  // };


//   const newGoal = {
//   id: Date.now(),
//   title: goal.title,
//   targetAmount: Number(goal.amount),
//   savedAmount: 0,
//   deadline: goal.deadline,
//   category: "Savings",
//   status: "Active"
// };

const handleSave = () => {

  if (!goal.title || !goal.amount) {
    alert("Please fill all fields");
    return;
  }


  const newGoal = {

    id: Date.now(),

    name: goal.title,

    targetAmount: Number(goal.amount),

    savedAmount: 0,

    deadline: goal.deadline,

    category: "Savings",

    status: "Active",

    createdAt: new Date().toISOString()

  };


  const existingGoals =
    JSON.parse(localStorage.getItem("goals")) || [];


  const updatedGoals = [
    ...existingGoals,
    newGoal
  ];


  localStorage.setItem(
    "goals",
    JSON.stringify(updatedGoals)
  );


  if(onGoalAdded){
    onGoalAdded(newGoal);
  }


  setGoal({

    title:"",
    amount:"",
    deadline:""

  });


  onClose();

};


  const existingGoals =
    JSON.parse(localStorage.getItem("goals")) || [];


  const updatedGoals = [
    ...existingGoals,
    newGoal
  ];


  localStorage.setItem(
    "goals",
    JSON.stringify(updatedGoals)
  );


  // IMPORTANT
  onGoalAdded(newGoal);


  setGoal({
    title:"",
    amount:"",
    deadline:"",
  });


  onClose();

};



  if(!open) return null;



  return (

    <div className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/70 backdrop-blur-sm
    ">


      <motion.div

      initial={{scale:0.8,opacity:0}}
      animate={{scale:1,opacity:1}}

      className="
      w-full max-w-md
      rounded-3xl
      bg-slate-900
      p-8
      shadow-2xl
      "

      >


        <div className="flex justify-between mb-6">


          <h2 className="
          text-2xl
          font-bold
          text-white
          ">
            Set Savings Goal
          </h2>


          <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
          >
            <X/>
          </button>


        </div>




        <input

        className="
        mb-4 w-full
        rounded-xl
        bg-slate-800
        p-3
        text-white
        "

        placeholder="Goal Name"

        name="title"

        value={goal.title}

        onChange={handleChange}

        />





        <input

        className="
        mb-4 w-full
        rounded-xl
        bg-slate-800
        p-3
        text-white
        "

        type="number"

        placeholder="Target Amount"

        name="amount"

        value={goal.amount}

        onChange={handleChange}

        />






        <input

        className="
        mb-6 w-full
        rounded-xl
        bg-slate-800
        p-3
        text-white
        "

        type="date"

        name="deadline"

        value={goal.deadline}

        onChange={handleChange}

        />





        <div className="flex justify-end gap-3">


          <button

          onClick={onClose}

          className="
          rounded-xl
          bg-slate-700
          px-5 py-3
          text-white
          "

          >
            Cancel
          </button>




          <button

          onClick={handleSave}

          className="
          rounded-xl
          bg-blue-600
          px-5 py-3
          text-white
          hover:bg-blue-700
          "

          >
            Save Goal
          </button>



        </div>


      </motion.div>


    </div>

  );
}


export default GoalModal;