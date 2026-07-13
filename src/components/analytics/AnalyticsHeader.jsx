import { motion } from "framer-motion";
import {
  BarChart3,
} from "lucide-react";


function AnalyticsHeader() {


  return (

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


        gap-5


        rounded-3xl


        border


        border-slate-200


        bg-white


        p-8


        shadow-xl


        shadow-slate-200/40


        backdrop-blur-xl




        dark:border-white/10


        dark:bg-slate-900/70


        dark:shadow-black/30


        sm:flex-row


        sm:items-center

      "


    >




      {/* Background Glow */}



      <div

        className="

          absolute

          -right-20

          -top-20


          h-52

          w-52


          rounded-full


          bg-cyan-500/20


          blur-3xl

        "

      />




      <div

        className="

          absolute

          -bottom-20

          -left-20


          h-52

          w-52


          rounded-full


          bg-blue-500/20


          blur-3xl

        "

      />







      <div

        className="
          relative

          flex

          items-center

          gap-5
        "

      >




        {/* Icon */}



        <motion.div


          whileHover={{
            rotate:10,
            scale:1.05,
          }}



          className="

            flex

            h-16

            w-16


            items-center

            justify-center


            rounded-2xl


            bg-gradient-to-br


            from-cyan-500


            to-blue-600


            text-white


            shadow-lg


            shadow-cyan-500/30

          "

        >

          <BarChart3 size={34}/>


        </motion.div>







        {/* Text */}



        <div>


          <h1

            className="

              flex

              items-center

              gap-3


              text-3xl


              font-extrabold


              text-slate-900


              sm:text-4xl



              dark:text-white

            "

          >

            Analytics


          </h1>





          <p

            className="

              mt-2


              text-slate-600



              dark:text-slate-400

            "

          >

            Track your financial performance


          </p>




        </div>





      </div>





    </motion.div>


  );

}


export default AnalyticsHeader;