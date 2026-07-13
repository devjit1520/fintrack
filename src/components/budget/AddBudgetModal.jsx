import { useState } from "react";

import useBudget from "../../hooks/useBudget";
import { budgetCategories } from "../../data/budgetCategories";

function AddBudgetModal({
  open,
  onClose,
}) {
  const { addBudget } = useBudget();

  const [form, setForm] = useState({
    category: "Food",
    amount: "",
  });


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.amount) return;

    addBudget({
      category: form.category,
      amount: Number(form.amount),
    });


    setForm({
      category: "Food",
      amount: "",
    });


    onClose();
  };


  if (!open) return null;


  return (
    <div
      className="
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        bg-black/70

        p-4
      "
    >

      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-md

          rounded-3xl

          border
          border-slate-200

          bg-white

          p-8

          shadow-xl


          dark:border-slate-800
          dark:bg-slate-900
        "
      >


        <h2
          className="
            mb-6

            text-2xl
            font-bold

            text-slate-900

            dark:text-white
          "
        >
          Add Budget
        </h2>



        {/* Category */}

        <select
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
          className="
            mb-4

            w-full

            rounded-xl

            border
            border-slate-200

            bg-slate-100

            p-3

            text-slate-900

            outline-none

            focus:border-blue-500


            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
          "
        >

          {budgetCategories.map((item) => (
            <option key={item}>
              {item}
            </option>
          ))}

        </select>




        {/* Amount */}

        <input
          type="number"
          placeholder="Budget Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({
              ...form,
              amount: e.target.value,
            })
          }
          className="
            mb-6

            w-full

            rounded-xl

            border
            border-slate-200

            bg-slate-100

            p-3

            text-slate-900

            placeholder:text-slate-400

            outline-none

            focus:border-blue-500


            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
            dark:placeholder:text-slate-500
          "
        />




        {/* Buttons */}

        <div className="flex justify-end gap-3">


          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl

              bg-slate-200

              px-5
              py-3

              text-slate-900

              transition

              hover:bg-slate-300


              dark:bg-slate-700
              dark:text-white
              dark:hover:bg-slate-600
            "
          >
            Cancel
          </button>



          <button
            type="submit"
            className="
              rounded-xl

              bg-blue-600

              px-5
              py-3

              text-white

              transition

              hover:bg-blue-700

              active:scale-95
            "
          >
            Save
          </button>


        </div>


      </form>


    </div>
  );
}

export default AddBudgetModal;