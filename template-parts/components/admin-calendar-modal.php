<!-- Modal -->
<div class="modal fade" id="event-details-modal" tabindex="-1" aria-labelledby="eventDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable modal-dialog-scrollable">
        <div class="modal-content bg-light">
            <div class="modal-header border-0">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body pt-0" id="eventDetailsContent">
                <!-- Event details will be inserted here -->
                <div class="container">
                    <div id="calendar-modal-content-1" class="mb-2">
                        <h3 class="fw-bold mb-3 text-center" id="modal-event-customer"></h3>
                        <div class="row row-cols-1 gap-3 gap-md-4">
                            <div class="col">
                                <div class="w-auto d-flex align-items-center mb-2">
                                    <i class="fa-solid fa-bookmark me-2"></i>
                                    <p class="fw-semibold">Service/Services: </p>
                                </div>
                                <div>
                                    <ol class="list-group list-group-numbered gap-2" id="modal-event-services"></ol>
                                </div>
                            </div>

                            <div class="col">
                                <div class="d-flex flex-column gap-3 gap-md-4 border py-3 px-2 rounded">
                                    <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                                        <div class="d-flex align-items-center">
                                            <i class="fa-solid fa-calendar me-2"></i>
                                            <p class="fw-semibold">Appointment Date: </p>
                                        </div>
                                        <div>
                                            <p id="modal-event-appointment-date"></p>
                                        </div>
                                    </div>

                                    <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                                        <div class="d-flex align-items-center">
                                            <i class="fa-solid fa-business-time me-2"></i>
                                            <p class="fw-semibold">Appointment Time: </p>
                                        </div>
                                        <div>
                                            <p id="modal-event-appointment-time"></p>
                                        </div>
                                    </div>

                                    <button type="button" class="btn dark-btn" id="service-reschedule-btn">Reschedule</button>
                                    <div class="spinner-border mx-auto d-none" role="status" id="rescheduleDateSpinner">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>

                                    </button>
                                </div>
                            </div>


                            <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                                <div class="d-flex align-items-center">
                                    <i class="fa-solid fa-square-poll-vertical me-2"></i>
                                    <p class="fw-semibold">Service Status: </p>
                                </div>
                                <div class=" d-flex gap-3 align-items-center justify-content-start" id="modal-event-service-status-container">
                                </div>
                            </div>

                            <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                                <div class="d-flex align-items-center">
                                    <i class="fa-solid fa-note-sticky me-2"></i>
                                    <p class="fw-semibold">Notes: </p>
                                </div>
                                <div class=" d-flex gap-3 align-items-center justify-content-start" id="modal-event-service-notes-container">
                                </div>
                            </div>

                            <div class="col d-flex flex-column flex-md-row align-items-center justify-content-between column-gap-3">
                                <div class="flex-grow-1 flex-shrink-0 d-flex align-items-center">
                                    <i class="fa-regular fa-id-badge me-2"></i>
                                    <p class="fw-semibold">Ref No: </p>
                                </div>
                                <div class="flex-shrink-1">
                                    <p class="text-break w-auto" id="modal-event-reference-number"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="calendar-modal-content-2" class="d-none w-100">
                        <button type="button" class="btn btn-link text-black p-0 fs-6 fw-medium mb-3 link-offset-2" id="service-status-back-btn">Go back</button>
                        <h3 class="fw-bold mb-3 text-center">Update Service Status</h3>
                        <form id="updateServiceStatusForm">
                            <input type="hidden" id="ref-number" name="ref-number" value="">

                            <div class="mb-3">
                                <label for="service-status" class="form-label">Select Service Status</label>
                                <select class="form-select" id="service-status" name="service-status" required>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="No Show">No Show</option>
                                </select>
                            </div>

                            <!-- This is hidden initially -->
                            <div id="completed-form-fields" class="d-none">
                                <input type="hidden" id="client-id" name="client-id" value="">

                                <div class="mb-3">
                                    <label for="client-name" class="form-label">Client</label>
                                    <input type="text" class="form-control" id="client-name" name="client-name" aria-describedby="textHelp" required disabled>
                                </div>

                                <input type="hidden" id="service-id" name="service-id" value="">

                                <input type="hidden" id="service-type" name="service-type" value="">

                                <div class="mb-3">
                                    <label for="last-haircut" class="form-label">Last Haircut</label>
                                    <input type="text" class="form-control" id="last-haircut" name="last-haircut" aria-describedby="textHelp" required disabled>
                                </div>

                                <div class="mb-3">
                                    <label for="haircut-images" class="form-label">Haircut Image/Images</label>
                                    <input class="form-control" type="file" id="haircut-images" multiple accept="image/*">
                                </div>

                                <div>
                                    <label for="customer-notes" class="form-label">Notes</label>
                                    <textarea class="form-control" id="customer-notes" rows="5"></textarea>
                                </div>

                            </div>

                            <div class="d-flex justify-content-center mt-4">
                                <button type="submit" class="btn dark-btn w-100" id="saveServiceStatusBtn">Save changes</button>
                                <div class="spinner-border d-none" role="status" id="saveServiceStatusSpinner">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="calendar-modal-content-3" class="d-none w-100">
                        <button type="button" class="btn btn-link text-black p-0 fs-6 fw-medium mb-3 link-offset-2" id="resched-booking-back-btn">Go back</button>
                        <h3 class="fw-bold mb-3 text-center">Reschedule Booking</h3>

                        <div class="mb-4 w-100">
                            <div class="w-100 d-none" id="resched-calendar">
                            </div>
                        </div>

                        <div class="mb-3">
                            <div class="list-group gap-3 d-none" id="list-group-time-resched-container"></div>

                            <div class="spinner-border mx-auto d-block d-none" role="status" id="rescheduleTimeSpinner">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <div class="d-flex justify-content-center mt-4">
                            <button type="submit" class="btn dark-btn w-100" id="saveReschedBookingBtn">Reschedule</button>
                            <div class="spinner-border d-none" role="status" id="saveReschedBookingSpinner">
                                <span class="sr-only">Loading...</span>
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