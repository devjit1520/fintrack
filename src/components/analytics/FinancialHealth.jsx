import { motion } from "framer-motion";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";


import Card from "../common/Card";

import useFinance from "../../hooks/useFinance";
import useBudget from "../../hooks/useBudget";
import useGoal from "../../hooks/useGoal";



function FinancialHealth() {


  const {
    transactions = [],
  } = useFinance();


  const {
    budgets = [],
  } = useBudget();


  const {
    goals = [],
  } = useGoal();





  const income =
    transactions
      .filter(
        (t)=>t.type==="income"
      )
      .reduce(
        (sum,t)=>
          sum + Number(t.amount || 0),
        0
      );




  const expense =
    transactions
      .filter(
        (t)=>t.type==="expense"
      )
      .reduce(
        (sum,t)=>
          sum + Number(t.amount || 0),
        0
      );




  const balance =
    income - expense;





  const savingsRate =
    income > 0
    ?
    (balance / income) * 100
    :
    0;





  const totalBudget =
    budgets.reduce(
      (sum,b)=>
        sum + Number(b.amount || 0),
      0
    );





  const budgetUsage =
    totalBudget > 0
    ?
    (expense / totalBudget) * 100
    :
    0;






  const completedGoals =
    goals.filter(
      (g)=>
        Number(g.saved) >=
        Number(g.target)
    ).length;





  const goalScore =
    goals.length > 0
    ?
    (completedGoals / goals.length) * 100
    :
    100;





  let score = 0;


  score += Math.min(
    savingsRate,
    40
  );


  score += Math.max(
    0,
    30 - Math.max(
      0,
      budgetUsage - 70
    )
  );


  score += goalScore * 0.3;




  score =
    Math.max(
      0,
      Math.min(
        100,
        score
      )
    );







  const status =
    score >=80
    ?
    "Excellent"
    :
    score >=60
    ?
    "Good"
    :
    score >=40
    ?
    "Fair"
    :
    "Needs Improvement";






  const color =
    score >=80
    ?
    "#22c55e"
    :
    score >=60
    ?
    "#3b82f6"
    :
    score >=40
    ?
    "#f59e0b"
    :
    "#ef4444";








  return (



    <motion.div

      initial={{
        opacity:0,
        y:25,
      }}

      animate={{
        opacity:1,
        y:0,
      }}

      transition={{
        duration:0.5,
      }}

    >




      <Card


        className="

          relative

          overflow-hidden


          rounded-3xl


          border


          border-slate-200


          bg-white


          p-8


          shadow-xl


          shadow-slate-200/40


          backdrop-blur-xl




          dark:border-white/10


          dark:bg-slate-900/70


          dark:shadow-black/30

        "

      >





        {/* Glow */}


        <div

          className="

            absolute

            -right-20

            -top-20


            h-60

            w-60


            rounded-full


            bg-green-500/20


            blur-3xl

          "

        />







        <h2


          className="

            relative

            mb-8


            text-2xl


            font-extrabold


            text-slate-900



            dark:text-white
            

          "

        >

          Financial Health

        </h2>







        <div

          className="

            relative

            grid

            gap-10


            lg:grid-cols-2

          "

        >





          {/* Score */}


          <div

            className="

              mx-auto

              w-52
          
                text-black
                dark:text-white

            "

          >


            <CircularProgressbar


              value={score}


              text={`${Math.round(score)}`}



              styles={buildStyles({

                pathColor:
                  color,


                textColor:
                  "currentColor",


                trailColor:
                  "rgba(148,163,184,0.25)",


                textSize:
                  "22px",

              })}


            />


          </div>









          {/* Details */}



          <div

            className="

              space-y-6

            "

          >




            <div>


              <p className="text-slate-500 dark:text-slate-400">

                Status

              </p>



              <span


                className="

                  mt-2

                  inline-block


                  rounded-full


                  px-5


                  py-2


                  font-semibold


                  text-white

                "


                style={{

                  background:
                    color,

                }}


              >

                {status}


              </span>


            </div>









            <div

              className="

                grid

                grid-cols-2

                gap-6

              "

            >




              <Stat

                title="Savings Rate"

                value={`${savingsRate.toFixed(1)}%`}

                color="text-green-500"

              />



              <Stat

                title="Budget Used"

                value={`${budgetUsage.toFixed(1)}%`}

                color="text-red-500"

              />



              <Stat

                title="Balance"

                value={`₹${balance.toLocaleString("en-IN")}`}

                color="text-cyan-500"

              />



              <Stat

                title="Goals Completed"

                value={`${completedGoals}/${goals.length}`}

                color="text-yellow-500"

              />




            </div>




          </div>



        </div>





      </Card>




    </motion.div>


  );

}






function Stat({
  title,
  value,
  color,
}) {


  return (

    <div>


      <p className="text-sm text-slate-500 dark:text-slate-400">

        {title}

      </p>


      <h3

        className={`mt-2 text-xl font-bold ${color}`}

      >

        {value}


      </h3>


    </div>

  );

}





export default FinancialHealth;