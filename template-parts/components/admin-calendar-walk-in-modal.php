<!-- Modal -->
<div class="modal fade" id="walk-in-modal" tabindex="-1" aria-labelledby="addWalkinLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable modal-dialog-scrollable">
        <div class="modal-content bg-light">
            <div class="modal-header border-0">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body pt-0" id="add-walk-in-content">
                <div class="container">
                    <div class="d-flex flex-column justify-content-center align-items-center" id="walkInLoadingContainer">
                        <h5 class="text-center mb-3">Loading walk-in options...</h5>
                        <div class="spinner-border" role="status" id="walkInOptionsLoadingSpinner">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div class="d-none w-100" id="walk-in-options-container">
                        <h3 class="position-sticky top-0 start-50 z-3 mb-0 pb-3 fw-bold bg-light text-center">Add Walk-in</h3>

                        <div class="w-100 step" data-step="1">
                            <?php
                            // services tabs
                            get_template_part('template-parts/components/admin', 'calendar-services-tab');
                            ?>

                            <button type="button" class="btn dark-btn w-100 mt-4" id="next-to-step-2" disabled>Continue</button>
                        </div>

                        <div class="step d-none" data-step="2">
                            <button type="button" class="btn btn-link text-black p-0 fs-6 fw-medium mb-3 link-offset-2" id="back-to-step-1">Go back</button>

                            <div class="w-100 mb-4" id="walk-in-calendar">
                            </div>

                            <div class="d-flex justify-content-center align-items-center">
                                <div class="w-100 list-group gap-3 d-none mb-4" id="list-group-time-walk-in-container"></div>

                                <div class="spinner-border mx-auto d-none mb-4" role="status" id="walkInTimeSpinner">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>

                            <button type="button" class="btn dark-btn w-100" id="next-to-step-3" disabled>Continue</button>
                        </div>

                        <div class="step d-none" data-step="3">
                            <button type="button" class="btn btn-link text-black p-0 fs-6 fw-medium mb-3 link-offset-2" id="back-to-step-2">Go back</button>

                            <div class="d-flex gap-4 mb-4">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="switchAddClient" checked>
                                    <label class="form-check-label" for="switchAddClient" id="switchAddClientLabel">Existing Clients</label>
                                </div>
                            </div>

                            <div id="client-select-container">
                                <select class="form-select mb-4" aria-label="Client select" id="client-select">
                                    <option value="">Select an existing client</option>
                                    <?php
                                    $args = array(
                                        'post_type' => 'client',
                                        'posts_per_page' => -1,
                                        'orderby' => 'title',
                                        'order' => 'ASC',
                                    );

                                    $clients = new WP_Query($args);

                                    if ($clients->have_posts()) :
                                        while ($clients->have_posts()) : $clients->the_post();
                                    ?>
                                            <option value="<?php echo get_the_ID() ?>"><?php the_title() ?></option>
                                    <?php
                                        endwhile;
                                    endif;

                                    wp_reset_postdata();
                                    ?>
                                </select>

                                <button type="button" class="btn dark-btn w-100" id="next-to-step-4-client-select">Continue</button>
                            </div>

                            <form class="submit-form mb-4 d-none" id="client-form" novalidate>
                                <div class="row">
                                    <!-- Full Name Field -->
                                    <div class="col-md-6 mb-3 mb-md-4">
                                        <label for="full-name" class="form-label">Full Name</label>
                                        <input type="text" class="form-control" id="full-name-walk-in" name="full-name" aria-describedby="textHelp" required>
                                    </div>
                                    <!-- Email Address Field -->
                                    <div class="col-md-6 mb-3 mb-md-4">
                                        <label for="email-address" class="form-label">Email Address</label>
                                        <input type="email" class="form-control" id="email-address-walk-in" name="email-address" aria-describedby="textHelp" required>
                                    </div>
                                </div>

                                <div class="row">
                                    <!-- Contact Number Field -->
                                    <div class="col-md-6 mb-3 mb-md-4">
                                        <label for="contact-number" class="form-label">Contact Number (Optional)</label>
                                        <input type="tel" class="form-control" id="contact-number-walk-in" name="contact-number" aria-describedby="textHelp">
                                    </div>
                                    <!-- Date of Birth Field -->
                                    <div class="col-md-6 mb-3 mb-md-4">
                                        <label for="date-of-birth" class="form-label">Date Of Birth (Optional)</label>
                                        <input type="date" class="form-control date-of-birth-input-booking" id="date-of-birth-walk-in" name="date-of-birth" aria-describedby="textHelp">
                                    </div>
                                </div>

                                <button type="submit" class="btn dark-btn w-100" id="next-to-step-4-client-form">Continue</button>
                            </form>

                        </div>

                        <div class="step d-none" data-step="4">
                            <button type="button" class="btn btn-link text-black p-0 fs-6 fw-medium mb-3 link-offset-2" id="back-to-step-3">Go back</button>

                            <div class="accordion accordion-flush mb-3" id="accordion-summary">
                                <div class="accordion-item border rounded">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button" style="box-shadow: none !important; background-color: transparent !important; color: #000000 !important;" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-booking-items" aria-expanded="true" aria-controls="collapse-booking-items">
                                            Summary Item
                                        </button>
                                    </h2>
                                    <div id="collapse-booking-items" class="accordion-collapse collapse show" data-bs-parent="#accordion-summary">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer border-0">
            </div>
        </div>
    </div>
</div>