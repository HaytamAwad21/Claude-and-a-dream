export type Theme = "light" | "dark";

/** localStorage key holding the visitor's chosen theme. Light is the default. */
export const THEME_KEY = "theme";

/** Runs in <head> before first paint so a saved dark theme never flashes light. */
export const themeScript = `(function(){try{if(localStorage.getItem("${THEME_KEY}")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}})()`;
