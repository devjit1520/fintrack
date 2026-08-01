import { useContext } from "react";

import {
  DebtContext,
} from "../context/DebtContext";

/* =========================================================
   USE DEBT HOOK
========================================================= */

function useDebt() {
  const context =
    useContext(DebtContext);

  if (!context) {
    throw new Error(
      "useDebt must be used inside DebtProvider."
    );
  }

  return context;
}

export default useDebt;