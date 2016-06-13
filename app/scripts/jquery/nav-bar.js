/**
 * Created by gabriela on 08/06/16.
 */
$(function() {
  $("h1").animate({
    "margin-left": "100px"
  }, "slow");

  $(".nav li").on("click", function() {
    $(".nav li").removeClass("active");
    $(this).addClass("active");
  });
});
