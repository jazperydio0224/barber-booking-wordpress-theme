<!-- Modal -->
<div class="modal fade" id="client-bookings-history-modal" tabindex="-1" aria-labelledby="eventDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable modal-dialog-scrollable">
        <div class="modal-content bg-light">
            <div class="modal-header border-0">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="client-bookings-history-modal-content">
                <div class="container">
                    <h3 class="client-booking-history-modal-title fw-bold mb-3 text-center"></h3>

                    <div class="row mb-4">
                        <div class="col-12 col-md-6 col-lg-4 mb-3 mb-md-4">
                            <label for="client-id" class="form-label">ID</label>
                            <input type="text" class="form-control" id="client-history-id" name="client-id" aria-describedby=" textHelp" disabled>
                        </div>

                        <div class="col-12 col-md-6 col-lg-4 mb-3 mb-md-4">
                            <label for="full-name" class="form-label">Name</label>
                            <input type="text" class="form-control" id="client-history-name" name="full-name" aria-describedby="textHelp" disabled>
                        </div>

                        <div class="col-12 col-md-6 col-lg-4 mb-3 mb-md-4">
                            <label for="date-of-birth" class="form-label">DOB</label>
                            <input type="text" class="form-control" id="client-history-date-of-birth" name="date-of-birth" aria-describedby="textHelp" disabled>
                        </div>

                        <div class="col-12 col-md-6 col-lg-4 mb-3 mb-md-4">
                            <label for="email-address" class="form-label">Email Address</label>
                            <input type="text" class="form-control" id="client-history-email-address" name="email-address" aria-describedby="textHelp" disabled>
                        </div>

                        <div class="col-12 col-md-6 col-lg-4 mb-3 mb-md-4">
                            <label for="mobile-number" class="form-label">Mobile Number</label>
                            <input type="text" class="form-control" id="client-history-mobile-number" name="mobile-number" aria-describedby="textHelp" disabled>
                        </div>

                        <div class="col-12 col-md-6 col-lg-4 mb-3 mb-md-4">
                            <label for="last-haircut" class="form-label">Last Haircut</label>
                            <input type="text" class="form-control" id="client-history-last-haircut" name="last-haircut" aria-describedby="textHelp" disabled>
                        </div>
                    </div>

                    <div class="row mb-4">
                        <div class="col-12">
                            <!-- Chat Box -->
                            <div class="list-group">
                                <!-- Chat Message 1 -->
                                <div class="list-group-item p-4 d-flex flex-column gap-4" id="client-notes-list">
                                </div>
                            </div>
                        </div>
                    </div>

                    <table id="client-booking-history-table" class="table table-striped text-center table-fontsize">
                        <thead>
                            <tr>
                                <th style="vertical-align: middle !important; text-align: center !important;">Ref No.</th>
                                <th style="vertical-align: middle !important; text-align: center !important;">Client</th>
                                <th style="width: 20%; vertical-align: middle !important; text-align: center !important;">Services</th>
                                <th style="vertical-align: middle !important; text-align: center !important;">Appointment Date</th>
                                <th style="vertical-align: middle !important; text-align: center !important;">Appointment Time</th>
                                <th style="vertical-align: middle !important; text-align: center !important;">Status</th>
                                <th style="vertical-align: middle !important; text-align: center !important;">Total Amount</th>
                                <!-- <th style="vertical-align: middle !important; text-align: center !important;">Currency</th> -->
                                <th style="vertical-align: middle !important; text-align: center !important;">Notes</th>
                            </tr>
                        </thead>
                        <tbody style="text-align: center !important; vertical-align: middle !important;">
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer border-0">
            </div>
        </div>
    </div>
</div>