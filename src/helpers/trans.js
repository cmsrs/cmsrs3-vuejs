const ttt = (key) => {
  const d = {
    success_page_add: "Page has been added",
    success_page_edit: "Page has been changed",
    success_client_edit: "Page has been changed",
    success_client_add: "Page has been added",
  };

  return d[key] ? d[key] : key;
};

export default {
  ttt,
};
