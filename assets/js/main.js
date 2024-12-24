/**
 * main.js is used for general UI behaviors
 */

/* VARIABLES */
// Single
var stickyTabPills = $("#services-tab-container").length
  ? $("#services-tab-container")
  : null;
var stickyTabPillOffset = stickyTabPills ? stickyTabPills.offset().top : null;

var stickyScheduleCostingContainer = $("#schedule-costing-container").length
  ? $("#schedule-costing-container")
  : null;
var stickyScheduleImage = $("#booking-sched-photo").length
  ? $("#booking-sched-photo")
  : null;
var stickyScheduleInfoContainer = $("#booking-sched-info").length
  ? $("#booking-sched-info")
  : null;
var stickyScheduleContainerOffset = stickyScheduleCostingContainer
  ? stickyScheduleCostingContainer.offset().top
  : null;

var $fixedScheduleCostingContainerMobile = $("#costing-container-mobile").length
  ? $("#costing-container-mobile")
  : null;
var $bookingContainer = $("#main-booking-container").length
  ? $("#main-booking-container")
  : null;

// Group
var stickyTabPillsGroup = $("#services-tab-container-group").length
  ? $("#services-tab-container-group")
  : null;

var stickyTabPillOffsetGroup = stickyTabPillsGroup
  ? stickyTabPillsGroup.offset().top
  : null;

var stickyScheduleCostingContainerGroup = $("#schedule-costing-container-group")
  .length
  ? $("#schedule-costing-container-group")
  : null;

var stickyScheduleImageGroup = $("#booking-sched-photo-group").length
  ? $("#booking-sched-photo-group")
  : null;

var stickyScheduleInfoContainerGroup = $("#booking-sched-info-group").length
  ? $("#booking-sched-info-group")
  : null;

var stickyScheduleContainerOffsetGroup = stickyScheduleCostingContainerGroup
  ? stickyScheduleCostingContainerGroup.offset().top
  : null;

var $fixedScheduleCostingContainerMobileGroup = $(
  "#costing-container-mobile-group"
).length
  ? $("#costing-container-mobile-group")
  : null;

var $bookingContainerGroup = $("#main-booking-container").length
  ? $("#main-booking-container")
  : null;

// Booking Starts
var bookingTypeSelection = null;
window.bookingTypeSelection = bookingTypeSelection;
/* VARIABLES */

$(document).ready(function () {
  $(window).on("scroll", function () {
    if (stickyTabPills && $(window).scrollTop() > stickyTabPillOffset) {
      stickyTabPills.addClass("sticky-shadow py-3");
    } else if (stickyTabPills) {
      stickyTabPills.removeClass("sticky-shadow py-3");
    }
  });

  $(window).on("scroll", function () {
    if (
      stickyTabPillsGroup &&
      $(window).scrollTop() > stickyTabPillOffsetGroup
    ) {
      stickyTabPillsGroup.addClass("sticky-shadow py-3");
    } else if (stickyTabPillsGroup) {
      stickyTabPillsGroup.removeClass("sticky-shadow py-3");
    }
  });

  $(window).on("scroll", function () {
    if (
      stickyScheduleCostingContainer &&
      $(window).scrollTop() > stickyScheduleContainerOffset
    ) {
      stickyScheduleCostingContainer.addClass("schedule-costing-sticky-offset");
      if (stickyScheduleImage) stickyScheduleImage.addClass("shadow-sm");
      if (stickyScheduleInfoContainer)
        stickyScheduleInfoContainer.addClass("shadow-sm");
    } else {
      if (stickyScheduleImage) stickyScheduleImage.removeClass("shadow-sm");
      if (stickyScheduleInfoContainer)
        stickyScheduleInfoContainer.removeClass("shadow-sm");
      if (stickyScheduleCostingContainer)
        stickyScheduleCostingContainer.removeClass(
          "schedule-costing-sticky-offset"
        );
    }
  });

  $(window).on("scroll", function () {
    if (
      stickyScheduleCostingContainerGroup &&
      $(window).scrollTop() > stickyScheduleContainerOffsetGroup
    ) {
      stickyScheduleCostingContainerGroup.addClass(
        "schedule-costing-sticky-offset"
      );
      if (stickyScheduleImageGroup)
        stickyScheduleImageGroup.addClass("shadow-sm");
      if (stickyScheduleInfoContainerGroup)
        stickyScheduleInfoContainerGroup.addClass("shadow-sm");
    } else {
      if (stickyScheduleImageGroup)
        stickyScheduleImageGroup.removeClass("shadow-sm");
      if (stickyScheduleInfoContainerGroup)
        stickyScheduleInfoContainerGroup.removeClass("shadow-sm");
      if (stickyScheduleCostingContainerGroup)
        stickyScheduleCostingContainerGroup.removeClass(
          "schedule-costing-sticky-offset"
        );
    }
  });

  updateBookingContainerMobilePadding();
  updateBookingContainerMobilePaddingGroup();

  $(window).on("resize", function () {
    updateBookingContainerMobilePadding();
    updateBookingContainerMobilePaddingGroup();
  });

  /* START - RESTRICT DATES FOR DATE INPUT */
  restrictDatesForDateInput();
  /* END - RESTRICT DATES FOR DATE INPUT */

  /* START - BOOKING TYPE */
  $("#booking-type-tab").on(
    "shown.bs.tab",
    'button[data-bs-toggle="tab"]',
    function (e) {
      const bookingType = $(e.target).data("booking-type");
      console.log("bookingType", bookingType);

      bookingTypeSelection = bookingType.toLowerCase();
    }
  );

  window.restrictDatesForDateInput = restrictDatesForDateInput;
  /* END - BOOKING TYPE */

  /** START - FUNCTIONS **/
  function updateBookingContainerMobilePadding() {
    if ($(window).width() < 992) {
      if (
        $fixedScheduleCostingContainerMobile &&
        !$fixedScheduleCostingContainerMobile.hasClass("hidden")
      ) {
        const currentTopPadding =
          parseInt($bookingContainer.css("padding-top"), 10) || 0;

        const fixedElementHeight =
          $fixedScheduleCostingContainerMobile.outerHeight();

        const newPaddingBottom = fixedElementHeight - currentTopPadding;

        $bookingContainer.css("padding-bottom", newPaddingBottom + "px");
      } else if ($bookingContainer) {
        const currentTopPadding =
          parseInt($bookingContainer.css("padding-top"), 10) || 0;
        $bookingContainer.css("padding-bottom", currentTopPadding + "px");
      }
    }
  }

  window.updateBookingContainerMobilePadding =
    updateBookingContainerMobilePadding;

  function updateBookingContainerMobilePaddingGroup() {
    if ($(window).width() < 992) {
      if (
        $fixedScheduleCostingContainerMobileGroup &&
        !$fixedScheduleCostingContainerMobileGroup.hasClass("hidden")
      ) {
        const currentTopPadding =
          parseInt($bookingContainerGroup.css("padding-top"), 10) || 0;

        const fixedElementHeight =
          $fixedScheduleCostingContainerMobileGroup.outerHeight();

        const newPaddingBottom = fixedElementHeight - currentTopPadding;

        $bookingContainerGroup.css("padding-bottom", newPaddingBottom + "px");
      } else if ($bookingContainerGroup) {
        const currentTopPadding =
          parseInt($bookingContainerGroup.css("padding-top"), 10) || 0;
        $bookingContainerGroup.css("padding-bottom", currentTopPadding + "px");
      }
    }
  }

  window.updateBookingContainerMobilePaddingGroup =
    updateBookingContainerMobilePaddingGroup;

  // RESTRICT DATE INPUT 3 YEARS FROM NOW
  function restrictDatesForDateInput() {
    // Get today's date
    const today = new Date();

    // Calculate the maximum date (3 years ago from today)
    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() - 3); // Set to 3 years ago

    // Format the maximum date to YYYY-MM-DD
    const maxDateString = maxDate.toISOString().split("T")[0];

    // Set the max attribute for the date input
    $(".date-of-birth-input-booking").attr("max", maxDateString);
  }

  /** END - FUNCTIONS **/
});

/** START - GLOBAL FUNCTIONS */
// Function to show spinner
function showSpinner() {
  $("#loading-spinner").removeClass("d-none");
}

window.showSpinner = showSpinner;

// Function to hide spinner
function hideSpinner() {
  $("#loading-spinner").addClass("d-none");
}
window.hideSpinner = hideSpinner;

// Function to show toast
function showToast(message, type) {
  // Ensure any existing background classes are removed
  $("#global-toast")
    .removeClass("text-bg-danger text-bg-success text-bg-warning") // Add any other classes if needed
    .addClass("text-bg-" + type); // Dynamically add the correct class (e.g., 'text-bg-success' or 'text-bg-warning')

  // Set the new message
  $("#global-toast-message").html(message);

  // Show the toast
  $("#global-toast").toast("show");
}
window.showToast = showToast;
/** END - GLOBAL FUNCTIONS */
