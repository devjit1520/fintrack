import { motion } from "framer-motion";


function PageWrapper({
 children
}){


return (

<motion.main

initial={{
 opacity:0,
 y:20
}}

animate={{
 opacity:1,
 y:0
}}

transition={{
 duration:.5
}}

className="
min-h-screen
bg-slate-950
dark:bg-slate-950
light:bg-slate-100
transition-all
duration-500
relative
overflow-hidden
"

>


<div
className="
absolute
top-0
left-1/2
h-[400px]
w-[400px]
-translate-x-1/2
rounded-full
bg-cyan-500/20
blur-[120px]
"
/>


<div
className="
relative
z-10
"
>

{children}

</div>


</motion.main>


)


}


export default PageWrapper;