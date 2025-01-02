(function (dShaverApiGroupSettings) {
  /**
   * booking.js is used for group booking related behaviors
   */

  /* VARIABLES */

  // Booking details - GROUP
  // let groupBookingData = [
  //   {
  //     selectedBarber: null,
  //     selectedServices: null,
  //     totalPrice: 0,
  //     selectedBookingDate: null,
  //     selectedBookingTime: null,
  //     fullName: null,
  //     contactNumber: null,
  //     emailAddress: null,
  //     dateOfBirth: null,
  //   },
  // ];

  let currentUser = null;
  let groupBookingData = [];
  let selectedBookingDate = null;
  let selectedBookingTime = null;
  let formFilloutType = "main only";

  // Booking step - GROUP
  let currentStep = 0;
  const bookingStepContainersGroup = [
    "#booking-group-step-0",
    "#booking-group-step-1",
    "#booking-group-step-2",
    "#booking-group-step-3",
  ];

  // International Phone Input
  let itiInstanceGroup = null;

  // Final Booking Step Modal
  let preventBookingModalClose = false;
  /* VARIABLES */

  let selectedAdditional = null;

  $(document).ready(async function () {
    /* START - INTERNATIONAL TELEPHONE INPUT */
    // Wait until the modal is shown before initializing intl-tel-input
    $("#bookingInfoModalGroup").on("shown.bs.modal", function () {
      renderContactNumberITLForm();
    });

    //Destroy the instance when modal is hidden
    $("#bookingInfoModalGroup").on("hidden.bs.modal", function () {
      if (itiInstanceGroup) {
        itiInstanceGroup.destroy(); // Destroy the intlTelInput instance
        itiInstanceGroup = null;
      }
    });
    /* END - INTERNATIONAL TELEPHONE INPUT */

    $("#group-booking-tab").on("shown.bs.tab", function (e) {
      const bookingType = $(e.target).data("booking-type");
      if (bookingType.toLowerCase() === "group") {
        if (groupBookingData.length === 0) {
          currentUser = 0;

          groupBookingData.push({
            guestId: 0,
            isMain: true,
            selectedBarber: null,
            selectedServices: [],
            totalPrice: 0,
            fullName: null,
            contactNumber: null,
            emailAddress: null,
            dateOfBirth: null,
          });
        }
      }
    });

    /* START - CONDITIONAL RENDERING OF BOOKING TYPE COSTING (SINGLE/GROUP) */
    $("#booking-type-tab").on(
      "shown.bs.tab",
      'button[data-bs-toggle="tab"]',
      function (e) {
        const bookingType = $(e.target).data("booking-type");

        const costingContainer = $("#costing-container-group");
        const costingContainerMobile = $("#costing-container-mobile-group");
        const scheduleContainer = $("#schedule-container-group");

        if (bookingType.toLowerCase() !== "group") {
          scheduleContainer.addClass("hidden");
          costingContainer.addClass("hidden");
          costingContainerMobile.addClass("hidden");
        } else {
          updateSchedOrCostingContainerVisibilityGroup();
        }
      }
    );
    /* END - CONDITIONAL RENDERING OF BOOKING TYPE COSTING (SINGLE/GROUP) */

    /* START - LIST ITEMS CLICK EVENT */
    // Click listener for services list
    $(".list-item-service-group").on("click", function (event) {
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
      $("#modal-service-name-group").text(serviceName);
      $("#modal-service-duration-group").text(`${duration} mins`);
      $("#modal-service-for-whom-group").text(forWhom);
      $("#modal-service-description-group").text(description);
      $("#modal-service-price-group").text(`$${price}`);

      // Determine whether to show Add or Remove button
      const userSelectedServices =
        groupBookingData[currentUser]?.selectedServices || [];

      const serviceIndex = userSelectedServices.findIndex(
        (service) =>
          service.serviceName === serviceName &&
          service.serviceType === serviceType
      );

      if (serviceIndex === -1) {
        // If not selected, show Add button
        $("#modal-add-to-booking-btn-group").text("Add to booking");
      } else {
        // If already selected, show Remove button
        $("#modal-add-to-booking-btn-group").text("Remove from booking");
      }

      // Show the modal
      $("#servicesModalGroup").modal("show");

      // Handle button action (Add/Remove)
      $("#modal-add-to-booking-btn-group")
        .off("click")
        .on("click", function () {
          if (serviceIndex === -1) {
            addOrReplaceUserServiceGroup(
              serviceId,
              serviceType,
              serviceName,
              duration,
              forWhom,
              price
            );

            toggleCostingContinueButtonGroupState();
            updateServicesSelectedStylingGroup(".list-item-service-group");
            toggleModalAdditionalButtonStateGroup();
          } else {
            removeServiceGroup(
              serviceId,
              serviceType,
              serviceName,
              duration,
              forWhom,
              price
            );

            toggleCostingContinueButtonGroupState();
            updateServicesSelectedStylingGroup(".list-item-service-group");
            toggleModalAdditionalButtonStateGroup();
          }
          $("#servicesModalGroup").modal("hide");
        });
    });
    /* END - LIST ITEMS CLICK EVENT */

    /* START - LIST ITEMS BUTTON CLICK EVENT */
    $(".services-list-group-btn-group").on("click", function (event) {
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
      const userSelectedServices =
        groupBookingData[currentUser]?.selectedServices || [];

      const serviceIndex = userSelectedServices.findIndex(
        (service) =>
          service.serviceName === serviceName &&
          service.serviceType === serviceType &&
          service.serviceId === serviceId
      );

      if (serviceIndex === -1) {
        addOrReplaceUserServiceGroup(
          serviceId,
          serviceType,
          serviceName,
          duration,
          forWhom,
          price
        );

        toggleCostingContinueButtonGroupState();
        updateServicesSelectedStylingGroup(".list-item-service-group");
        toggleModalAdditionalButtonStateGroup();
      } else {
        // Remove service
        groupBookingData[currentUser].selectedServices.splice(serviceIndex, 1);

        removeServiceGroup(
          serviceId,
          serviceType,
          serviceName,
          duration,
          forWhom,
          price
        );

        toggleCostingContinueButtonGroupState();
        updateServicesSelectedStylingGroup(".list-item-service-group");
        toggleModalAdditionalButtonStateGroup();
      }
    });
    /* END - LIST ITEMS BUTTON CLICK EVENT */

    /** START - BOOKING STEPS **/
    $("#costing-nav-btn-group").on("click", function () {
      if (!canProceedToNextStepGroup()) {
        if (currentStep === 0 || currentStep === 1) {
          showToast(
            `<p>Please select a service/services for all the people in your group.</p>`,
            "danger"
          );
        } else if (currentStep === 2) {
          showToast(
            `<p>Please select a barber for all the people in your group.</p>`,
            "danger"
          );
        } else if (currentStep === 3) {
          showToast(
            `<p>Please select a date and time for you group booking.</p>`,
            "danger"
          );
        }

        return;
      }

      if (currentStep === bookingStepContainersGroup.length - 1) {
        const selectedAdditionalServices = groupBookingData
          .flatMap(function (customer) {
            return customer.selectedServices
              ? customer.selectedServices.filter(function (selectedService) {
                  return (
                    selectedService.serviceType.toLowerCase() === "additional"
                  );
                })
              : [];
          })
          .filter(function (selectedService) {
            return (
              selectedService &&
              selectedService.serviceType.toLowerCase() === "additional"
            );
          });

        if (
          !selectedAdditionalServices ||
          selectedAdditionalServices.length < groupBookingData.length
        ) {
          $(".final-step-0").removeClass("d-none");
          $(".final-step-1").addClass("d-none");
          $(".final-step-2").addClass("d-none");
        } else {
          $(".final-step-0").addClass("d-none");
          $(".final-step-1").removeClass("d-none");
          $(".final-step-2").addClass("d-none");
        }

        $("#bookingInfoModalGroup").modal("show");
      } else {
        currentStep++;
        handleShowBookingStepContainersGroup(currentStep);
        if (
          bookingStepContainersGroup[currentStep] === "#booking-group-step-3"
        ) {
          $("#booking-group-step-3").resize();
        }
      }
    });

    $("#costing-nav-btn-mobile-group").on("click", function () {
      if (!canProceedToNextStepGroup()) {
        if (currentStep === 0 || currentStep === 1) {
          showToast(
            `<p>Please select a service/services for all the people in your group.</p>`,
            "danger"
          );
        } else if (currentStep === 2) {
          showToast(
            `<p>Please select a barber for all the people in your group.</p>`,
            "danger"
          );
        } else if (currentStep === 3) {
          showToast(
            `<p>Please select a date and time for you group booking.</p>`,
            "danger"
          );
        }

        return;
      }

      if (currentStep === bookingStepContainersGroup.length - 1) {
        const selectedAdditionalServices = groupBookingData
          .flatMap(function (customer) {
            return customer.selectedServices
              ? customer.selectedServices.filter(function (selectedService) {
                  return (
                    selectedService.serviceType.toLowerCase() === "additional"
                  );
                })
              : [];
          })
          .filter(function (selectedService) {
            return (
              selectedService &&
              selectedService.serviceType.toLowerCase() === "additional"
            );
          });

        if (
          !selectedAdditionalServices ||
          selectedAdditionalServices.length < groupBookingData.length
        ) {
          $(".final-step-0").removeClass("d-none");
          $(".final-step-1").addClass("d-none");
          $(".final-step-2").addClass("d-none");
        } else {
          $(".final-step-0").addClass("d-none");
          $(".final-step-1").removeClass("d-none");
          $(".final-step-2").addClass("d-none");
        }

        $("#bookingInfoModalGroup").modal("show");
      } else {
        currentStep++;
        handleShowBookingStepContainersGroup(currentStep);
        if (
          bookingStepContainersGroup[currentStep] === "#booking-group-step-3"
        ) {
          $("#booking-group-step-3").resize();
        }
      }
    });

    // Edit Guest Selected Services
    $(document).on("click", ".dropdown-edit-guest-service", function () {
      const guestId = $(this).data("guest-id");
      editGuest(guestId);
    });

    // Delete Guest
    $(document).on("click", ".dropdown-delete-guest-service", function () {
      const guestId = $(this).data("guest-id");
      deleteGuest(guestId);
    });

    // Add Guest
    $(document).on("click", ".add-guest-button", function () {
      addNewGuest();
    });

    /** START - BARBER SELECTION **/
    $(document).on("click", ".group-barber-select-btn", function () {
      const guestId = $(this).data("guest-id");
      handleBarberSelectionModalGroup(guestId);
    });

    $(document).on("click", ".list-item-barber-group", function () {
      const itemBarber = $(this);
      const barberID = itemBarber.data("barber-id");
      const barberName = itemBarber.data("barber-name");

      const selectedBarber = {
        barber_id: barberID,
        barber_name: barberName,
      };

      groupBookingData[currentUser].selectedBarber = selectedBarber;
      $(this).addClass("services-list-group-item-checked");
      setCostingBookingBarberGroup(barberName);

      $("#barberSelectionModalGroup").modal("hide");
    });
    /** END - BARBER SELECTION */

    /** START - PREVIOUS BUTTON CLICK */
    $("#booking-nav-prev-group").on("click", function () {
      if (currentStep > 0) {
        currentStep--;

        handleShowBookingStepContainersGroup(currentStep);

        if (bookingStepContainersGroup[currentStep] === "#booking-step-4") {
          $("#booking-step-4").resize();
        }
      }
    });

    // Additional
    $("#additional-go-back-btn-group").on("click", function () {
      $(".final-step-0").removeClass("d-none");
      $(".final-step-1").addClass("d-none");
      $(".final-step-2").addClass("d-none");
    });

    $("#additional-not-today-btn-group").on("click", function () {
      $(".final-step-0").addClass("d-none");
      $(".final-step-1").removeClass("d-none");
      $(".final-step-2").addClass("d-none");
    });

    $("#additional-continue-btn-group").on("click", function () {
      $(".final-step-0").addClass("d-none");
      $(".final-step-1").removeClass("d-none");
      $(".final-step-2").addClass("d-none");
    });

    // Personal information form
    // client switch event client selection
    $("#switchFormOtherGuests").on("change", function (e) {
      // Check if the switch is checked
      if (e.target.checked) {
        $("#switchFormOtherGuestsLabel").text("All Guests");
        formFilloutType = "all";

        const guestIds = groupBookingData
          .filter((bookingData) => bookingData.guestId !== 0)
          .map((guest) => guest.guestId);
        renderGuestFormsGroup(guestIds);
      } else {
        $("#switchFormOtherGuestsLabel").text("Main Guest Only");
        formFilloutType = "main only";
        const guestIds = [];
        renderGuestFormsGroup(guestIds);
      }
    });

    // Summary
    $("#final-go-back-btn-group").on("click", function () {
      const stepZeroFinalModal = $(".final-step-0");
      const stepOneFinalModal = $(".final-step-1");
      const stepTwoFinalModal = $(".final-step-2");

      stepZeroFinalModal.addClass("d-none");
      stepOneFinalModal.removeClass("d-none");
      stepTwoFinalModal.addClass("d-none");
    });
    /** END - PREVIOUS BUTTON CLICK */

    /** START - TIME BUTTONS **/
    $(document).on("click", ".list-item-time-group", function () {
      const itemTime = $(this);
      const bookingTime = itemTime.data("booking-time"); // Fixed from "data-booking-time"
      selectedBookingTime = bookingTime;
      updateBookingTimeButtonStatesGroup();
      setCostingBookingTimeGroup(selectedBookingTime);
      setCostingBookingTimeMobileGroup(selectedBookingTime);
    });
    /** END - TIME BUTTONS */

    /** START - BOOKING ADDITIONAL MODAL */
    $(".services-list-group-btn-group-additional").on("click", function () {
      $(this)
        .closest(".list-item-service-group-additional")
        .addClass("services-list-group-item-checked");
      $(this).addClass("services-list-group-btn-checked");
      $(this)
        .find(".services-list-group-btn-group-additional i")
        .removeClass("fa-plus")
        .addClass("fa-check");

      const serviceId = $(this)
        .closest(".list-item-service-group-additional")
        .data("service-id");
      const serviceName = $(this)
        .closest(".list-item-service-group-additional")
        .data("service-name");
      const serviceDuration = $(this)
        .closest(".list-item-service-group-additional")
        .data("duration");
      const serviceForWhom = $(this)
        .closest(".list-item-service-group-additional")
        .data("for-whom");
      const serviceType = $(this)
        .closest(".list-item-service-group-additional")
        .data("service-type");
      const servicePrice = $(this)
        .closest(".list-item-service-group-additional")
        .data("price");

      selectedAdditional = {
        serviceId: serviceId,
        serviceType: serviceType,
        serviceName: serviceName,
        serviceDuration: serviceDuration,
        serviceForWhom: serviceForWhom,
        servicePrice: servicePrice,
      };

      // filter groupBookingData to only include users without services that are additional
      const filteredGroupBookingData = groupBookingData.filter(
        (customer) =>
          customer.selectedServices.find(
            (service) => service.serviceType.toLowerCase() === "additional"
          ) === undefined
      );
      console.log(groupBookingData);
      console.log(filteredGroupBookingData);
      if (filteredGroupBookingData.length === 0) {
        selectedAdditional = null;
        $(this)
          .closest(".list-item-service-group-additional")
          .removeClass("services-list-group-item-checked");
        $(this).removeClass("services-list-group-btn-checked");
        $(this)
          .find(".services-list-group-btn-group-additional i")
          .addClass("fa-plus")
          .removeClass("fa-check");
      } else {
        renderGuestListForAdditionalServiceSelection(filteredGroupBookingData);
        $("#guestAdditionalServiceSelectionModal").modal("show");
      }
    });

    $(document).on("click", ".list-item-guest-additional", function () {
      const itemGuest = $(this);
      const guestId = itemGuest.data("guest-id");

      const guest = groupBookingData.find(
        (client) => client.guestId === guestId
      );

      guest.selectedServices.push(selectedAdditional);
      $(this).addClass("services-list-group-item-checked");
      renderListServicesDesktopGroup();
      renderListServicesMobileGroup();

      const filteredGroupBookingData = groupBookingData.filter(
        (customer) =>
          customer.selectedServices.find(
            (service) => service.serviceType.toLowerCase() === "additional"
          ) === undefined
      );

      $("#guestAdditionalServiceSelectionModal").modal("hide");
      selectedAdditional = null;
      $(".list-item-service-group-additional").removeClass(
        "services-list-group-item-checked"
      );
      $(".services-list-group-btn-group-additional").removeClass(
        "services-list-group-btn-checked"
      );
      $(".services-list-group-btn-group-additional i")
        .addClass("fa-plus")
        .removeClass("fa-check");

      if (filteredGroupBookingData.length === 0) {
        $("#additional-not-today-btn-group").addClass("d-none");
        $("#additional-continue-btn-group").removeClass("d-none");
        $("#additional-go-back-btn-group").attr("disabled", true);

        $(".final-step-0").addClass("d-none");
        $(".final-step-1").removeClass("d-none");
        $(".final-step-2").addClass("d-none");
      }
    });
    /** END - BOOKING ADDITIONAL MODAL */

    /** START - FORM VALIDATION **/
    const forms = document.querySelectorAll(".submit-form-group");

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
    $("#bookingInfoModalGroup").on("hide.bs.modal", function (e) {
      if (preventBookingModalClose) {
        e.preventDefault(); // Prevent the modal from closing
      }
    });

    // Handle Form Submission
    const stepZeroFinalModal = $(".final-step-0");
    const stepOneFinalModal = $(".final-step-1");
    const stepTwoFinalModal = $(".final-step-2");

    $(document).on("submit", ".submit-form-group", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const that = this;

      if (formFilloutType === "main only") {
        const { fullName, contactNumber, emailAddress, dateOfBirth } =
          getMainGuestInfo(that);

        // Populate Group Data
        groupBookingData = groupBookingData.map((customer) => ({
          ...customer,
          fullName: fullName,
          contactNumber: contactNumber,
          emailAddress: emailAddress,
          dateOfBirth: dateOfBirth,
        }));
      } else {
        const { fullName, contactNumber, emailAddress, dateOfBirth } =
          getMainGuestInfo(that);
        groupBookingData[0] = {
          ...groupBookingData[0],
          fullName: fullName,
          contactNumber: contactNumber,
          emailAddress: emailAddress,
          dateOfBirth: dateOfBirth,
        };

        // update other guests
        groupBookingData.map((customer) => {
          if (customer.guestId !== 0) {
            const guestFullName = $(this)
              .find(`input[name='full-name-group-${customer.guestId}']`)
              .val()
              .trim();

            groupBookingData[customer.guestId] = {
              ...groupBookingData[customer.guestId],
              fullName: guestFullName,
            };
          }
        });
      }

      stepZeroFinalModal.addClass("d-none");
      stepOneFinalModal.addClass("d-none");
      stepTwoFinalModal.removeClass("d-none");

      renderSummaryListContentGroup();
    });

    // Final Submit
    $("#book-btn-group").on("click", function () {
      submitBookingGroup();
    });

    /** END - FORM SUBMISSION **/

    /** END - BOOKING STEPS **/

    /* START - FUNCTIONS */
    /** update or replace service **/
    function addOrReplaceUserServiceGroup(
      serviceId,
      serviceType,
      serviceName,
      serviceDuration,
      serviceForWhom,
      servicePrice
    ) {
      let existingIndex = -1;

      const userSelectedServices =
        groupBookingData[currentUser]?.selectedServices || [];

      for (let i = 0; i < userSelectedServices.length; i++) {
        if (userSelectedServices[i].serviceType === serviceType) {
          existingIndex = i;
          break;
        }
      }

      // If it exists, replace it
      if (existingIndex > -1 && serviceType.toLowerCase() !== "additional") {
        groupBookingData[currentUser].selectedServices[existingIndex] = {
          serviceId: serviceId,
          serviceType: serviceType,
          serviceName: serviceName,
          serviceDuration: serviceDuration,
          serviceForWhom: serviceForWhom,
          servicePrice: servicePrice,
        };
      } else {
        // If it doesn't exist, add the new service
        groupBookingData[currentUser]?.selectedServices.push({
          serviceId: serviceId,
          serviceType: serviceType,
          serviceName: serviceName,
          serviceDuration: serviceDuration,
          serviceForWhom: serviceForWhom,
          servicePrice: servicePrice,
        });
      }
      updateSchedOrCostingContainerVisibilityGroup();
      updateBookingContainerMobilePaddingGroup();
    }

    /** remove service **/
    function removeServiceGroup(
      serviceId,
      serviceType,
      serviceName,
      serviceDuration,
      serviceForWhom,
      servicePrice
    ) {
      const userSelectedServices =
        groupBookingData[currentUser]?.selectedServices || [];

      if (userSelectedServices && Array.isArray(userSelectedServices)) {
        groupBookingData[currentUser].selectedServices =
          userSelectedServices.filter(function (service) {
            return !(
              service.serviceId === serviceId &&
              service.serviceType === serviceType &&
              service.serviceName === serviceName &&
              service.serviceDuration === serviceDuration &&
              service.serviceForWhom === serviceForWhom &&
              service.servicePrice === servicePrice
            );
          });
      } else {
        groupBookingData[currentUser].selectedServices = [];
      }

      updateSchedOrCostingContainerVisibilityGroup();
      updateBookingContainerMobilePaddingGroup();
    }

    // toggle the continue button
    function toggleCostingContinueButtonGroupState() {
      const userSelectedServices =
        groupBookingData[currentUser]?.selectedServices || [];
      if (
        userSelectedServices.length === 0 ||
        (currentStep === 1 && groupBookingData.length < 2)
      ) {
        $("#costing-nav-btn-group").prop("disabled", true);
        $("#costing-nav-btn-mobile-group").prop("disabled", true);
      } else {
        $("#costing-nav-btn-group").prop("disabled", false);
        $("#costing-nav-btn-mobile-group").prop("disabled", false);
      }
    }

    /** update Service Button States function **/
    function updateServicesSelectedStylingGroup(dataContainerIdentifier) {
      // Get the IDs of currently selected services
      let selectedServiceNames = [];
      const userSelectedServices =
        groupBookingData[currentUser]?.selectedServices || [];

      for (const element of userSelectedServices) {
        selectedServiceNames.push(element.serviceName);
      }

      $(dataContainerIdentifier).each(function () {
        const serviceName = $(this).data("service-name");

        if (selectedServiceNames.includes(serviceName)) {
          $(this)
            .find(".services-list-group-btn-group")
            .addClass("services-list-group-btn-checked");
          $(this)
            .find(".services-list-group-btn-group i")
            .removeClass("fa-solid fa-plus")
            .addClass("fa-solid fa-check");

          $(this).addClass("services-list-group-item-checked");
        } else {
          $(this)
            .find(".services-list-group-btn-group")
            .removeClass("services-list-group-btn-checked");
          $(this)
            .find(".services-list-group-btn-group i")
            .removeClass("fa-solid fa-check")
            .addClass("fa-solid fa-plus");

          $(this).removeClass("services-list-group-item-checked");
        }
      });
    }

    function toggleModalAdditionalButtonStateGroup() {
      let isAnyCustomerSelectedAdditionalService = false;

      groupBookingData.forEach(function (customer) {
        const selectedAdditionalServices = customer.selectedServices
          ? customer.selectedServices.filter(function (service) {
              return service.serviceType.toLowerCase() === "additional";
            })
          : [];

        const selectedAdditionalServicesLength =
          selectedAdditionalServices.length;

        if (selectedAdditionalServicesLength > 0) {
          isAnyCustomerSelectedAdditionalService = true;
        }
      });

      if (isAnyCustomerSelectedAdditionalService) {
        $("#additional-not-today-btn-group").addClass("d-none");
        $("#additional-continue-btn-group").removeClass("d-none");
        $("#additional-go-back-btn-group").attr("disabled", true);
      } else {
        $("#additional-not-today-btn-group").removeClass("d-none");
        $("#additional-continue-btn-group").addClass("d-none");
        $("#additional-go-back-btn-group").attr("disabled", false);
      }
    }

    /** update costing component visibility **/
    function updateSchedOrCostingContainerVisibilityGroup() {
      const costingContainer = $("#costing-container-group");
      const costingContainerMobile = $("#costing-container-mobile-group");
      const scheduleContainer = $("#schedule-container");

      const isAnyCustomerHasSelectedServices = groupBookingData.some(function (
        customer
      ) {
        return (
          customer.selectedServices && customer.selectedServices.length > 0
        );
      });

      if (isAnyCustomerHasSelectedServices) {
        scheduleContainer.addClass("hidden");
        costingContainer.removeClass("hidden");
        costingContainerMobile.removeClass("hidden");

        renderListServicesDesktopGroup();
        renderListServicesMobileGroup();
      } else {
        scheduleContainer.removeClass("hidden");
        costingContainer.addClass("hidden");
        costingContainerMobile.addClass("hidden");
      }
    }

    /** render selected services on the costing component **/
    function renderListServicesDesktopGroup() {
      const container = $("#list-items-container-group");
      container.empty();

      groupBookingData.forEach(function (customer, index) {
        const customerLabel = customer.isMain
          ? "You"
          : `Guest ${customer.guestId}`;

        container.append(`
            <p class="fw-bold d-shaver-paragraph">${customerLabel}</p>
          `);

        customer.selectedServices.forEach(function (service) {
          const serviceHTML = `
            <div class="d-flex justify-content-between gap-2 gap-sm-3 gap-md-4">
              <div>
                <p class="fw-light d-shaver-paragraph">${
                  service.serviceName
                }</p>
                <p class="fw-light d-shaver-paragraph">
                  <span>${service.serviceDuration} mins</span>
                  <span> • </span>
                  <span>${service.serviceForWhom}</span>
                  ${
                    customer.selectedBarber
                      ? `<span class="selected-barber-name-group">with <b>${customer.selectedBarber.barber_name}</b></span>`
                      : `<span class="d-none selected-barber-name-group"></span>`
                  }
                </p>
              </div>
              <p class="fw-light d-shaver-paragraph">$<span>${
                service.servicePrice
              }</span></p>
            </div>
        `;

          container.append(serviceHTML);
        });

        if (index < groupBookingData.length - 1) {
          container.append(
            '<hr class="bg-black border-2 border-top border-black my-1" />'
          );
        }
      });

      setTotalPriceOnCostingContainerDesktopGroup();
    }

    function setTotalPriceOnCostingContainerDesktopGroup() {
      let totalPriceCalculated = 0;

      groupBookingData.forEach(function (customer) {
        if (customer.selectedServices) {
          // Calculate the total price for the customer's selected services
          const customerTotalPrice = customer.selectedServices.reduce(function (
            sum,
            service
          ) {
            return sum + service.servicePrice;
          },
          0);
          totalPriceCalculated += customerTotalPrice;
        }
      });

      $("#total-cost-value-group").text("$" + totalPriceCalculated.toFixed(2));
      $("#total-cost-value-group").attr("data-total", totalPriceCalculated);
    }

    function renderListServicesMobileGroup() {
      const container = $("#list-items-container-mobile-group");
      container.empty();

      let totalNumberOfServices = 0;
      let totalDurationOfServices = 0;

      groupBookingData.forEach(function (customer) {
        if (customer.selectedServices) {
          totalNumberOfServices += customer.selectedServices.length;
          totalDurationOfServices += customer.selectedServices.reduce(
            (sum, service) => sum + parseInt(service.serviceDuration),
            0
          );
        }
      });

      const serviceHTML = `
        <div class="d-flex gap-2">
            <p class="fw-bold">${totalNumberOfServices} ${
        totalNumberOfServices > 1 ? "Services" : "Service"
      }</p>
            <p>•</p>
            <p>${totalDurationOfServices} mins</p>
        </div>
    `;

      container.append(serviceHTML);
      setTotalPriceOnCostingContainerMobileGroup();
    }

    function setTotalPriceOnCostingContainerMobileGroup() {
      let totalPriceCalculated = 0;

      groupBookingData.forEach(function (customer) {
        if (customer.selectedServices) {
          totalPriceCalculated += customer.selectedServices.reduce(function (
            sum,
            service
          ) {
            return sum + service.servicePrice;
          },
          0);
        }
      });

      $("#total-cost-value-mobile-group").text(
        "$" + totalPriceCalculated.toFixed(2)
      );
      $("#total-cost-value-mobile-group").attr(
        "data-total",
        totalPriceCalculated
      );
    }

    /** Check if conditions are satisfied to move to the next step **/
    function canProceedToNextStepGroup() {
      if (currentStep === 0 || currentStep === 1) {
        const isAnyCustomerSelectedService = groupBookingData.some(function (
          customer
        ) {
          return (
            customer.selectedServices && customer.selectedServices.length > 0
          );
        });
        if (!isAnyCustomerSelectedService) {
          return false;
        }
      } else if (currentStep === 2) {
        const isAnyCustomerUnselectedBarber = groupBookingData.some(function (
          customer
        ) {
          return customer.selectedBarber === null;
        });
        if (isAnyCustomerUnselectedBarber) {
          return false;
        }
      } else if (
        currentStep === 3 &&
        (selectedBookingDate === null || selectedBookingTime === null)
      ) {
        return false;
      }

      return true;
    }

    /** Show BOOKING steps containers dynamically **/
    async function handleShowBookingStepContainersGroup(step) {
      // Hide all booking containers
      bookingStepContainersGroup.forEach(function (container) {
        $(container).addClass("hidden");
      });

      // Manage the visibility of the 'Next' and 'Previous' buttons
      if (step === 0) {
        $("#booking-nav-prev-group").addClass("hidden");
      } else {
        $("#booking-nav-prev-group").removeClass("hidden");
      }

      if (step === 1) {
        renderBookingGuests();
        toggleCostingContinueButtonGroupState();
      }

      if (step === 2) {
        renderBookingGuestsBarberSelection();
      }

      if (step === 3) {
        selectedBookingDate = null;
        selectedBookingTime = null;
        resetBookingTimeButtonStatesGroup();
        await loadBookingCalendarGroup();
      }

      // Show the current booking container
      $(bookingStepContainersGroup[step]).removeClass("hidden");
    }

    /** reset Barber Button States function **/
    function resetBookingTimeButtonStatesGroup() {
      $(".list-item-time-group").removeClass(
        "services-list-group-item-checked"
      );
      const listItemTimeContainer = $("#list-group-time-container-group");
      listItemTimeContainer.empty();
    }

    function updateBookingTimeButtonStatesGroup() {
      $(".list-item-time-group").each(function () {
        const serviceTime = $(this).data("booking-time");
        if (serviceTime === selectedBookingTime) {
          $(this).addClass("services-list-group-item-checked");
        } else {
          $(this).removeClass("services-list-group-item-checked");
        }
      });
    }

    function setCostingBookingTimeGroup(selectedBookingTime) {
      $("#costing-booking-time-group").removeClass("d-none");
      $("#costing-booking-time-mobile-group").removeClass("d-none");
      const costingBookingTimeParagraph = $("#costing-booking-time-group");
      costingBookingTimeParagraph.empty();
      costingBookingTimeParagraph.text(` (${selectedBookingTime})`);
    }

    function setCostingBookingTimeMobileGroup(selectedBookingTime) {
      $("#costing-booking-time-group").removeClass("d-none");
      $("#costing-booking-time-mobile-group").removeClass("d-none");
      const costingBookingTimeParagraph = $(
        "#costing-booking-time-mobile-group"
      );
      costingBookingTimeParagraph.empty();
      costingBookingTimeParagraph.text(` (${selectedBookingTime})`);
    }

    function resetCostingBookingTimeGroup() {
      $("#costing-booking-time-group").removeClass("d-none");
      $("#costing-booking-time-mobile-group").removeClass("d-none");
      const costingBookingTimeParagraph = $("#costing-booking-time-group");
      costingBookingTimeParagraph.empty();
    }

    function resetCostingBookingTimeMobileGroup() {
      $("#costing-booking-time-group").removeClass("d-none");
      $("#costing-booking-time-mobile-group").removeClass("d-none");
      const costingBookingTimeParagraph = $(
        "#costing-booking-time-mobile-group"
      );
      costingBookingTimeParagraph.empty();
    }

    /* For rendering the booking calendar */
    async function loadBookingCalendarGroup() {
      const unavailableDates = await loadUnavailableDatesGroup();

      const options = {
        actions: {
          async clickDay(event, self) {
            selectedBookingTime = null;
            resetCostingBookingTimeGroup();
            resetCostingBookingTimeMobileGroup();

            selectedBookingDate = self.selectedDates[0];
            setCostingBookingDateGroup(selectedBookingDate);
            setCostingBookingDateMobileGroup(selectedBookingDate);
            const availableTimes = await loadAvailableTimesGroup(
              selectedBookingDate
            );

            const listItemTimeContainer = $("#list-group-time-container-group");
            listItemTimeContainer.empty();

            if (availableTimes.length === 0) {
              const listItemTimeHTML = `
                <h5 class="mb-0 fw-medium d-shaver-time-choices-h5 text-center">No booking time slots available on this day.</h5>`;

              listItemTimeContainer.append(listItemTimeHTML);
            } else {
              availableTimes.forEach((time) => {
                const listItemTimeHTML = `
                    <div class="list-group-item list-group-item-action list-item-time-group p-0 d-shaver-border" aria-current="true"
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

      const calendar = new VanillaCalendar("#booking-calendar-group", options);
      calendar.init();
    }

    function renderBookingGuests() {
      const guestsContainer = $("#list-group-guests-container-group");
      guestsContainer.empty();

      if (groupBookingData.length > 0) {
        groupBookingData.forEach(function (client, index) {
          let selectedServiceText = "No services selected";
          if (client.selectedServices?.length === 1) {
            selectedServiceText = client.selectedServices[0].serviceName;
          } else if (client.selectedServices?.length > 1) {
            selectedServiceText = `${client.selectedServices.length} services selected`;
          }

          const guestLabel = client.isMain ? "You" : `Guest ${client.guestId}`;

          const bgClass = client.isMain
            ? "bg-success-subtle"
            : "bg-info-subtle";
          const iconClass = client.isMain ? "text-success" : "text-info";

          const guestsHTML = `
            <div class="d-shaver-border d-shaver-list-group-item list-group-item list-group-item-action list-item-guest p-0" aria-current="true" style="cursor: default">
              <div class="d-flex flex-row align-items-center justify-content-between gap-3 gap-lg-4">

                <div class="d-flex">
                  <div class="${bgClass} rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                    <i class="${iconClass} fa-solid fa-user d-shaver-booking-schedule-icon"></i>
                  </div>
                  <div class="d-flex flex-column ms-3 ms-lg-4">
                    <p class="fw-bold d-shaver-paragraph">${guestLabel}</p>
                    <p class="fw-light d-shaver-paragraph">${selectedServiceText}</p>
                  </div>
                </div>


                <div class="dropdown-center">
                  <button class="d-shaver-modal-btn btn dark-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Options
                  </button>
                  <ul class="dropdown-menu dshaver-dropdown-menu px-2" style="width: 200px;">
                    <li><a class="dropdown-item rounded d-shaver-paragraph dropdown-edit-guest-service" data-guest-id="${
                      client.guestId
                    }" role="button">Edit Services</a></li>
                    ${
                      client.isMain
                        ? ""
                        : `<li><a class="dropdown-item rounded d-shaver-paragraph dropdown-delete-guest-service" data-guest-id="${client.guestId}" role="button">Delete</a></li>`
                    }
                  </ul>
                </div>
              </div>
            </div>
          `;

          guestsContainer.append(guestsHTML);
        });

        const addGuestButtonHTML = `
        <div class="mt-3 mt-lg-4">
          <button class="btn btn-outline-secondary d-shaver-modal-btn dark-btn add-guest-button">
            <i class="fa-solid fa-plus me-1 me-lg-2"></i> Add Guest
          </button>
        </div>
        `;

        if (groupBookingData.length < 4) {
          guestsContainer.append(addGuestButtonHTML);
        }
      }
    }

    function renderBookingGuestsBarberSelection() {
      const guestsSelectContainer = $(
        "#list-group-guests-barber-select-container-group"
      );
      guestsSelectContainer.empty();

      if (groupBookingData.length > 0) {
        groupBookingData.forEach(function (client, index) {
          let selectedServiceText = "No services selected";
          if (client.selectedServices?.length === 1) {
            selectedServiceText = client.selectedServices[0].serviceName;
          } else if (client.selectedServices?.length > 1) {
            selectedServiceText = `${client.selectedServices.length} services selected`;
          }

          const guestLabel = client.isMain ? "You" : `Guest ${client.guestId}`;

          const bgClass = client.isMain
            ? "bg-success-subtle"
            : "bg-info-subtle";
          const iconClass = client.isMain ? "text-success" : "text-info";

          let buttonToRender = `<button type="button" class="d-shaver-modal-btn btn dark-btn group-barber-select-btn" data-guest-id="${client.guestId}">Select Barber <i class="ms-2 fa-solid fa-angle-down"></i></button>`;
          const selectedBarber = client.selectedBarber;
          if (selectedBarber) {
            buttonToRender = `<button type="button" class="d-shaver-modal-btn btn btn-success group-barber-select-btn" data-guest-id="${client.guestId}">with ${selectedBarber?.barber_name} <i class="ms-2 fa-solid fa-angle-down"></i></button>`;
          }

          const guestsHTML = `
            <div class="d-shaver-border d-shaver-list-group-item list-group-item list-group-item-action list-item-guest p-0" aria-current="true" style="cursor: default">
              <div class="d-flex flex-row align-items-center justify-content-between gap-3 gap-lg-4">

                <div class="d-flex">
                  <div class="${bgClass} rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                    <i class="${iconClass} fa-solid fa-user d-shaver-booking-schedule-icon"></i>
                  </div>
                  <div class="d-flex flex-column ms-3 ms-lg-4">
                    <p class="fw-bold d-shaver-paragraph">${guestLabel}</p>
                    <p class="fw-light d-shaver-paragraph">${selectedServiceText}</p>
                  </div>
                </div>

                ${buttonToRender}
              </div>
            </div>
          `;

          guestsSelectContainer.append(guestsHTML);
        });
      }
    }

    function renderGuestListForAdditionalServiceSelection(
      filteredGroupBookingData
    ) {
      const guestAdditionalServiceListContainer = $(
        "#guestAdditionalServiceSelectionList"
      );
      guestAdditionalServiceListContainer.empty();

      if (filteredGroupBookingData.length > 0) {
        filteredGroupBookingData.forEach(function (client, index) {
          const guestLabel = client.isMain ? "You" : `Guest ${client.guestId}`;

          const bgClass = client.isMain
            ? "bg-success-subtle"
            : "bg-info-subtle";
          const iconClass = client.isMain ? "text-success" : "text-info";

          const guestsHTML = `
            <div class="d-shaver-border d-shaver-list-group-item list-group-item list-group-item-action list-item-guest-additional p-0" aria-current="true" style="cursor: default" data-guest-id="${client.guestId}">
              <div class="d-flex flex-row align-items-center justify-content-between gap-3 gap-lg-4">
                <div class="d-flex">
                  <div class="${bgClass} rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                    <i class="${iconClass} fa-solid fa-user d-shaver-booking-schedule-icon"></i>
                  </div>
                   <p class="fw-bold d-shaver-paragraph ms-3 ms-lg-4">${guestLabel}</p>
                </div>
              </div>
            </div>
          `;

          guestAdditionalServiceListContainer.append(guestsHTML);
        });
      }
    }

    function addNewGuest() {
      const guestIds = groupBookingData.map(function (guest) {
        return guest.guestId;
      });

      guestIds.sort(function (a, b) {
        return b - a; // Sorting in descending order
      });

      const nextGuestId = guestIds[0] + 1;
      console.log("nextGuestId", nextGuestId);

      currentUser = nextGuestId;
      currentStep = 0;

      const newGuest = {
        guestId: nextGuestId,
        isMain: false,
        selectedBarber: null,
        selectedServices: [],
        totalPrice: 0,
        fullName: null,
        contactNumber: null,
        emailAddress: null,
        dateOfBirth: null,
      };

      groupBookingData.push(newGuest);

      console.log("groupBookingData", groupBookingData);

      resetServicesSelectedStylingGroup(".list-item-service-group");
      handleShowBookingStepContainersGroup(currentStep);
      renderListServicesDesktopGroup();
      renderListServicesMobileGroup();
      toggleCostingContinueButtonGroupState();
      toggleModalAdditionalButtonStateGroup();
    }

    function deleteGuest(guestId) {
      currentUser = 0;

      groupBookingData = groupBookingData.filter(function (guest) {
        return guest.guestId !== guestId;
      });

      groupBookingData.forEach(function (guest, index) {
        guest.guestId = index;
      });

      resetServicesSelectedStylingGroup(".list-item-service-group");
      renderListServicesDesktopGroup();
      renderListServicesMobileGroup();
      toggleCostingContinueButtonGroupState();
      toggleModalAdditionalButtonStateGroup();
      renderBookingGuests();
    }

    function editGuest(guestId) {
      currentUser = guestId;
      currentStep = 0;

      resetServicesSelectedStylingGroup(".list-item-service-group");
      updateServicesSelectedStylingGroup(".list-item-service-group");
      handleShowBookingStepContainersGroup(currentStep);
      renderListServicesDesktopGroup();
      renderListServicesMobileGroup();
      toggleCostingContinueButtonGroupState();
      toggleModalAdditionalButtonStateGroup();
    }

    function resetServicesSelectedStylingGroup(dataContainerIdentifier) {
      $(dataContainerIdentifier).each(function () {
        $(this).removeClass("services-list-group-item-checked");

        $(this)
          .find(".services-list-group-btn-group")
          .removeClass("services-list-group-btn-checked");

        $(this)
          .find(".services-list-group-btn-group i")
          .removeClass("fa-solid fa-check")
          .addClass("fa-solid fa-plus");
      });
    }

    function handleBarberSelectionModalGroup(guestId) {
      currentUser = guestId;
      const guestIdentifier = guestId === 0 ? "You" : `Guest ${guestId}`;
      const guestLabel = `Select a barber for <span class='fw-bold'>${guestIdentifier}</span>`;

      const barberSelectionModalLabelContainer = $("#modal-group-guest-label");
      barberSelectionModalLabelContainer.empty();
      barberSelectionModalLabelContainer.append(guestLabel);

      $(".list-item-barber-group").removeClass(
        "services-list-group-item-checked"
      );
      $("#barberSelectionModalGroup").modal("show");
    }

    function setCostingBookingBarberGroup(selectedBarberName) {
      const selectedBarberSpans = $(".selected-barber-name-group"); // selected-barber-name-group is rendered through this JS file

      const barberSelectionButtons = $(".group-barber-select-btn"); // group-barber-select-btn is rendered through this JS file

      if (currentUser < selectedBarberSpans.length) {
        const currentBarberSpan = selectedBarberSpans.eq(currentUser);

        currentBarberSpan.removeClass("d-none");
        currentBarberSpan.empty();
        currentBarberSpan.html(`with <b>${selectedBarberName}</b>`);

        const currentBarberSelectionButton =
          barberSelectionButtons.eq(currentUser);
        currentBarberSelectionButton.removeClass("dark-btn");
        currentBarberSelectionButton.addClass("btn-success");
        currentBarberSelectionButton.html(
          `<span>with ${selectedBarberName}</span> <i class="ms-2 fa-solid fa-angle-down"></i>`
        );
      }
    }

    async function loadUnavailableDatesGroup() {
      try {
        const isAnyCustomerUnselectedBarber = groupBookingData.some(function (
          customer
        ) {
          return customer.selectedBarber === null;
        });
        if (isAnyCustomerUnselectedBarber) {
          throw new Error("All guests must have a selected barber");
        }

        showSpinner(); // imported from main.js

        const uniqueBarberIds = [
          ...new Set(
            groupBookingData.map((item) => item.selectedBarber.barber_id)
          ),
        ];

        const apiUrl = `${
          dShaverApiGroupSettings.unavailableDatesApi
        }?barber_id=${encodeURIComponent(uniqueBarberIds.join(","))}`;

        const response = await fetch(apiUrl, {
          headers: {
            "X-WP-Nonce": dShaverApiGroupSettings.nonce,
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
    async function loadAvailableTimesGroup(selectedBookingDate) {
      try {
        showSpinner(); // imported from main.js

        const isAnyCustomerUnselectedBarber = groupBookingData.some(function (
          customer
        ) {
          return customer.selectedBarber === null;
        });
        if (isAnyCustomerUnselectedBarber) {
          throw new Error("All guests must have a selected barber");
        }

        const isAnyCustomerHasNoSelectedBookingDate = groupBookingData.some(
          function (customer) {
            return customer.selectedBookingDate === null;
          }
        );
        if (isAnyCustomerHasNoSelectedBookingDate) {
          throw new Error("All guests must have a selected booking date");
        }

        const barberIDs = groupBookingData.map(function (customer) {
          return customer.selectedBarber.barber_id;
        });

        const response = await fetch(
          dShaverApiGroupSettings.availableTimesApi,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-WP-Nonce": dShaverApiGroupSettings.nonce,
            },
            body: JSON.stringify({
              barberIDs: barberIDs,
              selectedBookingDate: selectedBookingDate,
            }),
          }
        );

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

    function setCostingBookingDateGroup(selectedBookingDate) {
      $("#costing-booking-icon-group").removeClass("d-none");
      $("#costing-booking-date-group").removeClass("d-none");
      const costingBookingDateParagraph = $("#costing-booking-date-group");
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

    function setCostingBookingDateMobileGroup(selectedBookingDate) {
      $("#costing-booking-icon-mobile-group").removeClass("d-none");
      $("#costing-booking-date-mobile-group").removeClass("d-none");
      const costingBookingDateParagraph = $(
        "#costing-booking-date-mobile-group"
      );
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

    /** Render Summary */
    function renderSummaryListContentGroup() {
      let summaryGroupContainer = $("#accordion-summary-group");
      summaryGroupContainer.empty();

      let groupBookingTotalDuration = 0;
      let groupBookingTotalPrice = 0;

      groupBookingData.forEach(function (guest, index) {
        const guestId = guest.guestId;
        const fullName = guest.fullName;
        const contactNumber = guest.contactNumber;
        const emailAddress = guest.emailAddress;
        const dateOfBirth = guest.dateOfBirth;
        let formattedDateOfBirth = null;

        if (dateOfBirth) {
          formattedDateOfBirth = new Date(dateOfBirth).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );
        } else {
          formattedDateOfBirth = "N/A";
        }

        let formattedBookingDate = null;
        if (selectedBookingDate) {
          formattedBookingDate = new Date(
            selectedBookingDate
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        } else {
          formattedBookingDate = "N/A";
        }

        const selectedBookingTimeData = selectedBookingTime;

        const totalPriceCalculated = guest.selectedServices.reduce(function (
          sum,
          service
        ) {
          return sum + service.servicePrice;
        },
        0);

        groupBookingTotalPrice += totalPriceCalculated;
        groupBookingData[index].totalPrice = totalPriceCalculated;

        const totalMinutesCalculated = guest.selectedServices.reduce(function (
          sum,
          service
        ) {
          return sum + service.serviceDuration;
        },
        0);

        groupBookingTotalDuration += totalMinutesCalculated;
        const totalPriceFormatted = "$ " + totalPriceCalculated.toFixed(2);
        const totalDurationFormatted = totalMinutesCalculated + " mins";

        const summaryItem = `<div class="accordion-item d-shaver-border-non-service">
                        <h2 class="accordion-header">
                            <button class="d-shaver-modal-btn accordion-button d-shaver-summary-header-btn" style="box-shadow: none !important; background-color: transparent !important; color: #000000 !important;" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-booking-items-group-${guestId}" aria-expanded="true" aria-controls="collapse-booking-items">
                                ${
                                  guestId === 0
                                    ? "Your Summary"
                                    : `Guest ${guestId}'s Summary`
                                }
                            </button>
                        </h2>
                        <div id="collapse-booking-items-group-${guestId}" class="accordion-collapse collapse show" data-bs-parent="#accordion-summary-group">
                            <div class="accordion-body">
                                <p class="d-shaver-paragraph mb-3 mb-md-4 fw-medium">Full Name: <span class="fw-normal">${
                                  fullName && formFilloutType !== "main only"
                                    ? fullName
                                    : guestId === 0
                                    ? fullName
                                    : "N/A"
                                }</span></p>
                                ${
                                  guestId === 0
                                    ? `
                                      <p class="d-shaver-paragraph mb-3 mb-md-4 fw-medium">Email Address: <span class="fw-normal">${
                                        contactNumber ? contactNumber : "N/A"
                                      }</span></p>
                                      <p class="d-shaver-paragraph mb-3 mb-md-4 fw-medium">Contact Number: <span class="fw-normal">${
                                        emailAddress ? emailAddress : "N/A"
                                      }</span></p>
                                      <p class="d-shaver-paragraph mb-3 mb-md-4 fw-medium">Date of Birth: <span class="fw-normal">${
                                        formattedDateOfBirth
                                          ? formattedDateOfBirth
                                          : "N/A"
                                      }</span></p>
                                      `
                                    : ""
                                }

                                <hr class="bg-black border-2 border-top border-black mb-3 mb-md-4" />

                                <div class="d-flex flex-column gap-3 gap-md-4">
                                    <div class="d-flex gap-2 align-items-center">
                                        <i class="fa-regular fa-clock d-shaver-booking-costing-icon"></i>
                                        <p class="d-shaver-paragraph">${formattedBookingDate}</p>
                                        <p class="d-shaver-paragraph">${selectedBookingTimeData}</p>
                                    </div>

                                    <div class="d-flex flex-column gap-2 gap-sm-3 gap-md-4">
                                    ${guest.selectedServices
                                      .map(function (service) {
                                        return `
                                        <div class="d-flex justify-content-between gap-2 gap-sm-3 gap-md-4">
                                          <div>
                                            <p class="fw-light d-shaver-paragraph">${service.serviceName}</p>
                                            <p class="fw-light d-shaver-paragraph"><span>${service.serviceDuration} mins</span><span> • </span><span>${service.serviceForWhom}</span></p>
                                          </div>
                                          <p class="fw-light d-shaver-paragraph">$<span>${service.servicePrice}</span></p>
                                        </div>
                                      `;
                                      })
                                      .join("")}
                                    </div>

                                    <hr class="bg-black border-2 border-top border-black my-0" />

                                    <div class="d-flex flex-column gap-2">
                                        <div class="d-flex justify-content-between">
                                            <p class="fw-semibold d-shaver-paragraph">Total Duration</p>
                                            <p class="fw-semibold d-shaver-paragraph">${totalDurationFormatted}</p>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <p class="fw-semibold d-shaver-paragraph">Total</p>
                                            <p class="fw-semibold d-shaver-paragraph">${totalPriceFormatted}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

        summaryGroupContainer.append(summaryItem);
      });

      summaryGroupContainer.append(`
            <div class="d-flex flex-column gap-2">
                <div class="d-flex justify-content-between">
                    <p class="fw-semibold d-shaver-paragraph">Group Total Duration</p>
                    <p class="fw-semibold d-shaver-paragraph">${groupBookingTotalDuration} mins</p>
                </div>
                <div class="d-flex justify-content-between">
                    <p class="fw-semibold d-shaver-paragraph">Group Total Price</p>
                    <p class="fw-semibold d-shaver-paragraph">$ ${groupBookingTotalPrice.toFixed(
                      2
                    )}</p>
                </div>
            </div>
        `);
    }

    /** Render Contact Number ITL Form */
    function renderContactNumberITLForm() {
      let inputGroup = document.querySelector("#contact-number-group");
      if (inputGroup && !inputGroup.classList.contains("iti")) {
        // Check if it’s not already initialized
        itiInstanceGroup = window.intlTelInput(inputGroup, {
          initialCountry: "nz",
          separateDialCode: true,
          preferredCountries: ["nz"],
          onlyCountries: ["nz"],
          allowDropdown: false,
          utilsScript:
            "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js",
        });
      } else if (!inputGroup) {
        console.error("Contact number input field not found");
      }
    }

    /** Render Guest Forms **/
    function renderGuestFormsGroup(guestIds) {
      const formContainer = $("#booking-info-form-group");
      formContainer.empty();

      const mainGuestForm = `
        <h5 class="d-shaver-h5 mb-2 mb-md-3 mb-lg-4">Your Details</h5>

        <div class="mb-3 mb-md-4">
          <label for="full-name-group" class="form-label d-shaver-paragraph fw-light">Full Name</label>
          <input type="text" class="form-control d-shaver-paragraph d-shaver-form-field" id="full-name-group" name="full-name-group" aria-describedby="textHelp" required>
        </div>

        <div class="mb-3 mb-md-4">
          <label for="email-address-group" class="form-label d-shaver-paragraph fw-light">Email Address</label>
          <input type="email" class="form-control d-shaver-paragraph d-shaver-form-field" id="email-address-group" name="email-address-group" aria-describedby="textHelp" required>
        </div>

        <div class="mb-3 mb-md-4 d-flex flex-column gap-1">
          <label for="contact-number-group" class="form-label d-shaver-paragraph fw-light">Contact Number (Optional)</label>
          <input type="tel" class="form-control d-shaver-paragraph d-shaver-form-field" id="contact-number-group" name="contact-number-group" aria-describedby="textHelp">
        </div>

        <div class="mb-3 mb-md-4">
          <label for="date-of-birth-group" class="form-label d-shaver-paragraph fw-light">Date Of Birth (Optional)</label>
          <input type="date" class="form-control d-shaver-paragraph d-shaver-form-field date-of-birth-input-booking" id="date-of-birth-group" name="date-of-birth-group" aria-describedby="textHelp">
        </div>
      `;

      let guestForms = ``;

      if (guestIds.length > 0) {
        guestForms = ``;

        guestIds.forEach((guestId) => {
          guestForms += `
            <div>
              <h5 class="d-shaver-h5 mb-2 mb-md-3 mb-lg-4">Guest ${guestId} Details</h5>
              <div class="mb-3 mb-md-4">
                <label for="full-name-group-${guestId}" class="form-label d-shaver-paragraph fw-light">Full Name</label>
                <input type="text" class="form-control d-shaver-paragraph d-shaver-form-field" id="full-name-group-${guestId}" name="full-name-group-${guestId}" aria-describedby="textHelp" required>
              </div>
            </div>
          `;
        });
      }

      const policy = `
        <div class="mb-3 mb-md-4 d-flex align-items-start">
          <input class="form-check-input d-shaver-paragraph me-2 me-lg-3" type="checkbox" value="" id="checkboxConsentGroup" required>
          <label class="form-check-label d-shaver-paragraph" for="checkboxConsentGroup">
          I have reviewed and agree to D'Shaver and Comb's <a class="link-offset-2 text-dark" target="_blank" href="<?= esc_url(home_url('/privacy-policy')); ?>">Privacy Policy</a>
          </label>
        </div>
      `;

      const groupBookingInfoForm = `
      ${mainGuestForm} 
      ${guestForms} 
      ${policy}
      `;

      formContainer.append(groupBookingInfoForm);
      renderContactNumberITLForm(); // rerenders the international telephone input
      restrictDatesForDateInput(); // restricts the date input - function declared in main.js as a global variable
    }

    /** Populate group booking form personal info **/
    function getMainGuestInfo(that) {
      const phoneInput = $("#contact-number-group");

      // Get values from the form inputs
      const formFullName = $(that)
        .find("input[name='full-name-group']")
        .val()
        .trim();
      const formContactNumber = itiInstanceGroup.getNumber();
      const formEmailAddress = $(that)
        .find("input[name='email-address-group']")
        .val()
        .trim();
      const formDateOfBirth = $(that)
        .find("input[name='date-of-birth-group']")
        .val()
        .trim();

      if (formContactNumber) {
        // If phone number is provided, check if it's valid
        if (!itiInstanceGroup.isValidNumber()) {
          showToast("Please enter a valid phone number.", "danger");
          $(phoneInput).addClass("is-invalid");
          return;
        }
      }

      // Proceed with valid inputs
      const fullName = formFullName;
      const contactNumber = formContactNumber.trim();
      const emailAddress = formEmailAddress;
      const dateOfBirth = formDateOfBirth;

      return { fullName, contactNumber, emailAddress, dateOfBirth };
    }

    /** Handle Booking Submit **/
    async function submitBookingGroup() {
      try {
        $("#book-btn-group").attr("disabled", true);
        $("#final-go-back-btn-group").attr("disabled", true);
        $("#final-go-back-btn-group").addClass("d-none");
        preventBookingModalClose = true;
        showBookingSubmissionSpinnerGroup();

        const currency = "nzd";

        const updatedGroupBookingItems = groupBookingData.map(function (guest) {
          const barber = guest.selectedBarber;
          const date = selectedBookingDate;
          const time = selectedBookingTime;
          const guestId = guest.guestId;
          const isMain = guest.isMain;
          const customer = guest.fullName;
          const mobileNumber = guest?.contactNumber || null;
          const emailAddress = guest?.emailAddress || null;
          const dateOfBirth = guest?.dateOfBirth || null;
          const totalPrice = guest.totalPrice;
          return {
            barber,
            date,
            time,
            guestId,
            isMain,
            customer,
            mobileNumber,
            emailAddress,
            dateOfBirth,
            totalPrice,
            services: guest.selectedServices.map(function (service) {
              return {
                serviceId: service.serviceId,
                serviceType: service.serviceType,
                serviceName: service.serviceName,
                serviceDuration: service.serviceDuration,
                serviceForWhom: service.serviceForWhom,
                servicePrice: service.servicePrice,
                servicePriceCurrency: currency,
              };
            }),
          };
        });

        console.log("updatedGroupBookingItems:", updatedGroupBookingItems);
        const groupId = crypto.randomUUID();

        const response = await fetch(dShaverApiGroupSettings.bookingApi, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": dShaverApiGroupSettings.nonce,
          },
          body: JSON.stringify({
            bookingType: bookingTypeSelection,
            formFilloutType: formFilloutType,
            groupId: groupId,
            bookingItems: updatedGroupBookingItems,
          }),
        });

        const data = await response.json();

        console.log(data);

        if (data.success) {
          showToast(data.message, "success");
          resetTrackedValuesGroup();

          if (data.data.bookingType === "group") {
            const bookingDetailsArray = data.data.bookingDetails;

            const pathName =
              `${dShaverApiGroupSettings.bookingSuccessfulURL}?` +
              `bookingType=${encodeURIComponent(data.data.bookingType)}&` +
              `formFilloutType=${encodeURIComponent(
                data.data.formFilloutType
              )}&` +
              `bookingDetails=${encodeURIComponent(
                JSON.stringify(bookingDetailsArray)
              )}`;
            window.location.href = pathName;
          }
        } else {
          showToast(data.message, "danger");
          hideBookingSubmissionSpinnerGroup();
          $("#final-go-back-btn-group").removeClass("d-none");
          $("#final-go-back-btn-group").attr("disabled", false);
          $("#book-btn-group").attr("disabled", false);
          preventBookingModalClose = false;

          // clear timeslots container
          const containerTimeSlots = $("#list-group-time-container-group");
          containerTimeSlots.empty();

          // close the modal
          $("#bookingInfoModalGroup").modal("hide");

          // Reset selected booking date and time
          selectedBookingDate = null;
          selectedBookingTime = null;

          // Reload calendar and unavailable dates
          await loadBookingCalendarGroup();
        }
      } catch (error) {
        console.log(error);
        showToast("Error submitting booking", "danger");
        const pathName = `${dShaverApiGroupSettings.bookingFailedURL}`;
        window.location.href = pathName;
      }
    }

    function showBookingSubmissionSpinnerGroup() {
      $("#book-btn-group").addClass("d-none");
      $("#booking-submission-spinner-group").removeClass("d-none");
    }

    function hideBookingSubmissionSpinnerGroup() {
      $("#book-btn-group").removeClass("d-none");
      $("#booking-submission-spinner-group").addClass("d-none");
    }

    function resetTrackedValuesGroup() {
      currentUser = null;
      groupBookingData = [];
      selectedBookingDate = null;
      selectedBookingTime = null;
      currentStep = 0;
    }
    /* END - FUNCTIONS */
  });
})(dShaverApiGroupSettings);
