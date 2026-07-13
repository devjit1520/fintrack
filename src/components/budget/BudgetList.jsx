import { motion } from "framer-motion";
import {
  SearchX,
} from "lucide-react";

import Card from "../common/Card";

import useBudget from "../../hooks/useBudget";

import BudgetCard from "./BudgetCard";


function BudgetList({
  search = "",
  category = "all",
}) {


  const {
    budgets,
  } = useBudget();




  const filteredBudgets =
    budgets.filter((budget) => {


      const matchesSearch =
        budget.category
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );



      const matchesCategory =
        category === "all" ||
        budget.category === category;



      return (
        matchesSearch &&
        matchesCategory
      );

    });






  // Empty State

  if(filteredBudgets.length === 0){

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


            bg-white


            p-8


            backdrop-blur-xl



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


              h-40

              w-40


              rounded-full


              bg-blue-500/20


              blur-3xl
            "

          />





          <div

            className="
              relative

              flex

              flex-col

              items-center

              justify-center


              py-20

              text-center
            "

          >



            <div

              className="
                mb-5

                flex

                h-16

                w-16


                items-center

                justify-center


                rounded-2xl


                bg-blue-500/10


                text-blue-600


                dark:text-blue-400
              "

            >

              <SearchX size={32}/>


            </div>





            <h2

              className="
                text-2xl

                font-bold


                text-slate-900


                dark:text-white
              "

            >

              No Budgets Found


            </h2>





            <p

              className="
                mt-2


                max-w-md


                text-slate-600


                dark:text-slate-400
              "

            >

              Try changing your search
              or category filter.

            </p>




          </div>



        </Card>


      </motion.div>


    );

  }







  return (

    <motion.div

      initial={{
        opacity:0,
      }}

      animate={{
        opacity:1,
      }}

      className="
        grid

        gap-6
      "

    >


      {filteredBudgets.map(
        (budget) => (

          <BudgetCard

            key={budget.id}

            budget={budget}

          />

        )
      )}



    </motion.div>

  );

}



export default BudgetList;