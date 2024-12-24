<div class="modal fade" id="bookingInfoModalGroup" tabindex="-1" aria-labelledby="bookingInfoModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <!-- Step 0: Additional Services Offer -->
        <div class="modal-content d-shaver-modal final-step final-step-0 d-none">
            <div class="modal-header border-0 flex-column justify-content-start align-items-start" style="padding: 0px 4px !important;">
                <h5 class="d-shaver-h5 mb-2 mb-md-3 mb-lg-4">Need Extra Service?</h5>
                <p class="mb-3 mb-md-4 mb-xl-5 d-shaver-paragraph fw-light">Choose from our additional services below</p>
            </div>

            <div class="modal-body" style="padding: 4px !important;">
                <div class="list-group gap-3 gap-md-4 gap-lg-5 additional-service-container">
                    <?php display_additional_services_group() ?>
                </div>
            </div>

            <div class="modal-footer mt-3 mt-md-4 mt-xl-5 pb-0 border-0 justify-content-center" style="padding: 0px 4px !important;">
                <button type="button" class="d-shaver-modal-btn btn dark-btn w-100 d-none" id="additional-not-today-btn-group">Not Today</button>
                <button type="button" class="d-shaver-modal-btn btn dark-btn w-100 d-none" id="additional-continue-btn-group">Continue</button>
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
                <div class="form-check form-switch mb-3 mb-md-4 w-100 px-0" style="padding-top: 4px !important;">
                    <input class="form-check-input d-shaver-paragraph ms-0" type="checkbox" role="switch" id="switchFormOtherGuests">
                    <label class="form-check-label d-shaver-paragraph fw-semibold ms-2" for="switchFormOtherGuests" id="switchFormOtherGuestsLabel">Main Guest Only</label>
                </div>

                <form class="submit-form-group" id="booking-info-form-group" novalidate>
                    <div class="mb-3 mb-md-4">
                        <label for="full-name-group" class="form-label d-shaver-paragraph fw-light">Full Name</label>
                        <input type="text" class="form-control d-shaver-paragraph d-shaver-form-field" id="full-name-group" name="full-name-group" aria-describedby="textHelp" required>
                    </div>

                    <div class="mb-3 mb-md-4">
                        <label for="email-address-group" class="form-label d-shaver-paragraph fw-light">Email Address</label>
                        <input type="email" class="form-control d-shaver-paragraph d-shaver-form-field" id="email-address-group" name="email-address-group" aria-describedby="textHelp" required>
                    </div>

                    <div class="mb-3 mb-md-4 d-flex flex-column gap-1">
                        <label for="contact-number-group" class="form-label d-shaver-paragraph fw-light">Contact Number (Optional)</label>
                        <input type="tel" class="form-control d-shaver-paragraph d-shaver-form-field" id="contact-number-group" name="contact-number-group" aria-describedby="textHelp">
                    </div>

                    <div class="mb-3 mb-md-4">
                        <label for="date-of-birth-group" class="form-label d-shaver-paragraph fw-light">Date Of Birth (Optional)</label>
                        <input type="date" class="form-control d-shaver-paragraph d-shaver-form-field date-of-birth-input-booking" id="date-of-birth-group" name="date-of-birth-group" aria-describedby="textHelp">
                    </div>

                    <div class="mb-3 mb-md-4 d-flex align-items-start">
                        <input class="form-check-input d-shaver-paragraph me-2 me-lg-3" type="checkbox" value="" id="checkboxConsentGroup" required>
                        <label class="form-check-label d-shaver-paragraph" for="checkboxConsentGroup">
                            I have reviewed and agree to D'Shaver and Comb's <a class="link-offset-2 text-dark" target="_blank" href="<?= esc_url(home_url('/privacy-policy')); ?>">Privacy Policy</a>
                        </label>
                    </div>
                </form>
            </div>

            <div class="modal-footer mt-3 mt-md-4 mt-xl-5 pb-0 border-0 justify-content-center gap-3" style="padding: 0px 4px !important;">
                <button type="button" class="d-shaver-modal-btn btn dark-btn" id="additional-go-back-btn-group">Go Back</button>
                <button type="submit" class="d-shaver-modal-btn btn dark-btn" id="booking-submission-btn-group" form="booking-info-form-group">Lock in Your Look</button>
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
                <div class="accordion accordion-flush mb-3 mb-md-4 d-flex flex-column gap-3 gap-md-4 gap-lg-5" id="accordion-summary-group">
                </div>
            </div>
            <div class="modal-footer mt-3 mt-md-4 mt-xl-5 pb-0 border-0 justify-content-center gap-3" style="padding: 0px 4px !important;">
                <button type="button" class="d-shaver-modal-btn btn dark-btn" id="final-go-back-btn-group">Go Back</button>
                <button type="button" class="d-shaver-modal-btn btn dark-btn" id="book-btn-group">
                    <i class="fa-solid fa-calendar-check me-2 me-md-3"></i>
                    <span>Book Appointment</span>
                </button>
                <div class="spinner-border d-none" role="status" id="booking-submission-spinner-group">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
        <!-- Step 2: Summary and Payment -->
    </div>
</div>