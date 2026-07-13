import { motion } from "framer-motion";
import { Settings } from "lucide-react";


function SettingsHeader() {


return (

<motion.div

initial={{
 opacity:0,
 y:-25
}}

animate={{
 opacity:1,
 y:0
}}

transition={{
 duration:.5
}}

className="

relative
overflow-hidden

rounded-3xl

border
border-slate-200
dark:border-white/10

bg-white
dark:bg-white/5

p-8

shadow-xl

backdrop-blur-xl

"


>


{/* Background Glow */}

<div
className="
absolute
-top-20
-right-20

h-56
w-56

rounded-full

bg-cyan-500/20

blur-3xl
"
/>



<div
className="
absolute
-bottom-24
-left-24

h-56
w-56

rounded-full

bg-blue-600/20

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


<motion.div

whileHover={{
scale:1.1,
rotate:10
}}

className="
rounded-2xl

bg-cyan-500/20

p-4

"

>

<Settings

size={34}

className="
text-cyan-400
"

/>

</motion.div>





<div>


<h1

className="

text-4xl

font-bold


text-slate-900

dark:text-white


"

>

Settings

</h1>




<p

className="

mt-2


text-slate-500

dark:text-slate-400


"

>

Customize your FinTrack experience

</p>



</div>



</div>



</motion.div>


)

}


export default SettingsHeader;