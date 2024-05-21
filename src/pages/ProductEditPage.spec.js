import {
  render,
  router,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "../../test/helper.js";
import "../../test/afterlogin.js";

import ProductEditPage from "./ProductEditPage.vue";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import userEvent from "@testing-library/user-event";
import trans from "../helpers/trans.js";
import storage from "../state/storage.js";
import { afterAll, beforeAll } from "vitest";

const confirmSpy = vi.spyOn(window, "confirm");

const responseGetProduct = {
  success: 1,
  data: {
    id: 1,
    published: 1,
    sku: "AN/34534_1",
    price: 101,
    page_id: 1,
    product_name: {
      en: "php3 db app_1",
      pl: "php3 jako app bazodanowe",
    },
    product_name_slug: {
      en: "php3-db-app-1",
      pl: "php3-jako-app-bazodanowe",
    },
    product_description: {
      en: "book desc_1",
      pl: "php3 app bazodanowe",
    },
    product_name_default_lang: "php3 db app_1",
    images: [
      {
        id: 1,
        name: "phpunittest1.jpg",
        position: 1,
        page_id: null,
        product_id: 1,
        created_at: "2024-04-25T16:54:10.000000Z",
        updated_at: "2024-04-25T16:54:10.000000Z",
        alt: {
          en: "description img1 - product image",
          pl: "opis img1 - obraz produktu",
        },
        fs: {
          org: "/images/product/1/1/phpunittest1.jpg",
          small: "/images/product/1/1/phpunittest1-small.jpg",
          medium: "/images/product/1/1/phpunittest1-medium.jpg",
        },
      },
      {
        id: 2,
        name: "phpunittest2.jpg",
        position: 2,
        page_id: null,
        product_id: 1,
        created_at: "2024-04-25T16:54:10.000000Z",
        updated_at: "2024-04-25T16:54:10.000000Z",
        alt: {
          en: "",
          pl: "",
        },
        fs: {
          org: "/images/product/1/2/phpunittest2.jpg",
          small: "/images/product/1/2/phpunittest2-small.jpg",
          medium: "/images/product/1/2/phpunittest2-medium.jpg",
        },
      },
    ],
  },
};

const responsePagesTypeShop = {
  success: 1,
  data: [
    {
      id: 1,
      published: 0,
      commented: 0,
      after_login: 0,
      position: 1,
      type: "shop",
      menu_id: null,
      page_id: null,
      title: {
        en: "test p2",
      },
      short_title: {
        en: "p22",
      },
      description: {
        en: "",
      },
      content: {
        en: "aaa bbbb",
      },
      images: [],
    },
  ],
};

let server = setupServer(
  http.get("/api/pages/type/shop", () => {
    counter += 1;
    return HttpResponse.json(responsePagesTypeShop);
  }),

  http.get("/api/products/1", () => {
    counter += 1;
    return HttpResponse.json(responseGetProduct);
  }),

  http.put("/api/products/1", () => {
    counter += 1;
    return HttpResponse.json({
      success: true,
    });
  }),

  http.post("/api/products", () => {
    counter += 1;
    return HttpResponse.json({
      success: true,
    });
  }),
);

let counter = 0;

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

const setupAdd = async () => {
  router.push("/product/add/");
  await router.isReady();
  return render(ProductEditPage, {
    props: {
      mode: "add",
    },
  });
};

const setupEdit = async () => {
  router.push("/product/edit/1");
  await router.isReady();
  return render(ProductEditPage, {
    props: {
      mode: "edit",
      id: "1",
    },
  });
};

const waitForAjax = async () => {
  const spinner = screen.queryByRole("pre_loader_add_edit_product");

  //console.log(spinner);
  expect(spinner).not.toBeNull();
  await waitForElementToBeRemoved(spinner);
};

describe.skip("empty token", () => {
  //TODO
  it("has product redirect", async () => {
    storage.setItem("auth", { token: "" });
    await setupAdd();
    await waitForAjax();
    const header = screen.queryByRole("heading", { name: "Add product" });
    expect(header).not.toBeInTheDocument();
  });
});

describe("Product edit or add page", () => {
  describe("Layout", () => {
    it("has edit product header", async () => {
      await setupEdit();
      await waitForAjax();
      const header = screen.queryByRole("heading", { name: "Edit product" });
      expect(header).toBeInTheDocument();
    });

    it("has add product header", async () => {
      await setupAdd();
      await waitForAjax();

      const header = screen.queryByRole("heading", { name: "Add product" });
      expect(header).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("load product data", async () => {
      await setupEdit();

      await waitForAjax();
      expect(counter).toBe(2); //mount
    });

    it("new data", async () => {
      await setupAdd();
      await waitForAjax();
      expect(counter).toBe(1);
    });

    it("load edit product", async () => {
      await setupEdit();
      await waitForAjax();
      expect(counter).toBe(2);

      const product_name = screen.queryByPlaceholderText("product name");
      expect(product_name).toHaveValue(
        responseGetProduct.data.product_name["en"],
      );

      const sku = screen.queryByPlaceholderText("sku");
      expect(sku).toHaveValue(responseGetProduct.data.sku);

      const price = screen.queryByPlaceholderText("price");
      expect(price).toHaveValue(responseGetProduct.data.price.toString());

      const published = screen.queryByLabelText("Published");
      expect(published).toBeChecked(); //  toHaveValue(responseGetProduct.data.published);

      const productDescription = screen.queryByPlaceholderText(
        "product description",
      );
      expect(productDescription).toHaveValue(
        responseGetProduct.data.product_description["en"],
      );
    });

    it("load add product", async () => {
      await setupAdd();
      await waitForAjax();
      expect(counter).toBe(1);

      const sku = screen.queryByPlaceholderText("sku");
      expect(sku).toHaveValue("");

      const product_name = screen.queryByPlaceholderText("product name");
      expect(product_name).toHaveValue("");

      const price = screen.queryByPlaceholderText("price");
      expect(price).toHaveValue("");

      const published = screen.queryByLabelText("Published");
      expect(published).not.toBeChecked();

      const productDescription = screen.queryByPlaceholderText(
        "product description",
      );
      expect(productDescription).toHaveValue("");
    });

    it("edit product by click", async () => {
      await setupEdit();
      await waitForAjax();
      expect(counter).toBe(2);

      const sku = screen.queryByPlaceholderText("sku");
      await userEvent.type(sku, "sku/test/123");

      const buttonSubmit = screen.queryByRole("button_save_edit_product");
      await userEvent.click(buttonSubmit);
      expect(counter).toBe(3);

      const successMsg = trans.ttt("success_product_edit");
      expect(successMsg).not.toBe("");
      await screen.findByText(successMsg);
    });

    it("add product by click", async () => {
      await setupAdd();
      await waitForAjax();
      expect(counter).toBe(1);

      const product_name = screen.queryByPlaceholderText("product name");
      await userEvent.type(product_name, "aaaaaaaaaaaaa");

      const sku = screen.queryByPlaceholderText("sku");
      await userEvent.type(sku, "aaaabb/16/3");

      const price = screen.queryByPlaceholderText("price");
      await userEvent.type(price, "323");

      //const published = screen.queryByLabelText("Published");
      //expect(published).toBeChecked();//  toHaveValue(responseGetProduct.data.published);

      const productDescription = screen.queryByPlaceholderText(
        "product description",
      );
      await userEvent.type(productDescription, "323");

      const buttonSubmit = screen.queryByRole("button_save_edit_product");
      await userEvent.click(buttonSubmit);
      expect(counter).toBe(2);

      const successMsg = trans.ttt("success_product_add");
      expect(successMsg).not.toBe("");
      await screen.findByText(successMsg);
    });
  });

  describe("Interactions edit product change lang", () => {
    const jsonStore2 = {
      auth: {
        token: "abcde12345",
      },
      //this data came from api/config and save to local storage
      config: {
        page_types: ["cms", "gallery", "main_page"],
        langs: ["pl", "en"],
        default_lang: "pl",
        cache_enable: 1,
      },
    };

    it("show data in Polish language", async () => {
      localStorage.clear();
      storage.setItem("auth", jsonStore2.auth);
      storage.setItem("config", jsonStore2.config);
      await setupEdit();
      await waitForAjax();
      expect(counter).toBe(2);

      await waitFor(() => {
        const productPl = screen.queryByRole("product_name_pl");
        expect(productPl).toBeInTheDocument();

        const product_name1 = responseGetProduct.data.product_name["pl"];
        expect(productPl.value).toBe(product_name1);

        const productEn = screen.queryByRole("product_name_en");
        expect(productEn).not.toBeInTheDocument();

        //const sku1 = responseGetProduct.data.sku;
        //screen.findByText(sku1);

        //const product_name1 = responseGetProduct.data.product_name['pl'];
        //screen.findByText(product_name1);
      });
    });

    it("change lang from Polish to England", async () => {
      localStorage.clear();
      storage.setItem("auth", jsonStore2.auth);
      storage.setItem("config", jsonStore2.config);
      await setupEdit();
      await waitForAjax();

      //see previous test
      //const product_name1 = responseGetProduct.data.product_name['pl'];
      //await screen.findByText(product_name1);

      const productPl = screen.queryByRole("product_name_pl");
      expect(productPl).toBeInTheDocument();

      const productEn = screen.queryByRole("product_name_en");
      expect(productEn).not.toBeInTheDocument();

      const langEn = screen.queryByRole("lang_en");
      await userEvent.click(langEn);

      await waitFor(() => {
        const product_name2 = responseGetProduct.data.product_name["en"];
        //screen.findByText(product_name2);
        //screen.findByText('aaaaaaaaaaaaaaaaaaaaaaaa'); //it works too. i don't  know why

        const productEn = screen.queryByRole("product_name_en");
        expect(productEn).toBeInTheDocument();
        expect(productEn.value).toBe(product_name2);

        const productPl = screen.queryByRole("product_name_pl");
        expect(productPl).not.toBeInTheDocument();
      });
    });
  });

  describe("Interactions validation errors", () => {
    it("add product with errors", async () => {
      const responseError = {
        success: false,
        error: {
          sku: ["The sku has already been taken."],
          price: [
            "The price must be an integer.",
            "The price field is required.",
          ],
        },
      };

      server.use(
        http.post("/api/products", () => {
          counter += 1;
          return HttpResponse.json(responseError);
        }),
        http.get("/api/pages/type/shop", () => {
          counter += 1;
          return HttpResponse.json(responsePagesTypeShop);
        }),
      );

      await setupAdd();
      await waitForAjax();
      expect(counter).toBe(1);

      //const sku = screen.queryByPlaceholderText("sku");
      //await userEvent.type(sku, "b/4345");

      const product_name = screen.queryByPlaceholderText("product name");
      await userEvent.type(product_name, "TV");

      const alertDangerAfter = screen.queryByRole("alert_danger");
      expect(alertDangerAfter).not.toBeInTheDocument();

      const buttonSubmit = screen.queryByRole("button_save_edit_product");
      await userEvent.click(buttonSubmit);
      expect(counter).toBe(2);

      await waitFor(() => {
        const alertDangerAfter2 = screen.queryByRole("alert_danger");
        expect(alertDangerAfter2).toBeInTheDocument();

        const sku2 = screen.queryByPlaceholderText("sku");
        expect(sku2).toHaveClass("is-invalid");

        const price = screen.queryByPlaceholderText("price");
        expect(price).toHaveClass("is-invalid");
      });
    });
  });

  /**
   * products images
   */
  describe("Products images tests", () => {
    const setup_edit_product = async () => {
      await setupEdit();
      await waitForAjax();
    };

    const images = responseGetProduct.data.images;
    let counterUpload = 0;
    let counterImage = 0;

    let counterDeleteImages = 0;
    let counterDeleteOneImage = 0;
    beforeEach(() => {
      counterUpload = 0;
      counterImage = 0;
      counterDeleteImages = 0;
      counterDeleteOneImage = 0;
      server.use(
        http.post("/api/image/product/1", async () => {
          counterUpload += 1;
          return HttpResponse.json({
            success: true,
          });
        }),

        http.get("/api/images/product/1", async () => {
          //s !!
          return HttpResponse.json({
            success: true,
            data: images,
          });
        }),

        http.get("/api/images/position/down/1", async () => {
          counterImage += 1;
          return HttpResponse.json({
            success: true,
          });
        }),

        http.get("/api/images/position/up/2", async () => {
          counterImage += 1;
          return HttpResponse.json({
            success: true,
          });
        }),

        http.delete("/api/images/1", async () => {
          counterImage += 1;
          return HttpResponse.json({
            success: true,
          });
        }),

        http.delete("/api/images/1,2", async () => {
          counterDeleteImages += 1;
          return HttpResponse.json({
            success: true,
          });
        }),

        http.delete("/api/images/2", async () => {
          counterDeleteOneImage += 1;
          return HttpResponse.json({
            success: true,
          });
        }),
      );
    });

    it.skip("upload images is prohibit without edit page", async () => {
      await setup_edit_product();

      expect(counterUpload).toBe(0);
      const uploadImages = screen.queryByRole("upload_images"); //const uploadImages = screen.getByLabelText(/upload images/i) //second option
      await userEvent.upload(uploadImages, [
        new File(["phpunittest1"], "phpunittest1.jpg", { type: "image/jpg" }),
        new File(["phpunittest2"], "phpunittest2.jpg", { type: "image/jpg" }),
      ]);

      await waitFor(() => {
        expect(counterUpload).toBe(0);
      });
    });

    it("upload one image success", async () => {
      await setup_edit_product();

      expect(counterUpload).toBe(0);

      const uploadImages = screen.queryByRole("upload_images"); //const uploadImages = screen.getByLabelText(/upload images/i) //second option
      await userEvent.upload(uploadImages, [
        new File(["phpunittest1"], "phpunittest1.jpg", { type: "image/jpg" }),
        new File(["phpunittest2"], "phpunittest2.jpg", { type: "image/jpg" }),
      ]);

      await waitFor(() => {
        expect(counterUpload).toBe(2);

        const successMsg = "Images has been uploaded";
        screen.findByText(successMsg);
      });
    });

    it("image show", async () => {
      await setup_edit_product();
      const delImage = screen.queryAllByRole("del_image");
      const positionDownImages = screen.queryAllByRole("down_image");
      const positionUpImages = screen.queryAllByRole("up_image");

      expect(delImage.length).toBe(2);
      expect(positionDownImages.length).toBe(2);
      expect(positionUpImages.length).toBe(2);
    });

    it("image delete success", async () => {
      confirmSpy.mockReturnValueOnce(true);
      await setup_edit_product();

      expect(counterImage).toBe(0);
      const delImage = screen.queryAllByRole("del_image");
      await userEvent.click(delImage[0]);

      await waitFor(() => {
        expect(counterImage).toBe(1);

        const successMsg = trans.ttt("success_image_delete");
        screen.findByText(successMsg);
      });
    });

    it("delete many images success", async () => {
      confirmSpy.mockReturnValueOnce(true);
      await setup_edit_product();

      expect(counterImage).toBe(0);

      const allCheckbox = screen.queryAllByRole("check_image");      
      //console.log( images );
      expect(images.length).toBe(2);
      expect(allCheckbox.length).toBe(2);

      await userEvent.click(allCheckbox[0]);
      await userEvent.click(allCheckbox[1]);

      const deleteImages = screen.queryByRole("delete_many_images");
      await userEvent.click(deleteImages);

      await waitFor(() => {
        const alertSuccessAfter = screen.queryByRole("alert_success");
        expect(alertSuccessAfter).toBeInTheDocument();

        expect(counterDeleteOneImage).toBe(0);
        expect(counterDeleteImages).toBe(1);

        const successMsg = trans.ttt("success_images_delete");
        screen.findByText(successMsg);
      });
    });

    it("successfully delete all images by selecting select all", async () => {
      confirmSpy.mockReturnValueOnce(true);
      await setup_edit_product();

      const checkboxSelectedAllItems = screen.queryByRole("selected_all_items");
      await userEvent.click(checkboxSelectedAllItems);

      const deleteImages = screen.queryByRole("delete_many_images");
      await userEvent.click(deleteImages);

      await waitFor(() => {
        const alertSuccessAfter = screen.queryByRole("alert_success");
        expect(alertSuccessAfter).toBeInTheDocument();

        expect(counterDeleteOneImage).toBe(0);
        expect(counterDeleteImages).toBe(1);

        const successMsg = trans.ttt("success_images_delete");
        screen.findByText(successMsg);
      });
    });

    it("click select all two times", async () => {
      confirmSpy.mockReturnValueOnce(true);
      await setup_edit_product();

      const checkboxSelectedAllItems = screen.queryByRole("selected_all_items");
      await userEvent.click(checkboxSelectedAllItems);
      await userEvent.click(checkboxSelectedAllItems);

      const deleteImages = screen.queryByRole("delete_many_images");
      await userEvent.click(deleteImages);

      await waitFor(() => {
        const alertSuccessAfter = screen.queryByRole("alert_success");
        expect(alertSuccessAfter).not.toBeInTheDocument();

        const alertDangerAfter = screen.queryByRole("alert_danger");
        expect(alertDangerAfter).toBeInTheDocument();

        const msg = trans.ttt("fail_delete_images_no_items");
        screen.findByText(msg);
      });
    });

    it("delete one image success", async () => {
      confirmSpy.mockReturnValueOnce(true);
      await setup_edit_product();

      expect(counterImage).toBe(0);

      const allCheckbox = screen.queryAllByRole("check_image");
      expect(images.length).toBe(2);
      expect(allCheckbox.length).toBe(2);

      await userEvent.click(allCheckbox[0]);
      await userEvent.click(allCheckbox[1]);
      await userEvent.click(allCheckbox[0]);

      const deleteImages = screen.queryByRole("delete_many_images");
      await userEvent.click(deleteImages);

      await waitFor(() => {
        const alertSuccessAfter = screen.queryByRole("alert_success");
        expect(alertSuccessAfter).toBeInTheDocument();

        expect(counterDeleteOneImage).toBe(1);
        expect(counterDeleteImages).toBe(0);

        const successMsg = trans.ttt("success_images_delete");
        screen.findByText(successMsg);
      });
    });

    it("click icon delete many images without check any item", async () => {
      confirmSpy.mockReturnValueOnce(true);
      await setup_edit_product();

      expect(counterImage).toBe(0);

      const deleteImages = screen.queryByRole("delete_many_images");
      await userEvent.click(deleteImages);
      const alertDangerAfter = screen.queryByRole("alert_danger");
      expect(alertDangerAfter).toBeInTheDocument();
    });

    it("image position down success", async () => {
      await setup_edit_product();

      expect(counterImage).toBe(0);

      const positionDownImages = screen.queryAllByRole("down_image");
      await userEvent.click(positionDownImages[0]);

      await waitFor(() => {
        expect(counterImage).toBe(1);

        const successMsg = trans.ttt("success_image_position");
        screen.findByText(successMsg);
      });
    });

    it("image position up success", async () => {
      await setup_edit_product();
      expect(counterImage).toBe(0);

      const positionUpImages = screen.queryAllByRole("up_image");
      await userEvent.click(positionUpImages[1]);

      await waitFor(() => {
        expect(counterImage).toBe(1);

        const successMsg = trans.ttt("success_image_position");
        screen.findByText(successMsg);
      });
    });
  });

});
