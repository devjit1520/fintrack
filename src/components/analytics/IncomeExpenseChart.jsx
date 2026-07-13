import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";



function IncomeExpenseChart() {


  const {
    summary = {
      income:0,
      expense:0,
    },
  } = useFinance();




  const data = [

    {
      name:"Finance",

      Income:
        Number(summary.income || 0),

      Expense:
        Number(summary.expense || 0),

    },

  ];







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


          p-6


          shadow-xl


          shadow-slate-200/40


          backdrop-blur-xl

      text-black
      dark:text-white


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


            h-52

            w-52


            rounded-full


            bg-blue-500/20


            blur-3xl

          "

        />







        <h2


          className="

            relative

            mb-6


            text-2xl


            font-extrabold


            text-slate-900



            dark:text-white

          "

        >

          Income vs Expense

        </h2>







        <div className="relative h-80">


          <ResponsiveContainer

            width="100%"

            height="100%"

          >



            <BarChart

              data={data}

              barGap={15}

            >




              <CartesianGrid


                strokeDasharray="4 4"


                stroke="currentColor"


                opacity={0.15}


              />






              <XAxis


                dataKey="name"


                tick={{

                  fill:
                    "currentColor",

                }}


              />





              <YAxis


                tick={{

                  fill:
                    "currentColor",

                }}


                tickFormatter={(value)=>

                  `₹${value / 1000}k`

                }


              />








              <Tooltip



                formatter={(value)=>

                  `₹${Number(value)
                    .toLocaleString(
                      "en-IN"
                    )}`

                }



                contentStyle={{

                  background:
                    "var(--chart-bg)",


                  border:
                    "1px solid var(--chart-border)",


                  borderRadius:
                    "16px",

                }}



              />









              <Bar


                dataKey="Income"


                fill="#22c55e"


                radius={[10,10,0,0]}


                animationDuration={1200}


              />







              <Bar


                dataKey="Expense"


                fill="#ef4444"


                radius={[10,10,0,0]}


                animationDuration={1200}


              />






            </BarChart>



          </ResponsiveContainer>



        </div>






      </Card>




    </motion.div>


  );

}



export default IncomeExpenseChart;