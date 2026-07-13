import { motion } from "framer-motion";

import {
  Info,
  Globe,
  Mail,
  Code2,
  Heart,
  Laptop,
  BadgeCheck,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";



function AboutCard() {


  const version = "v2.0.0";



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



      whileHover={{
        y:-6,
      }}



      transition={{
        duration:0.4,
      }}



      className="

        relative

        overflow-hidden


        rounded-3xl


        border

        border-slate-200


        bg-white


        p-8


        shadow-xl


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


          h-64

          w-64


          rounded-full


          bg-cyan-500/20


          blur-3xl

        "

      />






      <div className="relative">






        {/* Header */}

        <div

          className="

            mb-8

            flex

            items-center

            gap-3

          "

        >

          <div

            className="

              rounded-2xl

              bg-cyan-500/10

              p-3

            "

          >

            <Info

              size={30}

              className="text-cyan-500"

            />

          </div>




          <h2

            className="

              text-3xl

              font-extrabold


              text-slate-900



              dark:text-white

            "

          >

            About FinTrack Pro

          </h2>



        </div>









        {/* Logo */}

        <div

          className="

            mb-8

            flex

            justify-center

          "

        >



          <motion.div


            whileHover={{

              rotate:10,

              scale:1.05,

            }}



            className="

              flex

              h-32

              w-32

              items-center

              justify-center


              rounded-full


              bg-cyan-500/10


              ring-4


              ring-cyan-500/20

            "

          >



            <Laptop

              size={58}

              className="text-cyan-500"

            />



          </motion.div>



        </div>









        {/* Information */}


        <div className="space-y-5">



          <InfoRow

            icon={<BadgeCheck />}

            label="Version"

            value={version}

          />




          <InfoRow

            icon={<Code2 />}

            label="Developer"

            value="Devjit Mondal"

          />




          <InfoRow

            icon={<Heart />}

            label="Built With"

            value="React • Tailwind CSS • Vite"

          />



        </div>









        {/* Buttons */}


        <div className="mt-8 grid gap-4">





          <SocialButton

            href="https://github.com/devjit1520"

            icon={<FaGithub size={22}/>}

            text="GitHub"

            className="

            bg-slate-900

            hover:bg-slate-700

            dark:bg-slate-800

            "

          />






          <SocialButton

            href="https://your-portfolio-link.com"

            icon={<Globe size={22}/>}

            text="Portfolio"

            className="

              bg-cyan-600

              hover:bg-cyan-500

            "

          />






          <SocialButton

            href="mailto:your@email.com"

            icon={<Mail size={22}/>}

            text="Contact"

            className="

              bg-blue-600

              hover:bg-blue-500

            "

          />





        </div>





      </div>






    </motion.div>


  );

}







function InfoRow({
  icon,
  label,
  value,
}) {


  return (


    <motion.div


      whileHover={{
        scale:1.02,
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


        dark:bg-slate-800/50

      "

    >




      <div

        className="

          rounded-xl

          bg-cyan-500/10

          p-3

          text-cyan-500

        "

      >

        {icon}

      </div>





      <div>


        <p

          className="

            text-sm

            text-slate-500



            dark:text-slate-400

          "

        >

          {label}

        </p>





        <h4

          className="

            font-bold


            text-slate-900



            dark:text-white

          "

        >

          {value}

        </h4>



      </div>




    </motion.div>


  );

}







function SocialButton({
  href,
  icon,
  text,
  className,
}) {


  return (

    <a

      href={href}

      target="_blank"

      rel="noreferrer"


      className={`

        flex

        items-center

        justify-center

        gap-3


        rounded-2xl


        py-4


        font-semibold

        text-white


        transition


        hover:scale-[1.03]


        ${className}

      `}

    >

      {icon}

      {text}


    </a>

  );

}




export default AboutCard;