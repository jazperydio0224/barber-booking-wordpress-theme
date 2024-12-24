$(document).ready(function () {
  let isRequestInProgress = false;
  let notificationsData = [];

  fetchInitialNotifications();

  // Poll for new notifications every 10 seconds
  setInterval(fetchNotifications, 10000);

  /** START - FUNCTIONS **/
  // check if user is on the notifications page
  function isOnNotificationsPage() {
    return window.location.pathname === "/admin-dashboard/notifications-list/";
  }

  // for the first ajax call only
  async function fetchInitialNotifications() {
    // Show the spinner before making the AJAX call
    showSpinner();
    try {
      await ajaxGetNotifications();
      initializeNotificationsTable();

      if (isOnNotificationsPage()) {
        await markNotificationsAsRead();
      }
    } catch (error) {
      console.error("Error in fetching notifications:", error);
    } finally {
      hideSpinner();
    }
  }

  async function fetchNotifications() {
    try {
      await ajaxGetNotifications();
      initializeNotificationsTable();

      if (isOnNotificationsPage()) {
        await markNotificationsAsRead();
      }
    } catch (error) {
      console.error("Error in fetching  notifications:", error);
    }
  }

  function ajaxGetNotifications() {
    return new Promise((resolve, reject) => {
      if (isRequestInProgress) {
        return; // Prevent overlapping requests
      }
      isRequestInProgress = true; // Set flag to prevent multiple calls

      jQuery.ajax({
        url: dShaverApiSettings.ajax_url,
        method: "POST",
        data: {
          action: "get_admin_notifications",
          _ajax_nonce: dShaverApiSettings.nonce,
        },
        success: function (response) {
          if (response.success && response.data) {
            if (response.data.unread_count > 0) {
              showNotificationCount(response.data.unread_count);
            }
            notificationsData = response.data.notifications;
            resolve();
          } else {
            hideNotificationCount();
            reject(new Error("No notifications found"));
          }
        },
        error: function (error) {
          console.error("Error fetching notifications:", error);
          reject(error);
        },
        complete: function () {
          isRequestInProgress = false;
        },
      });
    });
  }

  function showNotificationCount(notificationCount) {
    $("#notification-count").text(notificationCount).removeClass("d-none");
  }

  function hideNotificationCount() {
    $("#notification-count").text("").addClass("d-none");
  }

  function markNotificationsAsRead() {
    return new Promise((resolve, reject) => {
      jQuery.ajax({
        url: dShaverApiSettings.ajax_url,
        method: "POST",
        data: {
          action: "mark_notifications_as_read",
          _ajax_nonce: dShaverApiSettings.nonce,
        },
        success: function (response) {
          if (response.success) {
            resolve();
          }
        },
        error: function (error) {
          console.error("Error marking notifications as read:", error);
          reject(error);
        },
      });
    });
  }

  function initializeNotificationsTable() {
    if (typeof $.fn.dataTable === "undefined") {
      console.warn("DataTables plugin is not loaded.");
      return;
    }

    if (notificationsData.length > 0 && Array.isArray(notificationsData)) {
      // Check if the DataTable has already been initialized
      if ($.fn.dataTable.isDataTable("#notifications-table")) {
        // If it is, destroy the existing DataTable instance
        $("#notifications-table").DataTable().destroy();
      }

      $("#notifications-table").DataTable({
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
        data: notificationsData,
        columns: [
          { data: "booking_reference_number", title: "Ref No." },
          { data: "client_fullname", title: "Client" },
          { data: "appointment_date", title: "Appointment Date" },
          { data: "appointment_time", title: "Appointment Time" },
        ],
        columnDefs: [
          {
            targets: 2,
            render: DataTable.render.datetime("MM/DD/YYYY"),
          },
          {
            targets: 3,
            render: function (data, type, row) {
              if (type === "display" || type === "filter") {
                const time = moment(data, "HH:mm:ss"); // Parse the time
                return time.format("h:mm A"); // Format to 12-hour time with AM/PM
              }
              return data; // For other types (like 'sort'), return original data
            },
          },
        ],
        rowCallback: function (row, data) {
          $(row)
            .find("td")
            .each(function () {
              $(this).addClass("text-center");
            });

          if (data.read === "0") {
            $(row).addClass("text-white bg-secondary");
            $(row)
              .find("td")
              .each(function () {
                $(this).addClass("text-white bg-secondary");
              });
          }
        },
        order: [[0, "desc"]],
      });
    }
  }
  /** END - FUNCTIONS **/
});
