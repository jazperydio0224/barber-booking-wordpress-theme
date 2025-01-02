/* START - VARIABLES */
let bookingsCalendars = [];
let allExistingBookings = [];

// Update Status Variables
let referenceNumber = null;
let selectedStatus = null;
let clientId = null;
let serviceId = null;
let haircutImages = null;
let customerNotes = null;

// Resched Variables
let bookingRefNumber = null;
let reschedDate = null;
let reschedTime = null;

// WalkIn Variables
let clientSelectionType = "existing";
let selectedServices = [];
let totalPrice = 0;
let selectedBookingDate = null;
let selectedBookingTime = null;
let walkInClientId = null;
let fullName = null;
let contactNumber = null;
let emailAddress = null;
let dateOfBirth = null;

// Walk-in Steps
let currentStep = 1;
let isWalkInSubmitting = false;

// International Phone Input
let itiInstance = null;

/** END - VARIABLES **/

$(document).ready(async function () {
  try {
    await loadFullCalendar();
  } catch (error) {
    console.error("Initialization failed:", error);
    showToast("Failed to load bookings calendar", "danger");
  }

  /** START - REBOOKING **/
  $(document).on("click", ".list-item-rebooking-time", function () {
    const itemTime = $(this);
    const bookingTime = itemTime.data("booking-time"); // Fixed from "data-booking-time"
    reschedTime = bookingTime;
    updateTimeButtonStates("list-item-rebooking-time", reschedTime);
  });

  $(document).on("click", "#saveReschedBookingBtn", async function () {
    await rescheduleBooking();
  });
  /** END - REBOOKING **/

  /** START - WALK-IN **/

  /* START - INTERNATIONAL TELEPHONE INPUT */
  // Wait until the modal is shown before initializing intl-tel-input
  $("#walk-in-modal").on("shown.bs.modal", function () {
    var input = document.querySelector("#contact-number-walk-in");
    if (input && !input.classList.contains("iti")) {
      // Check if it’s not already initialized
      itiInstance = window.intlTelInput(input, {
        initialCountry: "nz",
        separateDialCode: true,
        preferredCountries: ["nz"],
        onlyCountries: ["nz"],
        allowDropdown: false,
        utilsScript:
          "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js",
      });
    } else if (!input) {
      console.error("Contact number input field not found");
    }
  });

  //Destroy the instance when modal is hidden
  $("#walk-in-modal").on("hidden.bs.modal", function () {
    if (itiInstance) {
      itiInstance.destroy(); // Destroy the intlTelInput instance
      itiInstance = null;
    }
  });
  /* END - INTERNATIONAL TELEPHONE INPUT */

  /* START - LIST ITEMS BUTTON CLICK EVENT - ADMIN*/
  $(".services-list-group-btn").on("click", function (event) {
    event.stopPropagation();

    var $service = $(this).parent().parent();

    // Retrieve service details from data attributes
    var serviceId = $service.data("service-id");
    var serviceName = $service.data("service-name");
    var duration = $service.data("duration");
    var forWhom = $service.data("for-whom");
    var price = parseFloat($service.data("price"));
    var serviceType = $service.data("service-type"); // Get the service type

    // Determine whether to show Add or Remove button
    var serviceIndex = selectedServices.findIndex(
      (service) =>
        service.serviceName === serviceName &&
        service.serviceType === serviceType
    );

    if (serviceIndex === -1) {
      addOrReplaceService(
        serviceId,
        serviceType,
        serviceName,
        duration,
        forWhom,
        price
      );

      toggleNextButtonState("next-to-step-2");
      updateServicesSelectedStyling(".list-item-service");
    } else {
      // Remove service
      selectedServices.splice(serviceIndex, 1);
      removeService(
        serviceId,
        serviceType,
        serviceName,
        duration,
        forWhom,
        price
      );

      toggleNextButtonState("next-to-step-2");
      updateServicesSelectedStyling(".list-item-service");
    }
  });
  /* END - LIST ITEMS BUTTON CLICK EVENT - ADMIN */
  // show modal and load its options
  $(document).on("click", "#add-new-walk-in-btn", async function () {
    $("#walk-in-modal").modal("show");
    await loadWalkInCalendar();
    $("#walkInLoadingContainer").addClass("d-none");
    $("#walk-in-options-container").removeClass("d-none");
  });

  // steps
  $(document).on("click", "#next-to-step-2", function () {
    if (selectedServices.length === 0) {
      showToast("Please select at least one service", "danger");
      return;
    } else {
      currentStep = 2;
      showWalkInStep(2);
    }
  });

  $(document).on("click", "#back-to-step-1", function () {
    currentStep = 1;
    showWalkInStep(1);
  });

  $(document).on("click", "#next-to-step-3", function () {
    if (!selectedBookingDate && !selectedBookingTime) {
      showToast("Please select the booking date and time", "danger");
      return;
    } else {
      currentStep = 3;
      showWalkInStep(3);
    }
  });

  $(document).on("click", "#back-to-step-2", function () {
    currentStep = 2;
    showWalkInStep(2);
  });

  // Get the form element
  const form = document.getElementById("client-form");

  // Handle form submission of the continue to step 4 button in the form
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add("was-validated"); // Add Bootstrap validation class
    } else {
      form.classList.add("was-validated"); // Add Bootstrap validation class

      if (clientSelectionType === "new") {
        const contactNumber = itiInstance.getNumber();

        if (contactNumber) {
          if (!itiInstance.isValidNumber()) {
            $("#contact-number-walk-in").addClass("is-invalid");
            return;
          }
        }

        const data = {
          fullName: document.getElementById("full-name-walk-in").value,
          contactNumber: contactNumber.trim(),
          emailAddress: document.getElementById("email-address-walk-in").value,
          dateOfBirth: document.getElementById("date-of-birth-walk-in").value,
          selectedServices,
          selectedBookingDate,
          selectedBookingTime,
        };

        currentStep = 4;
        showWalkInStep(4);
        renderSummaryListContent("new", data);
      }
    }
  });

  $(document).on("click", "#next-to-step-4-client-select", function () {
    if (clientSelectionType === "existing") {
      if (!walkInClientId) {
        showToast("Please select a client", "danger");
        return;
      } else {
        currentStep = 4;
        showWalkInStep(4);

        const data = {
          fullName,
          selectedServices,
          selectedBookingDate,
          selectedBookingTime,
        };
        renderSummaryListContent("existing", data);
      }
    }
  });

  $(document).on("click", "#back-to-step-3", function () {
    currentStep = 3;
    showWalkInStep(3);
  });

  // walk in time slots click event
  $(document).on("click", ".list-item-walk-in-time", function () {
    var itemTime = $(this);
    var bookingTime = itemTime.data("booking-time");
    selectedBookingTime = bookingTime;
    updateTimeButtonStates("list-item-walk-in-time", selectedBookingTime);
    if (selectedBookingDate && selectedBookingTime) {
      toggleNextButtonState("next-to-step-3");
    }
  });

  // client switch event client selection
  $("#switchAddClient").on("change", function (e) {
    // Check if the switch is checked
    if (e.target.checked) {
      $("#switchAddClientLabel").text("Existing Clients");
      clientSelectionType = "existing";
      $("#client-select-container").removeClass("d-none");
      $("#client-form").addClass("d-none");
    } else {
      $("#switchAddClientLabel").text("New Client");
      clientSelectionType = "new";
      $("#client-select-container").addClass("d-none");
      $("#client-form").removeClass("d-none");
    }
  });

  // existing client select
  $("#client-select").on("change", function () {
    walkInClientId = $(this).val();
    fullName = $(this).find("option:selected").text();
    if (walkInClientId) {
      toggleNextButtonState("next-to-step-4");
    }
  });

  // prevent closing of modal during submission
  $("#add-new-walk-in-btn").on("hide.bs.modal", function (e) {
    if (isWalkInSubmitting) {
      e.preventDefault(); // Prevent the modal from closing
    }
  });

  // new client fill-up
  $(document).on(
    "input",
    "#full-name-walk-in, #email-address-walk-in, #contact-number-walk-in, #date-of-birth-walk-in",
    function () {
      fullName = $("#full-name-walk-in").val();
      emailAddress = $("#email-address-walk-in").val();
      contactNumber = $("#contact-number-walk-in").val();
      dateOfBirth = $("#date-of-birth").val();

      // Check if both fields are not empty
      if (fullName && emailAddress) {
        toggleNextButtonState("next-to-step-4");
      }
    }
  );

  $(document).on("click", "#book-btn", async function () {
    const currency = "nzd";

    const updatedServices = selectedServices.map(function (service) {
      return {
        serviceId: service.serviceId,
        serviceType: service.serviceType,
        serviceName: service.serviceName,
        serviceDuration: service.serviceDuration,
        serviceForWhom: service.serviceForWhom,
        servicePrice: service.servicePrice,
        servicePriceCurrency: currency,
      };
    });

    const data = {
      clientSelectionType,
      selectedServices: updatedServices,
      totalPrice,
      selectedBookingDate,
      selectedBookingTime,
      walkInClientId,
      fullName,
      contactNumber,
      emailAddress,
      dateOfBirth,
    };

    isWalkInSubmitting = true;
    await submitWalkInBooking(data);
    isWalkInSubmitting = false;
  });

  /** END - WALK-IN **/
});

/** START - FUNCTIONS **/
async function loadFullCalendar() {
  initializeCalendarModalDefaultContent();
  const allCalendars = document.querySelectorAll(".full-calendar");
  console.log("allCalendars", allCalendars);

  allCalendars.forEach((calendar) => {
    const barberId = calendar.getAttribute("data-barber-id");

    const bookingsCalendar = new FullCalendar.Calendar(calendar, {
      initialView: "listWeek",
      nowIndicator: true,
      headerToolbar: {
        left: "prev,next",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
      },
      events: async function (fetchInfo, successCallback, failureCallback) {
        try {
          const bookings = await loadBookingCalendarData(
            barberId,
            fetchInfo.startStr,
            fetchInfo.endStr
          );

          console.log("bookings", bookings);

          const formattedBookings = bookings.map((booking) => {
            const {
              reference_number,
              client_id,
              client_name,
              appointment_date,
              appointment_time,
              barber_id,
              barber_name,
              booking_type,
              group_id,
              services,
              booking_service_status,
              notes,
            } = booking;

            const startDateTime = new Date(
              `${appointment_date}T${appointment_time}`
            );

            if (isNaN(startDateTime.getTime())) {
              console.error(
                "Invalid date or time:",
                appointment_date,
                appointment_time
              );
              return null; // Handle invalid date
            }

            return {
              title:
                booking_type === "group"
                  ? `${client_name} (GROUP)`
                  : `${client_name}`,
              start: startDateTime.toISOString(),
              end: new Date(
                startDateTime.getTime() + 15 * 60 * 1000
              ).toISOString(),
              client_id: client_id,
              reference_number: reference_number,
              appointment_date: appointment_date,
              appointment_time: appointment_time,
              barber_id: barber_id,
              barber_name: barber_name,
              booking_type: booking_type,
              group_id: group_id,
              services: services,
              booking_service_status: booking_service_status,
              notes,
            };
          });

          successCallback(formattedBookings);
          allExistingBookings.push(...formattedBookings);
        } catch (error) {
          failureCallback(error);
        }
      },
      eventDidMount: function (info) {
        if (
          info.event.extendedProps.booking_service_status.toLowerCase() ===
          "completed"
        ) {
          info.el.style.color = "#28a745";
        } else if (
          info.event.extendedProps.booking_service_status.toLowerCase() ===
          "cancelled"
        ) {
          info.el.style.color = "#dc3545";
        } else if (
          info.event.extendedProps.booking_service_status.toLowerCase() ===
          "no show"
        ) {
          info.el.style.color = "#ff5722";
        }
      },
      eventClick: function (info) {
        setUpdateServiceStatusEventListener();

        const bookingType = info.event.extendedProps.booking_type;
        const bookingId = info.event.extendedProps.reference_number;
        const groupId = info.event.extendedProps.group_id;
        let bookingData = "";

        if (bookingType.toLowerCase() === "single") {
          bookingData = allExistingBookings.find(
            (booking) => booking.reference_number === bookingId
          );
        } else {
          bookingData = allExistingBookings.filter(
            (booking) => booking.group_id === groupId
          );
        }

        // render booking modal content
        renderBookingModal(bookingType, bookingData);

        initializeCalendarModalDefaultContent();
        showEventDetailsModal();

        // Calendar Modal Update Fields
        const calendarModalContent1 = document.getElementById(
          "calendar-modal-content-1"
        );
        const calendarModalContent2 = document.getElementById(
          "calendar-modal-content-2"
        );

        const calendarModalContent3 = document.getElementById(
          "calendar-modal-content-3"
        );

        // Set the default value of the select based on booking_service_status
        const serviceStatusSelect = document.getElementById("service-status");

        // Add event listener to the Update button
        document.getElementById("service-status-update-btn").onclick =
          function () {
            calendarModalContent1.classList.add("d-none");
            calendarModalContent2.classList.remove("d-none");
            calendarModalContent3.classList.add("d-none");

            serviceStatusSelect.value =
              event.extendedProps.booking_service_status;

            // Set the transaction ID in the hidden field
            document.getElementById("ref-number").value =
              event.extendedProps.reference_number;

            handleShowCompletedFormFields(serviceStatusSelect, event);
          };

        document.getElementById("service-status-back-btn").onclick =
          function () {
            calendarModalContent1.classList.remove("d-none");
            calendarModalContent2.classList.add("d-none");
            calendarModalContent3.classList.add("d-none");
          };

        document.getElementById("service-reschedule-btn").onclick =
          async function () {
            let barberIDs = [];

            if (event.extendedProps.booking_type.toLowerCase() === "group") {
              barberIDs = allExistingBookings.map((booking) => {
                return booking.barber_id;
              });
            } else {
              barberIDs = [event.extendedProps.barber_id];
            }

            const uniqueBarberIds = [...new Set(barberIDs)];
            await loadRebookingCalendar(uniqueBarberIds);

            // state variable
            bookingRefNumber = event.extendedProps.reference_number;

            calendarModalContent1.classList.add("d-none");
            calendarModalContent2.classList.add("d-none");
            calendarModalContent3.classList.remove("d-none");
          };

        document.getElementById("resched-booking-back-btn").onclick =
          function () {
            calendarModalContent1.classList.remove("d-none");
            calendarModalContent2.classList.add("d-none");
            calendarModalContent3.classList.add("d-none");
          };

        $("#service-status").on("change", function () {
          handleShowCompletedFormFields(serviceStatusSelect, event);
        });
      },
    });
    bookingsCalendar.render();
    bookingsCalendars.push(bookingsCalendar);
  });
}

function getServiceByPriority(services) {
  const priority = ["Hair", "Shave", "Additional"];

  // Find the first service that matches the priority
  return priority
    .map((type) => services.find((service) => service.service_type === type))
    .find((service) => service !== undefined);
}

async function loadBookingCalendarData(barberId, start, end) {
  try {
    // Calendar Modal Update Fields

    showSpinner();
    const response = await fetch(
      `${dShaverApiSettings.calendarBookingsApi}?barberId=${barberId}&start=${start}&end=${end}`,
      {
        headers: {
          "X-WP-Nonce": dShaverApiSettings.nonce, // Include nonce for security
        },
      }
    );

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      return data.data;
    } else {
      showToast("Error fetching booking calendar data", "danger");
    }
  } catch (error) {
    console.error("Error fetching booking calendar data:", error);
    showToast("Error fetching booking calendar data", "danger");
  } finally {
    hideSpinner();
  }
}

function setUpdateServiceStatusEventListener() {
  document.getElementById("updateServiceStatusForm").onsubmit = async function (
    event
  ) {
    // Prevent the default action (if the button is inside a form)
    event.preventDefault();
    // Stop the event from propagating to parent elements
    event.stopPropagation();

    // Retrieve the values
    selectedStatus = document.getElementById("service-status").value;
    referenceNumber = document.getElementById("ref-number").value;

    clientId = document.getElementById("client-id").value;
    serviceId = document.getElementById("service-id").value;
    haircutImages = document.getElementById("haircut-images");
    customerNotes = document.getElementById("customer-notes").value;

    if (selectedStatus.toLowerCase() === "completed") {
      await updateServiceCompletedStatus(
        referenceNumber,
        selectedStatus,
        clientId,
        serviceId,
        haircutImages,
        customerNotes
      );
    } else {
      await updateServiceStatus(referenceNumber, selectedStatus);
    }

    await loadFullCalendar();

    // Close the update modal
    hideEventDetailsModal();
  };
}

async function updateServiceStatus(referenceNumber, selectedStatus) {
  try {
    showLoadingSaveServiceStatusSubmission();
    const response = await fetch(dShaverApiSettings.updateServiceStatusApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": dShaverApiSettings.nonce,
      },
      body: JSON.stringify({
        reference_number: referenceNumber,
        service_status: selectedStatus,
      }),
    });

    const result = await response.json();
    if (result.success) {
      resetBookingStatusVariables();
    } else {
      showToast(result?.message, "danger");
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideLoadingSaveServiceStatusSubmission();
  }
}

async function updateServiceCompletedStatus(
  referenceNumber,
  selectedStatus,
  clientId,
  serviceId,
  haircutImages,
  customerNotes
) {
  try {
    showLoadingSaveServiceStatusSubmission();

    if (!referenceNumber || !selectedStatus || !clientId || !serviceId) {
      showToast(
        `<p>Please complete the required fields before proceeding.</p>`,
        "danger"
      );
      return;
    }

    // form data for file uploads
    const formData = new FormData();
    formData.append("reference_number", referenceNumber);
    formData.append("service_status", selectedStatus);
    formData.append("client_id", clientId);
    formData.append("service_id", serviceId);
    formData.append("customer_notes", customerNotes);

    // Append each selected image file to the FormData object
    if (haircutImages && haircutImages.files.length > 0) {
      for (let i = 0; i < haircutImages.files.length; i++) {
        formData.append("haircut_images[]", haircutImages.files[i]);
      }
    }

    const response = await fetch(
      dShaverApiSettings.updateServiceStatusCompletedApi,
      {
        method: "POST",
        headers: {
          "X-WP-Nonce": dShaverApiSettings.nonce,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (result.success) {
      resetBookingStatusVariables();
    } else {
      showToast(result?.message, "danger");
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideLoadingSaveServiceStatusSubmission();
  }
}

function showLoadingSaveServiceStatusSubmission() {
  const saveServiceStatusBtn = document.getElementById("saveServiceStatusBtn");
  saveServiceStatusBtn.classList.add("d-none");

  const saveServiceStatusSpinner = document.getElementById(
    "saveServiceStatusSpinner"
  );
  saveServiceStatusSpinner.classList.remove("d-none");
}

function hideLoadingSaveServiceStatusSubmission() {
  const saveServiceStatusBtn = document.getElementById("saveServiceStatusBtn");
  saveServiceStatusBtn.classList.remove("d-none");

  const saveServiceStatusSpinner = document.getElementById(
    "saveServiceStatusSpinner"
  );
  saveServiceStatusSpinner.classList.add("d-none");
}

function hideContainer(containerId) {
  const container = document.getElementById(containerId);
  container.classList.add("d-none");
}

function showContainer(containerId) {
  const container = document.getElementById(containerId);
  container.classList.remove("d-none");
}

// WalkIn Calendar
async function loadWalkInCalendar() {
  const unavailableDates = await loadUnavailableDates();

  var options = {
    actions: {
      async clickDay(event, self) {
        selectedBookingDate = self.selectedDates[0];

        showBookingTimeSpinner(
          "walkInTimeSpinner",
          "list-group-time-walk-in-container"
        );

        const availableTimes = await loadAvailableTimes(selectedBookingDate);

        hideBookingTimeSpinner(
          "walkInTimeSpinner",
          "list-group-time-walk-in-container"
        );

        const listItemTimeWalkInContainer = $(
          "#list-group-time-walk-in-container"
        );

        listItemTimeWalkInContainer.empty();

        if (availableTimes.length === 0) {
          var listItemTimeWalkInHTML = `
          <h5 class="mb-0 fw-medium text-center">No booking time slots available on this day.</h5>`;
          listItemTimeWalkInContainer.append(listItemTimeWalkInHTML);
        } else {
          availableTimes.forEach((time) => {
            var listItemTimeWalkInHTML = `
              <div class="list-group-item list-group-item-action list-item-walk-in-time p-0" aria-current="true"
                data-booking-time="${time}">
                <div class="p-3">
                  <h5 class="mb-0 fw-medium">${time}</h5>
                </div>
              </div>
            `;
            listItemTimeWalkInContainer.append(listItemTimeWalkInHTML);
          });
        }
      },
    },
    settings: {
      visibility: {
        theme: "light",
      },
      range: {
        disablePast: true,
        disabled: unavailableDates,
      },
    },
  };

  var calendar = new VanillaCalendar("#walk-in-calendar", options);
  calendar.init();
}

// Rebooking Calendar
async function loadRebookingCalendar(barberIDs) {
  const unavailableDates = await loadUnavailableDates(barberIDs);

  var options = {
    actions: {
      async clickDay(event, self) {
        reschedDate = self.selectedDates[0];

        showBookingTimeSpinner(
          "rescheduleTimeSpinner",
          "list-group-time-resched-container"
        );
        const availableTimes = await loadAvailableTimes(reschedDate, barberIDs);

        hideBookingTimeSpinner(
          "rescheduleTimeSpinner",
          "list-group-time-resched-container"
        );

        const listItemTimeReschedContainer = $(
          "#list-group-time-resched-container"
        );

        listItemTimeReschedContainer.empty();

        if (availableTimes.length === 0) {
          var listItemTimeReschedHTML = `
          <h5 class="mb-0 fw-medium text-center">No booking time slots available on this day.</h5>`;
          listItemTimeReschedContainer.append(listItemTimeReschedHTML);
        } else {
          availableTimes.forEach((time) => {
            var listItemTimeReschedHTML = `
              <div class="list-group-item list-group-item-action list-item-rebooking-time p-0" aria-current="true"
                data-booking-time="${time}">
                <div class="p-3">
                  <h5 class="mb-0 fw-medium">${time}</h5>
                </div>
              </div>
            `;
            listItemTimeReschedContainer.append(listItemTimeReschedHTML);
          });
        }
      },
    },
    settings: {
      visibility: {
        theme: "light",
      },
      range: {
        disablePast: true,
        disabled: unavailableDates,
      },
    },
  };

  var calendar = new VanillaCalendar("#resched-calendar", options);
  calendar.init();
}

// API call for unavailable dates
async function loadUnavailableDates(barberIDs) {
  try {
    showRebookingCalendarLoading();
    $("#service-status-update-btn").attr("disabled", true);

    const apiUrl = `${
      dShaverApiSettings.unavailableDatesApi
    }?barber_id=${encodeURIComponent(barberIDs.join(","))}`;

    const response = await fetch(apiUrl, {
      headers: {
        "X-WP-Nonce": dShaverApiSettings.nonce,
      },
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    } else {
      showToast("Error fetching unavailable dates", "danger");
    }
  } catch (error) {
    showToast("Error fetching unavailable dates", "danger");
  } finally {
    hideRebookingCalendarLoading();
    $("#service-status-update-btn").attr("disabled", false);
  }
}

// API call for available times
async function loadAvailableTimes(selectedBookingDate, barberIDs) {
  try {
    if (!selectedBookingDate) {
      return [];
    }

    const response = await fetch(dShaverApiSettings.availableTimesApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": dShaverApiSettings.nonce,
      },
      body: JSON.stringify({
        selectedBookingDate: selectedBookingDate,
        barberIDs: barberIDs,
      }),
    });

    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      showToast("Error fetching available times", "danger");
      return [];
    }
  } catch (error) {
    showToast("Error fetching available times", "danger");
    return [];
  }
}

// spinner while waiting for available dates
function showRebookingCalendarLoading() {
  const rebookingButton = document.getElementById("service-reschedule-btn");
  const rebookingDateSpinner = document.getElementById("rescheduleDateSpinner");
  const reschedCalendarContainer = document.getElementById("resched-calendar");

  rebookingButton.classList.add("d-none");
  rebookingDateSpinner.classList.remove("d-none");
  reschedCalendarContainer.classList.add("d-none");
}

function hideRebookingCalendarLoading() {
  const rebookingButton = document.getElementById("service-reschedule-btn");
  const rebookingDateSpinner = document.getElementById("rescheduleDateSpinner");
  const reschedCalendarContainer = document.getElementById("resched-calendar");

  rebookingButton.classList.remove("d-none");
  rebookingDateSpinner.classList.add("d-none");
  reschedCalendarContainer.classList.remove("d-none");
}

function showBookingTimeSpinner(spinnerId, timeContainerId) {
  const bookingTimeSpinner = document.getElementById(spinnerId);
  const timeContainer = document.getElementById(timeContainerId);

  bookingTimeSpinner.classList.remove("d-none");
  timeContainer.classList.add("d-none");
}

function hideBookingTimeSpinner(spinnerId, timeContainerId) {
  const bookingTimeSpinner = document.getElementById(spinnerId);
  const timeContainer = document.getElementById(timeContainerId);

  bookingTimeSpinner.classList.add("d-none");
  timeContainer.classList.remove("d-none");
}

function initializeCalendarModalDefaultContent() {
  const calendarModalContent1 = document.getElementById(
    "calendar-modal-content-1"
  );
  const calendarModalContent2 = document.getElementById(
    "calendar-modal-content-2"
  );

  const calendarModalContent3 = document.getElementById(
    "calendar-modal-content-3"
  );

  calendarModalContent1.classList.remove("d-none");
  calendarModalContent2.classList.add("d-none");
  calendarModalContent3.classList.add("d-none");
}

function handleShowCompletedFormFields(serviceStatusSelect, event) {
  const completedFields = document.getElementById("completed-form-fields");

  if (serviceStatusSelect.value.toLowerCase() === "completed") {
    // Last haircut/service
    const lastHaircutService = getServiceByPriority(
      event.extendedProps.services
    );

    const { service_id, service_name, service_type } = lastHaircutService;

    const clientIdElInput = document.getElementById("client-id");
    const clientNameElInput = document.getElementById("client-name");
    const serviceIdElInput = document.getElementById("service-id");
    const serviceTypeElInput = document.getElementById("service-type");
    const lastHaircutElInput = document.getElementById("last-haircut");
    const customerNotes = document.getElementById("customer-notes");

    clientIdElInput.value = event.extendedProps.client_id;
    clientNameElInput.value = event.title;
    serviceIdElInput.value = service_id;
    serviceTypeElInput.value = service_type;
    lastHaircutElInput.value = service_name;
    customerNotes.value = event.extendedProps.notes;

    completedFields.classList.remove("d-none");
  } else {
    completedFields.classList.add("d-none");
  }
}

/** update Time Button States function - resched **/
function updateTimeButtonStates(listItemTimeId, timeStateVariable) {
  $(`.${listItemTimeId}`).each(function () {
    var serviceTime = $(this).data("booking-time");
    if (serviceTime === timeStateVariable) {
      $(this).addClass("services-list-group-item-checked");
    } else {
      $(this).removeClass("services-list-group-item-checked");
    }
  });
}

/** Reset Booking Status Variables **/
function resetBookingStatusVariables() {
  referenceNumber = null;
  selectedStatus = null;
  clientId = null;
  serviceId = null;
  haircutImages = null;
}

/** Reset Booking Date and Time Variables **/
function resetRebookingDateAndTimeVariables() {
  bookingRefNumber = null;
  reschedDate = null;
  reschedTime = null;
}

function resetWalkInDateAndTimeVariables() {
  clientSelectionType = "existing";
  selectedServices = [];
  totalPrice = 0;
  selectedBookingDate = null;
  selectedBookingTime = null;
  walkInClientId = null;
  fullName = null;
  contactNumber = null;
  emailAddress = null;
  dateOfBirth = null;
  currentStep = 1;
}

function resetWalkInModalSteps() {
  const steps = $(".step");
}

/** API Call - Submit Walk-in Booking **/
async function submitWalkInBooking(data) {
  try {
    showBookingReschedOrWalkinSpinner("booking-submission-spinner", "book-btn");
    const response = await fetch(dShaverApiSettings.createWalkInBookingApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": dShaverApiSettings.nonce,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      resetWalkInDateAndTimeVariables();
      hideBookingReschedOrWalkinSpinner(
        "booking-submission-spinner",
        "book-btn"
      );
      $("#walk-in-modal").modal("hide");
    } else {
      showToast(result.message, "danger");
      hideBookingReschedOrWalkinSpinner(
        "booking-submission-spinner",
        "book-btn"
      );

      // clear time slots container
      const listItemTimeWalkInContainer = $(
        "#list-group-time-walk-in-container"
      );
      listItemTimeWalkInContainer.empty();

      // Reset selected booking date and time
      selectedBookingDate = null;
      selectedBookingTime = null;

      // show booking step
      currentStep = 2;
      showWalkInStep(2);

      // Reload walk-in calendar
      await loadWalkInCalendar();
    }
  } catch (error) {
    showToast("Error submiting walk-in booking", "danger");
    resetWalkInDateAndTimeVariables();
    hideBookingReschedOrWalkinSpinner("booking-submission-spinner", "book-btn");
    $("#walk-in-modal").modal("hide");
  } finally {
    await loadFullCalendar();
  }
}

/** API Call - Update Booking Date & Time **/
async function rescheduleBooking() {
  try {
    showBookingReschedOrWalkinSpinner(
      "saveReschedBookingSpinner",
      "saveReschedBookingBtn"
    );

    if (!bookingRefNumber || !reschedDate || !reschedTime) {
      showToast("Please complete all the required fields", "danger");
      return;
    }

    const reschedulePayload = {
      bookingRefNumber,
      reschedDate,
      reschedTime,
    };

    const response = await fetch(dShaverApiSettings.reScheduleApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": dShaverApiSettings.nonce,
      },
      body: JSON.stringify(reschedulePayload),
    });

    const result = await response.json();

    if (result.success) {
      resetRebookingDateAndTimeVariables();
      hideBookingReschedOrWalkinSpinner(
        "saveReschedBookingSpinner",
        "saveReschedBookingBtn"
      );
      hideEventDetailsModal();
    } else {
      showToast(result.message, "danger");
      hideBookingReschedOrWalkinSpinner(
        "saveReschedBookingSpinner",
        "saveReschedBookingBtn"
      );

      // clear time slots container
      const listItemTimeReschedContainer = $(
        "#list-group-time-resched-container"
      );
      listItemTimeReschedContainer.empty();

      // reset rebooking date and time
      bookingRefNumber = null;
      reschedDate = null;
      reschedTime = null;
      hideEventDetailsModal();
    }
  } catch (error) {
    showToast("Error submitting rescheduling of booking", "danger");
    resetRebookingDateAndTimeVariables();
    hideBookingReschedOrWalkinSpinner(
      "saveReschedBookingSpinner",
      "saveReschedBookingBtn"
    );
    hideEventDetailsModal();
  } finally {
    await loadFullCalendar();
  }
}

function showBookingReschedOrWalkinSpinner(spinnerId, buttonId) {
  const spinner = document.getElementById(spinnerId);
  const button = document.getElementById(buttonId);

  if (spinner) {
    spinner.classList.remove("d-none");
  }
  if (button) {
    button.classList.add("d-none");
  }
}

function hideBookingReschedOrWalkinSpinner(spinnerId, buttonId) {
  const spinner = document.getElementById(spinnerId);
  const button = document.getElementById(buttonId);

  if (spinner) {
    spinner.classList.add("d-none");
  }
  if (button) {
    button.classList.remove("d-none");
  }
}

function hideEventDetailsModal() {
  // Close the update modal
  var eventDetailsModal = bootstrap.Modal.getInstance(
    document.getElementById("event-details-modal")
  );
  eventDetailsModal.hide();
}

function showEventDetailsModal() {
  var eventDetailsModal = new bootstrap.Modal(
    document.getElementById("event-details-modal")
  );

  eventDetailsModal.show();
}

function addOrReplaceService(
  serviceId,
  serviceType,
  serviceName,
  serviceDuration,
  serviceForWhom,
  servicePrice
) {
  // Check if a service of the same type already exists
  var existingIndex = -1;
  for (var i = 0; i < selectedServices.length; i++) {
    if (selectedServices[i].serviceType === serviceType) {
      existingIndex = i;
      break;
    }
  }

  // If it exists, replace it
  if (existingIndex > -1 && serviceType.toLowerCase() !== "additional") {
    selectedServices[existingIndex] = {
      serviceId: serviceId,
      serviceType: serviceType,
      serviceName: serviceName,
      serviceDuration: serviceDuration,
      serviceForWhom: serviceForWhom,
      servicePrice: servicePrice,
    };
  } else {
    // If it doesn't exist, add the new service
    selectedServices.push({
      serviceId: serviceId,
      serviceType: serviceType,
      serviceName: serviceName,
      serviceDuration: serviceDuration,
      serviceForWhom: serviceForWhom,
      servicePrice: servicePrice,
    });
  }
}

function toggleNextButtonState(buttonId) {
  if (selectedServices.length === 0) {
    $(`#${buttonId}`).prop("disabled", true);
  } else {
    $(`#${buttonId}`).prop("disabled", false);
  }
}
/** update Service Button States function **/
function updateServicesSelectedStyling(dataContainerIdentifier) {
  // Get the IDs of currently selected services
  var selectedServiceNames = [];
  for (var i = 0; i < selectedServices.length; i++) {
    selectedServiceNames.push(selectedServices[i].serviceName);
  }

  $(dataContainerIdentifier).each(function () {
    var serviceName = $(this).data("service-name");

    if (selectedServiceNames.includes(serviceName)) {
      $(this)
        .find(".services-list-group-btn")
        .addClass("services-list-group-btn-checked");
      $(this)
        .find(".services-list-group-btn i")
        .removeClass("fa-solid fa-plus")
        .addClass("fa-solid fa-check");

      $(this).addClass("services-list-group-item-checked");
    } else {
      $(this)
        .find(".services-list-group-btn")
        .removeClass("services-list-group-btn-checked");
      $(this)
        .find(".services-list-group-btn i")
        .removeClass("fa-solid fa-check")
        .addClass("fa-solid fa-plus");

      $(this).removeClass("services-list-group-item-checked");
    }
  });
}

/** remove service **/
function removeService(
  serviceId,
  serviceType,
  serviceName,
  serviceDuration,
  serviceForWhom,
  servicePrice
) {
  selectedServices = selectedServices.filter(function (service) {
    return !(
      service.serviceId === serviceId &&
      service.serviceType === serviceType &&
      service.serviceName === serviceName &&
      service.serviceDuration === serviceDuration &&
      service.serviceForWhom === serviceForWhom &&
      service.servicePrice === servicePrice
    );
  });
}

/** show walkin steps **/
function showWalkInStep(step) {
  const allSteps = $(".step");

  // Hide all steps
  allSteps.each(function () {
    $(this).addClass("d-none");
  });

  // Show the specific step
  $(`.step[data-step="${step}"]`).removeClass("d-none");
}

// switch selection for clients
function getSwitchValue() {
  return $("#switchAddClient").is(":checked"); // Returns true if checked, false if unchecked
}

/** Render Summary */
function renderSummaryListContent(clientSelectionType, data) {
  $("#collapse-booking-items").empty();

  const { selectedServices, selectedBookingDate, selectedBookingTime } = data;

  let listItemsListHTML = ""; // Initialize an empty string

  // Loop through each selected service and build the HTML
  selectedServices.forEach(function (service) {
    const serviceHTML = `
          <div class="d-flex justify-content-between gap-2 gap-sm-3 gap-md-4">
            <div>
            <p class="fw-light">${service.serviceName}</p>
            <p class="fw-light"><span>${service.serviceDuration} mins</span><span> • </span><span>${service.serviceForWhom}</span></p>
            </div>
            <p class="fw-light">$<span>${service.servicePrice}</span></p>
          </div>
        `;
    listItemsListHTML += serviceHTML; // Add each service HTML to the string
  });

  const totalPriceCalculated = selectedServices.reduce(function (sum, service) {
    return sum + service.servicePrice;
  }, 0);

  totalPrice = totalPriceCalculated;

  const totalMinutesCalculated = selectedServices.reduce(function (
    sum,
    service
  ) {
    return sum + service.serviceDuration;
  },
  0);

  if (clientSelectionType === "new") {
    const { fullName, contactNumber, emailAddress, dateOfBirth } = data;

    $("#collapse-booking-items").append(
      `
      <div class="accordion-body">
          <p class="mb-3 fw-medium">Full Name: <span id="summary-full-name" class="fw-normal">${fullName}</span></p>
          <p class="mb-3 fw-medium">Email Address: <span id="summary-email-address" class="fw-normal">${emailAddress}</span></p>
          <p class="mb-3 fw-medium">Contact Number: <span id="summary-contact-number" class="fw-normal"></span>${
            contactNumber || ""
          }</p>
          <p class="mb-3 fw-medium">Date of Birth: <span id="summary-date-of-birth" class="fw-normal">${
            dateOfBirth || ""
          }</span></p>

          <hr class="bg-black border-2 border-top border-black mb-3" />

          <div class="d-flex flex-column gap-3">
              <div class="d-flex gap-2 align-items-center">
                  <i class="fa-regular fa-clock" id="costing-summary-booking-icon"></i>
                  <p id="costing-summary-booking-date">${selectedBookingDate}</p>
                  <p id="costing-summary-booking-time">${selectedBookingTime}</p>
              </div>

              <div class="d-flex flex-column gap-2" id="list-items-summary-container">
              ${listItemsListHTML}
              </div>

              <hr class="bg-black border-2 border-top border-black my-0" />

              <div class="d-flex flex-column gap-2">
                  <div class="d-flex justify-content-between">
                      <p class="fw-semibold">Total Duration</p>
                      <p class="fw-semibold" id="total-summary-duration-value">${
                        totalMinutesCalculated + " mins"
                      }</p>
                  </div>
                  <div class="d-flex justify-content-between">
                      <p class="fw-semibold">Total</p>
                      <p class="fw-semibold" id="total-summary-cost-value">${
                        "$" + totalPriceCalculated.toFixed(2)
                      }</p>
                  </div>
              </div>

              <div class="d-flex justify-content-center mt-3">
                  <button type="button" class="btn w-100 dark-btn" id="book-btn">
                      <i class="fa-solid fa-calendar-check me-2"></i>
                      <span>Book Appointment</span>
                  </button>

                  <div class="spinner-border d-none" role="status" id="booking-submission-spinner">
                      <span class="sr-only">Loading...</span>
                  </div>
              </div>
          </div>
      </div>
      `
    );
  } else {
    const { fullName } = data;

    $("#collapse-booking-items").append(
      `
      <div class="accordion-body">
          <p class="mb-3 fw-medium">Full Name: <span id="summary-full-name" class="fw-normal">${fullName}</span></p>

          <hr class="bg-black border-2 border-top border-black mb-3" />

          <div class="d-flex flex-column gap-3">
              <div class="d-flex gap-2 align-items-center">
                  <i class="fa-regular fa-clock" id="costing-summary-booking-icon"></i>
                  <p id="costing-summary-booking-date">${selectedBookingDate}</p>
                  <p id="costing-summary-booking-time">${selectedBookingTime}</p>
              </div>

              <div class="d-flex flex-column gap-2" id="list-items-summary-container">
              ${listItemsListHTML}
              </div>

              <hr class="bg-black border-2 border-top border-black my-0" />

              <div class="d-flex flex-column gap-2">
                  <div class="d-flex justify-content-between">
                      <p class="fw-semibold">Total Duration</p>
                      <p class="fw-semibold" id="total-summary-duration-value">${
                        totalMinutesCalculated + " mins"
                      }</p>
                  </div>
                  <div class="d-flex justify-content-between">
                      <p class="fw-semibold">Total</p>
                      <p class="fw-semibold" id="total-summary-cost-value">${
                        "$" + totalPriceCalculated.toFixed(2)
                      }</p>
                  </div>
              </div>

              <div class="d-flex justify-content-center mt-3">
                  <button type="button" class="btn w-100 dark-btn" id="book-btn">
                      <i class="fa-solid fa-calendar-check me-2"></i>
                      <span>Book Appointment</span>
                  </button>

                  <div class="spinner-border d-none" role="status" id="booking-submission-spinner">
                      <span class="sr-only">Loading...</span>
                  </div>
              </div>
          </div>
      </div>
      `
    );
  }
}

/** Render Single Booking Modal */
function renderBookingModal(bookingType, bookingData) {
  const calendarBookingModalContainer = $("#calendar-modal-content-1");
  calendarBookingModalContainer.empty();

  console.log("bookingData", bookingData);

  if (bookingType.toLowerCase() === "single") {
    const retrievedBookingServiceStatus = bookingData.booking_service_status;
    let styledBookingServiceStatus = "";
    // Style booking service status
    if (retrievedBookingServiceStatus.toLowerCase() === "pending") {
      styledBookingServiceStatus = `<h5 class="m-0"><span class="badge bg-warning text-dark text-uppercase" data-service-status="${retrievedBookingServiceStatus}">${retrievedBookingServiceStatus}</span></h5>`;
    } else if (retrievedBookingServiceStatus.toLowerCase() === "completed") {
      styledBookingServiceStatus = `<h5 class="m-0"><span class="badge bg-success text-uppercase" data-service-status="${retrievedBookingServiceStatus}">${retrievedBookingServiceStatus}</span></h5>`;
    } else if (retrievedBookingServiceStatus.toLowerCase() === "no show") {
      styledBookingServiceStatus = `<h5 class="m-0"><span class="badge text-uppercase" style="background-color: #ff5722 !important" data-service-status="${retrievedBookingServiceStatus}">${retrievedBookingServiceStatus}</span></h5>`;
    } else if (retrievedBookingServiceStatus.toLowerCase() === "cancelled") {
      styledBookingServiceStatus = `<h5 class="m-0"><span class="badge bg-danger text-uppercase" data-service-status="${retrievedBookingServiceStatus}">${retrievedBookingServiceStatus}</span></h5>`;
    }
    const customer = bookingData.title;
    const services = bookingData.services
      .map((service) => {
        return `<li class="list-group-item" data-service-id="${service.service_id}">${service.service_name}</li>`;
      })
      .join("");
    const appointmentDate = moment(bookingData.appointment_date).format(
      "MMM DD YYYY"
    );
    const appointmentTime = moment(
      bookingData.appointment_time,
      "HH:mm:ss"
    ).format("h:mm A");
    const notes = bookingData.notes;
    const referenceNumber = bookingData.reference_number;
    const barberName = bookingData.barber_name;
    const bookingType = bookingData.booking_type;
    calendarBookingModalContainer.append(
      `
      <h3 class="fw-bold mb-3 text-center" id="modal-event-customer">${customer}</h3>
      <div class="row row-cols-1 gap-3 gap-md-4">
          <div class="col">
              <div class="w-auto d-flex align-items-center mb-2">
                  <i class="fa-solid fa-bookmark me-2"></i>
                  <p class="fw-semibold">Service/Services: </p>
              </div>
              <div>
                  <ol class="list-group list-group-numbered gap-2" id="modal-event-services">
                  ${services}
                  </ol>
              </div>
          </div>
          <div class="col">
              <div class="d-flex flex-column gap-3 gap-md-4 border py-3 px-2 rounded">
                  <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                      <div class="d-flex align-items-center">
                          <i class="fa-solid fa-calendar me-2"></i>
                          <p class="fw-semibold">Appointment Date: </p>
                      </div>
                      <div>
                          <p id="modal-event-appointment-date">${appointmentDate}</p>
                      </div>
                  </div>
                  <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                      <div class="d-flex align-items-center">
                          <i class="fa-solid fa-business-time me-2"></i>
                          <p class="fw-semibold">Appointment Time: </p>
                      </div>
                      <div>
                          <p id="modal-event-appointment-time">${appointmentTime}</p>
                      </div>
                  </div>
                  <button type="button" class="btn dark-btn" id="service-reschedule-btn">Reschedule</button>
                  <div class="spinner-border mx-auto d-none" role="status" id="rescheduleDateSpinner">
                      <span class="visually-hidden">Loading...</span>
                  </div>
                  </button>
              </div>
          </div>
          <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
              <div class="d-flex align-items-center">
                  <i class="fa-solid fa-square-poll-vertical me-2"></i>
                  <p class="fw-semibold">Service Status: </p>
              </div>
              <div class=" d-flex gap-3 align-items-center justify-content-start" id="modal-event-service-status-container">
                  ${styledBookingServiceStatus}
                  <button type="button" class="btn dark-btn" id="service-status-update-btn">Update</button>
              </div>
          </div>
          <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
              <div class="d-flex align-items-center">
                  <i class="fa-solid fa-note-sticky me-2"></i>
                  <p class="fw-semibold">Notes: </p>
              </div>
              <div class=" d-flex gap-3 align-items-center justify-content-start" id="modal-event-service-notes-container">
                  <p class="text-break">${notes}</p>
              </div>
          </div>
          <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
              <div class="flex-grow-1 flex-shrink-0 d-flex align-items-center">
                  <i class="fa-regular fa-id-badge me-2"></i>
                  <p class="fw-semibold">Ref No: </p>
              </div>
              <div class="flex-shrink-1">
                  <p class="text-break w-auto" id="modal-event-reference-number">
                  ${referenceNumber}
                  </p>
              </div>
          </div>
          <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
              <div class="flex-grow-1 flex-shrink-0 d-flex align-items-center">
                  <i class="fa-solid fa-user me-2"></i>
                  <p class="fw-semibold">Barber: </p>
              </div>
              <div class="flex-shrink-1">
                  <p class="text-break w-auto" id="modal-event-barber-name">
                  ${barberName}
                  </p>
              </div>
          </div>
          <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
              <div class="flex-grow-1 flex-shrink-0 d-flex align-items-center">
                  <i class="fa-solid fa-calendar-check me-2"></i>
                  <p class="fw-semibold">Booking Type: </p>
              </div>
              <div class="flex-shrink-1">
                  <p class="text-break w-auto" id="modal-event-booking-type">
                  ${bookingType}
                  </p>
              </div>
          </div>
      </div>
      `
    );
  } else if (bookingType.toLowerCase() === "group") {
    bookingData.forEach((booking) => {
      const retrievedBookingServiceStatus = booking.booking_service_status;
      let styledBookingServiceStatus = "";
      // Style booking service status
      if (retrievedBookingServiceStatus.toLowerCase() === "pending") {
        styledBookingServiceStatus = `<h5 class="m-0"><span class="badge bg-warning text-dark text-uppercase" data-service-status="${retrievedBookingServiceStatus}">${retrievedBookingServiceStatus}</span></h5>`;
      } else if (retrievedBookingServiceStatus.toLowerCase() === "completed") {
        styledBookingServiceStatus = `<h5 class="m-0"><span class="badge bg-success text-uppercase" data-service-status="${retrievedBookingServiceStatus}">${retrievedBookingServiceStatus}</span></h5>`;
      } else if (retrievedBookingServiceStatus.toLowerCase() === "no show") {
        styledBookingServiceStatus = `<h5 class="m-0"><span class="badge text-uppercase" style="background-color: #ff5722 !important" data-service-status="${retrievedBookingServiceStatus}">${retrievedBookingServiceStatus}</span></h5>`;
      } else if (retrievedBookingServiceStatus.toLowerCase() === "cancelled") {
        styledBookingServiceStatus = `<h5 class="m-0"><span class="badge bg-danger text-uppercase" data-service-status="${retrievedBookingServiceStatus}">${retrievedBookingServiceStatus}</span></h5>`;
      }
      const customer = booking.title;
      const services = booking.services
        .map((service) => {
          return `<li class="list-group-item" data-service-id="${service.service_id}">${service.service_name}</li>`;
        })
        .join("");
      const appointmentDate = moment(booking.appointment_date).format(
        "MMM DD YYYY"
      );
      const appointmentTime = moment(
        booking.appointment_time,
        "HH:mm:ss"
      ).format("h:mm A");
      const notes = booking.notes;
      const referenceNumber = booking.reference_number;
      const barberName = booking.barber_name;
      const bookingType = booking.booking_type;

      calendarBookingModalContainer.append(
        `
        <h3 class="fw-bold mb-3 text-center" id="modal-event-customer">${customer}</h3>
        <div class="row row-cols-1 gap-3 gap-md-4">
            <div class="col">
                <div class="w-auto d-flex align-items-center mb-2">
                    <i class="fa-solid fa-bookmark me-2"></i>
                    <p class="fw-semibold">Service/Services: </p>
                </div>
                <div>
                    <ol class="list-group list-group-numbered gap-2" id="modal-event-services">
                    ${services}
                    </ol>
                </div>
            </div>
            <div class="col">
                <div class="d-flex flex-column gap-3 gap-md-4 border py-3 px-2 rounded">
                    <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                        <div class="d-flex align-items-center">
                            <i class="fa-solid fa-calendar me-2"></i>
                            <p class="fw-semibold">Appointment Date: </p>
                        </div>
                        <div>
                            <p id="modal-event-appointment-date">${appointmentDate}</p>
                        </div>
                    </div>
                    <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                        <div class="d-flex align-items-center">
                            <i class="fa-solid fa-business-time me-2"></i>
                            <p class="fw-semibold">Appointment Time: </p>
                        </div>
                        <div>
                            <p id="modal-event-appointment-time">${appointmentTime}</p>
                        </div>
                    </div>
                    <button type="button" class="btn dark-btn" id="service-reschedule-btn">Reschedule</button>
                    <div class="spinner-border mx-auto d-none" role="status" id="rescheduleDateSpinner">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    </button>
                </div>
            </div>
            <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-square-poll-vertical me-2"></i>
                    <p class="fw-semibold">Service Status: </p>
                </div>
                <div class=" d-flex gap-3 align-items-center justify-content-start" id="modal-event-service-status-container">
                    ${styledBookingServiceStatus}
                    <button type="button" class="btn dark-btn" id="service-status-update-btn">Update</button>
                </div>
            </div>
            <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-note-sticky me-2"></i>
                    <p class="fw-semibold">Notes: </p>
                </div>
                <div class=" d-flex gap-3 align-items-center justify-content-start" id="modal-event-service-notes-container">
                    <p class="text-break">${notes}</p>
                </div>
            </div>
            <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                <div class="flex-grow-1 flex-shrink-0 d-flex align-items-center">
                    <i class="fa-regular fa-id-badge me-2"></i>
                    <p class="fw-semibold">Ref No: </p>
                </div>
                <div class="flex-shrink-1">
                    <p class="text-break w-auto" id="modal-event-reference-number">
                    ${referenceNumber}
                    </p>
                </div>
            </div>
            <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                <div class="flex-grow-1 flex-shrink-0 d-flex align-items-center">
                    <i class="fa-solid fa-user me-2"></i>
                    <p class="fw-semibold">Barber: </p>
                </div>
                <div class="flex-shrink-1">
                    <p class="text-break w-auto" id="modal-event-barber-name">
                    ${barberName}
                    </p>
                </div>
            </div>
            <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                <div class="flex-grow-1 flex-shrink-0 d-flex align-items-center">
                    <i class="fa-solid fa-calendar-check me-2"></i>
                    <p class="fw-semibold">Booking Type: </p>
                </div>
                <div class="flex-shrink-1">
                    <p class="text-break w-auto" id="modal-event-booking-type">
                    ${bookingType}
                    </p>
                </div>
            </div>
        </div>
        `
      );
    });
  }
}
/** END - FUNCTIONS **/
