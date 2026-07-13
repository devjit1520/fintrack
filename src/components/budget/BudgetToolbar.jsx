import { Search } from "lucide-react";

import {
  budgetCategories,
} from "../../data/budgetCategories";


function BudgetToolbar({
  search,
  setSearch,
  category,
  setCategory,
}) {


  return (

    <div

      className="
        grid

        gap-5


        md:grid-cols-2
      "

    >





      {/* Search */}


      <div

        className="
          group

          relative
        "

      >



        <Search

          size={20}

          className="
            absolute

            left-4

            top-1/2


            -translate-y-1/2


            text-slate-400


            transition


            group-focus-within:text-blue-500

          "

        />





        <input


          value={search}


          onChange={(e)=>
            setSearch(
              e.target.value
            )
          }


          placeholder="Search budget..."


          className="

            w-full


            rounded-2xl


            border


            border-slate-200


            bg-white


            px-5


            py-4


            pl-12


            text-slate-900


            outline-none


            shadow-sm


            backdrop-blur-xl


            transition-all



            placeholder:text-slate-400



            focus:border-blue-500


            focus:ring-4


            focus:ring-blue-500/20




            dark:border-white/10


            dark:bg-slate-900/70


            dark:text-white


          "

        />




      </div>







      {/* Category Filter */}



      <div

        className="
          relative
        "

      >


        <select


          value={category}


          onChange={(e)=>
            setCategory(
              e.target.value
            )
          }



          className="

            w-full


            appearance-none


            rounded-2xl


            border


            border-slate-200


            bg-white


            px-5


            py-4


            text-slate-900


            outline-none


            shadow-sm


            transition-all



            hover:border-blue-400



            focus:border-blue-500


            focus:ring-4


            focus:ring-blue-500/20




            dark:border-white/10


            dark:bg-slate-900/70


            dark:text-white

          "

        >



          <option value="all">

            All Categories

          </option>



          {
            budgetCategories.map(
              (item)=>(
                <option
                  key={item}
                  value={item}
                >

                  {item}

                </option>
              )
            )
          }


        </select>



        {/* Dropdown Glow */}

        <div

          className="
            pointer-events-none

            absolute

            right-5

            top-1/2


            -translate-y-1/2


            text-slate-400

          "

        >

          ▾

        </div>


      </div>






    </div>

  );

}



export default BudgetToolbar;