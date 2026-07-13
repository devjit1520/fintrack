import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";


import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";


const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
];



function ExpensePieChart() {


  const {
    transactions = [],
  } = useFinance();




  const expenses =
    transactions.filter(
      (item)=>
        item.type === "expense"
    );





  const grouped = {};



  expenses.forEach((item)=>{

    const category =
      item.category || "Other";


    grouped[category] =
      (grouped[category] || 0)
      +
      Number(item.amount || 0);

  });





  const data =
    Object.keys(grouped)
      .map((key)=>({

        name:key,

        value:grouped[key],

      }));







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


          bg-white/80


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

          className="

            absolute

            -right-20

            -top-20


            h-48

            w-48


            rounded-full


            bg-red-500/20


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

          Expenses by Category

        </h2>







        {
          data.length === 0

          ?

          (

            <div

              className="

                flex

                h-80


                items-center


                justify-center


                text-slate-600



                dark:text-slate-400

              "

            >

              No expense data available

            </div>


          )

          :

          (

            <div className="h-80">


              <ResponsiveContainer

                width="100%"

                height="100%"

              >


                <PieChart>


                  <Pie


                    data={data}


                    dataKey="value"


                    nameKey="name"


                    cx="50%"


                    cy="50%"


                    outerRadius={110}


                    innerRadius={55}


                    paddingAngle={5}


                    animationDuration={1200}


                    label={(item)=>

                      `${item.name}`

                    }

                  >


                    {
                      data.map(
                        (_,index)=>(

                          <Cell

                            key={index}

                            fill={
                              COLORS[
                                index %
                                COLORS.length
                              ]
                            }

                          />

                        )
                      )
                    }


                  </Pie>





                  <Tooltip

                    formatter={(value)=>

                      `₹${Number(value)
                        .toLocaleString(
                          "en-IN"
                        )}`

                    }


                    contentStyle={{

                      background:
                        "#0f172a",

                      border:
                        "1px solid #334155",

                      borderRadius:
                        "14px",

                      color:
                        "#fff",

                    }}

                  />




                  <Legend />



                </PieChart>


              </ResponsiveContainer>


            </div>


          )

        }



      </Card>



    </motion.div>


  );

}


export default ExpensePieChart;