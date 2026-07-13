import { motion } from "framer-motion";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
} from "lucide-react";


import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";



function RecentActivity() {


  const {
    transactions = [],
  } = useFinance();





  const recent =
    [...transactions]
      .sort(
        (a,b)=>
          new Date(b.date)
          -
          new Date(a.date)
      )
      .slice(0,6);








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


            h-48

            w-48


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

          Recent Activity

        </h2>








        {
          recent.length === 0

          ?

          (

            <p

              className="

                text-slate-500


                dark:text-slate-400

              "

            >

              No transactions yet.

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
                recent.map(
                  (item)=>(


                    <motion.div


                      key={item.id}


                      whileHover={{

                        scale:1.02,

                        x:5,

                      }}



                      transition={{

                        duration:0.2,

                      }}




                      className="


                        flex

                        items-center

                        justify-between


                        rounded-2xl


                        border


                        border-slate-200


                        bg-slate-50


                        p-4


                        transition





                        dark:border-white/10


                        dark:bg-slate-800/40


                      "

                    >






                      {/* Left */}


                      <div

                        className="

                          flex

                          items-center

                          gap-4

                        "

                      >





                        <div


                          className={`

                            rounded-2xl

                            p-3

                            ${
                              item.type === "income"

                              ?

                              "bg-green-500/10"

                              :

                              "bg-red-500/10"

                            }

                          `}

                        >



                          {
                            item.type==="income"

                            ?

                            (

                              <ArrowUpCircle

                                className="text-green-500"

                                size={28}

                              />

                            )


                            :


                            (

                              <ArrowDownCircle

                                className="text-red-500"

                                size={28}

                              />

                            )

                          }



                        </div>








                        <div>


                          <h3


                            className="

                              font-bold


                              text-slate-900



                              dark:text-white

                            "

                          >

                            {item.title}

                          </h3>





                          <p


                            className="

                              text-sm


                              text-slate-500



                              dark:text-slate-400

                            "

                          >

                            {item.category}

                          </p>



                        </div>





                      </div>









                      {/* Right */}


                      <div

                        className="

                          text-right

                        "

                      >





                        <h3


                          className={`

                            font-bold


                            ${
                              item.type==="income"

                              ?

                              "text-green-500"

                              :

                              "text-red-500"

                            }

                          `}

                        >


                          {
                            item.type==="income"
                            ?
                            "+"
                            :
                            "-"
                          }

                          ₹

                          {
                            Number(
                              item.amount
                            )
                            .toLocaleString(
                              "en-IN"
                            )
                          }


                        </h3>







                        <p


                          className="

                            mt-1

                            flex

                            items-center

                            justify-end

                            gap-1


                            text-xs


                            text-slate-500



                            dark:text-slate-400

                          "

                        >

                          <CalendarDays size={13}/>

                          {item.date}


                        </p>





                      </div>





                    </motion.div>


                  )
                )
              }



            </div>


          )

        }






      </Card>





    </motion.div>


  );

}



export default RecentActivity;