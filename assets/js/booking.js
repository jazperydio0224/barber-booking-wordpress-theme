(function (dShaverApiSettings) {
  /**
   * booking.js is used for booking related behaviors
   */

  /* VARIABLES */
  // Selected Barber - SINGLE
  let selectedBarber = null;

  // Booking submission values - SINGLE
  let selectedServices = [];
  let totalPrice = 0;
  let selectedBookingDate = null;
  let selectedBookingTime = null;
  let fullName = null;
  let contactNumber = null;
  let emailAddress = null;
  let dateOfBirth = null;

  // Booking step - SINGLE
  let currentStep = 0;
  const bookingStepContainers = [
    "#booking-step-1",
    "#booking-step-2",
    "#booking-step-3",
  ];

  // International Phone Input
  let itiInstance = null;

  // Final Booking Step Modal
  let preventBookingModalClose = false;
  /* VARIABLES */

  $(document).ready(async function () {
    /* START - INTERNATIONAL TELEPHONE INPUT */
    // Wait until the modal is shown before initializing intl-tel-input
    $("#bookingInfoModal").on("shown.bs.modal", function () {
      let input = document.querySelector("#contact-number");
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
    $("#bookingInfoModal").on("hidden.bs.modal", function () {
      if (itiInstance) {
        itiInstance.destroy(); // Destroy the intlTelInput instance
        itiInstance = null;
      }
    });
    /* END - INTERNATIONAL TELEPHONE INPUT */

    /* START - CONDITIONAL RENDERING OF BOOKING TYPE COSTING (SINGLE/GROUP) */
    $("#booking-type-tab").on(
      "shown.bs.tab",
      'button[data-bs-toggle="tab"]',
      function (e) {
        const bookingType = $(e.target).data("booking-type");

        const costingContainer = $("#costing-container");
        const costingContainerMobile = $("#costing-container-mobile");
        const scheduleContainer = $("#schedule-container");

        if (bookingType.toLowerCase() !== "single") {
          scheduleContainer.addClass("hidden");
          costingContainer.addClass("hidden");
          costingContainerMobile.addClass("hidden");
        } else {
          updateSchedOrCostingContainerVisibility();
        }
      }
    );
    /* END - CONDITIONAL RENDERING OF BOOKING TYPE COSTING (SINGLE/GROUP) */

    /* START - LIST ITEMS CLICK EVENT */
    // Click listener for services list
    $(".list-item-service").on("click", function (event) {
      const $item = $(this);

      if ($item.closest(".additional-service-container").length > 0) {
        return; // Stop the function if it is inside .additional-service-container
      }

      // Retrieve service details from data attributes
      const serviceId = $item.data("service-id");
      const serviceName = $item.data("service-name");
      const duration = $item.data("duration");
      const forWhom = $item.data("for-whom");
      const description = $item.data("description");
      const price = parseFloat($item.data("price"));
      const serviceType = $item.data("service-type"); // Get the service type

      // Populate modal with service details
      $("#modal-service-name").text(serviceName);
      $("#modal-service-duration").text(`${duration} mins`);
      $("#modal-service-for-whom").text(forWhom);
      $("#modal-service-description").text(description);
      $("#modal-service-price").text(`$${price}`);

      // Determine whether to show Add or Remove button
      const serviceIndex = selectedServices.findIndex(
        (service) =>
          service.serviceName === serviceName &&
          service.serviceType === serviceType
      );

      if (serviceIndex === -1) {
        // If not selected, show Add button
        $("#modal-add-to-booking-btn").text("Add to booking");
      } else {
        // If already selected, show Remove button
        $("#modal-add-to-booking-btn").text("Remove from booking");
      }

      // Show the modal
      $("#servicesModal").modal("show");

      // Handle button action (Add/Remove)
      $("#modal-add-to-booking-btn")
        .off("click")
        .on("click", function () {
          if (serviceIndex === -1) {
            addOrReplaceService(
              serviceId,
              serviceType,
              serviceName,
              duration,
              forWhom,
              price
            );

            toggleCostingContinueButtonState();
            updateServicesSelectedStyling(".list-item-service");
            toggleModalAdditionalButtonState();
          } else {
            removeService(
              serviceId,
              serviceType,
              serviceName,
              duration,
              forWhom,
              price
            );

            toggleCostingContinueButtonState();
            updateServicesSelectedStyling(".list-item-service");
            toggleModalAdditionalButtonState();
          }
          $("#servicesModal").modal("hide");
        });
    });
    /* END - LIST ITEMS CLICK EVENT */

    /* START - LIST ITEMS BUTTON CLICK EVENT */
    $(".services-list-group-btn").on("click", function (event) {
      event.stopPropagation();

      const $service = $(this).parent().parent();

      // Retrieve service details from data attributes
      const serviceId = $service.data("service-id");
      const serviceName = $service.data("service-name");
      const duration = $service.data("duration");
      const forWhom = $service.data("for-whom");
      const price = parseFloat($service.data("price"));
      const serviceType = $service.data("service-type"); // Get the service type

      // Determine whether to show Add or Remove button
      const serviceIndex = selectedServices.findIndex(
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

        toggleCostingContinueButtonState();
        updateServicesSelectedStyling(".list-item-service");
        toggleModalAdditionalButtonState();
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

        toggleCostingContinueButtonState();
        updateServicesSelectedStyling(".list-item-service");
        toggleModalAdditionalButtonState();
      }
    });
    /* END - LIST ITEMS BUTTON CLICK EVENT */

    /** START - BOOKING STEPS **/
    // Next button click
    $("#costing-nav-btn").on("click", function () {
      if (!canProceedToNextStep()) {
        if (currentStep === 0) {
          showToast(`<p>Please select a service.</p>`, "danger");
        } else if (currentStep === 1) {
          showToast(`<p>Please select a barber.</p>`, "danger");
        } else if (currentStep === 2) {
          showToast(`<p>Please select a date and time.</p>`, "danger");
        }

        return; // Stop the function execution
      }

      if (currentStep === bookingStepContainers.length - 1) {
        const additionalServices = $("#addon-tab-pane")
          .find(".list-group .list-item-service")
          .filter(function () {
            return $(this).data("serviceType").toLowerCase() === "additional"; // Use camelCase for `data-service-type`
          });

        const additionalServicesCount = additionalServices.length;

        const selectedAdditionalServices = selectedServices.filter(
          (selectedService) => {
            return selectedService.serviceType.toLowerCase() === "additional"; // Use camelCase for `serviceType`
          }
        );

        if (
          !selectedAdditionalServices ||
          selectedAdditionalServices.length === 0 ||
          selectedAdditionalServices.length < additionalServicesCount
        ) {
          $(".final-step-0").removeClass("d-none");
          $(".final-step-1").addClass("d-none");
          $(".final-step-2").addClass("d-none");
        } else {
          $(".final-step-0").addClass("d-none");
          $(".final-step-1").removeClass("d-none");
          $(".final-step-2").addClass("d-none");
        }

        $("#bookingInfoModal").modal("show");
      } else {
        currentStep++;
        handleShowBookingStepContainers(currentStep);
        if (bookingStepContainers[currentStep] === "#booking-step-3") {
          $("#booking-step-3").resize();
        }
      }
    });

    $("#costing-nav-btn-mobile").on("click", function () {
      if (!canProceedToNextStep()) {
        if (currentStep === 0) {
          showToast(`<p>Please select a service.</p>`, "danger");
        } else if (currentStep === 1) {
          showToast(`<p>Please select a barber.</p>`, "danger");
        } else if (currentStep === 2) {
          showToast(`<p>Please select a date and time.</p>`, "danger");
        }

        return; // Stop the function execution
      }

      if (currentStep === bookingStepContainers.length - 1) {
        const additionalServices = $("#addon-tab-pane")
          .find(".list-group .list-item-service")
          .filter(function () {
            return $(this).data("serviceType").toLowerCase() === "additional"; // Use camelCase for `data-service-type`
          });

        const additionalServicesCount = additionalServices.length;

        const selectedAdditionalServices = selectedServices.filter(
          (selectedService) => {
            return selectedService.serviceType.toLowerCase() === "additional"; // Use camelCase for `serviceType`
          }
        );

        if (
          !selectedAdditionalServices ||
          selectedAdditionalServices.length === 0 ||
          selectedAdditionalServices.length < additionalServicesCount
        ) {
          $(".final-step-0").removeClass("d-none");
          $(".final-step-1").addClass("d-none");
          $(".final-step-2").addClass("d-none");
        } else {
          $(".final-step-0").addClass("d-none");
          $(".final-step-1").removeClass("d-none");
          $(".final-step-2").addClass("d-none");
        }

        $("#bookingInfoModal").modal("show");
      } else {
        currentStep++;
        handleShowBookingStepContainers(currentStep);

        if (bookingStepContainers[currentStep] === "#booking-step-3") {
          $("#booking-step-3").resize();
        }
      }
    });

    // Previous button  click
    $("#booking-nav-prev").on("click", function () {
      if (currentStep > 0) {
        currentStep--;

        handleShowBookingStepContainers(currentStep);

        if (bookingStepContainers[currentStep] === "#booking-step-3") {
          $("#booking-step-3").resize();
        }
      }
    });

    $("#additional-not-today-btn").on("click", function () {
      $(".final-step-0").addClass("d-none");
      $(".final-step-1").removeClass("d-none");
      $(".final-step-2").addClass("d-none");
    });

    $("#additional-continue-btn").on("click", function () {
      $(".final-step-0").addClass("d-none");
      $(".final-step-1").removeClass("d-none");
      $(".final-step-2").addClass("d-none");
    });
    /** END - BOOKING STEPS **/

    /** START - BARBER SELECTION **/
    $(document).on("click", ".list-item-barber", function () {
      const itemBarber = $(this);
      const barberID = itemBarber.data("barber-id");
      const barberName = itemBarber.data("barber-name");

      selectedBarber = {
        barber_id: barberID,
        barber_name: barberName,
      };

      updateBookingBarberButtonStates();
      setCostingBookingBarber(barberName);
    });
    /** END - BARBER SELECTION */

    /** START - TIME BUTTONS **/
    $(document).on("click", ".list-item-time", function () {
      const itemTime = $(this);
      const bookingTime = itemTime.data("booking-time"); // Fixed from "data-booking-time"
      selectedBookingTime = bookingTime;
      updateBookingTimeButtonStates();
      setCostingBookingTime(selectedBookingTime);
      setCostingBookingTimeMobile(selectedBookingTime);
    });
    /** END - TIME BUTTONS */

    /** START - FORM VALIDATION **/
    const forms = document.querySelectorAll(".submit-form");

    // Loop over them and prevent submission
    Array.from(forms).forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
    /** END - FORM VALIDATION **/

    /** START - FORM SUBMISSION **/
    // Handle the modal's hide event
    $("#bookingInfoModal").on("hide.bs.modal", function (e) {
      if (preventBookingModalClose) {
        e.preventDefault(); // Prevent the modal from closing
      }
    });
    // Handle Form Submission
    const stepZeroFinalModal = $(".final-step-0");
    const stepOneFinalModal = $(".final-step-1");
    const stepTwoFinalModal = $(".final-step-2");
    $(document).on("submit", ".submit-form", function (event) {
      event.preventDefault(); // Prevent the default form submission behavior
      event.stopPropagation(); // Stop the event from propagating further

      const phoneInput = $("#contact-number");

      // Get values from the form inputs
      const formFullName = $(this).find("input[name='full-name']").val().trim();
      const formContactNumber = itiInstance.getNumber();
      const formEmailAddress = $(this)
        .find("input[name='email-address']")
        .val()
        .trim();
      const formDateOfBirth = $(this)
        .find("input[name='date-of-birth']")
        .val()
        .trim();

      // Check if the phone number is not empty
      if (formContactNumber) {
        // If phone number is provided, check if it's valid
        if (!itiInstance.isValidNumber()) {
          showToast("Please enter a valid phone number.", "danger");
          $(phoneInput).addClass("is-invalid");
          return; // Stop further execution
        }
      }

      // Proceed with valid inputs
      fullName = formFullName;
      contactNumber = formContactNumber.trim();
      emailAddress = formEmailAddress;
      dateOfBirth = formDateOfBirth; // Allow it to be empty

      stepZeroFinalModal.addClass("d-none");
      stepOneFinalModal.addClass("d-none");
      stepTwoFinalModal.removeClass("d-none");

      renderSummaryListContent();
    });

    // Additional
    $("#additional-go-back-btn").on("click", function () {
      $(".final-step-0").removeClass("d-none");
      $(".final-step-1").addClass("d-none");
      $(".final-step-2").addClass("d-none");
    });

    // Summary
    $("#final-go-back-btn").on("click", function () {
      const stepZeroFinalModal = $(".final-step-0");
      const stepOneFinalModal = $(".final-step-1");
      const stepTwoFinalModal = $(".final-step-2");

      stepZeroFinalModal.addClass("d-none");
      stepOneFinalModal.removeClass("d-none");
      stepTwoFinalModal.addClass("d-none");
    });

    // Final Submit
    $("#book-btn").on("click", function () {
      submitBooking();
    });

    /** END - FORM SUBMISSION **/

    /* -----------------------------------------------*/

    /* START - FUNCTIONS */
    /** update or replace service **/
    function addOrReplaceService(
      serviceId,
      serviceType,
      serviceName,
      serviceDuration,
      serviceForWhom,
      servicePrice
    ) {
      // Check if a service of the same type already exists
      let existingIndex = -1;
      for (let i = 0; i < selectedServices.length; i++) {
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
      updateSchedOrCostingContainerVisibility();
      updateBookingContainerMobilePadding(); // global function from main
    }

    /** update costing component visibility **/
    function updateSchedOrCostingContainerVisibility() {
      const costingContainer = $("#costing-container");
      const costingContainerMobile = $("#costing-container-mobile");
      const scheduleContainer = $("#schedule-container");

      if (selectedServices.length > 0) {
        scheduleContainer.addClass("hidden");
        costingContainer.removeClass("hidden");
        costingContainerMobile.removeClass("hidden");

        renderListServicesDesktop();
        renderListServicesMobile();
        if (currentStep > 1) {
          setCostingBookingBarber(selectedBarber.barber_name);
        }
      } else {
        scheduleContainer.removeClass("hidden");
        costingContainer.addClass("hidden");
        costingContainerMobile.addClass("hidden");
      }
    }

    /** render selected services on the costing component **/
    function renderListServicesDesktop() {
      const container = $("#list-items-container");
      container.empty();

      selectedServices.forEach(function (service) {
        const serviceHTML = `
        <div class="d-flex justify-content-between gap-2 gap-sm-3 gap-md-4">
          <div>
          <p class="fw-light d-shaver-paragraph">${service.serviceName}</p>
          <p class="fw-light d-shaver-paragraph"><span>${service.serviceDuration} mins</span><span> • </span><span>${service.serviceForWhom}</span> <span class="d-none selected-barber-name"></span></p>
          </div>
          <p class="fw-light d-shaver-paragraph">$<span>${service.servicePrice}</span></p>
        </div>
      `;

        container.append(serviceHTML);
        setTotalPriceOnCostingContainerDesktop();
      });
    }

    function setTotalPriceOnCostingContainerDesktop() {
      const totalPriceCalculated = selectedServices.reduce(function (
        sum,
        service
      ) {
        return sum + service.servicePrice;
      },
      0);

      totalPrice = totalPriceCalculated;

      $("#total-cost-value").text("$" + totalPriceCalculated.toFixed(2));
      $("#total-cost-value").attr("data-total", totalPriceCalculated);
    }

    function renderListServicesMobile() {
      const container = $("#list-items-container-mobile");
      container.empty();

      const numberOfservices = selectedServices.length;
      const totalDurationOfServices = selectedServices.reduce(
        (sum, service) => sum + parseInt(service.serviceDuration),
        0
      );

      const serviceHTML = `
        <div class="d-flex gap-2">
            <p class="fw-bold">${numberOfservices} ${
        numberOfservices > 1 ? "Services" : "Service"
      }</p>
            <p>•</p>
            <p>${totalDurationOfServices} mins</p>
        </div>
    `;

      container.append(serviceHTML);
      setTotalPriceOnCostingContainerMobile();
    }

    function setTotalPriceOnCostingContainerMobile() {
      const totalPriceCalculated = selectedServices.reduce(function (
        sum,
        service
      ) {
        return sum + service.servicePrice;
      },
      0);

      totalPrice = totalPriceCalculated;

      $("#total-cost-value-mobile").text("$" + totalPriceCalculated.toFixed(2));
      $("#total-cost-value-mobile").attr("data-total", totalPriceCalculated);
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
      updateSchedOrCostingContainerVisibility();
      updateBookingContainerMobilePadding(); // global function from main
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

    /** Show BOOKING steps containers dynamically **/
    async function handleShowBookingStepContainers(step) {
      // Hide all booking containers
      bookingStepContainers.forEach(function (container) {
        $(container).addClass("hidden");
      });

      // Manage the visibility of the 'Next' and 'Previous' buttons
      if (step === 0) {
        $("#booking-nav-prev").addClass("hidden");
      } else {
        $("#booking-nav-prev").removeClass("hidden");
      }

      if (step === 2) {
        selectedBookingDate = null;
        selectedBookingTime = null;
        resetBookingTimeButtonStates();
        await loadBookingCalendar();
      }

      // Show the current booking container
      $(bookingStepContainers[step]).removeClass("hidden");
    }

    //   function rerenderFullCalendar() {
    //     fullCalendarGlobal.updateSize();
    //     if (selectedBookingDate) {
    //       fullCalendarGlobal.select(selectedBookingDate);
    //     }
    //   }

    /** Check if conditions are satisfied to move to the next step **/
    function canProceedToNextStep() {
      if (currentStep === 0 && selectedServices.length === 0) {
        return false;
      } else if (currentStep === 1 && selectedBarber === null) {
        return false;
      } else if (
        currentStep === 2 &&
        (selectedBookingDate === null || selectedBookingTime === null)
      ) {
        return false;
      }
      return true;
    }

    // API call for unavailable dates
    async function loadUnavailableDates() {
      try {
        if (
          !selectedBarber ||
          !selectedBarber?.barber_id ||
          !selectedBarber?.barber_name
        ) {
          throw new Error("Choose a barber first to load their schedule");
        }

        showSpinner(); // imported from main.js

        const apiUrl = `${
          dShaverApiSettings.unavailableDatesApi
        }?barber_id=${encodeURIComponent(selectedBarber?.barber_id)}`;

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
        hideSpinner(); // imported from main.js
      }
    }

    // API call for available times
    async function loadAvailableTimes(selectedBookingDate) {
      try {
        showSpinner(); // imported from main.js

        if (
          !selectedBookingDate ||
          !selectedBarber ||
          !selectedBarber?.barber_id ||
          !selectedBarber?.barber_name
        ) {
          return [];
        }

        console.log(selectedBarber);

        const response = await fetch(dShaverApiSettings.availableTimesApi, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": dShaverApiSettings.nonce,
          },
          body: JSON.stringify({
            selectedBookingDate: selectedBookingDate,
            barberIDs: [selectedBarber?.barber_id],
          }),
        });

        const result = await response.json();

        console.log(result);

        if (result.success) {
          return result.data;
        } else {
          showToast("Error fetching available times", "danger");
          return [];
        }
      } catch (error) {
        showToast("Error fetching available times", "danger");
        return [];
      } finally {
        hideSpinner(); // imported from main.js
      }
    }

    /* For rendering the booking calendar */
    async function loadBookingCalendar() {
      const unavailableDates = await loadUnavailableDates();

      var options = {
        actions: {
          async clickDay(event, self) {
            selectedBookingTime = null;
            resetCostingBookingTime();
            resetCostingBookingTimeMobile();

            selectedBookingDate = self.selectedDates[0];
            setCostingBookingDate(selectedBookingDate);
            setCostingBookingDateMobile(selectedBookingDate);
            const availableTimes = await loadAvailableTimes(
              selectedBookingDate
            );

            const listItemTimeContainer = $("#list-group-time-container");
            listItemTimeContainer.empty();

            if (availableTimes.length === 0) {
              var listItemTimeHTML = `
            <h5 class="mb-0 fw-medium d-shaver-time-choices-h5 text-center">No booking time slots available on this day.</h5>`;

              listItemTimeContainer.append(listItemTimeHTML);
            } else {
              availableTimes.forEach((time) => {
                var listItemTimeHTML = `
                <div class="list-group-item list-group-item-action list-item-time p-0 d-shaver-border" aria-current="true"
                  data-booking-time="${time}">
                  <div class="p-3 p-lg-4">
                    <h5 class="mb-0 fw-medium d-shaver-time-choices-h5">${time}</h5>
                  </div>
                </div>
              `;

                listItemTimeContainer.append(listItemTimeHTML);
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

      var calendar = new VanillaCalendar("#booking-calendar", options);
      calendar.init();
    }

    function setCostingBookingDate(selectedBookingDate) {
      $("#costing-booking-icon").removeClass("d-none");
      $("#costing-booking-date").removeClass("d-none");
      const costingBookingDateParagraph = $("#costing-booking-date");
      costingBookingDateParagraph.empty();

      if (selectedBookingDate) {
        const date = new Date(selectedBookingDate);
        // Define options for formatting
        const options = { year: "numeric", month: "long", day: "numeric" };

        // Format the date
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
          date
        );
        costingBookingDateParagraph.text(formattedDate);
      }
    }

    function setCostingBookingDateMobile(selectedBookingDate) {
      $("#costing-booking-icon-mobile").removeClass("d-none");
      $("#costing-booking-date-mobile").removeClass("d-none");
      const costingBookingDateParagraph = $("#costing-booking-date-mobile");
      costingBookingDateParagraph.empty();

      if (selectedBookingDate) {
        const date = new Date(selectedBookingDate);
        // Define options for formatting
        const options = { year: "numeric", month: "long", day: "numeric" };

        // Format the date
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
          date
        );
        costingBookingDateParagraph.text(formattedDate);
      }
    }

    /** update Barber Button States function **/
    function updateBookingBarberButtonStates() {
      $(".list-item-barber").each(function () {
        const serviceBarberID = $(this).data("barber-id");
        const serviceBarberName = $(this).data("barber-name");

        const selectedBarberID = selectedBarber?.barber_id;
        const selectedBarberName = selectedBarber?.barber_name;

        if (
          serviceBarberID === selectedBarberID &&
          serviceBarberName === selectedBarberName
        ) {
          $(this).addClass("services-list-group-item-checked");
        } else {
          $(this).removeClass("services-list-group-item-checked");
        }
      });
    }

    /** reset Barber Button States function **/
    function resetBookingTimeButtonStates() {
      $(".list-item-time").removeClass("services-list-group-item-checked");
      const listItemTimeContainer = $("#list-group-time-container");
      listItemTimeContainer.empty();
    }

    /** update Time Button States function **/
    function updateBookingTimeButtonStates() {
      $(".list-item-time").each(function () {
        const serviceTime = $(this).data("booking-time");
        if (serviceTime === selectedBookingTime) {
          $(this).addClass("services-list-group-item-checked");
        } else {
          $(this).removeClass("services-list-group-item-checked");
        }
      });
    }

    function setCostingBookingBarber(selectedBarberName) {
      $(".selected-barber-name").removeClass("d-none"); // selected-barber-name is rendered through this JS file
      const barberSpanElement = $(".selected-barber-name");
      barberSpanElement.empty();
      barberSpanElement.html(`with <b>${selectedBarberName}</b>`);
    }

    function setCostingBookingTime(selectedBookingTime) {
      $("#costing-booking-time").removeClass("d-none");
      $("#costing-booking-time-mobile").removeClass("d-none");
      const costingBookingTimeParagraph = $("#costing-booking-time");
      costingBookingTimeParagraph.empty();
      costingBookingTimeParagraph.text(` (${selectedBookingTime})`);
    }

    function setCostingBookingTimeMobile(selectedBookingTime) {
      $("#costing-booking-time").removeClass("d-none");
      $("#costing-booking-time-mobile").removeClass("d-none");
      const costingBookingTimeParagraph = $("#costing-booking-time-mobile");
      costingBookingTimeParagraph.empty();
      costingBookingTimeParagraph.text(` (${selectedBookingTime})`);
    }

    function resetCostingBookingTime() {
      $("#costing-booking-time").removeClass("d-none");
      $("#costing-booking-time-mobile").removeClass("d-none");
      const costingBookingTimeParagraph = $("#costing-booking-time");
      costingBookingTimeParagraph.empty();
    }

    function resetCostingBookingTimeMobile() {
      $("#costing-booking-time").removeClass("d-none");
      $("#costing-booking-time-mobile").removeClass("d-none");
      const costingBookingTimeParagraph = $("#costing-booking-time-mobile");
      costingBookingTimeParagraph.empty();
    }

    function toggleCostingContinueButtonState() {
      if (selectedServices.length === 0) {
        $("#costing-nav-btn").prop("disabled", true);
        $("#costing-nav-btn-mobile").prop("disabled", true);
      } else {
        $("#costing-nav-btn").prop("disabled", false);
        $("#costing-nav-btn-mobile").prop("disabled", false);
      }
    }

    function toggleModalAdditionalButtonState() {
      const selectedAdditionalServices = selectedServices.filter(function (
        service
      ) {
        return service.serviceType.toLowerCase() === "additional";
      });

      const selectedAdditionalServicesLength =
        selectedAdditionalServices.length;

      if (selectedAdditionalServicesLength === 0) {
        $("#additional-not-today-btn").removeClass("d-none");
        $("#additional-continue-btn").addClass("d-none");
      } else {
        $("#additional-not-today-btn").addClass("d-none");
        $("#additional-continue-btn").removeClass("d-none");
      }
    }

    function showBookingSubmissionSpinner() {
      $("#book-btn").addClass("d-none");
      $("#booking-submission-spinner").removeClass("d-none");
    }

    function hideBookingSubmissionSpinner() {
      $("#book-btn").removeClass("d-none");
      $("#booking-submission-spinner").addClass("d-none");
    }

    /** Render Summary */
    function renderSummaryListContent() {
      const summaryFullName = $("#summary-full-name");
      summaryFullName.empty();
      summaryFullName.text(fullName);

      const summaryContactNumber = $("#summary-contact-number");
      summaryContactNumber.empty();
      summaryContactNumber.text(contactNumber);

      const summaryEmailAddress = $("#summary-email-address");
      summaryEmailAddress.empty();
      summaryEmailAddress.text(emailAddress);

      const summaryDateOfBirth = $("#summary-date-of-birth");
      if (dateOfBirth) {
        const formattedDate = new Date(dateOfBirth).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
        summaryDateOfBirth.empty();
        summaryDateOfBirth.text(formattedDate);
      } else {
        summaryDateOfBirth.empty();
        summaryDateOfBirth.text("N/A");
      }

      const container = $("#list-items-summary-container");
      container.empty();

      selectedServices.forEach(function (service) {
        const serviceHTML = `
        <div class="d-flex justify-content-between gap-2 gap-sm-3 gap-md-4">
          <div>
          <p class="fw-light d-shaver-paragraph">${service.serviceName}</p>
          <p class="fw-light d-shaver-paragraph"><span>${service.serviceDuration} mins</span><span> • </span><span>${service.serviceForWhom}</span> <span>with ${selectedBarber.barber_name}</span></p>
          </div>
          <p class="fw-light d-shaver-paragraph">$<span>${service.servicePrice}</span></p>
        </div>
      `;

        container.append(serviceHTML);
      });

      $("#costing-summary-booking-icon").removeClass("d-none");
      $("#costing-summary-booking-date").removeClass("d-none");
      $("#costing-summary-booking-time").removeClass("d-none");

      const costingBookingDateParagraph = $("#costing-summary-booking-date");
      if (selectedBookingDate) {
        const formattedDate = new Date(selectedBookingDate).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
        costingBookingDateParagraph.empty();
        costingBookingDateParagraph.text(formattedDate);
      } else {
        costingBookingDateParagraph.empty();
        costingBookingDateParagraph.text("N/A");
      }

      const costingBookingTimeParagraph = $("#costing-summary-booking-time");
      costingBookingTimeParagraph.empty();
      costingBookingTimeParagraph.text(` (${selectedBookingTime})`);

      var totalPriceCalculated = selectedServices.reduce(function (
        sum,
        service
      ) {
        return sum + service.servicePrice;
      },
      0);

      totalPrice = totalPriceCalculated;

      var totalMinutesCalculated = selectedServices.reduce(function (
        sum,
        service
      ) {
        return sum + service.serviceDuration;
      },
      0);

      $("#total-summary-cost-value").text(
        "$" + totalPriceCalculated.toFixed(2)
      );
      $("#total-summary-cost-value").attr("data-total", totalPriceCalculated);

      $("#total-summary-duration-value").text(totalMinutesCalculated + " mins");
    }

    /** Handle Booking Submit **/
    async function submitBooking() {
      try {
        $("#book-btn").attr("disabled", true);
        $("#final-go-back-btn").attr("disabled", true);
        $("#final-go-back-btn").addClass("d-none");
        preventBookingModalClose = true;
        showBookingSubmissionSpinner();

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

        const bookingItem = {
          barber: selectedBarber,
          services: updatedServices,
          date: selectedBookingDate,
          time: selectedBookingTime,
          customer: fullName,
          mobileNumber: contactNumber,
          emailAddress: emailAddress,
          dateOfBirth: dateOfBirth,
          totalPrice: totalPrice,
        };

        const response = await fetch(dShaverApiSettings.bookingApi, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": dShaverApiSettings.nonce,
          },
          body: JSON.stringify(bookingItem),
        });

        const data = await response.json();

        console.log(data);

        if (data.success) {
          showToast(data.message, "success");
          resetTrackedValues();

          const {
            booking_reference_number,
            client_name,
            barber_name,
            appointment_date,
            appointment_time,
            total_amount,
            services,
          } = data.data;

          const pathName =
            `${dShaverApiSettings.bookingSuccessfulURL}?` +
            `bookingRefNumber=${encodeURIComponent(
              booking_reference_number
            )}&` +
            `clientName=${encodeURIComponent(client_name)}&` +
            `barberName=${encodeURIComponent(barber_name)}&` +
            `appointmentDate=${encodeURIComponent(appointment_date)}&` +
            `appointmentTime=${encodeURIComponent(appointment_time)}&` +
            `totalAmount=${encodeURIComponent(total_amount)}&` +
            `services=${encodeURIComponent(services)}`;
          window.location.href = pathName;
        } else {
          showToast(data.message, "danger");
          hideBookingSubmissionSpinner();
          $("#final-go-back-btn").removeClass("d-none");
          $("#final-go-back-btn").attr("disabled", false);
          $("#book-btn").attr("disabled", false);
          preventBookingModalClose = false;

          // clear timeslots container
          const containerTimeSlots = $("#list-group-time-container");
          containerTimeSlots.empty();

          // close the modal
          $("#bookingInfoModal").modal("hide");

          // Reset selected booking date and time
          selectedBookingDate = null;
          selectedBookingTime = null;

          // Reload calendar and unavailable dates
          await loadBookingCalendar();
        }
      } catch (error) {
        console.log(error);
        showToast("Error submitting booking", "danger");
        const pathName = `${dShaverApiSettings.bookingFailedURL}`;
        window.location.href = pathName;
      }
    }

    function resetTrackedValues() {
      selectedBarber = null;
      selectedServices = [];
      totalPrice = 0;
      selectedBookingDate = null;
      selectedBookingTime = null;
      fullName = null;
      contactNumber = null;
      emailAddress = null;
      dateOfBirth = null;
    }

    /* END - FUNCTIONS */
  });
})(dShaverApiSettings);
