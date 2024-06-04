// let preloaderDone = localStorage.getItem("preloaderDone");

// if (preloaderDone === "Done") {
//   var page = window.location.pathname.split("/").pop();
//   if (page === "index.html") {
//     load();
//   } else {
//     $("#preloader")[0].style.display = "none";
//     document.documentElement.classList.remove("locked-body");
//   }
// } else {
//   load();
// }

$(".colored-text").css("opacity", "100");
setTimeout(() => {
  $(".number")[0].style.setProperty("--num", "100");
}, 1500);

function load() {
  function preloaderSwipe() {
    setTimeout(() => {
      $("#preloader")[0].classList.add("preloader-swipe");
      $("body")[0].classList.remove("locked-body");
    }, 1750);
  }

  setTimeout(() => {
    $(".colored-text").css("color", "var(--second)");
    preloaderSwipe();
  }, 2000);

  localStorage.setItem("preloaderDone", "Done");

  // $.when($(".number").innerHTML === "f").then(() => {
  //   console.log("fini");
  // });
}

load();