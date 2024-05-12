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
  };

  return d[key] ? d[key] : key;
};

export default {
  ttt,
};
