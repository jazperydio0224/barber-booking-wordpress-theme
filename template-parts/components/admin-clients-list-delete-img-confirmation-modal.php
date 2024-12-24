<!-- Modal -->
<div class="modal fade" id="client-image-delete-modal" tabindex="-1" aria-labelledby="eventDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable modal-dialog-scrollable">
        <div class="modal-content bg-light">
            <div class="modal-header border-0">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="client-image-delete-modal-content">
                <div class="d-flex justify-content-center align-items-center">
                    <p>Are you sure you want to delete this image?</p>
                </div>
            </div>
            <div class="modal-footer border-0">
                <div class="d-flex justify-content-center gap-3">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="cancelDeleteClientImageBtn">Cancel</button>
                    <button type="button" class="btn dark-btn" id="deleteClientImageBtn">Delete</button>
                    <div class="spinner-border d-none" role="status" id="deleteClientImageSpinner">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>