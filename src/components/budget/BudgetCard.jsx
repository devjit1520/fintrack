import { useState } from "react";
import { motion } from "framer-motion";

import {
  Pencil,
  Trash2,
  Wallet,
} from "lucide-react";


import Card from "../common/Card";

import useBudget from "../../hooks/useBudget";
import useFinance from "../../hooks/useFinance";

import EditBudgetModal from "./EditBudgetModal";



function BudgetCard({ budget }) {


  const {
    deleteBudget,
  } = useBudget();


  const {
    transactions,
  } = useFinance();



  const [editing, setEditing] = useState(false);





  // Calculate spent amount

  const spent = transactions
    .filter(
      (item) =>
        item.type === "expense" &&
        item.category === budget.category
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );



  const remaining =
    budget.amount - spent;



  const progress =
    budget.amount > 0
      ? Math.min(
          (spent / budget.amount) * 100,
          100
        )
      : 0;





  // Progress color

  const progressColor =
    progress >= 100
      ? "#ef4444"
      : progress >= 80
      ? "#f59e0b"
      : "#06b6d4";






  // Remaining days

  const today = new Date();


  const daysInMonth =
    new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();



  const remainingDays =
    Math.max(
      daysInMonth - today.getDate(),
      1
    );




  const dailyBudget =
    remaining > 0
      ? remaining / remainingDays
      : 0;






  // Status

  const status =
    progress >= 100
      ? "Over Budget"
      : progress >= 80
      ? "Warning"
      : "On Track";



  const statusColor =
    progress >= 100

      ?

      "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30"

      :

      progress >= 80

      ?

      "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"

      :

      "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30";






  return (

    <>


      <motion.div

        initial={{
          opacity:0,
          y:30,
        }}

        animate={{
          opacity:1,
          y:0,
        }}

        whileHover={{
          y:-8,
          scale:1.02,
        }}

        transition={{
          duration:0.4,
        }}

      >




        <Card

          className="

            group

            relative

            overflow-hidden

            rounded-3xl


            border

            border-slate-200/50


            bg-white


            shadow-xl

            shadow-slate-200/40


            backdrop-blur-xl


            transition-all

            duration-500


            hover:shadow-2xl



            dark:border-white/10


            dark:bg-slate-900/70


            dark:shadow-black/30

          "

        >




          {/* Animated Glow */}


          <div

            className="

              absolute

              -right-24

              -top-24


              h-56

              w-56


              rounded-full


              bg-cyan-400/20


              blur-3xl


              transition-all

              duration-700


              group-hover:scale-125

            "

          />



          <div

            className="

              absolute

              -bottom-24

              -left-24


              h-56

              w-56


              rounded-full


              bg-blue-500/20


              blur-3xl


              transition-all

              duration-700


              group-hover:scale-125

            "

          />







          {/* Header */}


          <div

            className="

              relative

              flex

              items-center

              justify-between

            "

          >




            {/* Category */}


            <div

              className="

                flex

                items-center

                gap-4

              "

            >



              <div

                className="

                  flex

                  h-14

                  w-14

                  items-center

                  justify-center


                  rounded-2xl


                  bg-gradient-to-br

                  from-cyan-500

                  to-blue-600


                  text-white


                  shadow-lg

                  shadow-blue-500/30

                "

              >

                <Wallet size={28}/>


              </div>





              <div>


                <h2

                  className="

                    text-2xl

                    font-bold


                    text-slate-900


                    dark:text-white

                  "

                >

                  {budget.category}


                </h2>



                <p

                  className="

                    text-sm


                    text-slate-500


                    dark:text-slate-400

                  "

                >

                  Monthly Budget


                </p>



              </div>



            </div>
            
            {/* Action Buttons */}

            <div className="flex gap-3">


              <motion.button

                whileHover={{
                  scale:1.1,
                  rotate:8,
                }}

                whileTap={{
                  scale:0.9,
                }}

                onClick={() =>
                  setEditing(true)
                }

                className="

                  rounded-xl

                  border

                  border-blue-500/20


                  bg-blue-500/10


                  p-3


                  text-blue-600


                  transition


                  hover:bg-blue-500/20


                  dark:text-blue-400

                "

              >

                <Pencil size={18}/>

              </motion.button>





              <motion.button

                whileHover={{
                  scale:1.1,
                  rotate:-8,
                }}

                whileTap={{
                  scale:0.9,
                }}

                onClick={() => {

                  if(
                    window.confirm(
                      "Delete this budget?"
                    )
                  ){

                    deleteBudget(
                      budget.id
                    );

                  }

                }}

                className="

                  rounded-xl


                  border

                  border-red-500/20


                  bg-red-500/10


                  p-3


                  text-red-500


                  transition


                  hover:bg-red-500/20


                  dark:text-red-400

                "

              >

                <Trash2 size={18}/>


              </motion.button>



            </div>


          </div>






          {/* Main Content */}


          <div

            className="

              relative

              mt-8


              grid

              gap-8


              lg:grid-cols-4

            "

          >




            {/* Circle Progress */}


            <div

              className="

                flex

                items-center

                justify-center


                lg:justify-start

              "

            >


              <div

                className="

                  relative

                  flex

                  h-36

                  w-36


                  items-center

                  justify-center


                  rounded-full


                  border-[10px]


                  border-cyan-500


                  bg-white


                  shadow-lg


                  shadow-cyan-500/20


                  dark:bg-slate-900

                "

              >



                <div className="text-center">


                  <h3

                    className="

                      text-3xl

                      font-extrabold


                      text-slate-900


                      dark:text-white

                    "

                  >

                    {progress.toFixed(0)}%

                  </h3>



                  <p

                    className="

                      text-xs


                      text-slate-500


                      dark:text-slate-400

                    "

                  >

                    Used

                  </p>


                </div>



              </div>



            </div>







            {/* Stats */}


            <div

              className="

                lg:col-span-3

              "

            >




              <div

                className="

                  grid

                  grid-cols-2


                  gap-5


                  md:grid-cols-4

                "

              >





                {/* Budget */}


                <div

                  className="

                    rounded-2xl


                    border

                    border-slate-200


                    bg-slate-50


                    p-4


                    dark:border-white/10


                    dark:bg-white/5

                  "

                >

                  <p

                    className="

                      text-sm

                      text-slate-500


                      dark:text-slate-400

                    "

                  >

                    Budget

                  </p>



                  <h3

                    className="

                      mt-2


                      text-xl

                      font-bold


                      text-green-600


                      dark:text-green-400

                    "

                  >

                    ₹
                    {budget.amount.toLocaleString(
                      "en-IN"
                    )}

                  </h3>


                </div>







                {/* Spent */}


                <div

                  className="

                    rounded-2xl


                    border

                    border-slate-200


                    bg-slate-50


                    p-4


                    dark:border-white/10


                    dark:bg-white/5

                  "

                >


                  <p

                    className="

                      text-sm

                      text-slate-500


                      dark:text-slate-400

                    "

                  >

                    Spent

                  </p>



                  <h3

                    className="

                      mt-2


                      text-xl

                      font-bold


                      text-red-600


                      dark:text-red-400

                    "

                  >

                    ₹
                    {spent.toLocaleString(
                      "en-IN"
                    )}

                  </h3>


                </div>







                {/* Remaining */}


                <div

                  className="

                    rounded-2xl


                    border

                    border-slate-200


                    bg-slate-50


                    p-4


                    dark:border-white/10


                    dark:bg-white/5

                  "

                >


                  <p

                    className="

                      text-sm

                      text-slate-500


                      dark:text-slate-400

                    "

                  >

                    Remaining

                  </p>



                  <h3

                    className="

                      mt-2


                      text-xl

                      font-bold


                      text-blue-600


                      dark:text-blue-400

                    "

                  >

                    ₹
                    {remaining.toLocaleString(
                      "en-IN"
                    )}

                  </h3>


                </div>







                {/* Daily Limit */}


                <div

                  className="

                    rounded-2xl


                    border

                    border-slate-200


                    bg-slate-50


                    p-4


                    dark:border-white/10


                    dark:bg-white/5

                  "

                >


                  <p

                    className="

                      text-sm

                      text-slate-500


                      dark:text-slate-400

                    "

                  >

                    Daily Limit

                  </p>



                  <h3

                    className="

                      mt-2


                      text-xl

                      font-bold


                      text-purple-600


                      dark:text-purple-400

                    "

                  >

                    ₹
                    {Math.round(
                      dailyBudget
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </h3>


                </div>



              </div>
              



              {/* Progress Section */}


              <div className="mt-8">


                <div

                  className="

                    mb-3

                    flex

                    items-center

                    justify-between

                  "

                >


                  <span

                    className="

                      text-sm

                      font-medium


                      text-slate-600


                      dark:text-slate-400

                    "

                  >

                    Spending Progress

                  </span>




                  <span

                    className="

                      text-sm

                      font-bold


                      text-slate-900


                      dark:text-white

                    "

                  >

                    {progress.toFixed(0)}%

                  </span>



                </div>






                {/* Progress Background */}


                <div

                  className="

                    h-4

                    overflow-hidden

                    rounded-full


                    bg-slate-200


                    shadow-inner


                    dark:bg-slate-800

                  "

                >



                  <motion.div


                    initial={{
                      width:0,
                    }}


                    animate={{
                      width:`${progress}%`,
                    }}


                    transition={{
                      duration:1.2,
                      ease:"easeOut",
                    }}



                    className="

                      h-full

                      rounded-full


                      bg-gradient-to-r

                      from-cyan-400

                      via-blue-500

                      to-indigo-600


                      shadow-lg

                    "



                    style={{
                      background:
                        progressColor,
                    }}

                  />


                </div>



              </div>








              {/* Footer */}



              <div

                className="

                  mt-8

                  flex

                  flex-wrap

                  items-center

                  justify-between

                  gap-4

                "

              >




                {/* Status */}


                <motion.span


                  whileHover={{
                    scale:1.05,
                  }}


                  className={`

                    rounded-full


                    border


                    px-5

                    py-2


                    text-sm

                    font-semibold


                    ${statusColor}

                  `}


                >

                  {status}


                </motion.span>








                {/* Days Remaining */}



                <div

                  className="

                    rounded-full


                    border

                    border-slate-200


                    bg-slate-100


                    px-5

                    py-2


                    text-sm

                    font-medium


                    text-slate-600



                    dark:border-white/10


                    dark:bg-white/5


                    dark:text-slate-400

                  "

                >

                  ⏳ {remainingDays} days remaining


                </div>



              </div>





            </div>


          </div>



        </Card>



      </motion.div>








      {/* Edit Modal */}


      <EditBudgetModal

        open={editing}

        budget={budget}

        onClose={() =>
          setEditing(false)
        }

      />



    </>

  );

}



export default BudgetCard;