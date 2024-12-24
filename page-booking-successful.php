<?php
/*
Template Name: Booking Successful
*/

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

get_header();
get_template_part('template-parts/components/header', 'nav');
?>

<main class="container-py min-vh-100 d-flex align-items-center justify-content-center">
    <div class="card shadow border-0 px-3 px-md-4 booking-result-card-container">
        <div class="card-body d-flex flex-column gap-3 justify-content-center align-items-center">
            <span><i class="fa-solid fa-circle-check text-success" style="font-size: 3rem;"></i></span>
            <h3 class="card-title d-shaver-h3 ">Booking Successful</h3>
            <p class="card-text text-center d-shaver-paragraph">Thanks for scheduling your appointment with us! We’re excited to have you in for a great grooming experience. If you need to make any changes or have any special requests, feel free to let us know. See you soon!</p>
            <div class="d-flex flex-column gap-3 w-100">
                <div class="d-flex gap-2">
                    <span class="d-shaver-paragraph">Booking Reference Number:</span>
                    <span class="d-shaver-paragraph fw-bold"><?= $booking_reference_number; ?></span>
                </div>

                <div class="d-flex gap-2">
                    <span class="d-shaver-paragraph">Client Name:</span>
                    <span class="d-shaver-paragraph fw-bold"><?= $client_name; ?></span>
                </div>

                <div class="d-flex gap-2">
                    <span class="d-shaver-paragraph">Barber Name:</span>
                    <span class="d-shaver-paragraph fw-bold"><?= $barber_name; ?></span>
                </div>

                <div class="d-flex gap-2">
                    <span class="d-shaver-paragraph">Appointment Date:</span>
                    <span class="d-shaver-paragraph fw-bold"><?= $appointment_date; ?></span>
                </div>

                <div class="d-flex gap-2">
                    <span class="d-shaver-paragraph">Appointment Time:</span>
                    <span class="d-shaver-paragraph fw-bold"><?= $appointment_time; ?></span>
                </div>

                <div class="d-flex gap-2">
                    <span class="d-shaver-paragraph">Total Amount:</span>
                    <span class="d-shaver-paragraph fw-bold">$<?= $total_amount; ?></span>
                </div>

                <div class="d-flex gap-2">
                    <span class="d-shaver-paragraph">Services:</span>
                    <span class="d-shaver-paragraph fw-bold"><?= $services; ?></span>
                </div>
            </div>
            <a href="<?= esc_url(home_url('/')); ?>" class="card-link btn dark-btn d-shaver-paragraph d-shaver-modal-btn">Back to Homepage</a>
        </div>
    </div>
</main>

<?php
get_template_part('template-parts/components/footer', 'nav');
get_footer();
?>