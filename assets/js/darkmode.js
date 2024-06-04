// let darkMode = localStorage.getItem("darkMode");
// const darkModeToggleClick = $(".buttonDarkMode");
// const darkModeToggleText = $(".buttonDarkModeText");
// const theme = $("#darkmodestylesheet")[0];

// if (theme.href.charAt(0) !== "/") {
//   slash = "/";
// } else {
//   slash = "";
// }

// const lightTheme = () => {
//   darkModeToggleText.text("Dark Mode");
//   theme.href = slash + "assets/css/light.css";
//   localStorage.setItem("darkMode", "enabled");
//   darkModeToggleClick.attr("name", "sunny-outline");
// };

// const darkTheme = () => {
//   darkModeToggleText.text("Light Mode");
//   theme.href = slash + "assets/css/dark.css";
//   localStorage.setItem("darkMode", "disabled");
//   darkModeToggleClick.attr("name", "moon-outline");
// };

// if (darkMode === "enabled") {
//   lightTheme();
// } else {
//   darkTheme();
// }

// darkModeToggleClick.on("click", () => {
//   darkMode = localStorage.getItem("darkMode");
//   if (darkMode === "disabled") {
//     lightTheme();
//   } else {
//     darkTheme();
//   }
// });

// darkModeToggleText.on("click", () => {
//   darkMode = localStorage.getItem("darkMode");
//   if (darkMode === "disabled") {
//     lightTheme();
//   } else {
//     darkTheme();
//   }
// });
