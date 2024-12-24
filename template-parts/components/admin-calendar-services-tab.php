<ul class="nav nav-pills gap-3 position-sticky start-50 z-3 fw-bold bg-light pb-3" role="tablist" id="services-tab-admin">
    <li class="nav-item" role="presentation">
        <button class="nav-link active fw-medium" id="hair-tab-admin" data-bs-toggle="tab" data-bs-target="#hair-tab-admin-pane" type="button" role="tab" aria-controls="hair-tab-admin-pane" aria-selected="true">Hair</button>
    </li>
    <li class="nav-item" role="presentation">
        <button class="nav-link fw-medium" id="shave-tab-admin" data-bs-toggle="tab" data-bs-target="#shave-tab-admin-pane" type="button" role="tab" aria-controls="shave-tab-admin-pane" aria-selected="false">Shave</button>
    </li>
    <li class="nav-item" role="presentation">
        <button class="nav-link fw-medium" id="addon-tab-admin" data-bs-toggle="tab" data-bs-target="#addon-tab-admin-pane" type="button" role="tab" aria-controls="addon-tab-admin-pane" aria-selected="false">Additional</button>
    </li>
</ul>

<div class="tab-content" id="services-tab-content">
    <div class="tab-pane fade show active" id="hair-tab-admin-pane" role="tabpanel" aria-labelledby="hair-tab-admin" tabindex="0">
        <div class="list-group gap-3 gap-md-4">
            <?php display_services_by_type_admin('hair') ?>
        </div>
    </div>
    <div class="tab-pane fade" id="shave-tab-admin-pane" role="tabpanel" aria-labelledby="shave-tab-admin" tabindex="0">
        <div class="list-group gap-3 gap-md-4">
            <?php display_services_by_type_admin('shave') ?>
        </div>
    </div>
    <div class="tab-pane fade" id="addon-tab-admin-pane" role="tabpanel" aria-labelledby="addon-tab-admin" tabindex="0">
        <div class="list-group gap-3 gap-md-4">
            <?php display_services_by_type_admin('additional') ?>
        </div>
    </div>
</div>