import { motion } from "framer-motion";

import {
  Wallet,
  TrendingDown,
  PiggyBank,
} from "lucide-react";


import Card from "../common/Card";

import useBudget from "../../hooks/useBudget";
import useFinance from "../../hooks/useFinance";



function BudgetSummary() {


  const {
    budgets,
  } = useBudget();


  const {
    transactions,
  } = useFinance();





  const totalBudget = budgets.reduce(
    (sum, item) =>
      sum + Number(item.amount),
    0
  );





  const totalSpent = transactions

    .filter(
      (item) =>
        item.type === "expense"
    )

    .reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );





  const remaining =
    totalBudget - totalSpent;





  const stats = [

    {
      title:"Budget",
      value:
        `₹${totalBudget.toLocaleString("en-IN")}`,
      icon:Wallet,
      color:
        "from-green-500 to-emerald-500",
      text:
        "text-green-600 dark:text-green-400",
    },


    {
      title:"Spent",
      value:
        `₹${totalSpent.toLocaleString("en-IN")}`,
      icon:TrendingDown,
      color:
        "from-red-500 to-rose-500",
      text:
        "text-red-600 dark:text-red-400",
    },


    {
      title:"Remaining",
      value:
        `₹${remaining.toLocaleString("en-IN")}`,
      icon:PiggyBank,
      color:
        remaining >= 0
        ?
        "from-cyan-500 to-blue-500"
        :
        "from-red-500 to-orange-500",

      text:
        remaining >= 0
        ?
        "text-cyan-600 dark:text-cyan-400"
        :
        "text-red-600 dark:text-red-400",
    },

  ];







  return (

    <motion.div

      initial={{
        opacity:0,
        y:20,
      }}

      animate={{
        opacity:1,
        y:0,
      }}

    >



      <Card

        className="
          relative

          overflow-hidden


          rounded-3xl


          border

          border-slate-200


          bg-white/95


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

            -right-24

            -top-24


            h-60

            w-60


            rounded-full


            bg-blue-500/20


            blur-3xl
          "

        />





        <h2

          className="
            relative

            mb-8


            text-3xl

            font-extrabold


            text-slate-900


            dark:text-white
          "

        >

          Budget Summary

        </h2>







        <div

          className="
            relative

            grid


            gap-6


            md:grid-cols-3
          "

        >



          {stats.map(
            (item,index)=>{


              const Icon =
                item.icon;



              return (

                <motion.div


                  key={item.title}


                  whileHover={{
                    y:-6,
                  }}


                  transition={{
                    duration:0.3,
                  }}


                  className="
                    rounded-3xl


                    border

                    border-slate-200


                    bg-slate-50


                    p-6



                    dark:border-white/10


                    dark:bg-white/5
                  "

                >



                  <div

                    className="
                      flex

                      items-center

                      justify-between
                    "

                  >



                    <p

                      className="
                        text-sm

                        font-medium


                        text-slate-600


                        dark:text-slate-400
                      "

                    >

                      {item.title}

                    </p>





                    <div

                      className={`

                        flex

                        h-12

                        w-12


                        items-center

                        justify-center


                        rounded-2xl


                        bg-gradient-to-br


                        ${item.color}


                        text-white


                        shadow-lg

                      `}

                    >

                      <Icon size={24}/>


                    </div>



                  </div>





                  <h3

                    className={`

                      mt-5


                      text-3xl

                      font-extrabold


                      ${item.text}

                    `}

                  >

                    {item.value}


                  </h3>



                </motion.div>


              );


            }

          )}


        </div>



      </Card>


    </motion.div>


  );

}



export default BudgetSummary;