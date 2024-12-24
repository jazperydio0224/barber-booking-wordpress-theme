<?php
// ACF Field Group - Service Details
add_action('acf/include_fields', function () {
    if (! function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group(array(
        'key' => 'group_66e2c16de9bfa',
        'title' => 'Service Details',
        'fields' => array(
            array(
                'key' => 'field_66e2c16d75a97',
                'label' => 'Service Name',
                'name' => 'service_name',
                'aria-label' => '',
                'type' => 'text',
                'instructions' => 'Enter the name of the service',
                'required' => 1,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '33',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'maxlength' => '',
                'allow_in_bindings' => 0,
                'placeholder' => 'Service Name',
                'prepend' => '',
                'append' => '',
            ),
            array(
                'key' => 'field_66e2c1d375a98',
                'label' => 'Duration In Minutes',
                'name' => 'duration_in_minutes',
                'aria-label' => '',
                'type' => 'number',
                'instructions' => 'Enter the duration of the service',
                'required' => 1,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '33',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'min' => 1,
                'max' => '',
                'allow_in_bindings' => 0,
                'placeholder' => 'Duration In Minutes',
                'step' => 1,
                'prepend' => '',
                'append' => 'mins',
            ),
            array(
                'key' => 'field_66e2c31675a99',
                'label' => 'For Whom',
                'name' => 'for_whom',
                'aria-label' => '',
                'type' => 'select',
                'instructions' => 'Select the gender for which this service is intended: Male, Female, or Both.',
                'required' => 1,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '33',
                    'class' => '',
                    'id' => '',
                ),
                'choices' => array(
                    'Male only' => 'Male only',
                    'Female only' => 'Female only',
                    'Male and Female' => 'Male and Female',
                ),
                'default_value' => 'Male only',
                'return_format' => 'value',
                'multiple' => 0,
                'allow_null' => 0,
                'allow_in_bindings' => 0,
                'ui' => 0,
                'ajax' => 0,
                'placeholder' => '',
            ),
            array(
                'key' => 'field_66e2c39075a9a',
                'label' => 'Service Description',
                'name' => 'service_description',
                'aria-label' => '',
                'type' => 'textarea',
                'instructions' => 'Enter the description of the service',
                'required' => 1,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '33',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'maxlength' => '',
                'allow_in_bindings' => 0,
                'rows' => '',
                'placeholder' => '',
                'new_lines' => '',
            ),
            array(
                'key' => 'field_66e2c3e175a9b',
                'label' => 'Service Price',
                'name' => 'service_price',
                'aria-label' => '',
                'type' => 'number',
                'instructions' => 'Enter the price for this service in New Zealand Dollars (NZD).',
                'required' => 1,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '33',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'min' => 1,
                'max' => '',
                'allow_in_bindings' => 0,
                'placeholder' => 'Service Price',
                'step' => 1,
                'prepend' => '$',
                'append' => '',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'service',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => 'List of fields required for the service details',
        'show_in_rest' => 1,
    ));
});


// ACF CPT - Service Type
add_action('init', function () {
    register_taxonomy('service-type', array(
        0 => 'service',
    ), array(
        'labels' => array(
            'name' => 'Service Types',
            'singular_name' => 'Service Type',
            'menu_name' => 'Service Types',
            'all_items' => 'All Service Types',
            'edit_item' => 'Edit Service Type',
            'view_item' => 'View Service Type',
            'update_item' => 'Update Service Type',
            'add_new_item' => 'Add New Service Type',
            'new_item_name' => 'New Service Type Name',
            'parent_item' => 'Parent Service Type',
            'parent_item_colon' => 'Parent Service Type:',
            'search_items' => 'Search Service Types',
            'not_found' => 'No service types found',
            'no_terms' => 'No service types',
            'filter_by_item' => 'Filter by service type',
            'items_list_navigation' => 'Service Types list navigation',
            'items_list' => 'Service Types list',
            'back_to_items' => '← Go to service types',
            'item_link' => 'Service Type Link',
            'item_link_description' => 'A link to a service type',
        ),
        'description' => 'The list of service types',
        'public' => true,
        'hierarchical' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'sort' => true,
    ));
});


// ACF CPT - Service
add_action('init', function () {
    register_post_type('service', array(
        'labels' => array(
            'name' => 'Services',
            'singular_name' => 'Service',
            'menu_name' => 'Services',
            'all_items' => 'All Services',
            'edit_item' => 'Edit Service',
            'view_item' => 'View Service',
            'view_items' => 'View Services',
            'add_new_item' => 'Add New Service',
            'add_new' => 'Add New Service',
            'new_item' => 'New Service',
            'parent_item_colon' => 'Parent Service:',
            'search_items' => 'Search Services',
            'not_found' => 'No services found',
            'not_found_in_trash' => 'No services found in Trash',
            'archives' => 'Service Archives',
            'attributes' => 'Service Attributes',
            'insert_into_item' => 'Insert into service',
            'uploaded_to_this_item' => 'Uploaded to this service',
            'filter_items_list' => 'Filter services list',
            'filter_by_date' => 'Filter services by date',
            'items_list_navigation' => 'Services list navigation',
            'items_list' => 'Services list',
            'item_published' => 'Service published.',
            'item_published_privately' => 'Service published privately.',
            'item_reverted_to_draft' => 'Service reverted to draft.',
            'item_scheduled' => 'Service scheduled.',
            'item_updated' => 'Service updated.',
            'item_link' => 'Service Link',
            'item_link_description' => 'A link to a service.',
        ),
        'public' => true,
        'hierarchical' => true,
        'exclude_from_search' => false,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_nav_menus' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-admin-post',
        'supports' => array(
            0 => 'thumbnail',
            1 => 'custom-fields',
        ),
        'taxonomies' => array(
            0 => 'service-type',
        ),
        'delete_with_user' => false,
    ));
});