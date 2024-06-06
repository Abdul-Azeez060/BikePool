$(document).ready(function () {
  $(".pause").click(function () {
    $(".bike").toggleClass("paused");
    $(".pause").toggleClass("active");
  });
});
