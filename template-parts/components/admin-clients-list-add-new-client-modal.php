<!-- Modal -->
<div class="modal fade" id="add-new-client-modal" tabindex="-1" aria-labelledby="eventDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable modal-dialog-scrollable">
        <div class="modal-content bg-light">
            <div class="modal-header border-0">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="add-new-client-modal-content">
                <!-- Event details will be inserted here -->
                <div class="container">
                    <div id="client-update-images">
                        <h3 class="fw-bold mb-3 text-center">Add New Client</h3>
                        <form class="add-new-client-form" novalidate>
                            <div class="mb-3">
                                <label for="client-full-name" class="form-label">Fullname</label>
                                <input type="text" class="form-control" id="client-full-name" name="client-full-name" aria-describedby="textHelp" required>
                            </div>

                            <div class="mb-3">
                                <label for="client-email-address" class="form-label">Email Address</label>
                                <input type="email" class="form-control" id="client-email-address" name="client-email-address" aria-describedby="textHelp" required>
                            </div>

                            <div class="mb-3 d-flex flex-column gap-1">
                                <label for="client-contact-number" class="form-label">Contact Number</label>
                                <input type="tel" class="form-control" id="client-contact-number" name="client-contact-number" aria-describedby="textHelp">
                            </div>

                            <div class="mb-3">
                                <label for="client-date-of-birth" class="form-label">Date Of Birth</label>
                                <input type="date" class="form-control" id="client-date-of-birth" name="client-date-of-birth" aria-describedby="textHelp">
                            </div>

                            <div class="mb-3">
                                <label for="client-haircut-select" class="form-label">Last Haircut</label>
                                <select class="form-select" id="client-haircut-select" aria-label="client haircut select" required>
                                    <option selected value="">Select Client's Last Haircut</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="client-new-haircut-images-upload" class="form-label">Haircut Image/Images</label>
                                <input class="form-control" type="file" id="client-new-haircut-images-upload" multiple accept="image/*" required>
                            </div>

                            <div class="d-flex justify-content-center mt-4">
                                <button type="submit" class="btn dark-btn w-100" id="add-new-client-form-submit-btn">Add Client</button>
                                <div class="spinner-border d-none" role="status" id="add-new-client-form-submit-spinner">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="modal-footer border-0">
            </div>
        </div>
    </div>
</div>