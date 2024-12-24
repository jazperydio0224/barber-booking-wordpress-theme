<!-- Modal -->
<div class="modal fade" id="client-update-images-modal" tabindex="-1" aria-labelledby="eventDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable modal-dialog-scrollable">
        <div class="modal-content bg-light">
            <div class="modal-header border-0">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="update-client-haircut-images-content">
                <div class="container">
                    <div id="client-update-images">
                        <h3 class="fw-bold mb-3 text-center">Add Client Images</h3>
                        <form class="uploadClientHaircutForm">
                            <input type="hidden" id="client-id-upload-update" name="client-id-upload-update" value="">

                            <div class="mb-3">
                                <label for="client-name-upload" class="form-label">Client</label>
                                <input type="text" class="form-control" id="client-name-upload" name="client-name-upload" aria-describedby="textHelp" required disabled>
                            </div>

                            <div>
                                <label for="haircut-images-upload" class="form-label">Haircut Image/Images</label>
                                <input class="form-control" type="file" id="haircut-images-upload" multiple accept="image/*">
                            </div>

                            <div class="d-flex justify-content-center mt-4">
                                <button type="submit" class="btn dark-btn w-100" id="saveClientImagesBtn">Save changes</button>
                                <div class="spinner-border d-none" role="status" id="saveClientImagesSpinner">
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