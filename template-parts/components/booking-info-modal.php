<div class="modal fade" id="bookingInfoModal" tabindex="-1" aria-labelledby="bookingInfoModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <!-- Step 0: Additional Services Offer -->
        <div class="modal-content d-shaver-modal final-step final-step-0 d-none">
            <div class="modal-header border-0 flex-column justify-content-start align-items-start" style="padding: 0px 4px !important;">
                <h5 class="d-shaver-h5 mb-2 mb-md-3 mb-lg-4">Need Extra Service?</h5>
                <p class="mb-3 mb-md-4 mb-xl-5 d-shaver-paragraph fw-light">Choose from our additional services below</p>
            </div>

            <div class="modal-body" style="padding: 4px !important;">
                <div class="list-group gap-3 gap-md-4 gap-lg-5 additional-service-container">
                    <?php display_services_by_type('additional') ?>
                </div>
            </div>

            <div class="modal-footer mt-3 mt-md-4 mt-xl-5 pb-0 border-0 justify-content-center" style="padding: 0px 4px !important;">
                <button type="button" class="d-shaver-modal-btn btn dark-btn w-100 d-none" id="additional-not-today-btn">Not Today</button>
                <button type="button" class="d-shaver-modal-btn btn dark-btn w-100 d-none" id="additional-continue-btn">Continue</button>
            </div>
        </div>
        <!-- Step 0: Additional Services Offer -->
        <!-- Step 1: User Information -->
        <div class="modal-content d-shaver-modal final-step final-step-1 d-none">
            <div class="modal-header border-0 flex-column justify-content-start align-items-start" style="padding: 0px 4px !important;">
                <h5 class="d-shaver-h5 mb-2 mb-md-3 mb-lg-4">Last Step</h5>
                <p class="mb-3 mb-md-4 mb-xl-5 d-shaver-paragraph fw-light">Sign up and enter your details to complete your booking</p>
            </div>

            <div class="modal-body" style="padding: 0px 4px !important;">
                <form class="submit-form" id="booking-info-form" novalidate>
                    <div class="mb-3 mb-md-4">
                        <label for="full-name" class="form-label d-shaver-paragraph fw-light">Full Name</label>
                        <input type="text" class="form-control d-shaver-paragraph d-shaver-form-field" id="full-name" name="full-name" aria-describedby="textHelp" required>
                    </div>

                    <div class="mb-3 mb-md-4">
                        <label for="email-address" class="form-label d-shaver-paragraph fw-light">Email Address</label>
                        <input type="email" class="form-control d-shaver-paragraph d-shaver-form-field" id="email-address" name="email-address" aria-describedby="textHelp" required>
                    </div>

                    <div class="mb-3 mb-md-4 d-flex flex-column gap-1">
                        <label for="contact-number" class="form-label d-shaver-paragraph fw-light">Contact Number (Optional)</label>
                        <input type="tel" class="form-control d-shaver-paragraph d-shaver-form-field" id="contact-number" name="contact-number" aria-describedby="textHelp">
                    </div>

                    <div class="mb-3 mb-md-4">
                        <label for="date-of-birth" class="form-label d-shaver-paragraph fw-light">Date Of Birth (Optional)</label>
                        <input type="date" class="form-control d-shaver-paragraph d-shaver-form-field date-of-birth-input-booking" id="date-of-birth" name="date-of-birth" aria-describedby="textHelp">
                    </div>

                    <div class="mb-3 mb-md-4 d-flex align-items-start">
                        <input class="form-check-input d-shaver-paragraph me-2 me-lg-3" type="checkbox" value="" id="checkboxConsent" required>
                        <label class="form-check-label d-shaver-paragraph" for="checkboxConsent">
                            I have reviewed and agree to D'Shaver and Comb's <a class="link-offset-2 text-dark" target="_blank" href="<?= esc_url(home_url('/privacy-policy')); ?>">Privacy Policy</a>
                        </label>
                    </div>
                </form>
            </div>

            <div class="modal-footer mt-3 mt-md-4 mt-xl-5 pb-0 border-0 justify-content-center gap-3" style="padding: 0px 4px !important;">
                <button type="button" class="d-shaver-modal-btn btn dark-btn" id="additional-go-back-btn">Go Back</button>
                <button type="submit" class="d-shaver-modal-btn btn dark-btn" id="booking-submission-btn" form="booking-info-form">Lock in Your Look</button>
            </div>
        </div>
        <!-- Step 1: User Information -->
        <!-- Step 2: Summary and Payment -->
        <div class="modal-content d-shaver-modal final-step final-step-2 d-none">
            <div class="modal-header border-0 flex-column justify-content-start align-items-start" style="padding: 0px 4px !important;">
                <h5 class="d-shaver-h5 mb-2 mb-md-3 mb-lg-4">Booking Summary</h5>
                <p class="mb-3 mb-md-4 mb-xl-5 d-shaver-paragraph fw-light">Please confirm your details and proceed with payment.</p>
            </div>
            <div class="modal-body" style="padding: 0px 4px !important;">
                <div class="accordion accordion-flush mb-3 mb-md-4" id="accordion-summary">
                    <div class="accordion-item d-shaver-border-non-service">
                        <h2 class="accordion-header">
                            <button class="d-shaver-modal-btn accordion-button" style="box-shadow: none !important; background-color: transparent !important; color: #000000 !important;" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-booking-items" aria-expanded="true" aria-controls="collapse-booking-items">
                                Summary Item
                            </button>
                        </h2>
                        <div id="collapse-booking-items" class="accordion-collapse collapse show" data-bs-parent="#accordion-summary">
                            <div class="accordion-body">
                                <p class="d-shaver-paragraph mb-3 mb-md-4 fw-medium">Full Name: <span id="summary-full-name" class="fw-normal"></span></p>
                                <p class="d-shaver-paragraph mb-3 mb-md-4 fw-medium">Email Address: <span id="summary-email-address" class="fw-normal"></span></p>
                                <p class="d-shaver-paragraph mb-3 mb-md-4 fw-medium">Contact Number: <span id="summary-contact-number" class="fw-normal"></span></p>
                                <p class="d-shaver-paragraph mb-3 mb-md-4 fw-medium">Date of Birth: <span id="summary-date-of-birth" class="fw-normal"></span></p>

                                <hr class="bg-black border-2 border-top border-black mb-3 mb-md-4" />

                                <div class="d-flex flex-column gap-3 gap-md-4">
                                    <div class="d-flex gap-2 align-items-center">
                                        <i class="fa-regular fa-clock d-none d-shaver-booking-costing-icon" id="costing-summary-booking-icon"></i>
                                        <p id="costing-summary-booking-date" class="d-none d-shaver-paragraph"></p>
                                        <p id="costing-summary-booking-time" class="d-none d-shaver-paragraph"></p>
                                    </div>

                                    <div class="d-flex flex-column gap-2 gap-sm-3 gap-md-4" id="list-items-summary-container">
                                    </div>

                                    <hr class="bg-black border-2 border-top border-black my-0" />

                                    <div class="d-flex flex-column gap-2">
                                        <div class="d-flex justify-content-between">
                                            <p class="fw-semibold d-shaver-paragraph">Total Duration</p>
                                            <p class="fw-semibold d-shaver-paragraph" id="total-summary-duration-value"></p>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <p class="fw-semibold d-shaver-paragraph">Total</p>
                                            <p class="fw-semibold d-shaver-paragraph" id="total-summary-cost-value"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer mt-3 mt-md-4 mt-xl-5 pb-0 border-0 justify-content-center gap-3" style="padding: 0px 4px !important;">
                <button type="button" class="d-shaver-modal-btn btn dark-btn" id="final-go-back-btn">Go Back</button>
                <button type="button" class="d-shaver-modal-btn btn dark-btn" id="book-btn">
                    <i class="fa-solid fa-calendar-check me-2 me-md-3"></i>
                    <span>Book Appointment</span>
                </button>
                <div class="spinner-border d-none" role="status" id="booking-submission-spinner">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
        <!-- Step 2: Summary and Payment -->
    </div>
</div>