<?php
$args = array(
    'post_type'      => 'barber',
    'posts_per_page' => -1,
);

$query = new WP_Query($args);

// Check if there are barbers
if ($query->have_posts()) : ?>
    <div class="w-100 mb-3 mb-md-4 mb-lg-5 d-shaver-h5">
        <div class="list-group gap-3 gap-md-4 gap-lg-5">
            <?php
            while ($query->have_posts()) : $query->the_post();
                // Get the custom fields
                $barber_id = get_the_ID();
                $barber_profile_image_id = get_post_meta(get_the_ID(), 'barber_profile_image', true);
                $barber_profile_image_url = null;
                $barber_name = get_post_meta(get_the_ID(), 'barber_name', true);

                if (!empty($barber_profile_image_id)) {
                    $url = wp_get_attachment_url($barber_profile_image_id);
                    if ($url) {
                        $barber_profile_image_url = $url;
                    }
                }
            ?>
                <div class="d-shaver-border d-shaver-list-group-item list-group-item list-group-item-action list-item-barber p-0" aria-current="true"
                    data-barber-id="<?= esc_attr($barber_id); ?>"
                    data-barber-name="<?= esc_attr($barber_name); ?>">
                    <div class="d-flex flex-row align-items-center gap-3 gap-lg-5">
                        <img src="<?php echo esc_url($barber_profile_image_url); ?>" alt="<?php echo esc_attr($barber_name); ?>" class="img-thumbnail barber-selection-image">
                        <h5 class="fw-medium barber-name-text d-shaver-h5"><?= esc_html($barber_name); ?></h5>
                    </div>
                </div>
            <?php endwhile; ?>
        </div>
    </div>
<?php
endif;

// Reset post data
wp_reset_postdata();
?>