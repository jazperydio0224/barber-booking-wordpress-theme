<?php
// Theme Support - to dynamically load page titles
function dshaver_theme_support()
{
	// Adds dynamic title tag support
	add_theme_support('title-tag');
	// Custom header logo
	add_theme_support('custom-logo');
	// Allow post thumbnails
	add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'dshaver_theme_support');


// Custom Menus
function dshaver_menus()
{
	$locations = array(
		'primary' => 'Desktop Primary',
		'footer'  => 'Footer Menu Items',
	);

	register_nav_menus($locations);
}
add_action('init', 'dshaver_menus');

// Header style links
function dshaver_register_styles()
{
	wp_enqueue_style('dshaver-google-fonts', 'https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap', array());
	wp_enqueue_style('dshaver-style', get_template_directory_uri() . '/style.css', array('dshaver-bootstrap'), wp_get_theme()->get('Version'), 'all');
	wp_enqueue_style('dshaver-bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css', '5.3.3', 'all');
	wp_enqueue_style('dshaver-fontawesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css', array(), '6.6.0', 'all');
	wp_enqueue_style('dshaver-vanilla-calendar', 'https://cdn.jsdelivr.net/npm/vanilla-calendar-pro/build/vanilla-calendar.min.css', array(), null, 'all');
	wp_enqueue_style('dshaver-international-telephone-input', 'https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/css/intlTelInput.css', array(), '24.5.0', 'all');
	wp_enqueue_style('dshaver-data-table-bootstrap-style', 'https://cdn.datatables.net/2.1.7/css/dataTables.bootstrap5.css', array('dshaver-bootstrap'), '2.1.7', 'all');
	wp_enqueue_style('dshaver-data-table-responsive-bootstrap-style', 'https://cdn.datatables.net/responsive/3.0.3/css/responsive.bootstrap5.css', array('dshaver-data-table-bootstrap-style'), '3.0.3', 'all');
	wp_enqueue_style('dshaver-data-table-buttons-bootstrap-style', 'https://cdn.datatables.net/buttons/3.1.2/css/buttons.bootstrap5.css', array('dshaver-data-table-responsive-bootstrap-style'), '3.1.2', 'all');
	wp_enqueue_style('dshaver-lightbox-gallery-style', 'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.5/css/lightbox.css', array(), '2.11.5', 'all');
	wp_enqueue_style('dshaver-data-table-datetime', 'https://cdn.datatables.net/datetime/1.5.4/css/dataTables.dateTime.min.css', array('dshaver-data-table-bootstrap-style'), '1.5.4', 'all');
}
add_action('wp_enqueue_scripts', 'dshaver_register_styles');

// Footer js links
function dshaver_register_scripts()
{
	wp_enqueue_script('dshaver-bootstrap-script', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js', array(), '5.3.3', true);
	wp_enqueue_script('dshaver-jquery', 'https://code.jquery.com/jquery-3.7.1.min.js', array(), '3.7.1', true);
	wp_enqueue_script('dshaver-main-script', get_template_directory_uri() . '/assets/js/main.js', array('dshaver-bootstrap-script', 'dshaver-jquery'), wp_get_theme()->get('Version'), true);
	wp_enqueue_script('dshaver-international-telephone-input-script', "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/intlTelInput.min.js", array(), '24.5.0', true);
	wp_enqueue_script('dshaver-data-table-moment-script', 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.2/moment.min.js', array(), '2.29.2', true);
	wp_enqueue_script('dshaver-data-table-datetime-script', 'https://cdn.datatables.net/datetime/1.5.4/js/dataTables.dateTime.min.js', array(), '1.5.4', true);
	// vanilla - calendar
	wp_enqueue_script('dshaver-vanilla-calendar-script', 'https://cdn.jsdelivr.net/npm/vanilla-calendar-pro/build/vanilla-calendar.min.js', array(), null, true);

	if (is_page('booking')) {
		$api_settings = array(
			'unavailableDatesApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/unavailable-dates')),
			'availableTimesApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/available-times')),
			'bookingApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/add-new-booking')),
			'bookingSuccessfulURL' => home_url('/booking-successful'),
			'bookingFailedURL' => home_url('/booking-failed'),
			'nonce' => wp_create_nonce('wp_rest') // Create a nonce for REST API security
		);

		// custom booking script
		wp_enqueue_script('dshaver-booking-script', get_template_directory_uri() . '/assets/js/booking.js', array('dshaver-main-script', 'dshaver-vanilla-calendar-script'), wp_get_theme()->get('Version'), true);
		wp_enqueue_script('dshaver-booking-group-script', get_template_directory_uri() . '/assets/js/booking-group.js', array('dshaver-booking-script'), wp_get_theme()->get('Version'), true);

		wp_localize_script('dshaver-booking-script', 'dShaverApiSettings', $api_settings);
		wp_localize_script('dshaver-booking-group-script', 'dShaverApiGroupSettings', $api_settings);
	}

	if (is_page('admin-dashboard')) {
		// calendar - admin
		wp_enqueue_script('dshaver-full-calendar-script', 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js', array('dshaver-jquery'), '6.1.15', true);

		// custom admin calendar script
		wp_enqueue_script('dshaver-admin-dashboard-script', get_template_directory_uri() . '/assets/js/admin-dashboard.js', array('dshaver-main-script', 'dshaver-full-calendar-script'), wp_get_theme()->get('Version'), true);
		wp_enqueue_script('dshaver-admin-notification-script', get_template_directory_uri() . '/assets/js/notification.js', array('dshaver-admin-dashboard-script'), wp_get_theme()->get('Version'), true);
		wp_enqueue_script('dshaver-admin-sidebar-script', get_template_directory_uri() . '/assets/js/sidebar.js', array('dshaver-admin-notification-script'), wp_get_theme()->get('Version'), true);

		wp_localize_script('dshaver-admin-dashboard-script', 'dShaverApiSettings', array(
			'calendarBookingsApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/calendar-bookings')),
			'updateServiceStatusApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/update-service-status')),
			'updateServiceStatusCompletedApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/update-service-completed-status')),
			'unavailableDatesApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/unavailable-dates')),
			'availableTimesApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/available-times')),
			'createWalkInBookingApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/walk-ins-booking')),
			'reScheduleApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/reschedule-booking')),
			'nonce' => wp_create_nonce('wp_rest'), // Create a nonce for REST API security
			'ajax_url' => admin_url('admin-ajax.php')
		));
	}

	if (is_page('bookings-list')) {
		// bookings table - admin
		wp_enqueue_script('dshaver-jquery-data-table-script', "https://cdn.datatables.net/2.1.7/js/dataTables.min.js", array('dshaver-jquery'), '2.1.7', true);
		wp_enqueue_script('dshaver-data-table-companion-script', 'https://cdn.datatables.net/2.1.7/js/dataTables.bootstrap5.js', array('dshaver-jquery-data-table-script'), '2.1.7', 'all');
		wp_enqueue_script('dshaver-data-table-responsive-script', "https://cdn.datatables.net/responsive/3.0.3/js/dataTables.responsive.js", array('dshaver-data-table-companion-script'), '3.3.0', true);
		wp_enqueue_script('dshaver-data-table-bootstrap-responsive-script', "https://cdn.datatables.net/responsive/3.0.3/js/responsive.bootstrap5.js", array('dshaver-data-table-responsive-script'), '3.3.0', true);
		wp_enqueue_script('dshaver-data-table-buttons-script', 'https://cdn.datatables.net/buttons/3.1.2/js/dataTables.buttons.js', array('dshaver-data-table-bootstrap-responsive-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-data-table-bootstrap-buttons-script', 'https://cdn.datatables.net/buttons/3.1.2/js/buttons.bootstrap5.js', array('dshaver-data-table-buttons-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-data-table-jszip-script', 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', array('dshaver-data-table-bootstrap-buttons-script'), '3.10.0', true);
		wp_enqueue_script('dshaver-data-table-pdfmake-script', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js', array('dshaver-data-table-jszip-script'), '0.2.7', true);
		wp_enqueue_script('dshaver-data-table-vfs-font-script', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js', array('dshaver-data-table-pdfmake-script'), '0.2.7', true);
		wp_enqueue_script('dshaver-data-table-buttons-html5-script', 'https://cdn.datatables.net/buttons/3.1.2/js/buttons.html5.js', array('dshaver-data-table-vfs-font-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-data-table-buttons-print-script', 'https://cdn.datatables.net/buttons/3.1.2/js/buttons.print.js', array('dshaver-data-table-buttons-html5-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-data-table-buttons-colvis-script', 'https://cdn.datatables.net/buttons/3.1.2/js/buttons.colVis.js', array('dshaver-data-table-buttons-print-script'), '3.1.2', true);

		// custom admin bookings list script
		wp_enqueue_script('dshaver-admin-bookings-list-script', get_template_directory_uri() . '/assets/js/admin-bookings-list.js', array('dshaver-main-script', 'dshaver-data-table-moment-script'), wp_get_theme()->get('Version'), true);
		wp_enqueue_script('dshaver-admin-notification-script', get_template_directory_uri() . '/assets/js/notification.js', array('dshaver-admin-bookings-list-script'), wp_get_theme()->get('Version'), true);
		wp_enqueue_script('dshaver-admin-sidebar-script', get_template_directory_uri() . '/assets/js/sidebar.js', array('dshaver-admin-notification-script'), wp_get_theme()->get('Version'), true);



		wp_localize_script('dshaver-admin-bookings-list-script', 'dShaverApiSettings', array(
			'bookingsApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/bookings')),
			'unavailableDatesApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/unavailable-dates')),
			'availableTimesApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/available-times')),
			'nonce' => wp_create_nonce('wp_rest'), // Create a nonce for REST API security
			'ajax_url' => admin_url('admin-ajax.php')
		));
	}

	if (is_page('clients-list')) {
		// clienst list table - admin
		wp_enqueue_script('dshaver-jquery-data-table-script', "https://cdn.datatables.net/2.1.7/js/dataTables.min.js", array('dshaver-jquery'), '2.1.7', true);
		wp_enqueue_script('dshaver-data-table-companion-script', 'https://cdn.datatables.net/2.1.7/js/dataTables.bootstrap5.js', array('dshaver-jquery-data-table-script'), '2.1.7', 'all');
		wp_enqueue_script('dshaver-data-table-responsive-script', "https://cdn.datatables.net/responsive/3.0.3/js/dataTables.responsive.js", array('dshaver-data-table-companion-script'), '3.3.0', true);
		wp_enqueue_script('dshaver-data-table-bootstrap-responsive-script', "https://cdn.datatables.net/responsive/3.0.3/js/responsive.bootstrap5.js", array('dshaver-data-table-responsive-script'), '3.3.0', true);
		wp_enqueue_script('dshaver-data-table-buttons-script', 'https://cdn.datatables.net/buttons/3.1.2/js/dataTables.buttons.js', array('dshaver-data-table-bootstrap-responsive-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-data-table-bootstrap-buttons-script', 'https://cdn.datatables.net/buttons/3.1.2/js/buttons.bootstrap5.js', array('dshaver-data-table-buttons-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-data-table-jszip-script', 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', array('dshaver-data-table-bootstrap-buttons-script'), '3.10.0', true);
		wp_enqueue_script('dshaver-data-table-pdfmake-script', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js', array('dshaver-data-table-jszip-script'), '0.2.7', true);
		wp_enqueue_script('dshaver-data-table-vfs-font-script', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js', array('dshaver-data-table-pdfmake-script'), '0.2.7', true);
		wp_enqueue_script('dshaver-data-table-buttons-html5-script', 'https://cdn.datatables.net/buttons/3.1.2/js/buttons.html5.js', array('dshaver-data-table-vfs-font-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-data-table-buttons-print-script', 'https://cdn.datatables.net/buttons/3.1.2/js/buttons.print.js', array('dshaver-data-table-buttons-html5-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-data-table-buttons-colvis-script', 'https://cdn.datatables.net/buttons/3.1.2/js/buttons.colVis.js', array('dshaver-data-table-buttons-print-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-lightbox-gallery-script', 'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.5/js/lightbox.min.js', array('dshaver-data-table-buttons-colvis-script'), '2.11.5', true);

		// custom admin clients list script
		wp_enqueue_script('dshaver-admin-clients-list-script', get_template_directory_uri() . '/assets/js/admin-clients-list.js', array('dshaver-main-script', 'dshaver-data-table-moment-script'), wp_get_theme()->get('Version'), true);
		wp_enqueue_script('dshaver-admin-notification-script', get_template_directory_uri() . '/assets/js/notification.js', array('dshaver-admin-clients-list-script'), wp_get_theme()->get('Version'), true);
		wp_enqueue_script('dshaver-admin-sidebar-script', get_template_directory_uri() . '/assets/js/sidebar.js', array('dshaver-admin-notification-script'), wp_get_theme()->get('Version'), true);



		wp_localize_script('dshaver-admin-clients-list-script', 'dShaverApiSettings', array(
			'clientsListApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/clients-list')),
			'updateClientImagesApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/update-client-images')),
			'deleteClientImageApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/delete-client-image')),
			'clientBookingHistoryApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/client-booking-history')),
			'clientHaircutsApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/client-haircuts')),
			'addNewClientApi' => esc_url_raw(rest_url('dshaver_and_comb/api/v1/add-new-client')),
			'nonce' => wp_create_nonce('wp_rest'), // Create a nonce for REST API security
			'ajax_url' => admin_url('admin-ajax.php')
		));
	}

	if (is_page('notifications-list')) {
		wp_enqueue_script('dshaver-jquery-data-table-script', "https://cdn.datatables.net/2.1.7/js/dataTables.min.js", array('dshaver-jquery'), '2.1.7', true);
		wp_enqueue_script('dshaver-data-table-companion-script', 'https://cdn.datatables.net/2.1.7/js/dataTables.bootstrap5.js', array('dshaver-jquery-data-table-script'), '2.1.7', 'all');
		wp_enqueue_script('dshaver-data-table-responsive-script', "https://cdn.datatables.net/responsive/3.0.3/js/dataTables.responsive.js", array('dshaver-data-table-companion-script'), '3.3.0', true);
		wp_enqueue_script('dshaver-data-table-bootstrap-responsive-script', "https://cdn.datatables.net/responsive/3.0.3/js/responsive.bootstrap5.js", array('dshaver-data-table-responsive-script'), '3.3.0', true);
		wp_enqueue_script('dshaver-data-table-buttons-script', 'https://cdn.datatables.net/buttons/3.1.2/js/dataTables.buttons.js', array('dshaver-data-table-bootstrap-responsive-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-data-table-bootstrap-buttons-script', 'https://cdn.datatables.net/buttons/3.1.2/js/buttons.bootstrap5.js', array('dshaver-data-table-buttons-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-data-table-jszip-script', 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', array('dshaver-data-table-bootstrap-buttons-script'), '3.10.0', true);
		wp_enqueue_script('dshaver-data-table-pdfmake-script', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js', array('dshaver-data-table-jszip-script'), '0.2.7', true);
		wp_enqueue_script('dshaver-data-table-vfs-font-script', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js', array('dshaver-data-table-pdfmake-script'), '0.2.7', true);
		wp_enqueue_script('dshaver-data-table-buttons-html5-script', 'https://cdn.datatables.net/buttons/3.1.2/js/buttons.html5.js', array('dshaver-data-table-vfs-font-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-data-table-buttons-print-script', 'https://cdn.datatables.net/buttons/3.1.2/js/buttons.print.js', array('dshaver-data-table-buttons-html5-script'), '3.1.2', true);
		wp_enqueue_script('dshaver-data-table-buttons-colvis-script', 'https://cdn.datatables.net/buttons/3.1.2/js/buttons.colVis.js', array('dshaver-data-table-buttons-print-script'), '3.1.2', true);

		// custom admin notifications list script
		wp_enqueue_script('dshaver-admin-notification-script', get_template_directory_uri() . '/assets/js/notification.js', array(), wp_get_theme()->get('Version'), true);
		wp_enqueue_script('dshaver-admin-sidebar-script', get_template_directory_uri() . '/assets/js/sidebar.js', array('dshaver-admin-notification-script'), wp_get_theme()->get('Version'), true);


		wp_localize_script('dshaver-admin-notification-script', 'dShaverApiSettings', array(
			'nonce' => wp_create_nonce('wp_rest'), // Create a nonce for REST API security
			'ajax_url' => admin_url('admin-ajax.php')
		));
	}
}
add_action('wp_enqueue_scripts', 'dshaver_register_scripts');

// Custom Walker Class to use Bootstrap 5 on menu
require_once get_template_directory() . '/classes/bootstrap-walker-nav-menu.php';

// ACF CPT Declarations
require_once get_template_directory() . '/cpt/acf-fields.php';

/** CUSTOM ENDPOINT - GET UNAVAILABLE DATES **/
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/unavailable-dates', array(
		'methods' => 'GET',
		'callback' => 'get_unavailable_dates_and_times',
		'permission_callback' => function () {
			return wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		},
	));
});

function get_unavailable_dates_and_times(WP_REST_Request $request)
{
	$barber_id = $request->get_param('barber_id');

	if (empty($barber_id)) {
		return rest_ensure_response(array(
			'success' => false,
			'data' => "Missing or invalid barber details.",
		), 400);
	}

	// Split the comma-separated barber_id into an array
	$barber_ids = explode(',', $barber_id);

	// Get current date in 'Y-m-d' format for comparison
	$current_date = current_time('Y-m-d');

	// Prepare query to get bookings from today onwards
	$args = array(
		'post_type'      => 'booking',
		'posts_per_page' => -1,
		'meta_query'     => array(
			array(
				'key'     => 'appointment_date',
				'value'   => $current_date,
				'compare' => '>=',
				'type'    => 'DATE'
			),
			array(
				'key' => 'barber_id',
				'value' => $barber_ids,
				'compare' => 'IN'
			)
		),
		'orderby' => 'meta_value',
		'order'   => 'ASC',
	);

	$query = new WP_Query($args);

	$booked_slots = [];
	$service_durations = []; // Cache for service durations
	$service_ids_to_fetch = []; // Collect all service IDs

	$bookings = [];
	// Loop through bookings and group by date
	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			$booking_id = get_the_ID();

			$appointment_date_raw = get_post_meta(get_the_ID(), 'appointment_date', true);
			$appointment_time_raw = get_post_meta(get_the_ID(), 'appointment_time', true);

			// Use 'Y-m-d' for consistent date comparison
			$appointment_date_obj = DateTime::createFromFormat('Y-m-d', $appointment_date_raw);
			if ($appointment_date_obj) {
				$appointment_date = $appointment_date_obj->format('Y-m-d');
			} else {
				continue;
			}

			// Convert time to 'H:i' (24-hour format)
			$appointment_time_obj = DateTime::createFromFormat('H:i:s', $appointment_time_raw); // Assuming it's 'H:i:s' based on log
			if ($appointment_time_obj) {
				$appointment_time = $appointment_time_obj->format('H:i');
			} else {
				continue;
			}

			// Get the services for this booking
			$services = get_post_meta(get_the_ID(), 'services', false);

			if (is_array($services)) {
				$service_ids_to_fetch = array_merge($service_ids_to_fetch, $services);
			}

			// Store booking info for later processing
			$bookings[] = [
				'id' => $booking_id,
				'date' => $appointment_date,
				'time' => $appointment_time,
				'services' => $services
			];
		}
		wp_reset_postdata();
	}

	// Batch fetch service durations
	if (!empty($service_ids_to_fetch)) {
		$service_ids_to_fetch = array_unique($service_ids_to_fetch);
		$args = [
			'post_type' => 'service',
			'post__in' => $service_ids_to_fetch,
			'posts_per_page' => -1,
		];
		$services_query = new WP_Query($args);
		if ($services_query->have_posts()) {
			while ($services_query->have_posts()) {
				$services_query->the_post();
				$service_id = get_the_ID();
				$duration = get_post_meta($service_id, 'duration_in_minutes', true);
				$service_durations[$service_id] = intval($duration);
			}
			wp_reset_postdata();
		}
	}

	// Process bookings and calculate booked slots
	foreach ($bookings as $booking) {
		$total_duration = 0;
		if (is_array($booking['services'])) {
			foreach ($booking['services'] as $service_id) {
				$total_duration += $service_durations[$service_id] ?? 15; // Default to 15 if not found
			}
		}
		$total_duration = max($total_duration, 15);

		$end_time = strtotime("+{$total_duration} minutes", strtotime($booking['date'] . ' ' . $booking['time']));

		// Mark all affected time slots as booked
		$current_slot = strtotime($booking['date'] . ' ' . $booking['time']);
		while ($current_slot < $end_time) {
			$slot_date = date('Y-m-d', $current_slot);
			$slot_time = date('H:i', $current_slot);

			if (!isset($booked_slots[$slot_date])) {
				$booked_slots[$slot_date] = [];
			}
			$booked_slots[$slot_date][] = $slot_time;

			$current_slot = strtotime('+15 minutes', $current_slot);
		}
	}

	// Prepare the unavailable dates
	$unavailable_dates = [];

	foreach ($booked_slots as $date => $times) {
		$day_of_week = date('w', strtotime($date));

		// Set different start and end times for weekdays and weekends
		if ($day_of_week >= 1 && $day_of_week <= 5) {
			$start_time = '08:30';
			$end_time = '18:30';
		} else {
			$start_time = '08:30';
			$end_time = '17:00';
		}

		// Generate all possible 15-minute time slots for the day
		$current_time = strtotime($start_time);
		$end_time_stamp = strtotime($end_time);
		$all_possible_slots = [];

		while ($current_time < $end_time_stamp) {
			$all_possible_slots[] = date('H:i', $current_time);
			$current_time = strtotime('+15 minutes', $current_time);
		}

		// Check if all possible slots are booked
		$unavailable_count = count(array_intersect($all_possible_slots, $times));

		if ($unavailable_count === count($all_possible_slots)) {
			// If all slots are booked, mark the entire date as unavailable
			$unavailable_dates[] = $date;
		}
	}

	// Return unavailable dates in the response
	return rest_ensure_response(array(
		'success' => true,
		'data' => $unavailable_dates,
	), 200);
}
/** CUSTOM ENDPOINT - GET UNAVAILABLE DATES **/

/** CUSTOM ENDPOINT - GET AVAILABLE TIMES **/
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/available-times', array(
		'methods' => 'POST',
		'callback' => 'get_available_timeslots',
		'permission_callback' => function () {
			return wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		},
	));
});

function get_available_timeslots(WP_REST_Request $request)
{
	$request_data = json_decode($request->get_body(), true);
	$selected_date = isset($request_data['selectedBookingDate']) ? $request_data['selectedBookingDate'] : null;
	$barber_ids = isset($request_data['barberIDs']) ? $request_data['barberIDs'] : null;

	if (empty($barber_ids || !is_array($barber_ids))) {
		return rest_ensure_response(array(
			'success' => false,
			'data' => "Missing or invalid barber details.",
		), 400);
	}

	// Convert the selected date from 'Y-m-d' to 'Y-m-d' format (ensuring correct format)
	$selected_date_obj = DateTime::createFromFormat('Y-m-d', $selected_date);
	if (!$selected_date_obj) {
		return rest_ensure_response(array(
			'success' => false,
			'data' => "The date provided is invalid.",
		), 400);
	}
	$selected_date_formatted = $selected_date_obj->format('Y-m-d');

	// Query the bookings for the selected date
	$args = array(
		'post_type'      => 'booking',
		'posts_per_page' => -1,
		'meta_query'     => array(
			array(
				'key'     => 'appointment_date',
				'value'   => $selected_date_formatted,
				'compare' => '=',
				'type'    => 'DATE'
			),
			array(
				'key' => 'barber_id',
				'value' => $barber_ids,
				'compare' => 'IN'
			)
		),
		'orderby' => 'meta_value',
		'order'   => 'ASC',
	);

	$query = new WP_Query($args);
	$booked_slots = [];
	$service_ids_to_fetch = [];

	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			$booking_id = get_the_ID();
			$appointment_time_raw = get_post_meta(get_the_ID(), 'appointment_time', true);

			// Get the services for this booking
			$services = get_post_meta($booking_id, 'services', false);
			if (is_array($services)) {
				$service_ids_to_fetch = array_merge($service_ids_to_fetch, $services);
			}

			$booked_slots[] = [
				'time' => $appointment_time_raw,
				'services' => $services
			];
		}
		wp_reset_postdata();
	}

	// Batch fetch service durations
	$service_durations = [];
	if (!empty($service_ids_to_fetch)) {
		$service_ids_to_fetch = array_unique($service_ids_to_fetch);
		$args = [
			'post_type' => 'service',
			'post__in' => $service_ids_to_fetch,
			'posts_per_page' => -1,
		];
		$services_query = new WP_Query($args);
		if ($services_query->have_posts()) {
			while ($services_query->have_posts()) {
				$services_query->the_post();
				$service_id = get_the_ID();
				$duration = get_post_meta($service_id, 'duration_in_minutes', true);
				$service_durations[$service_id] = intval($duration);
			}
			wp_reset_postdata();
		}
	}

	// Calculate occupied time slots
	$occupied_slots = [];
	foreach ($booked_slots as $slot) {
		$total_duration = 0;
		if (is_array($slot['services'])) {
			foreach ($slot['services'] as $service_id) {
				$total_duration += $service_durations[$service_id] ?? 15; // Default to 15 if not found
			}
		}
		$total_duration = max($total_duration, 15);

		$start_time = strtotime($slot['time']);
		$end_time = strtotime("+{$total_duration} minutes", $start_time);

		$current_slot = $start_time;
		while ($current_slot < $end_time) {
			$occupied_slots[] = date('H:i', $current_slot);
			$current_slot = strtotime('+15 minutes', $current_slot);
		}
	}

	// Check if the selected date is a weekday or weekend
	$day_of_week = date('w', strtotime($selected_date_formatted));

	// Define the time range based on the day of the week
	if ($day_of_week >= 1 && $day_of_week <= 5) {
		// Weekdays (Monday to Friday)
		$start_time = '08:30';
		$end_time = '18:30';
	} else {
		// Weekends (Saturday and Sunday)
		$start_time = '08:30';
		$end_time = '17:00';
	}

	// Get the current time
	$current_timestamp = current_time('timestamp');
	$current_date = date('Y-m-d', $current_timestamp);
	$current_time = date('H:i', $current_timestamp);

	// Generate all available timeslots for the day
	$available_timeslots = [];
	$current_time_slot = strtotime($start_time);
	$end_time_stamp = strtotime($end_time);

	while ($current_time_slot < $end_time_stamp) {
		$slot = date('H:i', $current_time_slot);

		// Check if the slot is not occupied and is in the future
		if (
			!in_array($slot, $occupied_slots) &&
			($selected_date_formatted > $current_date ||
				($selected_date_formatted == $current_date && $slot > $current_time))
		) {
			$available_timeslots[] = date('h:i A', $current_time_slot); // Convert to 'h:i A' format for display
		}
		$current_time_slot = strtotime('+15 minutes', $current_time_slot);
	}

	return rest_ensure_response(array(
		'success' => true,
		'data' => $available_timeslots
	), 200);
}
/** CUSTOM ENDPOINT - GET AVAILABLE TIMES **/

/** CUSTOM ENDPOINT - BOOKED APPOINTMENTS */
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/bookings', array(
		'methods' => 'GET',
		'callback' => 'get_bookings_callback',
		'permission_callback' => function () {
			return is_user_logged_in() && wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});

/**
 * Retrieves all bookings from the bookings CPT, including relevant data such as:
 * - Reference number
 * - Client ID and name
 * - Appointment date and time
 * - Amount paid and currency
 * - Payment status
 * - Date of payment
 * - Services booked
 * - Service status
 *
 * @return array The bookings data as an array of associative arrays.
 */
function get_bookings_callback()
{
	$bookings = [];

	// Query the bookings CPT
	$args = array(
		'post_type' => 'booking',
		'posts_per_page' => -1,
	);
	$booking_query = new WP_Query($args);

	// Loop through the bookings and retrieve the relevant data
	if ($booking_query->have_posts()) {
		while ($booking_query->have_posts()) {
			$booking_query->the_post();

			// CLIENT
			$client_id = get_post_meta(get_the_ID(), 'client_id', true);
			$client_post = get_post($client_id);
			$client_name = '';

			if ($client_post) {
				$client_name = get_field('full_name', $client_id);
			}


			// SERVICES
			$service_ids = get_post_meta(get_the_ID(), 'services');
			$services = [];

			if (!empty($service_ids) && is_array($service_ids)) {
				foreach ($service_ids as $service_id) {
					$service = get_post($service_id);
					if ($service) {
						$service_name = get_field('service_name', $service_id);

						if (!empty($service_name)) {
							$services[] = array(
								'service_id' => $service_id,
								'service_name' => sanitize_text_field($service_name),
							);
						}
					}
				}
			}

			// SERVICE STATUS
			// Get the service_status term ID
			$service_status_id = get_post_meta(get_the_ID(), 'service_status', true); // Retrieve single ID

			// Initialize the service status name
			$service_status_name = '';


			// If there is a term ID, get the corresponding term object
			if (!empty($service_status_id)) {
				$term = get_term($service_status_id, 'booking_service_status'); // Use the taxonomy name here
				if (!is_wp_error($term) && !empty($term->name)) {
					$service_status_name = $term->name; // Get the term name
				}
			}

			$booking_data = array(
				'reference_number' => get_post_meta(get_the_ID(), 'reference_number', true),
				'client_id' => $client_id,
				'client_name' => $client_name,
				'appointment_date' => get_post_meta(get_the_ID(), 'appointment_date', true),
				'appointment_time' => get_post_meta(get_the_ID(), 'appointment_time', true),
				'total_amount' => (float)get_post_meta(get_the_ID(), 'total_amount', true),
				'total_amount_currency' => get_post_meta(get_the_ID(), 'total_amount_currency', true),
				'services' => $services,
				'booking_service_status' => $service_status_name,
				'notes' => get_post_meta(get_the_ID(), 'notes', true)
			);

			$bookings[] = $booking_data; // Add the booking data to the array
		}
		wp_reset_postdata(); // Reset post data after the loop
	}

	return rest_ensure_response(array(
		'success' => true,
		'data' => $bookings
	), 200); // Return the booking data as a JSON response
}
/** CUSTOM ENDPOINT - BOOKED APPOINTMENTS */

/** CUSTOM ENDPOINT - START - GET CLIENT BOOKING HISTORY */
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/client-booking-history', array(
		'methods' => 'GET',
		'callback' => 'get_client_booking_history_callback',
		'permission_callback' => function () {
			return is_user_logged_in() && wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});

function get_client_booking_history_callback($request)
{
	$client_id = sanitize_text_field($request->get_param('client_id'));

	if (!$client_id) {
		return rest_ensure_response(array(
			'success' => false,
			'message' => 'Client ID is required'
		), 400);
	}

	$bookings = [];

	// Query the bookings CPT
	$args = array(
		'post_type' => 'booking',
		'posts_per_page' => -1,
		'meta_query' => array(
			array(
				'key' => 'client_id',
				'value' => $client_id,
				'compare' => '=',
			)
		),
	);
	$booking_query = new WP_Query($args);

	// Loop through the bookings and retrieve the relevant data
	if ($booking_query->have_posts()) {
		while ($booking_query->have_posts()) {
			$booking_query->the_post();

			// CLIENT
			$client_id = get_post_meta(get_the_ID(), 'client_id', true);
			$client_post = get_post($client_id);
			$client_name = '';

			if ($client_post) {
				$client_name = get_field('full_name', $client_id);
			}


			// SERVICES
			$service_ids = get_post_meta(get_the_ID(), 'services');
			$services = [];

			if (!empty($service_ids) && is_array($service_ids)) {
				foreach ($service_ids as $service_id) {
					$service = get_post($service_id);
					if ($service) {
						$service_name = get_field('service_name', $service_id);

						if (!empty($service_name)) {
							$services[] = array(
								'service_id' => $service_id,
								'service_name' => sanitize_text_field($service_name),
							);
						}
					}
				}
			}

			// SERVICE STATUS
			// Get the service_status term ID
			$service_status_id = get_post_meta(get_the_ID(), 'service_status', true); // Retrieve single ID

			// Initialize the service status name
			$service_status_name = '';


			// If there is a term ID, get the corresponding term object
			if (!empty($service_status_id)) {
				$term = get_term($service_status_id, 'booking_service_status'); // Use the taxonomy name here
				if (!is_wp_error($term) && !empty($term->name)) {
					$service_status_name = $term->name; // Get the term name
				}
			}

			$booking_data = array(
				'reference_number' => get_post_meta(get_the_ID(), 'reference_number', true),
				'client_id' => $client_id,
				'client_name' => $client_name,
				'appointment_date' => get_post_meta(get_the_ID(), 'appointment_date', true),
				'appointment_time' => get_post_meta(get_the_ID(), 'appointment_time', true),
				'total_amount' => (float)get_post_meta(get_the_ID(), 'total_amount', true),
				'total_amount_currency' => get_post_meta(get_the_ID(), 'total_amount_currency', true),
				'services' => $services,
				'booking_service_status' => $service_status_name,
				'notes' => get_post_meta(get_the_ID(), 'notes', true)
			);

			$bookings[] = $booking_data; // Add the booking data to the array
		}
		wp_reset_postdata(); // Reset post data after the loop
	}

	return rest_ensure_response(array(
		'success' => true,
		'data' => $bookings
	), 200); // Return the booking data as a JSON response
}
/** CUSTOM ENDPOINT - END - GET CLIENT BOOKING HISTORY */

/** CUSTOM ENDPOINT - CALENDAR APPOINTMENTS */
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/calendar-bookings', array(
		'methods' => 'GET',
		'callback' => 'dshaver_get_calendar_bookings',
		'permission_callback' => function () {
			return is_user_logged_in() && wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});

function dshaver_get_calendar_bookings($data)
{
	$barber_id_payload = sanitize_text_field($data['barberId']);
	$start = sanitize_text_field($data['start']); // Start date
	$end = sanitize_text_field($data['end']);     // End date.

	$bookings = [];

	// Query the bookings CPT
	$args = array(
		'post_type' => 'booking',
		'meta_query' => array(
			'relation' => 'AND',
			array(
				'key' => 'appointment_date',
				'value' => array($start, $end),
				'compare' => 'BETWEEN',
				'type' => 'DATE'
			),
			array(
				'key' => 'barber_id',
				'value' => $barber_id_payload,
				'compare' => '='
			)
		),
		'posts_per_page' => -1
	);

	$booking_query = new WP_Query($args);

	// Loop through the bookings and retrieve the relevant data
	if ($booking_query->have_posts()) {
		while ($booking_query->have_posts()) {
			$booking_query->the_post();

			// BARBER
			$barber_id = get_post_meta(get_the_ID(), 'barber_id', true);
			$barber_post = get_post($barber_id);
			$barber_name = '';

			if ($barber_post) {
				$barber_name = get_field('barber_name', $barber_id);
			}

			// CLIENT
			$client_id = get_post_meta(get_the_ID(), 'client_id', true);
			$client_post = get_post($client_id);
			$client_name = '';

			if ($client_post) {
				$client_name = get_field('full_name', $client_id);
			}

			// SERVICES
			$service_ids = get_post_meta(get_the_ID(), 'services');
			$services = [];

			if (!empty($service_ids) && is_array($service_ids)) {
				foreach ($service_ids as $service_id) {
					$service = get_post($service_id);
					if ($service) {
						$service_name = get_field('service_name', $service_id);

						$service_type = get_the_terms($service_id, 'service-type')[0]->name;

						if (!empty($service_name)) {
							$services[] = array(
								'service_id' => $service_id,
								'service_name' => sanitize_text_field($service_name),
								'service_type' => $service_type
							);
						}
					}
				}
			}

			// SERVICE STATUS
			// Get the service_status term ID
			$service_status_id = get_post_meta(get_the_ID(), 'service_status', true); // Retrieve single ID

			// Initialize the service status name
			$service_status_name = '';


			// If there is a term ID, get the corresponding term object
			if (!empty($service_status_id)) {
				$term = get_term($service_status_id, 'booking_service_status'); // Use the taxonomy name here
				if (!is_wp_error($term) && !empty($term->name)) {
					$service_status_name = $term->name; // Get the term name
				}
			}

			// // Filter out bookings with service status "Cancelled"
			// if ($service_status_name === 'Cancelled') {
			// 	continue; // Skip this iteration of the loop
			// }


			$booking_data = array(
				'reference_number' => get_post_meta(get_the_ID(), 'reference_number', true),
				'client_id' => $client_id,
				'client_name' => $client_name,
				'appointment_date' => get_post_meta(get_the_ID(), 'appointment_date', true),
				'appointment_time' => get_post_meta(get_the_ID(), 'appointment_time', true),
				'barber_id' => $barber_id,
				'barber_name' => $barber_name,
				'booking_type' => get_post_meta(get_the_ID(), 'booking_type', true),
				'group_id' => get_post_meta(get_the_ID(), 'group_id', true),
				'services' => $services,
				'booking_service_status' => $service_status_name,
				'notes' => get_post_meta(get_the_ID(), 'notes', true)
			);

			$bookings[] = $booking_data; // Add the booking data to the array
		}
		wp_reset_postdata(); // Reset post data after the loop
	}

	return rest_ensure_response(array(
		'success' => true,
		'data' => $bookings
	), 200); // Return the booking data as a JSON response
}
/** CUSTOM ENDPOINT - CALENDAR APPOINTMENTS */

/** CUSTOM ENDPOINT - ADD BOOKING */
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/add-new-booking', array(
		'methods' => 'POST',
		'callback' => 'add_new_booking_callback',
		'permission_callback' => function () {
			return wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});

// update this function to accomodate a single booking or array of bookings
function add_new_booking_callback($request)
{
	$booking_type = sanitize_text_field($request->get_param('bookingType'));

	if ($booking_type === 'single') {
		$booking_item = $request->get_param('bookingItem');

		if (!is_array($booking_item)) {
			return rest_ensure_response(array(
				'success' => false,
				'message' => 'Booking item must be an array.',
				'status' => 400
			));
		}

		$barber = $booking_item['barber'] ?? '';
		$services = $booking_item['services'] ?? [];
		$date = sanitize_text_field($booking_item['date'] ?? '');
		$time = sanitize_text_field($booking_item['time'] ?? '');
		$customer = sanitize_text_field($booking_item['customer'] ?? '');
		$email_address = sanitize_email($booking_item['emailAddress'] ?? '');
		$mobile_number = sanitize_text_field($booking_item['mobileNumber'] ?? '');
		$date_of_birth = sanitize_text_field($booking_item['dateOfBirth'] ?? '');
		$total_price = floatval($booking_item['totalPrice'] ?? 0);

		// Validate total_price
		if ($total_price < 0) {
			return rest_ensure_response(array('success' => false, 'message' => 'Total price must be a positive number'), 404);
		}

		if (empty($barber) || empty($services) || empty($date) || empty($time) || empty($customer) || empty($email_address)) {
			return rest_ensure_response(array('success' => false, 'message' => 'Missing required fields'), 404);
		}

		// Validate and format the date of birth
		$date_of_birth_obj = null;
		$date_of_birth_formatted = '';
		if ($date_of_birth !== '') {
			$date_of_birth_obj = DateTime::createFromFormat('Y-m-d', $date_of_birth);
			if ($date_of_birth_obj !== false) {
				// Format it as a string in 'Y-m-d'
				$date_of_birth_formatted = $date_of_birth_obj->format('Y-m-d');
			}
		}
		if ($date_of_birth_formatted !== '' && $date_of_birth_obj !== null && $date_of_birth_obj->format('Y-m-d') !== $date_of_birth) {
			return rest_ensure_response(array('success' => false, 'message' => 'Invalid date format for date of birth. Expected format: YYYY-MM-DD'), 404);
		}

		// add wp transients in order to prevent race conditions
		$booking_key = "booking_{$date}_{$time}";
		$is_locked = get_transient($booking_key);

		if ($is_locked) {
			return rest_ensure_response(array(
				'success' => false,
				'message' => 'This time slot is currently being booked by another user. Please try again.',
			), 409);
		}
		// Set a transient lock for 30 seconds
		set_transient($booking_key, true, 30);

		// the total duration variable for checking conflicts
		$total_duration = 0;
		foreach ($services as $service) {
			$service_id = $service['serviceId'];
			$duration = get_post_meta($service_id, 'serviceDuration', true);
			$total_duration += intval($duration);
		}
		$total_duration = max($total_duration, 15);

		// 0. check if barber exists
		$barber_exists = check_if_barber_exists($barber);
		if (!$barber_exists) {
			return rest_ensure_response(array('success' => false, 'message' => 'Barber does not exist'), 404);
		}

		// ** check for booking conflicts
		$conflict = check_booking_conflict($date, $time, $barber['barber_id'], $total_duration);
		if ($conflict) {
			delete_transient($booking_key);
			return rest_ensure_response(array(
				'success' => false,
				'message' => 'This time slot is no longer available. Please choose another time.',
			), 409); // 409 Conflict
		}

		// 1. create or get client details
		$client_details = array(
			'customer_name' => $customer,
			'email_address' => $email_address,
			'mobile_number' => $mobile_number,
			'date_of_birth' => $date_of_birth_formatted
		);

		$client = create_or_get_client($client_details);

		if (!$client) {
			return rest_ensure_response(array('success' => false, 'message' => 'Failed to create or get client'), 404);
		}


		$currency = $services[0]['servicePriceCurrency'];
		// 2. create booking
		$booking_details = array(
			'client_id' => $client['id'],
			'barber_id' => $barber['barber_id'],
			'client_name' => $client['full_name'],
			'appointment_date' => $date,
			'appointment_time' => $time,
			'total_amount' => $total_price,
			'total_amount_currency' => $currency,
			'booking_type' => $booking_type,
			'group_id' => '',
			'services' => $services,
			'service_status' => 'Pending', // Set the initial service status
			'notes' => ''
		);
		$booking_reference_number = create_booking_post($booking_details);
		if (!$booking_reference_number) {
			return rest_ensure_response(array('success' => false, 'message' => 'Failed to create booking'), 404);
		}

		// 3. create booking notification
		create_booking_notification($booking_reference_number, $client['full_name'], $barber['barber_name'], $date, $time);

		// 4. send confirmation email
		$services_list = [];
		foreach ($services as $item) {
			$service = sanitize_text_field($item['serviceName'] ?? '');
			$services_list[] = $service;
		}

		$booking_email_details = array(
			'reference_number' => $booking_reference_number,
			'client_name' => $client['full_name'],
			'barber_name' => $barber['barber_name'],
			'appointment_date' => $date,
			'appointment_time' => $time,
			'total_amount' => $total_price,
			'services' => implode(', ', $services_list)
		);

		$booking_confirmation_sent = send_booking_email($booking_type, $email_address, $booking_email_details);

		// Delete the transient lock here, before returning the response
		delete_transient($booking_key);

		if (!$booking_confirmation_sent) {
			return rest_ensure_response(array(
				'success' => true,
				'message' => 'Booking was successful but failed to send confirmation email. Please contact us at +64224259522',
				'data' => array(
					'bookingType' => 'single',
					'bookingDetails' => array(
						'booking_reference_number' => $booking_reference_number,
						'client_name' => $client['full_name'],
						'barber_name' => $barber['barber_name'],
						'appointment_date' => $date,
						'appointment_time' => $time,
						'total_amount' => $total_price,
						'services' => implode(', ', $services_list)
					)
				)
			), 200);
		} else {
			return rest_ensure_response(array(
				'success' => true,
				'message' => 'Booking created successfully',
				'data' => array(
					'bookingType' => 'single',
					'bookingDetails' => array(
						'booking_reference_number' => $booking_reference_number,
						'client_name' => $client['full_name'],
						'barber_name' => $barber['barber_name'],
						'appointment_date' => $date,
						'appointment_time' => $time,
						'total_amount' => $total_price,
						'services' => implode(', ', $services_list)
					)
				)
			), 200);
		}
	} elseif ($booking_type == 'group') {
		$booking_items = $request->get_param('bookingItems');
		$form_fillout_type = $request->get_param('formFilloutType');
		$group_id = $request->get_param('groupId');

		if (!is_array($booking_items) || empty($booking_items)) {
			return rest_ensure_response(array(
				'success' => false,
				'message' => 'Booking items must be an array.',
				'status' => 400
			));
		}


		$date = sanitize_text_field($booking_items[0]['date'] ?? '');
		$time = sanitize_text_field($booking_items[0]['time'] ?? '');
		// add wp transients in order to prevent race conditions
		$booking_key = "booking_{$date}_{$time}";
		$is_locked = get_transient($booking_key);

		if ($is_locked) {
			return rest_ensure_response(array(
				'success' => false,
				'message' => 'This time slot is currently being booked by another user. Please try again.',
			), 409);
		}

		// get unique barber IDs
		$barber_ids = array_map(function ($booking_item) {
			return $booking_item['barber']['barber_id'];
		}, $booking_items);

		$unique_barber_ids = array_unique($barber_ids);

		$total_durations = array_map(function ($booking) {
			$total_duration = array_sum(array_column($booking['services'], 'serviceDuration'));
			return [
				'totalDuration' => $total_duration,
			];
		}, $booking_items);

		$longest_duration_booking = array_reduce($total_durations, function ($carry, $item) {
			return ($carry === null || $item['totalDuration'] > $carry['totalDuration']) ? $item : $carry;
		}, null);


		// ** check for booking conflicts
		foreach ($unique_barber_ids as $barber_id) {
			$conflict = check_booking_conflict($date, $time, $barber_id, $longest_duration_booking);
			if ($conflict) {
				delete_transient($booking_key);
				return rest_ensure_response(array(
					'success' => false,
					'message' => 'This time slot is no longer available. Please choose another time.',
				), 409); // 409 Conflict
			}
		}

		// Set a transient lock for 30 seconds
		set_transient($booking_key, true, 30);

		// Group Booking Email Information
		$group_booking_email_details = [];

		foreach ($booking_items as $item) {
			if (!is_array($item) || !is_object((object)$item)) {
				return rest_ensure_response(array(
					'success' => false,
					'message' => 'Each booking item must be an object.',
					'status' => 400
				));
			}

			$is_main = $item['isMain'] ?? false;
			$barber = $item['barber'] ?? '';
			$services = $item['services'] ?? [];
			$date = sanitize_text_field($item['date'] ?? '');
			$time = sanitize_text_field($item['time'] ?? '');
			$customer = sanitize_text_field($item['customer'] ?? '');
			$email_address = sanitize_email($item['emailAddress'] ?? '');
			$mobile_number = sanitize_text_field($item['mobileNumber'] ?? '');
			$date_of_birth = sanitize_text_field($item['dateOfBirth'] ?? '');
			$total_price = floatval($item['totalPrice'] ?? 0);

			// Validate total_price
			if ($total_price < 0) {
				return rest_ensure_response(array('success' => false, 'message' => 'Total price must be a positive number'), 404);
			}

			if ($is_main && (empty($barber) || empty($services) || empty($date) || empty($time) || empty($customer) || empty($email_address))) {
				return rest_ensure_response(array('success' => false, 'message' => 'Missing required fields'), 404);
			}

			if (!$is_main && (empty($barber) || empty($services) || empty($date) || empty($time) || empty($customer))) {
				return rest_ensure_response(array('success' => false, 'message' => 'Missing required fields'), 404);
			}

			// Validate and format the date of birth
			$date_of_birth_obj = null;
			$date_of_birth_formatted = '';
			if ($date_of_birth !== '') {
				$date_of_birth_obj = DateTime::createFromFormat('Y-m-d', $date_of_birth);
				if ($date_of_birth_obj !== false) {
					// Format it as a string in 'Y-m-d'
					$date_of_birth_formatted = $date_of_birth_obj->format('Y-m-d');
				}
			}
			if ($date_of_birth_formatted !== '' && $date_of_birth_obj !== null && $date_of_birth_obj->format('Y-m-d') !== $date_of_birth) {
				return rest_ensure_response(array('success' => false, 'message' => 'Invalid date format for date of birth. Expected format: YYYY-MM-DD'), 404);
			}

			// the total duration variable for checking conflicts
			$total_duration = 0;
			foreach ($services as $service) {
				$service_id = $service['serviceId'];
				$duration = get_post_meta($service_id, 'serviceDuration', true);
				$total_duration += intval($duration);
			}
			$total_duration = max($total_duration, 15);

			// 0. check if barber exists
			$barber_exists = check_if_barber_exists($barber);
			if (!$barber_exists) {
				return rest_ensure_response(array('success' => false, 'message' => 'Barber does not exist'), 404);
			}

			// 1. create or get client details
			$client_details = array(
				'customer_name' => $customer,
				'email_address' => $email_address,
				'mobile_number' => $mobile_number,
				'date_of_birth' => $date_of_birth_formatted
			);

			$client = create_or_get_client($client_details);

			if (!$client) {
				return rest_ensure_response(array('success' => false, 'message' => 'Failed to create or get client'), 404);
			}

			$currency = $services[0]['servicePriceCurrency'];
			// 2. create booking
			$booking_details = array(
				'client_id' => $client['id'],
				'barber_id' => $barber['barber_id'],
				'client_name' => $client['full_name'],
				'appointment_date' => $date,
				'appointment_time' => $time,
				'total_amount' => $total_price,
				'total_amount_currency' => $currency,
				'booking_type' => $booking_type,
				'group_id' => $group_id,
				'services' => $services,
				'service_status' => 'Pending', // Set the initial service status
				'notes' => ''
			);
			$booking_reference_number = create_booking_post($booking_details);
			if (!$booking_reference_number) {
				return rest_ensure_response(array('success' => false, 'message' => 'Failed to create booking'), 404);
			}

			// 3. create booking notification
			create_booking_notification($booking_reference_number, $client['full_name'], $barber['barber_name'], $date, $time);

			// 4. send confirmation email
			$services_list = [];
			foreach ($services as $item) {
				$service = sanitize_text_field($item['serviceName'] ?? '');
				$services_list[] = $service;
			}

			$group_booking_email_details[] = array(
				'reference_number' => $booking_reference_number,
				'client_name' => $client['full_name'],
				'barber_name' => $barber['barber_name'],
				'appointment_date' => $date,
				'appointment_time' => $time,
				'total_amount' => $total_price,
				'services' => implode(', ', $services_list)
			);
		}

		$email_address = $group_booking_email_details[0]['email_address'];
		$booking_confirmation_sent = send_booking_email($booking_type, $email_address, $group_booking_email_details);

		delete_transient($booking_key);

		if (!$booking_confirmation_sent) {
			return rest_ensure_response(array(
				'success' => true,
				'message' => 'Booking was successful but failed to send confirmation email. Please contact us at +64224259522',
				'data' => array(
					'bookingType' => 'group',
					'formFilloutType' => $form_fillout_type,
					'bookingDetails' => $group_booking_email_details
				)
			), 200);
		} else {
			return rest_ensure_response(array(
				'success' => true,
				'message' => 'Booking created successfully',
				'data' => array(
					'bookingType' => 'group',
					'formFilloutType' => $form_fillout_type,
					'bookingDetails' => $group_booking_email_details
				)
			), 200);
		}
	}
}

function check_booking_conflict($date, $time, $duration, $barber_id, $exclude_booking_id = null)
{
	$args = array(
		'post_type' => 'booking',
		'posts_per_page' => -1,
		'meta_query' => array(
			array(
				'key' => 'appointment_date',
				'value' => $date,
				'compare' => '=',
				'type' => 'DATE'
			),
			array(
				'key' => 'barber_id',
				'value' => $barber_id,
				'compare' => '='
			)
		)
	);

	$query = new WP_Query($args);
	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			$booking_id = get_the_ID();

			// Skip the current booking if we're rescheduling
			if ($exclude_booking_id && $booking_id == $exclude_booking_id) {
				continue;
			}

			$booking_time = get_post_meta($booking_id, 'appointment_time', true);
			$booking_services = get_post_meta($booking_id, 'services', true);

			// Calculate booking duration
			$booking_duration = 0;
			foreach ($booking_services as $service_id) {
				$service_duration = get_post_meta($service_id, 'duration_in_minutes', true);
				$booking_duration += intval($service_duration);
			}
			$booking_duration = max($booking_duration, 15);

			// Check for overlap
			$new_start = strtotime("$date $time");
			$new_end = strtotime("+$duration minutes", $new_start);
			$existing_start = strtotime("$date $booking_time");
			$existing_end = strtotime("+$booking_duration minutes", $existing_start);

			if (($new_start < $existing_end) && ($existing_start < $new_end)) {
				wp_reset_postdata();
				return true; // Conflict found
			}
		}
		wp_reset_postdata();
	}
	return false;  // No conflict
}

function check_if_barber_exists($barber_details)
{
	$barber_id = sanitize_text_field($barber_details['barber_id']);
	$barber_name = sanitize_text_field($barber_details['barber_name']);

	if (empty($barber_id)) {
		return false;
	}

	$post = get_post($barber_id);
	if ($post && $post->post_type === 'barber') {
		$stored_barber_name = get_post_meta($barber_id, 'barber_name', true);

		if (strtolower($stored_barber_name) === strtolower($barber_name)) {
			return true;
		}
	}

	return false;
}

function create_or_get_client($client_details)
{
	$full_name = sanitize_text_field($client_details['customer_name']);
	$email_address = sanitize_email($client_details['email_address']);
	$mobile_number = sanitize_text_field($client_details['mobile_number']);
	$date_of_birth_formatted = $client_details['date_of_birth'];

	// Standardized name for comparison
	$standardized_full_name = standardize_name($full_name);

	$client = pods('client', array(
		'where' => "LOWER(full_name.meta_value) = '$standardized_full_name'"
	));



	if ($client->total()) {
		$client_id = $client->field('ID');

		$existing_email = $client->field('email_address');
		$existing_mobile = $client->field('mobile_number');
		$existing_dob = $client->field('date_of_birth');

		// Only update fields if they are different
		$update_data = array();
		if ($existing_email !== $email_address) {
			$update_data['email_address'] = $email_address;
		}

		if (!empty($mobile_number) && $existing_mobile !== $mobile_number) {
			$update_data['mobile_number'] = $mobile_number;
		}

		if (!empty($date_of_birth_formatted) && $existing_dob !== $date_of_birth_formatted) {
			$update_data['date_of_birth'] = $date_of_birth_formatted;
		}

		if (!empty($update_data)) {
			$client->save($update_data);
		}

		return array(
			'id' => $client_id,
			'full_name' => $client->field('full_name')
		);
	}

	// Format name for storage (capitalized)
	$formatted_full_name = format_name($full_name);

	// If no existing client matches, create a new record
	$new_client = pods('client');
	$new_client_id = $new_client->add(array(
		'post_title' => $formatted_full_name,
		'post_status' => 'publish',
		'full_name' => $formatted_full_name,
		'email_address' => $email_address,
		'date_of_birth' => $date_of_birth_formatted,
		'mobile_number' => $mobile_number
	));

	if ($new_client_id) {
		return array(
			'id' => $new_client_id,
			'full_name' => $formatted_full_name
		);
	} else {
		return false;
	}
}

function standardize_name($name)
{
	// Convert to lowercase
	$name = strtolower($name);
	// Remove special characters, keeping only letters and spaces
	$name = preg_replace('/[^a-z\s]/', '', $name);
	// Replace multiple spaces with a single space
	$name = preg_replace('/\s+/', ' ', $name);
	// Trim any leading or trailing spaces
	return trim($name);
}

function format_name($name)
{
	// Standardize spaces and lowercase first for consistency
	$name = standardize_name($name);
	// Capitalize each word
	return ucwords($name);
}

function create_booking_post($booking_details)
{
	// Ensure required fields are present
	if (empty($booking_details)) {
		return false;
	}

	$new_booking = pods('booking');
	$new_booking_id = $new_booking->add(array(
		'post_title'  => sanitize_text_field($booking_details["client_name"] . ' - ' . $booking_details["appointment_date"] . ' - ' . $booking_details["appointment_time"]),
		'post_status' => 'publish',
	));
	$saved_booking = pods('booking', $new_booking_id);

	// Handle case where record creation failed
	if (is_wp_error($saved_booking)) {
		return false;
	}

	$services_ids = [];
	$line_items = $booking_details['services'];
	foreach ($line_items as $item) {
		$service_id = sanitize_text_field($item['serviceId'] ?? '');
		if (!empty($service_id)) {
			$services_ids[] = $service_id;
		}
	}

	if (empty($services_ids)) {
		return false;
	}

	// Generate the reference number
	$reference_number = generate_unique_reference_number($new_booking_id);

	$service_status_name = sanitize_text_field($booking_details['service_status']);
	$service_status_id = get_booking_service_status_id($service_status_name); // Get the term ID

	// Update the the booking fields
	$booking_data = array(
		'reference_number' => $reference_number,
		'client_id' => sanitize_text_field($booking_details['client_id']),
		'barber_id' => sanitize_text_field($booking_details['barber_id']),
		'appointment_date' => sanitize_text_field($booking_details['appointment_date']),
		'appointment_time' => sanitize_text_field($booking_details['appointment_time']),
		'total_amount' => floatval($booking_details['total_amount']),
		'total_amount_currency' => sanitize_text_field($booking_details['total_amount_currency']),
		'booking_type' => sanitize_text_field($booking_details['booking_type']),
		'group_id' => sanitize_text_field($booking_details['group_id']),
		'services' => $services_ids,
		'service_status' => $service_status_id,
		'notes' => $booking_details['notes']
	);

	if (is_wp_error($saved_booking->save($booking_data))) {
		return false;
	}

	return $reference_number;
}

function get_booking_service_status_id($term_name)
{
	$term = get_term_by('name', $term_name, 'booking_service_status'); // Get term by name in the 'booking_service_status' taxonomy
	return $term ? $term->term_id : null; // Return term ID or null if not found
}

function generate_unique_reference_number($latest_post_id)
{
	// Format the reference number using the latest post ID
	return 'DSC-BK-' . ($latest_post_id + 1);
}

function send_booking_email($booking_type, $email, $booking_email_details)
{
	$email_subject = "Your Booking Confirmation";

	if ($booking_type == 'group') {
		$email_message = "<p>Dear Customer,</p>";
		$email_message .= "<p>Thank you for choosing D'Shaver and Comb! We're excited to confirm your group appointment. Here are the details of your booking(s): </p>";

		$total_amount = 0;
		foreach ($booking_email_details as $booking_detail) {
			$total_amount += $booking_detail['total_amount'];
			// Construct booking details for each person in the group
			$email_message .= "<p><strong>Booking Details:</strong></p>";
			$email_message .= "<p>Ref No: " . esc_html($booking_detail['reference_number']) . "</p>";
			$email_message .= "<p>Name: " . esc_html($booking_detail['client_name']) . "</p>";
			$email_message .= "<p>Barber: " . esc_html($booking_detail['barber_name']) . "</p>";
			$email_message .= "<p>Services: " . esc_html($booking_detail['services']) . "</p>";
			$email_message .= "<p>Amount: " . "$" . esc_html($booking_detail['total_amount']) . "</p>";
			$email_message .= "<hr>";
		}

		$appointment_date = $booking_email_details[0]['appointment_date'];
		$appointment_time = $booking_email_details[0]['appointment_time'];

		$email_message .= "<p>Total Amount: " . esc_html($total_amount) . "</p>";
		$email_message .= "<p>Appointment Date: " . esc_html($appointment_date) . "</p>";
		$email_message .= "<p>Appointment Time: " . esc_html($appointment_time) . "</p>";
		$email_message .= "<p>Location: 490 Pakuranga Road, Half Moon Bay, Auckland</p>";
		$email_message .= "<hr>";

		$email_message .= "<p>Thank you for your payment and booking with us.</p>";
		$email_message .= "<p>Best regards,<br>D'Shaver and Comb</p>";
	} else {
		// Single booking - directly use the booking details
		$email_message = "<p>Dear " . esc_html($booking_email_details['client_name']) . ",</p>";
		$email_message .= "<p>Thank you for choosing D'Shaver and Comb! We're excited to confirm your appointment. Here are the details of your booking: </p>";
		$email_message .= "<p><strong>Booking Details:</strong></p>";
		$email_message .= "<p>Ref No: " . esc_html($booking_email_details['reference_number']) . "</p>";
		$email_message .= "<p>Name: " . esc_html($booking_email_details['client_name']) . "</p>";
		$email_message .= "<p>Barber: " . esc_html($booking_email_details['barber_name']) . "</p>";
		$email_message .= "<p>Appointment Date: " . esc_html($booking_email_details['appointment_date']) . "</p>";
		$email_message .= "<p>Appointment Time: " . esc_html($booking_email_details['appointment_time']) . "</p>";
		$email_message .= "<p>Services: " . esc_html($booking_email_details['services']) . "</p>";
		$email_message .= "<p>Total Amount: " . "$" . esc_html($booking_email_details['total_amount']) . "</p>";
		$email_message .= "<p>Location: 490 Pakuranga Road, Half Moon Bay, Auckland</p>";
		$email_message .= "<p>Thank you for your payment and booking with us.</p>";
		$email_message .= "<p>Best regards,<br>D'Shaver and Comb</p>";
	}

	// Email headers for HTML content
	$headers = array('Content-Type: text/html; charset=UTF-8');

	// Send email to the email address
	$booking_email_result = wp_mail($email, $email_subject, $email_message, $headers);
	if (!$booking_email_result) {
		error_log('Failed to send notification email to: ' . $email);
		return false;
	} else {
		error_log('Successfully sent notification email to: ' . $email);
		return true;
	}
}

/**
 * Creates a database table to store booking notifications.
 *
 * @return void
 */
function create_notifications_table()
{
	global $wpdb;
	$table_name = $wpdb->prefix . 'admin_notifications';

	// SQL to create the table if it doesn't exist
	$sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        booking_reference_number varchar(255) NOT NULL,
        client_fullname varchar(255) NOT NULL,
		selected_barber varchar(255) NOT NULL,
        appointment_date date NOT NULL,
        appointment_time time NOT NULL,
        timestamp datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        `read` tinyint(1) DEFAULT 0 NOT NULL,
        PRIMARY KEY  (id)
    ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
	dbDelta($sql);
}

// Trigger the function upon theme activation
add_action('after_switch_theme', 'create_notifications_table');

/**
 * Function to store notifications in the database.
 *
 * @param string $reference_number The booking reference number.
 * @param string $client_fullname The full name of the client.
 * @param string $appointment_date The date of the appointment.
 * @param string $appointment_time The time of the appointment.
 * @return void
 */
function create_booking_notification($reference_number, $client_fullname, $barber_name, $appointment_date, $appointment_time)
{
	global $wpdb;

	$table_name = $wpdb->prefix . 'admin_notifications';

	// Create the notification (e.g., booking successful)
	$wpdb->insert(
		$table_name,
		array(
			'booking_reference_number' => $reference_number,
			'client_fullname' => $client_fullname,
			'selected_barber' => $barber_name,
			'appointment_date' => $appointment_date,
			'appointment_time' => $appointment_time,
			'timestamp' => current_time('mysql'),
			'read' => 0 // Unread notification
		)
	);

	// Log success message
	if ($wpdb->insert_id) {
		error_log("Notification created successfully with ID: " . $wpdb->insert_id);
	} else {
		error_log("Failed to create notification: " . $wpdb->last_error);
	}
}
/** CUSTOM ENDPOINT - ADD BOOKING */

/** CUSTOM ENDPOINT - ADD WALK-IN BOOKING */
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/walk-ins-booking', array(
		'methods' => 'POST',
		'callback' => 'add_new_walk_in_booking_callback',
		'permission_callback' => function () {
			return wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});

function add_new_walk_in_booking_callback($request)
{
	$clientSelectionType = sanitize_text_field($request->get_param('clientSelectionType'));
	$services = $request->get_param('selectedServices');
	$date = sanitize_text_field($request->get_param('selectedBookingDate'));
	$time = sanitize_text_field($request->get_param('selectedBookingTime'));
	$total_price = floatval($request->get_param('totalPrice'));

	// Validate total_price
	if ($total_price < 0) {
		return rest_ensure_response(array('success' => false, 'message' => 'Total price must be a positive number'), 404);
	}

	if (empty($services) || empty($date) || empty($time)) {
		return rest_ensure_response(array('success' => false, 'message' => 'Missing required fields'), 404);
	}

	if ($clientSelectionType || !is_string($clientSelectionType)) {
		rest_ensure_response(array('success' => false, 'message' => 'Client selection type is required'), 404);
	}


	// add wp transients in order to prevent race conditions
	$booking_key = "booking_{$date}_{$time}";
	$is_locked = get_transient($booking_key);

	if ($is_locked) {
		return rest_ensure_response(array(
			'success' => false,
			'message' => 'This time slot is currently being booked by another user. Please try again.',
		), 409);
	}
	// Set a transient lock for 30 seconds
	set_transient($booking_key, true, 30);


	// ** Check for booking conflicts
	$total_duration = 0;
	foreach ($services as $service) {
		$service_id = $service['serviceId'];
		$duration = get_post_meta($service_id, 'serviceDuration', true);
		$total_duration += intval($duration);
	}
	$total_duration = max($total_duration, 15);
	$conflict = check_booking_conflict($date, $time, $total_duration);
	if ($conflict) {
		return rest_ensure_response(array(
			'success' => false,
			'message' => 'This time slot is no longer available. Please choose another time.',
		), 409); // 409 Conflict
	}

	if (strtolower($clientSelectionType) === 'new') {
		$customer = sanitize_text_field($request->get_param('fullName'));
		$email_address = sanitize_email($request->get_param('emailAddress'));
		$mobile_number = sanitize_text_field($request->get_param('contactNumber')) ?? '';
		$date_of_birth = sanitize_text_field($request->get_param('dateOfBirth')) ?? '';

		if (empty($customer) || empty($email_address)) {
			return rest_ensure_response(array('success' => false, 'message' => 'Missing required fields'), 404);
		}

		// validation for date of birth
		$date_of_birth_obj = null;
		if ($date_of_birth !== '') {
			$date_of_birth_obj = DateTime::createFromFormat('Y-m-d', $date_of_birth);
		}

		if ($date_of_birth_obj !== null && $date_of_birth_obj->format('Y-m-d') !== $date_of_birth) {
			return rest_ensure_response(array('success' => false, 'message' => 'Invalid date format for date of birth. Expected format: YYYY-MM-DD'), 404);
		}

		// 1. create or get client details
		$client_details = array(
			'customer_name' => $customer,
			'email_address' => $email_address,
			'mobile_number' => $mobile_number,
			'date_of_birth' => $date_of_birth_obj
		);

		$client = create_or_get_client($client_details);

		if (!$client) {
			return rest_ensure_response(array('success' => false, 'message' => 'Failed to create or get client'), 404);
		}
	} else if (strtolower($clientSelectionType) === 'existing') {
		$existing_client_id = intval($request->get_param('walkInClientId'));
		$client_pod = pods('client', $existing_client_id);

		if ($client_pod->exists()) {
			$full_name = $client_pod->field('full_name');
			$email_address = $client_pod->field('email_address');
		}

		$client = array(
			'id' => $existing_client_id,
			'full_name' => $full_name
		);
	} else {
		return rest_ensure_response(array('success' => false, 'message' => 'Invalid client selection type'), 404);
	}

	$currency = $services[0]['servicePriceCurrency'];
	// 2. create booking
	$booking_details = array(
		'client_id' => $client['id'],
		'client_name' => $client['full_name'],
		'appointment_date' => $date,
		'appointment_time' => $time,
		'total_amount' => $total_price,
		'total_amount_currency' => $currency,
		'services' => $services,
		'service_status' => 'Pending', // Set the initial service status
		'notes' => ''
	);
	$booking_reference_number = create_booking_post($booking_details);
	if (!$booking_reference_number) {
		return rest_ensure_response(array('success' => false, 'message' => 'Failed to create booking'), 404);
	}

	// 3. create booking notification
	create_booking_notification($booking_reference_number, $client['full_name'], $date, $time);

	// 4. send confirmation email
	$services_list = [];
	foreach ($services as $item) {
		$service = sanitize_text_field($item['serviceName'] ?? '');
		$services_list[] = $service;
	}

	$booking_email_details = array(
		'reference_number' => $booking_reference_number,
		'client_name' => $client['full_name'],
		'appointment_date' => $date,
		'appointment_time' => $time,
		'total_amount' => $total_price,
		'services' => implode(', ', $services_list)
	);

	$booking_confirmation_sent = send_booking_email($email_address, $booking_email_details);

	// Delete the transient lock here, before returning the response
	delete_transient($booking_key);

	if (!$booking_confirmation_sent) {
		return rest_ensure_response(array(
			'success' => true,
			'message' => 'Booking was successful but failed to send confirmation email. Please contact us at +64224259522',
			'data' => array(
				'booking_reference_number' => $booking_reference_number,
				'client_name' => $client['full_name'],
				'appointment_date' => $date,
				'appointment_time' => $time,
				'total_amount' => $total_price,
				'services' => implode(', ', $services_list)

			)
		), 200);
	} else {
		return rest_ensure_response(array(
			'success' => true,
			'message' => 'Booking created successfully',
			'data' => array(
				'booking_reference_number' => $booking_reference_number,
				'client_name' => $client['full_name'],
				'appointment_date' => $date,
				'appointment_time' => $time,
				'total_amount' => $total_price,
				'services' => implode(', ', $services_list)

			)
		), 200);
	}
}
/** CUSTOM ENDPOINT - ADD WALK-IN BOOKING */

/** CUSTOM ENDPOINT - WEBSOCKET NOTIFICATIONS */
// Add AJAX handler to fetch unread notifications
add_action('wp_ajax_get_admin_notifications', 'get_admin_notifications');
function get_admin_notifications()
{
	// Check if user is an admin
	if (!is_user_logged_in()) {
		wp_send_json_error('Unauthorized', 403);
		return;
	}

	global $wpdb;
	$table_name = $wpdb->prefix . 'admin_notifications';

	$notifications = $wpdb->get_results("SELECT * FROM $table_name ORDER BY timestamp DESC");
	$unread_notifications = array_filter($notifications, function ($notification) {
		return $notification->read === "0";
	});
	// Count notifications for use in JS
	$unread_notifications_count = count($unread_notifications);

	// Return both the count and the notification data
	wp_send_json_success(array(
		'unread_count' => $unread_notifications_count,
		'notifications' => $notifications,
	));
}
/** CUSTOM ENDPOINT - WEBSOCKET NOTIFICATIONS */

/** CUSTOM ENDPOINT - MARK NOTIFICATIONS AS READ **/
// Mark notifications as read
add_action('wp_ajax_mark_notifications_as_read', 'mark_notifications_as_read');
function mark_notifications_as_read()
{
	// Check if user is an admin
	if (!is_user_logged_in()) {
		wp_send_json_error('Unauthorized', 403);
		return;
	}

	global $wpdb;
	$table_name = $wpdb->prefix . 'admin_notifications';


	// Update all unread notifications to read
	$updated_rows = $wpdb->update(
		$table_name,
		array('read' => 1), // Set 'read' column to 1 (mark as read)
		array('read' => 0) // Only update records where 'read' column is 0 (unread)
	);

	// Debugging: Check how many rows were updated
	if ($updated_rows === false) {
		error_log("Error in updating notifications: " . $wpdb->last_error);
	} else {
		error_log("Number of rows updated: " . $updated_rows);
	}

	wp_send_json_success();
}
/** CUSTOM ENDPOINT - MARK NOTIFICATIONS AS READ **/

/** CUSTOM ENDPOINT - UPDATE BOOKING STATUS/DETAILS */
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/update-service-status', array(
		'methods' => 'POST',
		'callback' => 'update_service_status_callback',
		'permission_callback' => function () {
			return is_user_logged_in() && wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});


function update_service_status_callback($request)
{
	// Get the parameters from the request
	$reference_number = sanitize_text_field($request['reference_number']);
	$service_status = sanitize_text_field($request['service_status']);

	// Find the booking by reference_number
	$args = array(
		'post_type' => 'booking',
		'meta_query' => array(
			array(
				'key' => 'reference_number', // The meta key for your transaction ID
				'value' => $reference_number,
				'compare' => '='
			)
		)
	);

	$booking_query = new WP_Query($args);

	// Check if any post was found
	if ($booking_query->have_posts()) {
		$booking_post = $booking_query->posts[0]; // Get the first matched post

		// Get the term ID from the taxonomy using the service status value
		$term = get_term_by('name', $service_status, 'booking_service_status');

		if ($term) {
			// Update the custom field with the term ID
			update_post_meta($booking_post->ID, 'service_status', $term->term_id);

			// Return the success response
			return rest_ensure_response(array(
				'success' => true,
				'message' => 'Service status updated successfully'
			), 200);
		} else {
			// Return an error if the term was not found
			return rest_ensure_response(array(
				'success' => false,
				'message' => 'Service status term not found'
			), 404);
		}
	} else {
		// Return the error response
		return rest_ensure_response(array(
			'success' => false,
			'message' => 'Booking not found'
		), 404);
	}
}
/** CUSTOM ENDPOINT - UPDATE BOOKING STATUS/DETAILS */

/** CUSTOM ENDPOINT - UPDATE BOOKING STATUS/DETAILS - COMPLETED */
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/update-service-completed-status', array(
		'methods' => 'POST',
		'callback' => 'update_service_status_completed_callback',
		'permission_callback' => function () {
			return is_user_logged_in() && wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});


function update_service_status_completed_callback($request)
{
	$upload_dir = wp_upload_dir();

	// Booking related
	$reference_number = sanitize_text_field($request->get_param('reference_number'));
	$service_status = sanitize_text_field($request->get_param('service_status'));

	// Client related
	$client_id = sanitize_text_field($request->get_param('client_id'));
	$service_id = sanitize_text_field($request->get_param('service_id'));
	$image_urls = [];
	$customer_notes = sanitize_text_field($request->get_param('customer_notes'));

	if (!empty($_FILES['haircut_images']) && is_array($_FILES['haircut_images']['name'])) {
		$uploaded_files = $_FILES['haircut_images'];

		foreach ($uploaded_files['name'] as $key => $filename) {
			if ($uploaded_files['error'][$key] === UPLOAD_ERR_OK) {
				$file = array(
					'name'     => $filename,
					'type'     => $uploaded_files['type'][$key],
					'tmp_name' => $uploaded_files['tmp_name'][$key],
					'error'    => $uploaded_files['error'][$key],
					'size'     => $uploaded_files['size'][$key],
				);

				// Move the uploaded file to the uploads directory
				$target_file = $upload_dir['path'] . '/' . basename($file['name']);

				// Move the file
				if (move_uploaded_file($file['tmp_name'], $target_file)) {
					// Store the file URL
					$image_urls[] = $upload_dir['url'] . '/' . basename($file['name']);
				} else {
					return rest_ensure_response(array(
						'success' => false,
						'message' => 'Error uploading one of the images.'
					), 400);
				}
			} elseif ($uploaded_files['error'][$key] !== UPLOAD_ERR_NO_FILE) {
				return rest_ensure_response(array(
					'success' => false,
					'message' => 'Error with file upload: ' . $uploaded_files['error'][$key]
				), 400);
			}
		}
	}

	// 1. Update the client CPT
	$client_updated = update_client_details($client_id, $service_id, $image_urls);
	if (!$client_updated) {
		return rest_ensure_response(array(
			'success' => false,
			'message' => 'Client not found or failed to update'
		), 404);
	}

	// 2. Update the booking CPT
	$booking_updated = update_booking_status($reference_number, $service_status, $customer_notes);
	if (!$booking_updated) {
		return rest_ensure_response(array(
			'success' => false,
			'message' => 'Booking not found or service status update failed'
		), 404);
	}

	// Return success response
	return rest_ensure_response(array(
		'success' => true,
		'message' => 'Client and booking details updated successfully',
	), 200);
}


function update_client_details($client_id, $service_id, $uploaded_images)
{
	// Ensure WordPress functions are loaded
	if (!function_exists('media_sideload_image')) {
		require_once(ABSPATH . 'wp-admin/includes/media.php');
		require_once(ABSPATH . 'wp-admin/includes/file.php');
		require_once(ABSPATH . 'wp-admin/includes/image.php');
	}

	$pod = pods('client', $client_id);

	// Check if the pod is valid
	if ($pod->exists()) {
		$pod->save('last_haircut', $service_id);

		// Array to store attachment IDs
		$new_attachment_ids = [];

		// Loop through each uploaded image URL
		foreach ($uploaded_images as $image_url) {
			// Handle saving to WordPress media library and get the attachment ID
			$attachment_id = media_sideload_image($image_url, $client_id, null, 'id');

			if (!is_wp_error($attachment_id)) {
				// Add the attachment ID to the array
				$new_attachment_ids[] = $attachment_id;
			} else {
				error_log('Failed to sideload image: ' . $image_url);
			}
		}

		// Save the attachment IDs to the Pods 'images' field
		if (!empty($new_attachment_ids)) {
			$existing_images = $pod->field('images');

			if (!empty($existing_images)) {
				// If existing images are associative arrays, extract the IDs
				$existing_attachment_ids = array_map(function ($image) {
					return is_array($image) ? $image['ID'] : $image;
				}, $existing_images);
			} else {
				$existing_attachment_ids = [];
			}

			// Merge existing IDs with new ones
			$attachment_ids = array_merge($existing_attachment_ids, $new_attachment_ids);

			// Save the merged attachment IDs
			$pod->save('images', $attachment_ids);
		} else {
			error_log('No valid attachment IDs found to save.');
		}

		return true;
	}

	return false;
}

function update_booking_status($reference_number, $service_status, $customer_notes)
{
	// Find the booking by reference_number
	$booking_query = array(
		'post_type' => 'booking',
		'meta_query' => array(
			array(
				'key' => 'reference_number',
				'value' => $reference_number,
				'compare' => '='
			)
		)
	);

	$booking_query = new WP_Query($booking_query);

	// Check if any post was found
	if ($booking_query->have_posts()) {
		$booking_post = $booking_query->posts[0]; // Get the first matched post

		// Get the term ID from the taxonomy using the service status value
		$term = get_term_by('name', $service_status, 'booking_service_status');

		if ($term) {
			update_post_meta($booking_post->ID, 'service_status', $term->term_id);
			update_post_meta($booking_post->ID, 'notes', $customer_notes);
			return true;
		}
	}

	return false;
}
/** CUSTOM ENDPOINT - UPDATE BOOKING STATUS/DETAILS - COMPLETED */

/** CUSTOM ENDPOINT - RESCHEDULE BOOKING */
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/reschedule-booking', array(
		'methods' => 'POST',
		'callback' => 'reschedule_booking_callback',
		'permission_callback' => function () {
			return is_user_logged_in() && wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});


function reschedule_booking_callback($request)
{
	// Get the parameters from the request
	$reference_number = sanitize_text_field($request['bookingRefNumber']);
	$appointment_date = sanitize_text_field($request['reschedDate']);
	$appointment_time = sanitize_text_field($request['reschedTime']);

	// Create a booking key for the transient
	$booking_key = "booking_{$appointment_date}_{$appointment_time}";
	$is_locked = get_transient($booking_key);

	if ($is_locked) {
		return rest_ensure_response(array(
			'success' => false,
			'message' => 'This time slot is currently being booked by another user. Please try again.',
		), 409);
	}

	// Set a transient lock for 30 seconds
	set_transient($booking_key, true, 30);


	// Find the booking by reference_number
	$args = array(
		'post_type' => 'booking',
		'meta_query' => array(
			array(
				'key' => 'reference_number', // The meta key for your transaction ID
				'value' => $reference_number,
				'compare' => '='
			)
		)
	);

	$booking_query = new WP_Query($args);

	// Check if any post was found
	if ($booking_query->have_posts()) {
		$booking_post = $booking_query->posts[0];

		// Get the services for this booking
		$services = get_post_meta($booking_post->ID, 'services', true);

		// Calculate total duration
		$total_duration = 0;
		foreach ($services as $service_id) {
			$duration = get_post_meta($service_id, 'duration_in_minutes', true);
			$total_duration += intval($duration);
		}
		$total_duration = max($total_duration, 15); // Ensure minimum 15 minutes

		// Check for booking conflicts
		$conflict = check_booking_conflict($appointment_date, $appointment_time, $total_duration, $booking_post->ID);
		if ($conflict) {
			return rest_ensure_response(array(
				'success' => false,
				'message' => 'This time slot is no longer available. Please choose another time.',
			), 409); // 409 Conflict
		}

		$pod = pods('booking', $booking_post->ID);

		if ($pod->exists()) {
			$pod->save('appointment_date', $appointment_date);
			$pod->save('appointment_time', $appointment_time);

			return rest_ensure_response(array(
				'success' => true,
				'message' => 'Booking date and time updated successfully'
			), 200);
		} else {
			return rest_ensure_response(array(
				'success' => false,
				'message' => 'Booking not found'
			), 404);
		}
	} else {
		// Return the error response
		return rest_ensure_response(array(
			'success' => false,
			'message' => 'Booking not found'
		), 404);
	}
}
/** CUSTOM ENDPOINT - RESCHEDULE BOOKING */

/** CUSTOM ENDPOINT - GET CLIENTS LIST*/
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/clients-list', array(
		'methods' => 'GET',
		'callback' => 'get_clients_list_callback',
		'permission_callback' => function () {
			return is_user_logged_in() && wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});

function get_clients_list_callback()
{
	$clients_data = [];

	// Query the bookings CPT
	$args = array(
		'post_type' => 'client',
		'posts_per_page' => -1,
	);

	$client_query = new WP_Query($args);

	if ($client_query->have_posts()) {
		while ($client_query->have_posts()) {
			$client_query->the_post();

			// LAST HAIRCUT
			$last_haircut_id = get_post_meta(get_the_ID(), 'last_haircut', true);
			$last_haircut_post = get_post($last_haircut_id);
			$last_haircut = '';

			if ($last_haircut_post) {
				$last_haircut = get_field('service_name', $last_haircut_id);
			}

			// IMAGES
			$image_ids = get_post_meta(get_the_ID(), 'images', false);
			$images = array();

			if (!empty($image_ids) && is_array($image_ids)) {
				foreach ($image_ids as $image_id) {
					$image_url = wp_get_attachment_url($image_id);
					if ($image_url) {
						$images[] = array(
							'id' => $image_id,
							'url' => $image_url
						);
					}
				}
			}

			$client_data = array(
				'client_id' => get_the_ID(),
				'full_name' => get_post_meta(get_the_ID(), 'full_name', true),
				'email_address' => get_post_meta(get_the_ID(), 'email_address', true),
				'date_of_birth' => get_post_meta(get_the_ID(), 'date_of_birth', true),
				'mobile_number' => get_post_meta(get_the_ID(), 'mobile_number', true),
				'last_haircut' => $last_haircut,
				'images' => $images,
			);

			$clients_data[] = $client_data;
		}
		wp_reset_postdata(); // Reset post data after the loop
	}

	return rest_ensure_response(array(
		'success' => true,
		'data' => $clients_data
	), 200); // Return the booking data as a JSON response
}
/** CUSTOM ENDPOINT - GET CLIENTS LIST*/

/** CUSTOM ENDPOINT - UPDATE CLIENT IMAGES */
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/update-client-images', array(
		'methods' => 'POST',
		'callback' => 'update_client_images_callback',
		'permission_callback' => function () {
			return is_user_logged_in() && wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});


function update_client_images_callback($request)
{
	$upload_dir = wp_upload_dir();

	$client_id = sanitize_text_field($request->get_param('client_id'));
	$client_name = sanitize_text_field($request->get_param('client_name'));
	$image_urls = [];

	if (!empty($_FILES['haircut_images']) && is_array($_FILES['haircut_images']['name'])) {
		$uploaded_files = $_FILES['haircut_images'];

		foreach ($uploaded_files['name'] as $key => $filename) {
			if ($uploaded_files['error'][$key] === UPLOAD_ERR_OK) {
				$file = array(
					'name'     => $filename,
					'type'     => $uploaded_files['type'][$key],
					'tmp_name' => $uploaded_files['tmp_name'][$key],
					'error'    => $uploaded_files['error'][$key],
					'size'     => $uploaded_files['size'][$key],
				);

				// Move the uploaded file to the uploads directory
				$target_file = $upload_dir['path'] . '/' . basename($file['name']);

				// Move the file
				if (move_uploaded_file($file['tmp_name'], $target_file)) {
					// Store the file URL
					$image_urls[] = $upload_dir['url'] . '/' . basename($file['name']);
				} else {
					return rest_ensure_response(array(
						'success' => false,
						'message' => 'Error uploading one of the images.'
					), 400);
				}
			} elseif ($uploaded_files['error'][$key] !== UPLOAD_ERR_NO_FILE) {
				return rest_ensure_response(array(
					'success' => false,
					'message' => 'Error with file upload: ' . $uploaded_files['error'][$key]
				), 400);
			}
		}
	}

	// 1. Update the client CPT
	$client_updated = update_client_images($client_id, $image_urls);
	if (!$client_updated) {
		return rest_ensure_response(array(
			'success' => false,
			'message' => 'Client not found or failed to update images'
		), 404);
	}

	// Return success response
	return rest_ensure_response(array(
		'success' => true,
		'message' => 'Client images updated successfully',
	), 200);
}


function update_client_images($client_id, $uploaded_images)
{
	// Ensure WordPress functions are loaded
	if (!function_exists('media_sideload_image')) {
		require_once(ABSPATH . 'wp-admin/includes/media.php');
		require_once(ABSPATH . 'wp-admin/includes/file.php');
		require_once(ABSPATH . 'wp-admin/includes/image.php');
	}

	$pod = pods('client', $client_id);

	// Check if the pod is valid
	if ($pod->exists()) {

		// Array to store attachment IDs
		$new_attachment_ids = [];

		// Loop through each uploaded image URL
		foreach ($uploaded_images as $image_url) {
			// Handle saving to WordPress media library and get the attachment ID
			$attachment_id = media_sideload_image($image_url, $client_id, null, 'id');

			if (!is_wp_error($attachment_id)) {
				// Add the attachment ID to the array
				$new_attachment_ids[] = $attachment_id;
			} else {
				error_log('Failed to sideload image: ' . $image_url);
			}
		}

		// Save the attachment IDs to the Pods 'images' field
		if (!empty($new_attachment_ids)) {
			$existing_images = $pod->field('images');

			if (!empty($existing_images)) {
				// If existing images are associative arrays, extract the IDs
				$existing_attachment_ids = array_map(function ($image) {
					return is_array($image) ? $image['ID'] : $image;
				}, $existing_images);
			} else {
				$existing_attachment_ids = [];
			}

			// Merge existing IDs with new ones
			$attachment_ids = array_merge($existing_attachment_ids, $new_attachment_ids);

			// Save the merged attachment IDs
			$pod->save('images', $attachment_ids);
		} else {
			error_log('No valid attachment IDs found to save.');
		}

		return true;
	}

	return false;
}
/** CUSTOM ENDPOINT - UPDATE CLIENT IMAGES */

/** CUSTOM ENDPOINT - DELETE CLIENT IMAGE CALLBACK */
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/delete-client-image', array(
		'methods' => 'DELETE',
		'callback' => 'delete_client_image_callback',
		'permission_callback' => function () {
			return is_user_logged_in() && wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});


function delete_client_image_callback($request)
{
	$client_id = sanitize_text_field($request->get_param('client_id'));
	$image_id = sanitize_text_field($request->get_param('image_id'));

	// 1. Delete the image attached to the Client CPT
	$client_updated = delete_client_image($client_id, $image_id);
	if (!$client_updated) {
		return rest_ensure_response(array(
			'success' => false,
			'message' => 'Client not found or failed to update images'
		), 404);
	}

	// Return success response
	return rest_ensure_response(array(
		'success' => true,
		'message' => 'Client image deleted successfully',
	), 200);
}


function delete_client_image($client_id, $image_id)
{
	// Ensure WordPress functions are loaded
	if (!function_exists('media_sideload_image')) {
		require_once(ABSPATH . 'wp-admin/includes/media.php');
		require_once(ABSPATH . 'wp-admin/includes/file.php');
		require_once(ABSPATH . 'wp-admin/includes/image.php');
	}

	$pod = pods('client', $client_id);

	// Check if the pod is valid
	if ($pod->exists()) {

		$existing_images = $pod->field('images');

		if (!empty($existing_images)) {
			// Extract IDs from existing images (if associative arrays)
			$existing_attachment_ids = array_map(function ($image) {
				return is_array($image) ? $image['ID'] : $image;
			}, $existing_images);
		} else {
			$existing_attachment_ids = [];
		}

		// Check if the image ID exists in the list
		if (($key = array_search($image_id, $existing_attachment_ids)) !== false) {
			// Remove the image ID from the array
			unset($existing_attachment_ids[$key]);

			// Re-index the array to maintain correct ordering
			$existing_attachment_ids = array_values($existing_attachment_ids);

			// Save the updated attachment IDs
			$pod->save('images', $existing_attachment_ids);

			return true;
		} else {
			error_log("Image ID $image_id not found for client $client_id.");
		}
	}

	return false;
}

/** CUSTOM ENDPOINT - DELETE CLIENT IMAGE CALLBACK */

/** CUSTOM ENDPOINT - GET CLIENT HAIRCUTS */
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/client-haircuts', array(
		'methods' => 'GET',
		'callback' => 'get_client_haircuts_fallback',
		'permission_callback' => function () {
			return is_user_logged_in() && wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});


function get_client_haircuts_fallback()
{
	// Define query arguments
	$args = array(
		'post_type'      => 'service', // The custom post type
		'posts_per_page' => -1,        // Get all posts
		'tax_query'      => array(
			array(
				'taxonomy' => 'service-type',
				'field'    => 'name',
				'terms'    => 'Hair',
			),
		),
	);

	// Query the posts
	$services = new WP_Query($args);

	// If posts are found, loop through them
	if ($services->have_posts()) {
		while ($services->have_posts()) {
			$services->the_post();
			$response[] = array(
				'id' => get_the_ID(),
				'title' => get_the_title(), // Post title
			);
		}
	}

	// Return the response as JSON
	wp_reset_postdata();

	return rest_ensure_response(array(
		'success' => true,
		'data' => $response,
	), 200);
}
/** CUSTOM ENDPOINT - GET CLIENT HAIRCUTS */


/** CUSTOM ENDPOINT - ADD NEW CLIENT */
add_action('rest_api_init', function () {
	register_rest_route('dshaver_and_comb/api/v1', '/add-new-client', array(
		'methods' => 'POST',
		'callback' => 'add_new_client_fallback',
		'permission_callback' => function () {
			return is_user_logged_in() && wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'], 'wp_rest') !== false;
		}
	));
});


function add_new_client_fallback($request)
{
	$upload_dir = wp_upload_dir();

	// client details
	$client_name = sanitize_text_field($request->get_param('client_name'));
	$client_contact_number = sanitize_text_field($request->get_param('client_contact_number'));
	$client_email = sanitize_text_field($request->get_param('client_email'));
	$client_date_of_birth = sanitize_text_field($request->get_param('client_date_of_birth'));
	$client_haircut = sanitize_text_field($request->get_param('client_haircut'));

	$image_urls = [];

	if (!empty($_FILES['client_haircut_images']) && is_array($_FILES['client_haircut_images']['name'])) {
		$uploaded_files = $_FILES['client_haircut_images'];

		foreach ($uploaded_files['name'] as $key => $filename) {
			if ($uploaded_files['error'][$key] === UPLOAD_ERR_OK) {
				$file = array(
					'name'     => $filename,
					'type'     => $uploaded_files['type'][$key],
					'tmp_name' => $uploaded_files['tmp_name'][$key],
					'error'    => $uploaded_files['error'][$key],
					'size'     => $uploaded_files['size'][$key],
				);

				// Move the uploaded file to the uploads directory
				$target_file = $upload_dir['path'] . '/' . basename($file['name']);

				// Move the file
				if (move_uploaded_file($file['tmp_name'], $target_file)) {
					// Store the file URL
					$image_urls[] = $upload_dir['url'] . '/' . basename($file['name']);
				} else {
					return rest_ensure_response(array(
						'success' => false,
						'message' => 'Error uploading one of the images.'
					), 400);
				}
			} elseif ($uploaded_files['error'][$key] !== UPLOAD_ERR_NO_FILE) {
				return rest_ensure_response(array(
					'success' => false,
					'message' => 'Error with file upload: ' . $uploaded_files['error'][$key]
				), 400);
			}
		}
	}

	// check if client exists
	$client_exists = check_if_client_exists($client_email, $client_contact_number);
	if ($client_exists) {
		return rest_ensure_response(array(
			'success' => false,
			'message' => 'Client already exists'
		), 400);
	}

	// 1. Update the client CPT
	$client_created = create_client($client_name, $client_contact_number, $client_email, $client_date_of_birth, $client_haircut, $image_urls);
	if (!$client_created) {
		return rest_ensure_response(array(
			'success' => false,
			'message' => 'Client not found or failed to update'
		), 404);
	}

	// Return success response
	return rest_ensure_response(array(
		'success' => true,
		'message' => 'Client has been successfully added',
	), 200);
}

function create_client($client_name, $client_contact_number, $client_email, $client_date_of_birth, $client_haircut, $image_urls)
{
	// Ensure WordPress functions are loaded
	if (!function_exists('media_sideload_image')) {
		require_once(ABSPATH . 'wp-admin/includes/media.php');
		require_once(ABSPATH . 'wp-admin/includes/file.php');
		require_once(ABSPATH . 'wp-admin/includes/image.php');
	}

	$new_client_pod = pods('client');
	$new_client_id = $new_client_pod->add(array(
		'post_title'  => sanitize_text_field($client_name),
		'post_status' => 'publish',
	));

	$saved_client = pods('client', $new_client_id);

	if (is_wp_error($saved_client)) {
		return false;
	}

	$new_attachment_ids = [];

	foreach ($image_urls as $image_url) {
		$attachment_id = media_sideload_image($image_url, $new_client_id, null, 'id');

		if (!is_wp_error($attachment_id)) {
			$new_attachment_ids[] = $attachment_id;
		} else {
			error_log('Failed to sideload image: ' . $image_url);
		}
	}

	$client_data = array(
		'full_name' => $client_name,
		'email_address' => $client_email,
		'date_of_birth' => $client_date_of_birth,
		'mobile_number' => $client_contact_number,
		'last_haircut' => $client_haircut,
		'images' => $new_attachment_ids,
	);
	$saved_client->save($client_data);
	return true;
}


function check_if_client_exists($client_email, $client_contact_number)
{
	// Query Pods for a client with the specified email (also lowercase in the query)
	$client = pods('client', array(
		'where' => "LOWER(email.meta_value) = '$client_email'", // Normalize for comparison
	));

	if (!$client->total()) {
		$client = pods('client', array(
			'where' => "mobile_number.meta_value = '$client_contact_number'",
		));
	}


	if ($client->total()) {
		return true;
	}
}
/** CUSTOM ENDPOINT - ADD NEW CLIENT */

/** START - GLOBAL DECLARATION OF FUNCTION TO RETRIEVE AND RENDER SERVICES */
if (!function_exists('display_services_by_type')) {
	function display_services_by_type($service_type)
	{
		$args = array(
			'post_type' => 'service',
			'posts_per_page' => -1,
			'tax_query' => array(
				array(
					'taxonomy' => 'service-type',
					'field'    => 'slug',
					'terms'    => $service_type,
				),
			),
		);

		$services_query = new WP_Query($args);

		if ($services_query->have_posts()) {
			while ($services_query->have_posts()) {
				$services_query->the_post();

				// Get custom fields
				$service_id = get_the_ID();
				$service_name = get_field('service_name');
				$duration_in_minutes = get_field('duration_in_minutes');
				$for_whom = get_field('for_whom');
				$service_description = get_field('service_description');
				$service_price = get_field('service_price');

				// Retrieve the service type (taxonomy term)
				$terms = wp_get_post_terms(get_the_ID(), 'service-type');
				$service_type_name = !empty($terms) ? $terms[0]->name : 'Unknown';
?>

				<div class="d-shaver-border d-shaver-list-group-item list-group-item list-group-item-action list-item-service p-0" aria-current="true"
					data-service-id="<?= esc_attr($service_id); ?>"
					data-service-name="<?= esc_attr($service_name); ?>"
					data-duration="<?= esc_attr($duration_in_minutes); ?>"
					data-for-whom="<?= esc_attr($for_whom); ?>"
					data-description="<?= esc_attr($service_description); ?>"
					data-price="<?= esc_attr($service_price); ?>"
					data-service-type="<?= esc_attr($service_type_name); ?>">
					<div class="d-flex flex-row justify-content-between align-items-center gap-3 gap-lg-5">
						<div>
							<h5 class="mb-2 fw-medium service-name-text d-shaver-h5"><?= esc_html($service_name); ?></h5>
							<p class="d-shaver-paragraph d-shaver-service-name mb-1 fw-light text-dark service-duration-for-whom-text"><?= esc_html($for_whom) . ' • ' . esc_html($duration_in_minutes) . ' mins'; ?></p>
							<p class="d-shaver-paragraph mb-4 fw-light text-dark service-description-text"><?= esc_html($service_description); ?></p>
							<p class="d-shaver-paragraph d-shaver-service-price mb-0 fw-normal service-price-text"><?= '$' . esc_html($service_price); ?></p>
						</div>
						<button type="button" class="d-shaver-service-item-add-btn btn btn-light btn-sm services-list-group-btn"><span><i class="d-shaver-service-item-add-icon fa-solid fa-plus"></i></span></button>
					</div>
				</div>

			<?php
			}
			wp_reset_postdata(); // Restore original Post Data
		} else {
			echo '<p>No services found for this category.</p>';
		}
	}
}


if (!function_exists('display_services_by_type_group')) {
	function display_services_by_type_group($service_type)
	{
		$args = array(
			'post_type' => 'service',
			'posts_per_page' => -1,
			'tax_query' => array(
				array(
					'taxonomy' => 'service-type',
					'field'    => 'slug',
					'terms'    => $service_type,
				),
			),
		);

		$services_query = new WP_Query($args);

		if ($services_query->have_posts()) {
			while ($services_query->have_posts()) {
				$services_query->the_post();

				// Get custom fields
				$service_id = get_the_ID();
				$service_name = get_field('service_name');
				$duration_in_minutes = get_field('duration_in_minutes');
				$for_whom = get_field('for_whom');
				$service_description = get_field('service_description');
				$service_price = get_field('service_price');

				// Retrieve the service type (taxonomy term)
				$terms = wp_get_post_terms(get_the_ID(), 'service-type');
				$service_type_name = !empty($terms) ? $terms[0]->name : 'Unknown';
			?>

				<div class="d-shaver-border d-shaver-list-group-item list-group-item list-group-item-action list-item-service-group p-0" aria-current="true"
					data-service-id="<?= esc_attr($service_id); ?>"
					data-service-name="<?= esc_attr($service_name); ?>"
					data-duration="<?= esc_attr($duration_in_minutes); ?>"
					data-for-whom="<?= esc_attr($for_whom); ?>"
					data-description="<?= esc_attr($service_description); ?>"
					data-price="<?= esc_attr($service_price); ?>"
					data-service-type="<?= esc_attr($service_type_name); ?>">
					<div class="d-flex flex-row justify-content-between align-items-center gap-3 gap-lg-5">
						<div>
							<h5 class="mb-2 fw-medium service-name-text d-shaver-h5"><?= esc_html($service_name); ?></h5>
							<p class="d-shaver-paragraph d-shaver-service-name mb-1 fw-light text-dark service-duration-for-whom-text"><?= esc_html($for_whom) . ' • ' . esc_html($duration_in_minutes) . ' mins'; ?></p>
							<p class="d-shaver-paragraph mb-4 fw-light text-dark service-description-text"><?= esc_html($service_description); ?></p>
							<p class="d-shaver-paragraph d-shaver-service-price mb-0 fw-normal service-price-text"><?= '$' . esc_html($service_price); ?></p>
						</div>
						<button type="button" class="d-shaver-service-item-add-btn btn btn-light btn-sm services-list-group-btn-group"><span><i class="d-shaver-service-item-add-icon fa-solid fa-plus"></i></span></button>
					</div>
				</div>

			<?php
			}
			wp_reset_postdata(); // Restore original Post Data
		} else {
			echo '<p>No services found for this category.</p>';
		}
	}
}


if (!function_exists('display_additional_services_group')) {
	function display_additional_services_group()
	{
		$args = array(
			'post_type' => 'service',
			'posts_per_page' => -1,
			'tax_query' => array(
				array(
					'taxonomy' => 'service-type',
					'field'    => 'slug',
					'terms'    => 'additional',
				),
			),
		);

		$services_query = new WP_Query($args);

		if ($services_query->have_posts()) {
			while ($services_query->have_posts()) {
				$services_query->the_post();

				// Get custom fields
				$service_id = get_the_ID();
				$service_name = get_field('service_name');
				$duration_in_minutes = get_field('duration_in_minutes');
				$for_whom = get_field('for_whom');
				$service_description = get_field('service_description');
				$service_price = get_field('service_price');

				// Retrieve the service type (taxonomy term)
				$terms = wp_get_post_terms(get_the_ID(), 'service-type');
				$service_type_name = !empty($terms) ? $terms[0]->name : 'Unknown';
			?>

				<div class="d-shaver-border d-shaver-list-group-item list-group-item list-group-item-action list-item-service-group-additional p-0" aria-current="true"
					data-service-id="<?= esc_attr($service_id); ?>"
					data-service-name="<?= esc_attr($service_name); ?>"
					data-duration="<?= esc_attr($duration_in_minutes); ?>"
					data-for-whom="<?= esc_attr($for_whom); ?>"
					data-description="<?= esc_attr($service_description); ?>"
					data-price="<?= esc_attr($service_price); ?>"
					data-service-type="<?= esc_attr($service_type_name); ?>">
					<div class="d-flex flex-row justify-content-between align-items-center gap-3 gap-lg-5">
						<div>
							<h5 class="mb-2 fw-medium service-name-text d-shaver-h5"><?= esc_html($service_name); ?></h5>
							<p class="d-shaver-paragraph d-shaver-service-name mb-1 fw-light text-dark service-duration-for-whom-text"><?= esc_html($for_whom) . ' • ' . esc_html($duration_in_minutes) . ' mins'; ?></p>
							<p class="d-shaver-paragraph mb-4 fw-light text-dark service-description-text"><?= esc_html($service_description); ?></p>
							<p class="d-shaver-paragraph d-shaver-service-price mb-0 fw-normal service-price-text"><?= '$' . esc_html($service_price); ?></p>
						</div>
						<button type="button" class="d-shaver-service-item-add-btn btn btn-light btn-sm services-list-group-btn-group-additional"><span><i class="d-shaver-service-item-add-icon fa-solid fa-plus"></i></span></button>
					</div>
				</div>

			<?php
			}
			wp_reset_postdata(); // Restore original Post Data
		} else {
			echo '<p>No services found for this category.</p>';
		}
	}
}
/** END - GLOBAL DECLARATION OF FUNCTION TO RETRIEVE AND RENDER SERVICES */

/** START - GLOBAL DECLARATION OF FUNCTION TO RETRIEVE AND RENDER SERVICES ON ADMIN PAGE*/
if (!function_exists('display_services_by_type_admin')) {
	function display_services_by_type_admin($service_type)
	{
		$args = array(
			'post_type' => 'service',
			'posts_per_page' => -1,
			'tax_query' => array(
				array(
					'taxonomy' => 'service-type',
					'field'    => 'slug',
					'terms'    => $service_type,
				),
			),
		);

		$services_query = new WP_Query($args);

		if ($services_query->have_posts()) {
			while ($services_query->have_posts()) {
				$services_query->the_post();

				// Get custom fields
				$service_id = get_the_ID();
				$service_name = get_field('service_name');
				$duration_in_minutes = get_field('duration_in_minutes');
				$for_whom = get_field('for_whom');
				$service_description = get_field('service_description');
				$service_price = get_field('service_price');

				// Retrieve the service type (taxonomy term)
				$terms = wp_get_post_terms(get_the_ID(), 'service-type');
				$service_type_name = !empty($terms) ? $terms[0]->name : 'Unknown';
			?>

				<div class="admin-list-group-border list-group-item list-group-item-action list-item-service py-4 px-3" aria-current="true"
					data-service-id="<?= esc_attr($service_id); ?>"
					data-service-name="<?= esc_attr($service_name); ?>"
					data-duration="<?= esc_attr($duration_in_minutes); ?>"
					data-for-whom="<?= esc_attr($for_whom); ?>"
					data-description="<?= esc_attr($service_description); ?>"
					data-price="<?= esc_attr($service_price); ?>"
					data-service-type="<?= esc_attr($service_type_name); ?>">
					<div class="d-flex flex-row align-items-center gap-3 gap-lg-4">
						<div class="flex-grow-1" style="min-width: 0;">
							<h5 class="mb-2 fw-medium service-name-text"><?= esc_html($service_name); ?></h5>
							<p class="d-shaver-service-name mb-1 fw-light text-dark service-duration-for-whom-text"><?= esc_html($for_whom) . ' • ' . esc_html($duration_in_minutes) . ' mins'; ?></p>
							<p class="mb-4 fw-light text-dark service-description-text"><?= esc_html($service_description); ?></p>
							<p class="d-shaver-service-price mb-0 fw-normal service-price-text"><?= '$' . esc_html($service_price); ?></p>
						</div>
						<button type="button" class="btn btn-light btn-sm services-list-group-btn"><span><i class="fa-solid fa-plus"></i></span></button>
					</div>
				</div>

<?php
			}
			wp_reset_postdata(); // Restore original Post Data
		} else {
			echo '<p>No services found for this category.</p>';
		}
	}
}
/** END - GLOBAL DECLARATION OF FUNCTION TO RETRIEVE AND RENDER SERVICES ON ADMIN PAGE*/
