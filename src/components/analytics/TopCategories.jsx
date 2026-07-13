import { motion } from "framer-motion";
import { Trophy, Crown } from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";



function TopCategories() {


  const {
    transactions = [],
  } = useFinance();





  const expenses = transactions.filter(
    (t)=>t.type==="expense"
  );



  const categoryTotals = {};



  expenses.forEach((item)=>{

    const category =
      item.category || "Other";


    categoryTotals[category] =
      (categoryTotals[category] || 0)
      +
      Number(item.amount || 0);

  });





  const data = Object.entries(categoryTotals)

    .map(([name,value])=>({

      name,

      value,

    }))


    .sort(
      (a,b)=>b.value-a.value
    );





  const totalExpense =
    data.reduce(
      (sum,item)=>
        sum + item.value,
      0
    );






  return (


    <motion.div

      initial={{
        opacity:0,
        x:30,
      }}

      animate={{
        opacity:1,
        x:0,
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


          backdrop-blur-xl


          shadow-xl





          dark:border-white/10


          dark:bg-slate-900/70

        "

      >





        {/* Background Glow */}

        <div

          className="

            absolute

            -right-20

            -top-20


            h-56

            w-56


            rounded-full


            bg-yellow-500/20


            blur-3xl

          "

        />








        <div


          className="

            relative

            mb-8

            flex

            items-center

            gap-3

          "

        >



          <div

            className="

              rounded-2xl

              bg-yellow-500/10

              p-3

            "

          >

            <Trophy

              className="text-yellow-500"

              size={30}

            />

          </div>





          <h2

            className="

              text-2xl

              font-extrabold


              text-slate-900



              dark:text-white

            "

          >

            Top Spending Categories

          </h2>




        </div>









        {
          data.length===0

          ?


          (

            <div

              className="

                flex

                h-72

                items-center

                justify-center

              "

            >

              <p

                className="

                  text-slate-500


                  dark:text-slate-400

                "

              >

                No expense data available.

              </p>

            </div>

          )



          :



          (

            <div className="relative space-y-6">


              {
                data.map(
                  (item,index)=>{


                    const percent =
                      totalExpense > 0

                      ?

                      (item.value /
                      totalExpense)
                      *
                      100

                      :

                      0;



                    return (

                      <motion.div


                        key={item.name}



                        initial={{

                          opacity:0,

                          y:20

                        }}



                        animate={{

                          opacity:1,

                          y:0

                        }}



                        transition={{

                          delay:index*0.1

                        }}




                        whileHover={{

                          scale:1.02,

                        }}



                        className="

                          rounded-2xl

                          border

                          border-slate-200

                          bg-slate-50

                          p-5





                          dark:border-white/10

                          dark:bg-slate-800/40

                        "

                      >







                        <div

                          className="

                            mb-3

                            flex

                            items-center

                            justify-between

                          "

                        >




                          <div

                            className="

                              flex

                              items-center

                              gap-3

                            "

                          >



                            {
                              index===0 &&

                              (

                                <Crown

                                  size={22}

                                  className="text-yellow-500"

                                />

                              )

                            }




                            <div>

                              <h3


                                className="

                                  font-bold

                                  text-slate-900



                                  dark:text-white

                                "

                              >

                                {item.name}

                              </h3>




                              <p


                                className="

                                  text-sm

                                  text-slate-500



                                  dark:text-slate-400

                                "

                              >

                                {percent.toFixed(1)}%
                                of total expenses

                              </p>



                            </div>




                          </div>








                          <div

                            className="text-right"

                          >



                            <h3

                              className="

                                text-lg

                                font-extrabold

                                text-cyan-500

                              "

                            >

                              ₹
                              {
                                item.value
                                .toLocaleString(
                                  "en-IN"
                                )
                              }


                            </h3>




                            {
                              index===0 &&

                              (

                                <span

                                  className="

                                    inline-block

                                    rounded-full

                                    bg-red-500/10

                                    px-3

                                    py-1

                                    text-xs

                                    font-bold

                                    text-red-500

                                  "

                                >

                                  Highest

                                </span>

                              )

                            }



                          </div>






                        </div>









                        {/* Progress */}


                        <div

                          className="

                            h-3

                            overflow-hidden

                            rounded-full

                            bg-slate-200



                            dark:bg-slate-700

                          "

                        >



                          <motion.div


                            initial={{

                              width:0,

                            }}



                            animate={{

                              width:`${percent}%`

                            }}



                            transition={{

                              duration:1,

                              delay:index*0.1

                            }}



                            className="

                              h-full

                              rounded-full

                              bg-gradient-to-r

                              from-cyan-500

                              via-blue-500

                              to-indigo-500

                            "

                          />



                        </div>







                      </motion.div>


                    );

                  }
                )
              }




            </div>


          )

        }




      </Card>





    </motion.div>


  );

}


export default TopCategories;