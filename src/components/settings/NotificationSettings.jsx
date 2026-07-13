import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Bell,
  Wallet,
  Target,
  CalendarDays,
  Mail,
  Smartphone,
  Check,
} from "lucide-react";


function NotificationSettings() {


const [settings,setSettings]=useState(()=>{

const saved =
localStorage.getItem(
"notificationSettings"
);


return saved
? JSON.parse(saved)
:{
budgetAlert:true,
goalReminder:true,
weeklySummary:false,
emailNotification:true,
pushNotification:false
};


});




useEffect(()=>{

localStorage.setItem(
"notificationSettings",
JSON.stringify(settings)
);


},[settings]);





const toggle=(key)=>{

setSettings(prev=>({

...prev,

[key]:!prev[key]

}));

};





const items=[

{
key:"budgetAlert",
title:"Budget Alerts",
subtitle:"Warn when spending exceeds budget",
icon:Wallet
},


{
key:"goalReminder",
title:"Goal Reminder",
subtitle:"Receive savings goal reminders",
icon:Target
},


{
key:"weeklySummary",
title:"Weekly Summary",
subtitle:"Get weekly financial reports",
icon:CalendarDays
},


{
key:"emailNotification",
title:"Email Notifications",
subtitle:"Send reports through email",
icon:Mail
},


{
key:"pushNotification",
title:"Push Notifications",
subtitle:"Browser notifications",
icon:Smartphone
}


];






return (

<motion.div

initial={{
opacity:0,
x:-20
}}

animate={{
opacity:1,
x:0
}}

whileHover={{
y:-5
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


{/* Glow */}

<div
className="
absolute
-right-20
-top-20

h-60
w-60

rounded-full

bg-cyan-500/20

blur-3xl
"
/>




<div className="
relative
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


<Bell
size={28}
className="text-cyan-400"
/>


</div>



<div>


<h2 className="
text-2xl
font-bold

text-slate-900

dark:text-white

">

Notifications

</h2>


<p className="
text-sm

text-slate-500

dark:text-slate-400

">

Manage your finance alerts

</p>


</div>


</div>







<div className="
space-y-5
">


{
items.map((item,index)=>{


const Icon=item.icon;


return (

<motion.div

key={item.key}

initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}

transition={{
delay:index*0.08
}}


className="

flex

items-center

justify-between


rounded-2xl


border

border-slate-200

dark:border-white/10


bg-slate-100

dark:bg-slate-800/50


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

text-slate-900

dark:text-white

">

{item.title}

</h3>



<p className="

text-sm

text-slate-500

dark:text-slate-400

">

{item.subtitle}

</p>


</div>


</div>







{/* Toggle */}

<button

onClick={()=>toggle(item.key)}

className={`

relative

h-8

w-16

rounded-full

transition-all

duration-300


${
settings[item.key]

?

"bg-cyan-500 shadow-lg shadow-cyan-500/30"

:

"bg-slate-400 dark:bg-slate-600"

}

`}


>


<motion.div


animate={{

x:
settings[item.key]
?
32
:
4

}}


transition={{

type:"spring",

stiffness:500,

damping:30

}}


className="

absolute

top-1

h-6

w-6

rounded-full

bg-white

flex

items-center

justify-center

shadow

"


>


{
settings[item.key] &&

<Check

size={14}

className="text-cyan-500"

/>

}


</motion.div>


</button>




</motion.div>


)


})


}


</div>





</motion.div>


)

}


export default NotificationSettings;