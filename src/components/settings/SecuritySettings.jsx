import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Eye,
  KeyRound,
  Smartphone,
} from "lucide-react";
import { useState } from "react";

function SecuritySettings() {

  const [twoFactor, setTwoFactor] = useState(false);
  const [showActivity, setShowActivity] = useState(true);


  const securityItems = [
    {
      title: "Two Factor Authentication",
      description:
        "Add an extra layer of security to your account",
      icon: Smartphone,
      value: twoFactor,
      toggle: () => setTwoFactor(!twoFactor),
    },

    {
      title: "Login Activity",
      description:
        "Show recent login and device activity",
      icon: Eye,
      value: showActivity,
      toggle: () => setShowActivity(!showActivity),
    },
  ];


  return (
    <motion.div

      initial={{
        opacity:0,
        y:25
      }}

      animate={{
        opacity:1,
        y:0
      }}

      whileHover={{
        y:-5
      }}

      className="
      rounded-3xl
      border
      border-white/10

      bg-white
      
      p-8

      backdrop-blur-xl

      dark:bg-white/5

      "
    >


      {/* Header */}

      <div className="
      mb-8
      flex
      items-center
      gap-3
      
      ">

        <div className="
        rounded-2xl
        bg-cyan-500/20
        p-3
        ">

          <ShieldCheck
            size={28}
            className="text-cyan-400"
          />

        </div>


        <div>

          <h2 className="
          text-2xl
          font-bold
          text-black 
          dark:text-white
          ">
            Security
          </h2>

          <p className="
          text-slate-400
          ">
            Manage your account security
          </p>

        </div>

      </div>



      {/* Security Options */}

      <div className="space-y-5">


        {securityItems.map((item)=>{

          const Icon=item.icon;


          return (

            <div

            key={item.title}

            className="
            flex
            items-center
            justify-between

            rounded-2xl
            bg-slate-800/50

            p-5
            "

            >

              <div className="
              flex
              items-center
              gap-4
              
              ">


                <div className="
                rounded-xl
                bg-cyan-500/20
                p-3
                ">

                  <Icon
                  size={22}
                  className="text-cyan-400"
                  />

                </div>



                <div>

                  <h3 className="
                  font-semibold
                  text-white
                  ">
                    {item.title}
                  </h3>

                  <p className="
                  text-sm
                  text-slate-400
                  ">
                    {item.description}
                  </p>

                </div>


              </div>



              <button

              onClick={item.toggle}

              className={`
              relative
              h-7
              w-14
              rounded-full
              transition

              ${
                item.value
                ?
                "bg-cyan-500"
                :
                "bg-slate-600"
              }

              `}
              >

                <motion.div

                animate={{
                  x:item.value ? 28 : 4
                }}

                transition={{
                  type:"spring",
                  stiffness:400
                }}

                className="
                absolute
                top-1

                h-5
                w-5

                rounded-full
                bg-white
                "

                />

              </button>


            </div>

          )

        })}


      </div>



      {/* Password Section */}

      <div className="
      mt-8
      rounded-2xl
      bg-slate-800/50
      p-5
      ">


        <div className="
        flex
        items-center
        gap-3
        mb-4
        ">

          <KeyRound
          className="text-cyan-400"
          size={22}
          />


          <h3 className="
          font-semibold
          text-white
          ">
            Password
          </h3>

        </div>


        <button

        className="
        flex
        w-full
        items-center
        justify-center
        gap-3

        rounded-xl

        bg-gradient-to-r
        from-cyan-500
        to-blue-600

        py-3

        font-semibold
        text-white

        transition
        hover:scale-[1.02]

        "
        >

          <Lock size={18}/>

          Change Password

        </button>


      </div>



      {/* Status */}

      <div className="
      mt-6

      flex
      items-center
      gap-3

      rounded-2xl

      bg-green-500/10

      p-4
      ">


        <ShieldCheck
        className="text-green-400"
        />


        <p className="
        text-sm
        text-green-400
        ">

          Your account security is up to date.

        </p>


      </div>



    </motion.div>
  );
}


export default SecuritySettings;