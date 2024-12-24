<?php
$barbershop_info = new WP_Query(array(
    'post_type' => 'barbershop_info',
    'posts_per_page' => 1,
    'title' => 'Default Info'
));

if ($barbershop_info->have_posts()) {
    while ($barbershop_info->have_posts()) {
        $barbershop_info->the_post();

        $weekday_opening_hours = get_field('weekday_opening_hours');
        $weekend_opening_hours = get_field('weekend_opening_hours');
        $location = get_field('location');
?>
        <div class="d-flex flex-column mb-4 d-shaver-border-non-service d-shaver-booking-schedule-container" id="booking-sched-info">
            <h5 class="fw-medium d-shaver-h5 mb-3 mb-md-4 mb-lg-5">Or Visit Us</h5>
            <div class="d-flex flex-column gap-2 gap-sm-3 gap-md-4">

                <div class="accordion accordion-flush" id="accordion-schedule">
                    <?php
                    // Get the current day of the week (1 = Monday, 7 = Sunday)
                    $timestamp = current_time('timestamp');

                    // Map numeric day (1-7) to actual day names
                    $day_names = [
                        1 => 'Monday',
                        2 => 'Tuesday',
                        3 => 'Wednesday',
                        4 => 'Thursday',
                        5 => 'Friday',
                        6 => 'Saturday',
                        7 => 'Sunday'
                    ];

                    $current_day = (int) date('N', $timestamp);
                    $current_day_name = $day_names[$current_day];

                    $current_time = wp_date('g:i A', $timestamp);

                    // Set the dynamic closing time
                    $is_weekday = ($current_day >= 1 && $current_day <= 5);
                    $opening_time = '8:30 AM';
                    $closing_time = $is_weekday ? '6:30 PM' : '5:00 PM';

                    $opening_timestamp = strtotime($opening_time, $timestamp);
                    $closing_timestamp = strtotime($closing_time, $timestamp);
                    $current_timestamp = $timestamp;

                    $is_open = $current_timestamp >= $opening_timestamp && $current_timestamp < $closing_timestamp;

                    if ($is_open) {
                        $store_status_message = '<span class="text-success fw-bold">Open</span> until ' . $closing_time;
                    } elseif ($current_timestamp < $opening_timestamp) {
                        $store_status_message = '<span class="text-danger fw-bold">Closed</span>, opens later today at ' . $opening_time;
                    } else {
                        // Store is closed and will open tomorrow
                        $next_opening_day = $current_day + 1;

                        // Handle wrap-around for Sunday
                        if ($next_opening_day > 7) {
                            $next_opening_day = 1;
                        }

                        // just in case different opening times are set
                        $next_opening_time = ($next_opening_day >= 1 && $next_opening_day <= 5) ? '8:30 AM' : '8:30 AM';
                        $store_status_message = '<span class="text-danger fw-bold">Closed</span>, opens tomorrow at ' . $next_opening_time;
                    }

                    // Determine if the store is open or closed
                    $store_status = $is_open ? 'Open' : 'Closed';

                    // Set working hours for the days
                    $working_hours = [
                        'Monday' => '8:30 AM - 6:30 PM',
                        'Tuesday' => '8:30 AM - 6:30 PM',
                        'Wednesday' => '8:30 AM - 6:30 PM',
                        'Thursday' => '8:30 AM - 6:30 PM',
                        'Friday' => '8:30 AM - 6:30 PM',
                        'Saturday' => '8:30 AM - 5:00 PM',
                        'Sunday' => '8:30 AM - 5:00 PM'
                    ];
                    ?>

                    <div class="accordion-item">
                        <h2 class="accordion-header mb-2">
                            <button class="accordion-button collapsed p-0" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-schedule-collapse-flush" aria-expanded="false" aria-controls="accordion-schedule-collapse-flush">
                                <div class="d-flex gap-2 gap-sm-3 gap-md-4">
                                    <span class="d-inline w-auto"><i class="fa-regular fa-clock d-shaver-booking-schedule-icon"></i></span>
                                    <div class="d-flex flex-column gap-1 w-100">
                                        <p class="d-shaver-paragraph fw-regular"><span><?php echo $store_status_message; ?></span></p>
                                    </div>
                                </div>
                            </button>
                        </h2>
                        <div id="accordion-schedule-collapse-flush" class="accordion-collapse collapse" data-bs-parent="#accordion-schedule">
                            <?php foreach ($working_hours as $day => $hours):
                            ?>
                                <p class="d-shaver-paragraph fw-regular d-flex justify-content-between align-items-center <?php echo ($current_day_name == $day) ? 'fw-bold' : ''; ?>">
                                    <span>
                                        <span class="me-2 text-success fs-3">●</span><?php echo "$day"; ?>
                                    </span>
                                    <span><?php echo "$hours"; ?></span>
                                </p>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>

                <div class=" d-flex gap-2 gap-sm-3 gap-md-4">
                    <span><i class="fa-solid fa-location-dot d-shaver-booking-schedule-icon"></i></span>
                    <p class="d-shaver-paragraph fw-regular"><?php echo $location; ?></p>
                </div>

                <div class="d-flex gap-2 gap-sm-3 gap-md-4">
                    <span><i class="fa-solid fa-diamond-turn-right d-shaver-booking-schedule-icon"></i></span>
                    <a href="https://maps.google.com/?daddr=490%20Pakuranga%20Road%2C%20Auckland%2C%202012" target="_blank" class="text-decoration-none d-inline-block" style="color: #d2ab67;">
                        <p class="d-shaver-paragraph fw-regular">Get direction</p>
                    </a>
                </div>
            </div>

    <?php }
    wp_reset_postdata();
}
    ?>
        </div>