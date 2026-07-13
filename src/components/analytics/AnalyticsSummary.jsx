import { motion } from "framer-motion";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

import Card from "../common/Card";

import useFinance from "../../hooks/useFinance";



function AnalyticsSummary() {


  const {
    transactions = [],
  } = useFinance();





  const income = transactions

    .filter(
      (t) =>
        t.type === "income"
    )

    .reduce(
      (sum,t)=>
        sum + Number(t.amount || 0),
      0
    );





  const expense = transactions

    .filter(
      (t)=>
        t.type === "expense"
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
      ((balance / income) * 100).toFixed(1)
      :
      0;







  const cards = [


    {
      title:"Total Income",

      value:
        `₹${income.toLocaleString("en-IN")}`,

      icon:TrendingUp,

      gradient:
        "from-green-500 to-emerald-500",

      text:
        "text-green-600 dark:text-green-400",

      glow:
        "bg-green-500/20",

    },



    {
      title:"Total Expense",

      value:
        `₹${expense.toLocaleString("en-IN")}`,

      icon:TrendingDown,

      gradient:
        "from-red-500 to-rose-500",

      text:
        "text-red-600 dark:text-red-400",

      glow:
        "bg-red-500/20",

    },



    {
      title:"Current Balance",

      value:
        `₹${balance.toLocaleString("en-IN")}`,

      icon:Wallet,

      gradient:
        "from-cyan-500 to-blue-500",

      text:
        balance >= 0
        ?
        "text-cyan-600 dark:text-cyan-400"
        :
        "text-red-600 dark:text-red-400",

      glow:
        "bg-cyan-500/20",

    },



    {
      title:"Savings Rate",

      value:
        `${savingsRate}%`,

      icon:PiggyBank,

      gradient:
        "from-yellow-500 to-orange-500",

      text:
        "text-yellow-600 dark:text-yellow-400",

      glow:
        "bg-yellow-500/20",

    },


  ];







  return (


    <div

      className="
        grid

        gap-6


        md:grid-cols-2


        xl:grid-cols-4
      "

    >



      {
        cards.map(
          (card,index)=>{


            const Icon =
              card.icon;



            return (


              <motion.div


                key={card.title}



                initial={{
                  opacity:0,
                  y:30,
                }}



                animate={{
                  opacity:1,
                  y:0,
                }}



                transition={{
                  delay:index * 0.1,
                }}



                whileHover={{
                  y:-8,
                  scale:1.03,
                }}



              >




                <Card


                  className="

                    group

                    relative

                    overflow-hidden


                    rounded-3xl


                    border


                    border-slate-200


                    bg-white


                    p-6


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

                    className={`

                      absolute

                      -right-14

                      -top-14


                      h-40

                      w-40


                      rounded-full


                      blur-3xl


                      transition


                      group-hover:scale-125


                      ${card.glow}

                    `}

                  />







                  <div

                    className="

                      relative

                      flex

                      items-center

                      justify-between

                    "

                  >





                    {/* Text */}


                    <div>


                      <p

                        className="

                          text-sm

                          font-medium


                          text-slate-600



                          dark:text-slate-400

                        "

                      >

                        {card.title}


                      </p>





                      <h2

                        className={`

                          mt-3


                          text-3xl


                          font-extrabold


                          ${card.text}

                        `}

                      >

                        {card.value}


                      </h2>



                    </div>







                    {/* Icon */}


                    <motion.div


                      whileHover={{
                        rotate:10,
                        scale:1.1,
                      }}



                      className={`

                        flex

                        h-16

                        w-16


                        items-center

                        justify-center


                        rounded-2xl


                        bg-gradient-to-br


                        ${card.gradient}


                        text-white


                        shadow-lg

                      `}


                    >


                      <Icon size={30}/>


                    </motion.div>




                  </div>





                </Card>



              </motion.div>



            );


          }
        )
      }



    </div>


  );

}



export default AnalyticsSummary;