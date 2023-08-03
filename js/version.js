const root = document.querySelector(":root");

if (localStorage["valueTheme"] == "false") {
    root.style.setProperty("--bgText", "rgba(0, 0, 0, 0.8)");
    root.style.setProperty("--bgTextSoft", "rgba(0, 0, 0, 0.5)");
} else if (localStorage["valueTheme"] == "true") {
    root.style.setProperty("--bgText", "rgba(255, 255, 255, 1)");
    root.style.setProperty("--bgTextSoft", "rgba(255, 255, 255, 0.5)");
}

const values = JSON.parse(localStorage["valueColor"]);

root.style.setProperty("--colorMain", "hsl(" + values[0] + ", " + values[1] + "%, " + values[2] + "%)");
root.style.setProperty("--colorMainOpac", "hsl(" + values[0] + ", " + values[1] + "%, " + values[2] + "%, 0.15)");
root.style.setProperty("--colorMainFill", "hsl(" + values[0] + ", " + values[1] + "%, " + values[2] + "%, 0.3)");