import { motion } from "framer-motion";
import {
  Wallet,
  PiggyBank,
} from "lucide-react";

import Card from "../common/Card";
import useBudget from "../../hooks/useBudget";


function BudgetStats() {

  const {
    budgets,
    totalBudget,
  } = useBudget();



  const stats = [

    {
      title: "Total Budgets",
      value: budgets.length,
      icon: Wallet,
      color:
        "from-blue-500 to-cyan-500",
    },


    {
      title: "Total Budget",
      value:
        `₹${totalBudget.toLocaleString("en-IN")}`,
      icon: PiggyBank,
      color:
        "from-green-500 to-emerald-500",
    },

  ];



  return (

    <div
      className="
        grid

        gap-6

        md:grid-cols-2
      "
    >


      {stats.map((item,index)=>{


        const Icon = item.icon;


        return (

          <motion.div

            key={item.title}


            initial={{
              opacity:0,
              y:20,
            }}


            animate={{
              opacity:1,
              y:0,
            }}


            transition={{
              delay:index * 0.1,
            }}


            whileHover={{
              y:-6,
              scale:1.02,
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



                transition-all



                dark:border-white/10


                dark:bg-slate-900/70


                dark:shadow-black/30
              "

            >



              {/* Glow */}


              <div

                className="
                  absolute

                  -right-16

                  -top-16


                  h-40

                  w-40


                  rounded-full


                  bg-blue-500/20


                  blur-3xl


                  transition


                  group-hover:scale-125
                "

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

                    {item.title}


                  </p>





                  <h2

                    className="
                      mt-4


                      text-4xl


                      font-extrabold


                      text-slate-900


                      dark:text-white
                    "

                  >

                    {item.value}


                  </h2>


                </div>







                {/* Icon */}


                <div

                  className={`

                    flex

                    h-16

                    w-16


                    items-center

                    justify-center


                    rounded-2xl


                    bg-gradient-to-br


                    ${item.color}


                    text-white


                    shadow-lg

                  `}

                >

                  <Icon size={32}/>


                </div>



              </div>




            </Card>



          </motion.div>


        );


      })}


    </div>

  );

}


export default BudgetStats;