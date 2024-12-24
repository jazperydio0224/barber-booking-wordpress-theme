<?php
/*
Template Name: Booking Failed
*/


get_header();
get_template_part('template-parts/components/header', 'nav');
?>

<main class="container-py min-vh-100 d-flex align-items-center justify-content-center">
    <div class="card shadow border-0 px-3 px-md-4 booking-result-card-container">
        <div class="card-body d-flex flex-column gap-3 justify-content-center align-items-center">
            <span><i class="fa-solid fa-circle-exclamation text-danger" style="font-size: 3rem;"></i></span>
            <h3 class="card-title d-shaver-h3">Booking Failed</h3>
            <p class="card-text text-center d-shaver-paragraph">Oops! It looks like something went wrong with your booking. We’re sorry for the inconvenience. Please try scheduling again or contact us directly at [contact info] for assistance. We’re here to help and ensure you get your appointment as soon as possible.</p>
            <a href="<?= esc_url(home_url('/')); ?>" class="card-link btn dark-btn d-shaver-paragraph d-shaver-modal-btn">Back to Homepage</a>
        </div>
    </div>
</main>

<?php
get_template_part('template-parts/components/footer', 'nav');
get_footer();
?>