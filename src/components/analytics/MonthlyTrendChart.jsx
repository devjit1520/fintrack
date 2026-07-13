import { motion } from "framer-motion";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";


import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";



function MonthlyTrendChart() {


  const {
    transactions = [],
  } = useFinance();




  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];






  const chartData = months.map(
    (month,index)=>{


      const income =
        transactions
          .filter((t)=>{

            const d =
              new Date(t.date);


            return (
              d.getMonth() === index &&
              t.type === "income"
            );

          })
          .reduce(
            (sum,t)=>
              sum + Number(t.amount || 0),
            0
          );





      const expense =
        transactions
          .filter((t)=>{


            const d =
              new Date(t.date);


            return (
              d.getMonth() === index &&
              t.type === "expense"
            );


          })
          .reduce(
            (sum,t)=>
              sum + Number(t.amount || 0),
            0
          );





      return {

        month,

        income,

        expense,

      };


    }

  );








  return (



    <motion.div


      initial={{
        opacity:0,
        y:30,
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






        {/* Background Glow */}


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

          Monthly Trend

        </h2>








        <div className="relative">


          <ResponsiveContainer


            width="100%"


            height={350}


          >



            <LineChart

              data={chartData}

            >





              <CartesianGrid


                strokeDasharray="4 4"


                stroke="currentColor"


                opacity={0.15}


              />







              <XAxis


                dataKey="month"


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









              <Legend />









              <Line


                type="monotone"


                dataKey="income"


                name="Income"


                stroke="#22c55e"


                strokeWidth={4}


                dot={{

                  r:5,

                }}



                activeDot={{

                  r:8,

                }}



                animationDuration={1200}


              />









              <Line


                type="monotone"


                dataKey="expense"


                name="Expense"


                stroke="#ef4444"


                strokeWidth={4}


                dot={{

                  r:5,

                }}



                activeDot={{

                  r:8,

                }}



                animationDuration={1200}


              />







            </LineChart>




          </ResponsiveContainer>


        </div>






      </Card>




    </motion.div>


  );

}



export default MonthlyTrendChart;