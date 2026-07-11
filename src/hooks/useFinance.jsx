import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";

export default function useFinance() {
  return useContext(FinanceContext);
};