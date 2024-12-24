$(document).ready(function () {
  // Toggle sidebar
  $(".toggler-btn").on("click", function () {
    $("#sidebar").toggleClass("collapsed");

    // Wait for the sidebar animation to complete and then update the calendar size
    setTimeout(function () {
      bookingsCalendar.updateSize();
    }, 300);
  });
});
