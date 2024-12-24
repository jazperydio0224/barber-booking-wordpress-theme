<?php
get_header();
?>

<main class="container-py min-vh-100 d-flex align-items-center justify-content-center">
    <div class="card shadow border-0 px-3 px-md-4 booking-result-card-container">
        <div class="card-body d-flex flex-column gap-3 justify-content-center align-items-center">
            <span><i class="fa-solid fa-ban text-danger" style="font-size: 3rem;"></i></span>
            <h3 class="card-title d-shaver-h3">Page not found</h3>
            <p class="card-text text-center d-shaver-paragraph">So sorry, we couldn't find the page you were looking for.</p>
            <a href="<?= esc_url(home_url('/')); ?>" class="card-link btn dark-btn d-shaver-paragraph d-shaver-modal-btn">Back to Homepage</a>
        </div>
    </div>
</main>

<?php
get_footer();
?>