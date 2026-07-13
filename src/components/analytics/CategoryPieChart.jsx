import { motion } from "framer-motion";

import Card from "../common/Card";

import useFinance from "../../hooks/useFinance";


import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";



const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#14B8A6",
];





function CategoryPieChart() {


  const {
    transactions = [],
  } = useFinance();






  const expenses =
    transactions.filter(
      (t)=>
        t.type === "expense"
    );





  const categoryMap = {};





  expenses.forEach((item)=>{


    const category =
      item.category || "Other";



    categoryMap[category] =
      (
        categoryMap[category] || 0
      )
      +
      Number(item.amount || 0);


  });







  const chartData =
    Object.keys(categoryMap)
      .map(
        (key)=>({

          name:key,

          value:
            categoryMap[key],

        })
      );









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


            bg-purple-500/20


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
          chartData.length === 0

          ?

          (

            <div

              className="

                flex

                h-[350px]


                flex-col


                items-center


                justify-center


                gap-3

              "

            >


              <div

                className="

                  rounded-2xl


                  bg-purple-500/10


                  p-4


                  text-purple-500

                "

              >

                📊

              </div>



              <p

                className="

                  text-slate-600



                  dark:text-slate-400

                "

              >

                No expense data available


              </p>



            </div>


          )



          :



          (

            <ResponsiveContainer

              width="100%"

              height={350}

            >



              <PieChart>





                <Pie


                  data={chartData}


                  dataKey="value"


                  nameKey="name"


                  cx="50%"


                  cy="50%"


                  outerRadius={120}


                  innerRadius={65}


                  paddingAngle={5}


                  animationDuration={1200}



                  label={({
                    percent,
                  })=>

                    `${(
                      percent * 100

                    ).toFixed(0)}%`

                  }


                >




                  {
                    chartData.map(
                      (
                        entry,
                        index
                      )=>(


                        <Cell


                          key={
                            entry.name
                          }


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


                  contentStyle={{

                    background:
                      "var(--chart-bg)",

                    border:
                      "1px solid var(--chart-border)",

                    borderRadius:
                      "16px",

                    color:
                      "var(--chart-text)",

                  }}



                  formatter={(value)=>

                    `₹${Number(value)
                      .toLocaleString(
                        "en-IN"
                      )}`

                  }


                />








                <Legend


                  wrapperStyle={{

                    paddingTop:
                      "20px",

                  }}



                />





              </PieChart>




            </ResponsiveContainer>


          )

        }



      </Card>




    </motion.div>


  );

}



export default CategoryPieChart;