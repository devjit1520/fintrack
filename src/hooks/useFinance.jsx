import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";

function useFinance() {
  return useContext(FinanceContext);
}

export default useFinance;