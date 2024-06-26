const ttt = (key) => {
  const d = {
    success_page_add: "Page has been added",
    success_page_edit: "Page has been changed",
    success_client_edit: "Client has been changed",
    success_client_add: "Client has been added",
    success_product_edit: "Product has been changed",
    success_product_add: "Product has been added",
    success_image_position: "Position image has been changed",
    success_image_delete: "Image has been deleted",
    success_images_delete: "Images has been deleted",
    success_images_upload: "Images have been uploaded",

    fail_delete_images_no_items: "fail delete images no items",

    toggle_cache_enable: "toggle cache",
    clear_cache: "clear cache",
    create_sitemap: "create sitemap",

    cache_was_cleared: "Cache was cleared",
    sitemap_was_created: "Sitemap was created",

    success_edit_checkout: "Checkout has been updated",

    is_demo_true:
      "We're sorry, but this action is not available in the demo version.",
    internal_problem: "internal problem, see logs",
  };

  return d[key] ? d[key] : key;
};

export default {
  ttt,
};
