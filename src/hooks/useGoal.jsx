import { useContext } from "react";
import { GoalContext } from "../context/GoalContext";


function useGoal(){

  return useContext(GoalContext);

}


export default useGoal;