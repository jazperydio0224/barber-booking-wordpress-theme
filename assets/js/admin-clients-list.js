/* START - VARIABLES */
// client upload variables
var clientID = null;
var clientName = null;
var clientHaircutImages = null;

// client images delete
var deleteImgClientID = null;
var deleteImgID = null;

// client booking history
var bookingHistoryClientId = null;
var bookingHistoryClientName = null;
var bookingHistoryClientDOB = null;
var bookingHistoryClientEmail = null;
var bookingHistoryClientMobileNumber = null;
var bookingHistoryClientLastHaircut = null;

/** END - VARIABLES **/

$(document).ready(async function () {
  /* START - RESTRICT DATES FOR DATE INPUT */
  restrictDatesForDateInput();
  /* END - RESTRICT DATES FOR DATE INPUT */

  /* START - INTERNATIONAL TELEPHONE INPUT */
  // Wait until the modal is shown before initializing intl-tel-input
  $("#add-new-client-modal").on("shown.bs.modal", function () {
    var input = document.querySelector("#client-contact-number");
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
  $("#add-new-client-modal").on("hidden.bs.modal", function () {
    if (itiInstance) {
      itiInstance.destroy(); // Destroy the intlTelInput instance
      itiInstance = null;
    }
  });
  /* END - INTERNATIONAL TELEPHONE INPUT */

  // If the table is initialized, trigger the redraw for responsiveness
  if ($.fn.DataTable.isDataTable("#clients-list-table")) {
    $("#clients-list-table").DataTable().columns.adjust().draw();
  }

  $(window).on("resize", function () {
    if ($.fn.DataTable.isDataTable("#clients-list-table")) {
      $("#clients-list-table").DataTable().columns.adjust().draw();
    }
  });

  try {
    await initializeClientsListTable();
  } catch (error) {
    console.error("Initialization failed:", error);
    showToast("Failed to load bookings table", "danger");
  }

  // Add click event listener to upload button - show file input modal (Delegated)
  $(document).on("click", ".upload-additional-images-btn", function () {
    var uploadButton = $(this);

    $("#client-id-upload-update").val(uploadButton.attr("data-id"));
    clientID = uploadButton.attr("data-id");
    $("#client-name-upload").val(uploadButton.attr("data-fullname"));
    clientName = uploadButton.attr("data-fullname");

    $("#client-update-images-modal").modal("show");
  });

  // Listen to the form submission of upload images (Delegated)
  $(document).on("submit", ".uploadClientHaircutForm", async function (event) {
    event.preventDefault();
    event.stopPropagation();

    clientHaircutImages = document.getElementById("haircut-images-upload");
    await uploadClientHaircutImages(clientID, clientName, clientHaircutImages);

    // Hide the update images modal if open
    const updateImagesModal = document.getElementById(
      "client-update-images-modal"
    );
    if (updateImagesModal) {
      const bsUpdateImagesModal =
        bootstrap.Modal.getInstance(updateImagesModal);
      if (bsUpdateImagesModal) {
        bsUpdateImagesModal.hide();
      }
    }

    // Hide the dynamically generated modal
    const galleryModal = document.querySelector(`#gallery-${clientID}`);
    if (galleryModal) {
      const bsModal = bootstrap.Modal.getInstance(galleryModal);
      if (bsModal) {
        bsModal.hide();
      }
    }

    resetClientUploadImagesVariables();
    await initializeClientsListTable();
  });

  // Event delegation for delete image button
  $(document).on("click", ".delete-image-btn", function () {
    deleteImgClientID = $(this).data("client-id");
    deleteImgID = $(this).data("image-id");
    $("#client-image-delete-modal").modal("show");
  });

  // Event delegation for delete confirmation button
  $(document).on("click", "#deleteClientImageBtn", async function () {
    await deleteClientImage(deleteImgClientID, deleteImgID);

    $("#client-image-delete-modal").modal("hide");

    // Hide the dynamically generated modal
    const galleryModal = document.querySelector(
      `#gallery-${deleteImgClientID}`
    );
    if (galleryModal) {
      const bsModal = bootstrap.Modal.getInstance(galleryModal);
      if (bsModal) {
        bsModal.hide();
      }
    }

    resetDeleteClientImagesVariables();
    await initializeClientsListTable();
  });

  // Event delegation for client booking history
  $(document).on("click", ".client-booking-history-btn", async function () {
    // Retrieve client details from the data attr of the button
    bookingHistoryClientId = $(this).data("client-id");
    bookingHistoryClientName = $(this).data("client-fullname");
    bookingHistoryClientDOB =
      $(this).data("date-of-birth") === "0000-00-00"
        ? ""
        : $(this).data("date-of-birth");
    bookingHistoryClientEmail = $(this).data("email-address");
    bookingHistoryClientMobileNumber = $(this).data("mobile-number");
    bookingHistoryClientLastHaircut = $(this).data("last-haircut");

    // Update the client booking history modal field values
    $("#client-history-id").val(bookingHistoryClientId);
    $("#client-history-name").val(bookingHistoryClientName);
    $("#client-history-date-of-birth").val(bookingHistoryClientDOB);
    $("#client-history-email-address").val(bookingHistoryClientEmail);
    $("#client-history-mobile-number").val(bookingHistoryClientMobileNumber);
    $("#client-history-last-haircut").val(bookingHistoryClientLastHaircut);

    const clientBookingHistory = await getClientBookingHistory(
      bookingHistoryClientId
    );

    // initialize the client notes list
    const clientNotesList = $("#client-notes-list");
    clientNotesList.empty();

    const sortedBookingHistoryData = clientBookingHistory.sort((a, b) => {
      const dateA = new Date(a.appointment_date + " " + a.appointment_time);
      const dateB = new Date(b.appointment_date + " " + b.appointment_time);
      return dateB - dateA; // Sort descending
    });

    sortedBookingHistoryData.forEach((item) => {
      const formattedDate = new Date(
        item.appointment_date + " " + item.appointment_time
      ).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });

      const cardHtml = `
              <div class="card">
                  <div class="card-header text-muted">
                      <small>${formattedDate}</small>
                  </div>
                  <div class="card-body">
                      <p class="card-text">${
                        item.notes || "No notes available"
                      }</p>
                  </div>
              </div>
          `;

      clientNotesList.append(cardHtml);
    });

    await initializeClientBookingHistoryTable(clientBookingHistory);

    $(".client-booking-history-modal-title").text(
      `Client History - ${bookingHistoryClientName}`
    );

    $("#client-bookings-history-modal").modal("show");
  });

  // Listen for when the modal is fully closed
  $("#client-bookings-history-modal").on("hidden.bs.modal", function () {
    resetClientBookingHistoryVariables();
  });

  // Event delegation for add new client
  $(document).on("click", "#add-new-client-btn", async function () {
    const haircuts = await getHaircuts();

    // Select the haircut dropdown
    const haircutSelect = $("#client-haircut-select");

    // Check if the API returns valid haircuts data
    if (haircuts && Array.isArray(haircuts)) {
      haircuts.forEach(function (haircut) {
        // Assuming each 'haircut' object has 'id' and 'name' properties
        const option = `<option value="${haircut.id}">${haircut.title}</option>`;
        haircutSelect.append(option);
      });
    } else {
      // Handle the case when no data is returned or there's an error
      $("#error-message").text(
        "Unable to load haircut options. Please try again later."
      );
    }

    $("#add-new-client-modal").modal("show");
  });

  $(document).on("submit", ".add-new-client-form", async function (event) {
    event.preventDefault();
    event.stopPropagation();

    const clientName = $(this).find('[name="client-full-name"]').val();

    const formContactNumber = itiInstance.getNumber();
    const clientContactNumber = formContactNumber.trim();
    const clientEmail = $(this).find('[name="client-email-address"]').val();
    const clientDateOfBirth = $(this)
      .find('[name="client-date-of-birth"]')
      .val();
    const clientHaircut = $(this).find("#client-haircut-select").val();
    const clientHaircutImages = document.getElementById(
      "client-new-haircut-images-upload"
    );

    await addNewClient(
      clientName,
      clientContactNumber,
      clientEmail,
      clientDateOfBirth,
      clientHaircut,
      clientHaircutImages
    );

    $("#add-new-client-modal").modal("hide");
    await initializeClientsListTable();
  });

  /** START - FORM VALIDATION **/
  const forms = document.querySelectorAll(".add-new-client-form");

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
});

/** START - FUNCTIONS **/
async function initializeClientsListTable() {
  // Check if the DataTable has already been initialized
  if ($.fn.dataTable.isDataTable("#clients-list-table")) {
    // If it is, destroy the existing DataTable instance
    $("#clients-list-table").DataTable().destroy();
  }

  const clientsList = await loadClientsListData();

  if (clientsList && Array.isArray(clientsList)) {
    $("#clients-list-table").DataTable({
      dom:
        "<'row mb-3'<'col-12 col-sm-6'B>>" + // Buttons: margin-bottom added
        "<'row mb-3'<'col-12 col-sm-6'l><'col-12 col-sm-6'f>>" + // Length menu and search box: margin-bottom added
        "<'row mb-3'<'col-12' tr>>" + // Table: margin-bottom added
        "<'row mb-3'<'col-12 col-sm-6'i><'col-12 col-sm-6 d-flex justify-content-end'p>>", // Info and pagination: margin-bottom added
      buttons: [
        {
          extend: "excel",
          text: "Export to Excel",
          exportOptions: {
            format: {
              body: function (data, row, column, node) {
                // If the column contains your <ol> list, extract and format the services
                if ($(node).find("ol").length) {
                  // Extract each <li> from the <ol> and join with newlines
                  return $(node)
                    .find("li")
                    .map(function () {
                      return $(this).text();
                    })
                    .get()
                    .join("\n"); // Join items with newline
                }

                // For booking_service_status (styled with a <span> tag), return just the text
                if ($(node).find("span").length) {
                  return $(node).find("span").text();
                }

                // For transaction_id (styled with a <p> tag), return just the text
                if ($(node).find("p").length) {
                  return $(node).find("p").text();
                }

                return data; // Return other data as is
              },
            },
          },
        },
        "colvis",
      ],
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      responsive: true,
      data: clientsList,
      columns: [
        { data: "client_id", title: "Client ID" },
        { data: "full_name", title: "Full Name" },
        { data: "date_of_birth", title: "DOB" },
        { data: "email_address", title: "Email Address" },
        { data: "mobile_number", title: "Mobile Number" },
        { data: "last_haircut", title: "Last Haircut" },
        {
          data: "images",
          title: "Images",
          render: function (data, type, row) {
            // Check if data is an array
            if (Array.isArray(data) && data.length > 0) {
              const galleryId = `gallery-${row.client_id}`;
              const buttonHtml = `
                  <button type="button" class="btn dark-btn btn-sm" data-bs-toggle="modal" data-bs-target="#${galleryId}">
                    <i class="fa-solid fa-images"></i> View Images
                  </button>
                  <div id="${galleryId}" class="modal fade client-gallery-modal" tabindex="-1">
                    <div class="modal-dialog modal-dialog-centered modal-xl">
                      <div class="modal-content">
                        <div class="modal-header border-0">
                          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                          <div class="container">
                            <h3 class="modal-title fw-bold mb-3 text-center">Haircut Gallery - ${
                              row.full_name
                            }</h3>
                            <div class="row row-gap-4">
                              ${data
                                .map(
                                  (imageObject) =>
                                    `<div class="col-md-4">
                                      <div class="image-thumbnail-container position-relative">
                                        <a href="${imageObject?.url}" data-lightbox="${galleryId}">
                                          <img src="${imageObject?.url}" class="img-fluid img-thumbnail" alt="haircut image">
                                        </a>
                                        <button class="btn btn-danger btn-sm delete-image-btn position-absolute" style="top: 12px; right: 12px;" data-image-id="${imageObject?.id}" data-client-id="${row.client_id}">
                                          <i class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                    </div>`
                                )
                                .join("")}
                            </div>
                          </div>
                        </div>
                        <div class="modal-footer border-0">
                          <button type="button" class="w-100 btn dark-btn upload-additional-images-btn" 
                            data-id="${row.client_id}" 
                            data-fullname="${row.full_name}">
                              <i class="fa-solid fa-upload"></i> Upload</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>`;
              return buttonHtml;
            }
            return `<div class="d-flex flex-column gap-2">
                    <span>No Images</span>
                    <button type="button" class="btn dark-btn btn-sm upload-additional-images-btn" data-id="${row.client_id}" data-fullname="${row.full_name}"><i class="fa-solid fa-upload"></i> Upload</button>
                    </div>`; // Return a placeholder if no images
          },
        },
        {
          data: null,
          title: "Actions",
          render: function (data, type, row) {
            return `<button class="btn dark-btn btn-sm client-booking-history-btn" data-client-id="${row.client_id}" data-client-fullname="${row.full_name}" data-date-of-birth="${row.date_of_birth}" data-email-address="${row.email_address}" data-mobile-number="${row.mobile_number}" data-last-haircut="${row.last_haircut}"><i class="fa-solid fa-circle-info"></i> Client History</button>`;
          },
        },
      ],
      columnDefs: [
        {
          targets: 2, // your date column
          render: function (data, type, row) {
            if (data === "0000-00-00" || !data) {
              return "Not set"; // return a blank string for invalid dates
            } else {
              // format the valid date
              return moment(data).format("MMM DD YYYY"); // using moment.js for formatting
            }
          },
        },
        {
          targets: 4,
          render: function (data, type, row) {
            if (!data) {
              return "Not set";
            } else {
              return data;
            }
          },
        },
      ],
      order: [[0, "desc"]],
    });
  }
}

async function loadClientsListData() {
  try {
    showSpinner();
    const response = await fetch(dShaverApiSettings.clientsListApi, {
      method: "GET",
      headers: {
        "X-WP-Nonce": dShaverApiSettings.nonce, // Include nonce for security
      },
    });

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      return data.data;
    } else {
      showToast("Error fetching clients list data", "danger");
    }
  } catch (error) {
    console.error("Error fetching clients list data:", error);
    showToast("Error fetching clients list data", "danger");
  } finally {
    hideSpinner();
  }
}

// handle upload client images
async function uploadClientHaircutImages(
  clientID,
  clientName,
  clientHaircutImages
) {
  try {
    showLoadingUploadClientImages();

    if (!clientID || !clientName) {
      showToast("Please select atleast 1 image", "danger");
      return;
    }

    const formData = new FormData();
    formData.append("client_id", clientID);
    formData.append("client_name", clientName);

    if (clientHaircutImages && clientHaircutImages.files.length > 0) {
      for (let i = 0; i < clientHaircutImages.files.length; i++) {
        formData.append("haircut_images[]", clientHaircutImages.files[i]);
      }
    }

    const response = await fetch(dShaverApiSettings.updateClientImagesApi, {
      method: "POST",
      headers: {
        "X-WP-Nonce": dShaverApiSettings.nonce,
      },
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
    } else {
      showToast(result?.message, "danger");
    }
  } catch (error) {
    console.error("Error uploading images: ", error);
    showToast("Error uploading images", "danger");
  } finally {
    hideLoadingUploadClientImages();
  }
}

function resetClientUploadImagesVariables() {
  clientID = null;
  clientName = null;
  clientHaircutImages = null;
}

function showLoadingUploadClientImages() {
  const clientImagesUploadBtn = document.getElementById("saveClientImagesBtn");
  clientImagesUploadBtn.classList.add("d-none");

  const saveClientImagesSpinner = document.getElementById(
    "saveClientImagesSpinner"
  );
  saveClientImagesSpinner.classList.remove("d-none");
}

function hideLoadingUploadClientImages() {
  const clientImagesUploadBtn = document.getElementById("saveClientImagesBtn");
  clientImagesUploadBtn.classList.remove("d-none");

  const saveClientImagesSpinner = document.getElementById(
    "saveClientImagesSpinner"
  );
  saveClientImagesSpinner.classList.add("d-none");
}

async function deleteClientImage(deleteClientImageID, deleteImgID) {
  try {
    showLoadingDeleteClientImage();
    const response = await fetch(dShaverApiSettings.deleteClientImageApi, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": dShaverApiSettings.nonce,
      },
      body: JSON.stringify({
        client_id: deleteClientImageID,
        image_id: deleteImgID,
      }),
    });
    const result = await response.json();
    if (result.success) {
    } else {
      showToast(result?.message, "danger");
    }
  } catch (error) {
    console.error("Error deleting image: ", error);
    showToast("Error deleting image", "danger");
  } finally {
    hideLoadingDeleteClientImage();
  }
}

function resetDeleteClientImagesVariables() {
  deleteClientImageID = null;
  deleteImgID = null;
}

function showLoadingDeleteClientImage() {
  const deleteClientImageBtn = document.getElementById("deleteClientImageBtn");
  deleteClientImageBtn.classList.add("d-none");

  const deleteClientImageSpinner = document.getElementById(
    "deleteClientImageSpinner"
  );
  deleteClientImageSpinner.classList.remove("d-none");

  const cancelDeleteClientImageBtn = document.getElementById(
    "cancelDeleteClientImageBtn"
  );
  cancelDeleteClientImageBtn.classList.add("d-none");
}

function hideLoadingDeleteClientImage() {
  const deleteClientImageBtn = document.getElementById("deleteClientImageBtn");
  deleteClientImageBtn.classList.remove("d-none");

  const deleteClientImageSpinner = document.getElementById(
    "deleteClientImageSpinner"
  );
  deleteClientImageSpinner.classList.add("d-none");

  const cancelDeleteClientImageBtn = document.getElementById(
    "cancelDeleteClientImageBtn"
  );
  cancelDeleteClientImageBtn.classList.remove("d-none");
}

async function getClientBookingHistory(bookingHistoryClientId) {
  try {
    showSpinner();
    const url = new URL(dShaverApiSettings.clientBookingHistoryApi);
    url.searchParams.append("client_id", bookingHistoryClientId); // Append query parameter

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-WP-Nonce": dShaverApiSettings.nonce,
      },
    });
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      showToast(result?.message, "danger");
    }
  } catch (error) {
    console.error("Error fetching booking history: ", error);
    showToast("Error fetching booking history", "danger");
  } finally {
    hideSpinner();
  }
}

function resetClientBookingHistoryVariables() {
  bookingHistoryClientId = null;
  bookingHistoryClientName = null;
  bookingHistoryClientDOB = null;
  bookingHistoryClientEmail = null;
  bookingHistoryClientMobileNumber = null;
  bookingHistoryClientLastHaircut = null;
}

async function initializeClientBookingHistoryTable(clientBookingHistory) {
  // Check if the DataTable has already been initialized
  if ($.fn.dataTable.isDataTable("#client-booking-history-table")) {
    // If it is, destroy the existing DataTable instance
    $("#client-booking-history-table").DataTable().destroy();
  }

  if (clientBookingHistory && Array.isArray(clientBookingHistory)) {
    $("#client-booking-history-table").DataTable({
      dom:
        "<'row mb-3'<'col-12 col-sm-6'B>>" + // Buttons: margin-bottom added
        "<'row mb-3'<'col-12 col-sm-6'l><'col-12 col-sm-6'f>>" + // Length menu and search box: margin-bottom added
        "<'row mb-3'<'col-12' tr>>" + // Table: margin-bottom added
        "<'row mb-3'<'col-12 col-sm-6'i><'col-12 col-sm-6 d-flex justify-content-end'p>>", // Info and pagination: margin-bottom added
      buttons: [
        {
          extend: "excel",
          text: "Export to Excel",
          exportOptions: {
            format: {
              body: function (data, row, column, node) {
                // If the column contains your <ol> list, extract and format the services
                if ($(node).find("ol").length) {
                  // Extract each <li> from the <ol> and join with newlines
                  return $(node)
                    .find("li")
                    .map(function () {
                      return $(this).text();
                    })
                    .get()
                    .join("\n"); // Join items with newline
                }

                // For booking_service_status (styled with a <span> tag), return just the text
                if ($(node).find("span").length) {
                  return $(node).find("span").text();
                }

                // For transaction_id (styled with a <p> tag), return just the text
                if ($(node).find("p").length) {
                  return $(node).find("p").text();
                }

                return data; // Return other data as is
              },
            },
          },
        },
        "colvis",
      ],
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      responsive: true,
      data: clientBookingHistory,
      columns: [
        { data: "reference_number", title: "Ref No." },
        { data: "client_name", title: "Client" },
        {
          data: "services",
          title: "Services",
          render: function (data, type, row) {
            // Check if data is an array
            if (Array.isArray(data) && data.length > 0) {
              const formattedServices = `
                  <ol class="list-group list-group-numbered gap-2">
                      ${data
                        .map(
                          (service) =>
                            `<li class="list-group-item">${service?.service_name}</li>`
                        )
                        .join("")}
                  </ol>`;
              return formattedServices;
            }
            return "<span>No Services</span>"; // Return a placeholder if no services
          },
        },
        { data: "appointment_date", title: "Appointment Date" },
        { data: "appointment_time", title: "Appointment Time" },
        {
          data: "booking_service_status",
          title: "Status",
          render: function (data, type, row) {
            let styledBookingServiceStatus;
            const bookingServiceStatus = data.toLowerCase();
            const referenceNumber = row.reference_number;

            if (bookingServiceStatus === "pending") {
              styledBookingServiceStatus = `
                    <h5 class="mb-2"><span class="badge bg-warning text-dark text-uppercase">${bookingServiceStatus}</span></h5>`;
            } else if (bookingServiceStatus === "completed") {
              styledBookingServiceStatus = `
                    <h5 class="mb-2"><span class="badge bg-success text-uppercase">${bookingServiceStatus}</span></h5>`;
            } else if (bookingServiceStatus === "no show") {
              styledBookingServiceStatus = `
                    <h5 class="mb-2"><span class="badge text-uppercase" style="background-color: #ff5722 !important">${bookingServiceStatus}</span></h5>`;
            } else if (bookingServiceStatus === "cancelled") {
              styledBookingServiceStatus = `
                    <h5 class="mb-2"><span class="badge bg-danger text-uppercase">${bookingServiceStatus}</span></h5>`;
            }

            return styledBookingServiceStatus;
          },
        },
        {
          data: "total_amount",
          title: "Total Amount",
          render: function (data) {
            return `<p class="text-center">$${data}</p>`;
          },
        },
        // { data: "total_amount_currency", title: "Currency" },
        {
          data: "notes",
          title: "Notes",
          render: function (data) {
            return `<p class="text-center">${data}</p>`;
          },
        },
      ],
      columnDefs: [
        {
          targets: 3,
          render: DataTable.render.datetime("MMM DD YYYY"),
        },
        {
          targets: 4,
          render: function (data, type, row) {
            if (type === "display" || type === "filter") {
              const time = moment(data, "HH:mm:ss"); // Parse the time
              return time.format("h:mm A"); // Format to 12-hour time with AM/PM
            }
            return data; // For other types (like 'sort'), return original data
          },
        },
      ],
      order: [[0, "desc"]],
    });
  }
}

async function getHaircuts() {
  try {
    showSpinner();
    const url = new URL(dShaverApiSettings.clientHaircutsApi);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-WP-Nonce": dShaverApiSettings.nonce,
      },
    });
    const result = await response.json();
    if (result.success) {
      return result.data;
    } else {
      showToast(result?.message, "danger");
    }
  } catch (error) {
    console.error("Error fetching client haircuts: ", error);
    showToast("Error fetching client haircuts", "danger");
  } finally {
    hideSpinner();
  }
}

async function addNewClient(
  clientName,
  clientContactNumber,
  clientEmail,
  clientDateOfBirth,
  clientHaircut,
  clientHaircutImages
) {
  try {
    showSpinner();
    toggleSubmitButtonAndSpinner();
    toggleAddNewClientFormFields();

    const url = new URL(dShaverApiSettings.addNewClientApi);

    const formData = new FormData();
    formData.append("client_name", clientName);
    formData.append("client_contact_number", clientContactNumber);
    formData.append("client_email", clientEmail);
    formData.append("client_date_of_birth", clientDateOfBirth);
    formData.append("client_haircut", clientHaircut);

    if (clientHaircutImages && clientHaircutImages.files.length > 0) {
      for (let i = 0; i < clientHaircutImages.files.length; i++) {
        formData.append(
          "client_haircut_images[]",
          clientHaircutImages.files[i]
        );
      }
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      body: formData,
      headers: {
        "X-WP-Nonce": dShaverApiSettings.nonce,
      },
    });
    const result = await response.json();
    if (result.success) {
      resetAddNewClientForm();
      return result.data;
    } else {
      showToast(result?.message, "danger");
    }
  } catch (error) {
    console.error("Error adding new client: ", error);
    showToast("Error adding new client", "danger");
  } finally {
    toggleAddNewClientFormFields();
    toggleSubmitButtonAndSpinner();
    hideSpinner();
  }
}

function toggleAddNewClientFormFields() {
  $("#client-full-name").prop("disabled", function (_, val) {
    return !val;
  });
  $("#client-contact-number").prop("disabled", function (_, val) {
    return !val;
  });
  $("#client-email-address").prop("disabled", function (_, val) {
    return !val;
  });
  $("#client-date-of-birth").prop("disabled", function (_, val) {
    return !val;
  });
  $("#client-haircut-select").prop("disabled", function (_, val) {
    return !val;
  });
  $("#client-new-haircut-images-upload").prop("disabled", function (_, val) {
    return !val;
  });
}
function toggleSubmitButtonAndSpinner() {
  $("#add-new-client-form-submit-btn").toggleClass("d-none");
  $("#add-new-client-form-submit-spinner").toggleClass("d-none");
}

function resetAddNewClientForm() {
  $("#client-full-name").val("");
  $("#client-contact-number").val("");
  $("#client-email-address").val("");
  $("#client-date-of-birth").val("");
  $("#client-haircut-select").val("");
  $("#client-new-haircut-images-upload").val("");
}

// function to restrict dates from the booking dob input
function restrictDatesForDateInput() {
  // Get today's date
  const today = new Date();

  // Calculate the maximum date (3 years ago from today)
  const maxDate = new Date(today);
  maxDate.setFullYear(maxDate.getFullYear() - 3); // Set to 3 years ago

  // Format the maximum date to YYYY-MM-DD
  const maxDateString = maxDate.toISOString().split("T")[0];

  // Set the max attribute for the date input
  const dateInput = document.getElementById("client-date-of-birth");
  dateInput.setAttribute("max", maxDateString);
}
/** END - FUNCTIONS **/
