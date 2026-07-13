import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Plus,
} from "lucide-react";

import AddBudgetModal from "./AddBudgetModal";


function BudgetHeader() {

  const [open, setOpen] = useState(false);


  return (
    <>

      <motion.div

        initial={{
          opacity:0,
          y:-20,
        }}

        animate={{
          opacity:1,
          y:0,
        }}

        transition={{
          duration:0.5,
        }}


        className="
          relative
          overflow-hidden

          flex

          flex-col

          gap-6


          rounded-3xl


          border

          border-slate-200


          bg-white


          p-8


          shadow-xl

          shadow-slate-200/50


          backdrop-blur-xl


          sm:flex-row

          sm:items-center

          sm:justify-between



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


            h-48

            w-48


            rounded-full


            bg-blue-500/20


            blur-3xl
          "
        />



        <div
          className="
            absolute

            -bottom-20

            -left-20


            h-48

            w-48


            rounded-full


            bg-cyan-500/20


            blur-3xl
          "
        />






        {/* Title Section */}


        <div className="relative">


          <div
            className="
              flex

              items-center

              gap-4
            "
          >


            <div
              className="
                flex

                h-14

                w-14


                items-center

                justify-center


                rounded-2xl


                bg-gradient-to-br

                from-blue-500

                to-cyan-500


                text-white


                shadow-lg

                shadow-blue-500/30
              "
            >

              <Wallet size={28}/>

            </div>





            <div>


              <h1

                className="
                  text-3xl

                  font-extrabold


                  text-slate-900


                  sm:text-4xl


                  dark:text-white
                "
              >

                Budget


              </h1>




              <p

                className="
                  mt-1


                  text-slate-600


                  dark:text-slate-400
                "
              >

                Manage monthly spending limits


              </p>



            </div>



          </div>


        </div>







        {/* Add Button */}



        <motion.button


          whileHover={{
            scale:1.05,
          }}


          whileTap={{
            scale:0.95,
          }}


          onClick={() =>
            setOpen(true)
          }


          className="
            relative

            flex

            items-center

            justify-center


            gap-2


            rounded-2xl


            bg-gradient-to-r

            from-blue-600

            to-indigo-600


            px-6

            py-3


            font-semibold


            text-white


            shadow-lg

            shadow-blue-500/30


            transition-all


            hover:from-blue-500

            hover:to-indigo-500


            sm:w-auto

            w-full
          "
        >


          <Plus size={20}/>


          Add Budget


        </motion.button>




      </motion.div>





      <AddBudgetModal

        open={open}

        onClose={() =>
          setOpen(false)
        }

      />


    </>
  );
}


export default BudgetHeader;