const getImagesUpload = async (files) => {
  const promises = [];
  for (let i = 0; i < files.length; i++) {
    promises.push(
      new Promise((resolve, reject) => {
        let name = files[i].name;
        let reader = new FileReader();

        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          resolve({ data: e.target.result, name: name });
        };
        reader.onerror = (error) => {
          reject(error);
        };
      }),
    );
  }
  return Promise.all(promises);
};

export default {
  getImagesUpload,
};
