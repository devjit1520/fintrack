import { motion } from "framer-motion";
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Trophy,
  BarChart3,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";



function SmartInsights() {


  const {
    transactions = [],
  } = useFinance();




  const income = transactions
    .filter(
      (t)=>t.type==="income"
    )
    .reduce(
      (sum,t)=>
        sum + Number(t.amount || 0),
      0
    );



  const expense = transactions
    .filter(
      (t)=>t.type==="expense"
    )
    .reduce(
      (sum,t)=>
        sum + Number(t.amount || 0),
      0
    );



  const balance = income - expense;



  const insights = [];



  if(income === 0)

    insights.push({

      text:"Add an income transaction to start tracking earnings.",

      icon:Lightbulb,

      color:
      "text-yellow-500 bg-yellow-500/10"

    });




  if(expense > income)

    insights.push({

      text:"Your expenses are higher than your income.",

      icon:AlertTriangle,

      color:
      "text-red-500 bg-red-500/10"

    });





  if(balance > 0)

    insights.push({

      text:"Great job! You are saving money.",

      icon:TrendingUp,

      color:
      "text-green-500 bg-green-500/10"

    });





  if(expense < income * 0.5 && income > 0)

    insights.push({

      text:"Excellent expense management this month.",

      icon:Trophy,

      color:
      "text-blue-500 bg-blue-500/10"

    });





  if(transactions.length < 5)

    insights.push({

      text:"Add more transactions for better analytics.",

      icon:BarChart3,

      color:
      "text-cyan-500 bg-cyan-500/10"

    });









  return (



    <motion.div


      initial={{
        opacity:0,
        y:20
      }}


      animate={{
        opacity:1,
        y:0
      }}


      transition={{
        duration:0.5
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


            flex

            items-center

            gap-3


            text-2xl

            font-extrabold


            text-slate-900



            dark:text-white

          "

        >

          💡 Smart Insights

        </h2>









        {

          insights.length === 0

          ?

          (

            <p

              className="

                text-slate-500


                dark:text-slate-400

              "

            >

              No insights available yet.

            </p>

          )



          :



          (

            <div

              className="

                relative

                space-y-4

              "

            >


              {
                insights.map(

                  (item,index)=>{


                    const Icon=item.icon;


                    return (

                      <motion.div


                        key={index}



                        initial={{

                          opacity:0,

                          x:-20

                        }}



                        animate={{

                          opacity:1,

                          x:0

                        }}



                        transition={{

                          delay:index*0.1

                        }}





                        whileHover={{

                          scale:1.02,

                          x:5

                        }}



                        className="

                          flex

                          items-center

                          gap-4


                          rounded-2xl


                          border


                          border-slate-200


                          bg-slate-50


                          p-4




                          dark:border-white/10


                          dark:bg-slate-800/40

                        "

                      >




                        <div

                          className={`

                            rounded-xl

                            p-3

                            ${item.color}

                          `}

                        >

                          <Icon size={24}/>

                        </div>







                        <p


                          className="

                            font-medium


                            text-slate-700



                            dark:text-slate-200

                          "

                        >

                          {item.text}

                        </p>





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


export default SmartInsights;