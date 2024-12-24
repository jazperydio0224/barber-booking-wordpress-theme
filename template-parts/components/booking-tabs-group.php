<div class="position-sticky top-0 start-50 z-3 mb-4 mb-xl-5 bg-white" id="services-tab-container-group" style="outline: 2px solid #ffffff">
    <ul class="nav nav-pills gap-3 gap-lg-5" role="tablist" id="services-tab-group">
        <li class="nav-item" role="presentation">
            <button class="d-shaver-tab-pills-button nav-link active rounded-5 fw-medium" id="hair-tab-group" data-bs-toggle="tab" data-bs-target="#hair-tab-group-pane" type="button" role="tab" aria-controls="hair-tab-group-pane" aria-selected="true">Hair</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="d-shaver-tab-pills-button nav-link rounded-5 fw-medium" id="shave-tab-group" data-bs-toggle="tab" data-bs-target="#shave-tab-group-pane" type="button" role="tab" aria-controls="shave-tab-group-pane" aria-selected="false">Shave</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="d-shaver-tab-pills-button nav-link rounded-5 fw-medium" id="addon-tab-group" data-bs-toggle="tab" data-bs-target="#addon-tab-group-pane" type="button" role="tab" aria-controls="addon-tab-group-pane" aria-selected="false">Additional</button>
        </li>
    </ul>
</div>

<div class="tab-content" id="services-tab-content-group">
    <div class="tab-pane fade show active" id="hair-tab-group-pane" role="tabpanel" aria-labelledby="hair-tab-group" tabindex="0">
        <div class="list-group gap-3 gap-md-4 gap-lg-5">
            <?php display_services_by_type_group('hair') ?>
        </div>
    </div>
    <div class="tab-pane fade" id="shave-tab-group-pane" role="tabpanel" aria-labelledby="shave-tab-group" tabindex="0">
        <div class="list-group gap-3 gap-md-4 gap-lg-5">
            <?php display_services_by_type_group('shave') ?>
        </div>
    </div>
    <div class="tab-pane fade" id="addon-tab-group-pane" role="tabpanel" aria-labelledby="addon-tab-group" tabindex="0">
        <div class="list-group gap-3 gap-md-4 gap-lg-5">
            <?php display_services_by_type_group('additional') ?>
        </div>
    </div>
</div>