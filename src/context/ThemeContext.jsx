import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


const ThemeContext = createContext();


export function ThemeProvider({ children }) {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );


  const [accent, setAccent] = useState(
    localStorage.getItem("accent") || "#06b6d4"
  );


  useEffect(() => {

    const root = document.documentElement;


    if(theme === "dark"){

      root.classList.add("dark");

    }
    else if(theme === "light"){

      root.classList.remove("dark");

    }
    else{

      const systemDark =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;


      systemDark
        ? root.classList.add("dark")
        : root.classList.remove("dark");

    }


    localStorage.setItem(
      "theme",
      theme
    );


  },[theme]);



  useEffect(()=>{

    document.documentElement.style.setProperty(
      "--accent",
      accent
    );


    localStorage.setItem(
      "accent",
      accent
    );


  },[accent]);



  return (

    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accent,
        setAccent
      }}
    >

      {children}

    </ThemeContext.Provider>

  );

}



export function useTheme(){

  return useContext(ThemeContext);

}