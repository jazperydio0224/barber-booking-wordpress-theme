<?php
/*
Template Name: Booking Successful
*/

$booking_type = isset($_GET['bookingType']) ? sanitize_text_field($_GET['bookingType']) : '';
if ($booking_type === 'single') {
    $booking_reference_number = isset($_GET['bookingRefNumber']) ? sanitize_text_field($_GET['bookingRefNumber']) : '';
    $client_name = isset($_GET['clientName']) ? sanitize_text_field($_GET['clientName']) : '';
    $barber_name = isset($_GET['barberName']) ? sanitize_text_field($_GET['barberName']) : '';
    $appointment_date = isset($_GET['appointmentDate']) ? sanitize_text_field($_GET['appointmentDate']) : '';
    $appointment_time = isset($_GET['appointmentTime']) ? sanitize_text_field($_GET['appointmentTime']) : '';
    $total_amount = isset($_GET['totalAmount']) ? sanitize_text_field($_GET['totalAmount']) : '';
    $services = isset($_GET['services']) ? $_GET['services'] : '';

    if (!$booking_reference_number || !$client_name || !$barber_name || !$appointment_date || !$appointment_time || !$total_amount || !$services) {
        wp_redirect(home_url('/'));
        exit;
    }
} elseif ($booking_type === 'group') {
    $form_fillout_type = isset($_GET['formFilloutType']) ? sanitize_text_field($_GET['formFilloutType']) : '';
    $booking_details_raw = isset($_GET['bookingDetails']) ? $_GET['bookingDetails'] : '';

    // Step 1: URL-decode the string
    $decoded_url = urldecode($booking_details_raw);

    // Step 2: Remove the extra escape slashes that are causing the syntax error
    $decoded_json = stripslashes($decoded_url);

    // Step 3: Decode the JSON string
    $booking_details = json_decode($decoded_json, true);

    if (empty($booking_details)) {
        wp_redirect(home_url('/'));
        exit;
    }
}

get_header();
get_template_part('template-parts/components/header', 'nav');
?>

<main class="container-py min-vh-100 d-flex align-items-center justify-content-center">
    <div class="card shadow border-0 px-3 px-md-4 booking-result-card-container">
        <div class="card-body d-flex flex-column gap-3 justify-content-center align-items-center">
            <span><i class="fa-solid fa-circle-check text-success" style="font-size: 3rem;"></i></span>
            <h3 class="card-title d-shaver-h3 ">Booking Successful</h3>
            <p class="card-text text-center d-shaver-paragraph">Thanks for scheduling your appointment with us! We’re excited to have you in for a great grooming experience. If you need to make any changes or have any special requests, feel free to let us know. See you soon!</p>

            <?php if ($booking_type === 'single'): ?>
                <div class="d-flex flex-column gap-3 w-100">
                    <?php
                    $details = [
                        'Booking Reference Number' => htmlspecialchars($booking_reference_number),
                        'Client Name' => htmlspecialchars($client_name),
                        'Barber Name' => htmlspecialchars($barber_name),
                        'Appointment Date' => htmlspecialchars($appointment_date),
                        'Appointment Time' => htmlspecialchars($appointment_time),
                        'Total Amount' => '$' . htmlspecialchars($total_amount),
                        'Services' => htmlspecialchars($services)
                    ];
                    ?>
                    <?php foreach ($details as $label => $value): ?>
                        <div class="d-flex gap-2">
                            <span class="d-shaver-paragraph"><?= $label; ?>:</span>
                            <span class="d-shaver-paragraph fw-bold"><?= $value; ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <?php if ($booking_type === 'group' && !empty($booking_details)): ?>
                <div class="d-flex flex-column gap-3 w-100">
                    <?php
                    $total_booking_duration = 0;
                    $total_amount = 0;

                    foreach ($booking_details as $booking_detail):
                        $details = [
                            'Booking Reference Number' => htmlspecialchars($booking_detail['reference_number']),
                            'Client Name' => htmlspecialchars($booking_detail['client_name']),
                            'Barber Name' => htmlspecialchars($booking_detail['barber_name']),
                            'Appointment Date' => htmlspecialchars($booking_detail['appointment_date']),
                            'Appointment Time' => htmlspecialchars($booking_detail['appointment_time']),
                            'Amount' => '$' . htmlspecialchars($booking_detail['total_amount']),
                            'Services' => htmlspecialchars($booking_detail['services'])
                        ];

                        $total_amount += is_numeric($booking_detail['total_amount']) ? $booking_detail['total_amount'] : 0;
                        $total_booking_duration += is_numeric($booking_detail['booking_duration']) ? $booking_detail['booking_duration'] : 0;

                    ?>
                        <?php foreach ($details as $label => $value): ?>
                            <div class="d-flex gap-2">
                                <span class="d-shaver-paragraph"><?= $label; ?>:</span>
                                <span class="d-shaver-paragraph fw-bold"><?= $value; ?></span>
                            </div>
                        <?php endforeach; ?>

                        <hr class="w-100" />

                    <?php endforeach; ?>

                    <div class="d-flex gap-2">
                        <span class="d-shaver-paragraph">Total Amount:</span>
                        <span class="d-shaver-paragraph fw-bold">$<?= $total_amount; ?></span>
                    </div>
                </div>
            <?php endif; ?>

            <a href="<?= esc_url(home_url('/')); ?>" class="card-link btn dark-btn d-shaver-paragraph d-shaver-modal-btn">Back to Homepage</a>
        </div>
    </div>
</main>

<?php
get_template_part('template-parts/components/footer', 'nav');
get_footer();
?>