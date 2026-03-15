jQuery(function ($) {
  $(document).on('click', '.wrk-hsa-media-upload', function (e) {
    e.preventDefault();

    const button = $(this);
    const field = button.closest('td');
    const input = field.find('.wrk-hsa-media-id');
    const preview = field.find('.wrk-hsa-media-preview');

    const frame = wp.media({
      title: 'Select image',
      button: { text: 'Use image' },
      multiple: false,
      library: { type: 'image' },
    });

    frame.on('select', function () {
      const attachment = frame.state().get('selection').first().toJSON();
      input.val(attachment.id);
      preview.attr('src', attachment.url).show();
    });

    frame.open();
  });

  $(document).on('click', '.wrk-hsa-media-clear', function (e) {
    e.preventDefault();
    const field = $(this).closest('td');
    field.find('.wrk-hsa-media-id').val('');
    field.find('.wrk-hsa-media-preview').attr('src', '').hide();
  });
});
