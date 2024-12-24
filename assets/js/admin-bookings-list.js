/* START - VARIABLES */
var startDate = null;
var endDate = null;
/** END - VARIABLES **/

$(document).ready(async function () {
  /** START - TABLE FILTERING */
  // Custom filtering function which will search data in column four between two values
  DataTable.ext.search.push(function (settings, data, dataIndex) {
    let min = minDate.val();
    let max = maxDate.val();
    let date = new Date(data[3]);

    if (
      (min === null && max === null) ||
      (min === null && date <= max) ||
      (min <= date && max === null) ||
      (min <= date && date <= max)
    ) {
      return true;
    }
    return false;
  });

  // Create date inputs
  minDate = new DateTime("#min", {
    format: "MM/DD/YYYY",
  });
  maxDate = new DateTime("#max", {
    format: "MM/DD/YYYY",
  });

  // Refilter the table
  document.querySelectorAll("#min, #max").forEach((el) => {
    el.addEventListener("change", () =>
      $("#bookings-table").DataTable().columns.adjust().draw()
    );
  });
  /** END - TABLE FILTERING */

  // If the table is initialized, trigger the redraw for responsiveness
  if ($.fn.DataTable.isDataTable("#bookings-table")) {
    $("#bookings-table").DataTable().columns.adjust().draw();
  }

  $(window).on("resize", function () {
    if ($.fn.DataTable.isDataTable("#bookings-table")) {
      $("#bookings-table").DataTable().columns.adjust().draw();
    }
  });

  try {
    await initializeBookingsTable();
  } catch (error) {
    console.error("Initialization failed:", error);
    showToast("Failed to load bookings table", "danger");
  }
});

/** START - FUNCTIONS **/
async function initializeBookingsTable() {
  // Check if the DataTable has already been initialized
  if ($.fn.dataTable.isDataTable("#bookings-table")) {
    // If it is, destroy the existing DataTable instance
    $("#bookings-table").DataTable().destroy();
  }

  const bookings = await loadBookingData();

  if (bookings && Array.isArray(bookings)) {
    $("#bookings-table").DataTable({
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
      data: bookings,
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
          render: DataTable.render.datetime("MM/DD/YYYY"),
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

async function loadBookingData() {
  try {
    showSpinner();
    const response = await fetch(dShaverApiSettings.bookingsApi, {
      headers: {
        "X-WP-Nonce": dShaverApiSettings.nonce, // Include nonce for security
      },
    });

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      return data.data;
    } else {
      showToast("Error fetching booking data", "danger");
    }
  } catch (error) {
    console.error("Error fetching booking data:", error);
    showToast("Error fetching booking data", "danger");
  } finally {
    hideSpinner();
  }
}

async function updateServiceStatus(transactionId, selectedStatus) {
  try {
    showLoadingSaveServiceStatusSubmission();
    const response = await fetch(dShaverApiSettings.updateServiceStatusApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": dShaverApiSettings.nonce,
      },
      body: JSON.stringify({
        transaction_id: transactionId,
        service_status: selectedStatus,
      }),
    });

    const result = await response.json();
    if (result.success) {
      await initializeBookingsTable();
    } else {
      showToast("Error updating service status", "danger");
    }
  } catch (error) {
    showToast("Error updating service status", "danger");
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

/** END - FUNCTIONS **/
