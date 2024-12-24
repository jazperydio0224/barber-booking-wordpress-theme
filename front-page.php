<?php
/*
Template Name: Booking
*/

get_header();
get_template_part('template-parts/components/header', 'nav');
?>

<main class="container-py min-vh-100" id="main-booking-container">
    <div class="container" id="multi-step-booking-container">
        <div class="row gap-1 gap-md-2 gap-lg-3">
            <div class="col">
                <img src="<?php echo get_template_directory_uri() . '/assets/images/booking/costing_sched_image.webp'; ?>" class="img-fluid mb-4 d-block d-lg-none d-shaver-image-border-radius ratio ratio-16x9" alt="D'Shaver and comb info image" id="booking-sched-photo">
                <h1 class="fw-semibold d-shaver-h1 mb-4 mb-lg-5">Book Now</h1>

                <div class="mb-4 mb-xl-5" id="booking-type-tab-container">
                    <ul class="nav nav-pills gap-3 gap-lg-5" role="tablist" id="booking-type-tab">
                        <li class="nav-item" role="presentation">
                            <button class="d-shaver-tab-pills-button nav-link active rounded-5 fw-medium tab-pills-booking-type" id="single-booking-tab" data-bs-toggle="tab" data-bs-target="#single-booking-tab-pane" type="button" role="tab" aria-controls="single-booking-tab-pane" aria-selected="true" data-booking-type="single">Single Booking</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="d-shaver-tab-pills-button nav-link rounded-5 fw-medium tab-pills-booking-type" id="group-booking-tab" data-bs-toggle="tab" data-bs-target="#group-booking-tab-pane" type="button" role="tab" aria-controls="group-booking-tab-pane" aria-selected="false" data-booking-type="group">Group Booking</button>
                        </li>
                    </ul>
                </div>

                <div class="tab-content" id="services-tab-content">
                    <div class="tab-pane fade show active" id="single-booking-tab-pane" role="tabpanel" aria-labelledby="single-booking-tab" tabindex="0">
                        <div id="single-booking-container">
                            <button type="button" class="btn btn-link text-black hidden p-0 fs-6 fw-light mb-2 mb-sm-3 mb-lg-4 link-offset-2 d-shaver-paragraph" id="booking-nav-prev">Go to previous</button>

                            <div class="d-flex flex-column" id="booking-step-1">
                                <?php get_template_part('template-parts/components/booking', 'tabs'); ?>
                                <div class="mt-5 d-block d-lg-none">
                                    <?php get_template_part('template-parts/components/booking', 'schedule'); ?>
                                </div>
                            </div>

                            <div class="d-flex flex-column hidden" id="booking-step-2">
                                <h2 class="fw-semibold mb-3 mb-lg-4 d-shaver-h2">Select your Barber</h2>
                                <?php get_template_part('template-parts/components/booking', 'barbers'); ?>
                            </div>

                            <div class="d-flex flex-column gap-2 hidden" id="booking-step-3">
                                <h2 class="fw-semibold mb-3 mb-lg-4 d-shaver-h2">Select Date and Time</h2>
                                <?php get_template_part('template-parts/components/booking', 'calendar'); ?>
                                <?php get_template_part('template-parts/components/booking', 'time'); ?>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="group-booking-tab-pane" role="tabpanel" aria-labelledby="group-booking-tab" tabindex="0">
                        <div id="group-booking-container">
                            <button type="button" class="btn btn-link text-black hidden p-0 fs-6 fw-light mb-2 mb-sm-3 mb-lg-4 link-offset-2 d-shaver-paragraph" id="booking-nav-prev-group">Go to previous</button>

                            <div class="d-flex flex-column" id="booking-group-step-0">
                                <?php get_template_part('template-parts/components/booking', 'tabs-group'); ?>
                                <div class="mt-5 d-block d-lg-none">
                                    <?php get_template_part('template-parts/components/booking', 'schedule-group'); ?>
                                </div>
                            </div>

                            <div class="d-flex flex-column hidden" id="booking-group-step-1">
                                <h2 class="fw-semibold mb-3 mb-lg-4 d-shaver-h2">Add guests and services</h2>
                                <?php get_template_part('template-parts/components/booking', 'guests-group'); ?>
                            </div>

                            <div class="d-flex flex-column hidden" id="booking-group-step-2">
                                <h2 class="fw-semibold mb-3 mb-lg-4 d-shaver-h2">Select your Barber</h2>
                                <?php get_template_part('template-parts/components/booking', 'barbers-group'); ?>
                            </div>


                            <div class="d-flex flex-column gap-2 hidden" id="booking-group-step-3">
                                <h2 class="fw-semibold mb-3 mb-lg-4 d-shaver-h2">Select Date and Time</h2>
                                <?php get_template_part('template-parts/components/booking', 'calendar-group'); ?>
                                <?php get_template_part('template-parts/components/booking', 'time-group'); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-5 col-xl-4">
                <div class="d-flex flex-column bg-white position-sticky top-0 start-50 z-3 d-none d-lg-block" id="schedule-costing-container">
                    <img src="<?php echo get_template_directory_uri() . '/assets/images/booking/costing_sched_image.webp'; ?>" class="img-fluid mb-5 d-shaver-image-border-radius ratio ratio-16x9" alt="D'Shaver and comb info image" id="booking-sched-photo-group">
                    <div id="schedule-container">
                        <?php get_template_part('template-parts/components/booking', 'schedule'); ?>
                    </div>
                    <div class="hidden" id="costing-container">
                        <div class="d-flex flex-column d-shaver-border-non-service d-shaver-booking-costing-container">
                            <h5 class="fw-medium d-shaver-h5 mb-3 mb-md-4">D'Shaver and Comb Barbershop</h5>
                            <?php get_template_part('template-parts/components/booking', 'costing') ?>
                        </div>
                    </div>

                    <!-- GROUPS -->
                    <div class="hidden" id="costing-container-group">
                        <div class="d-flex flex-column d-shaver-border-non-service d-shaver-booking-costing-container">
                            <h5 class="fw-medium d-shaver-h5 mb-3 mb-md-4">D'Shaver and Comb Barbershop</h5>
                            <?php get_template_part('template-parts/components/booking', 'costing-group') ?>
                        </div>
                    </div>
                </div>

                <div class="d-flex flex-column fixed-bottom border-top bg-white z-3 d-block d-lg-none hidden" id="costing-container-mobile">
                    <?php get_template_part('template-parts/components/booking-costing', 'mobile') ?>
                </div>

                <!-- GROUPS -->
                <div class="d-flex flex-column fixed-bottom border-top bg-white z-3 d-block d-lg-none hidden" id="costing-container-mobile-group">
                    <?php get_template_part('template-parts/components/booking-costing', 'mobile-group') ?>
                </div>
            </div>
        </div>
    </div>

    <?php
    // booking type selection modal
    get_template_part('template-parts/components/booking', 'type-selection-modal');
    // services modal
    get_template_part('template-parts/components/booking', 'services-modal');
    // services modal group
    get_template_part('template-parts/components/booking', 'services-modal-group');
    // booking info modal
    get_template_part('template-parts/components/booking', 'info-modal');
    // booking info modal group
    get_template_part('template-parts/components/booking', 'info-modal-group');
    // barber selection modal group
    get_template_part('template-parts/components/booking', 'barbers-group-modal');
    // additonal services selection modal group
    get_template_part('template-parts/components/booking', 'info-modal-group-extra-service-guests-selection');
    ?>
</main>

<?php
get_template_part('template-parts/components/footer', 'nav');
get_footer();
?>