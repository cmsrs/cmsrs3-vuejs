import {
  render,
  router,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "../../test/helper.js";
//import "../../test/afterlogin.js";

import ProductEditPage from "./ProductEditPage.vue";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import userEvent from "@testing-library/user-event";
import trans from "../helpers/trans.js";
import storage from "../state/storage.js"
//import storage from "../state/storage.js";
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

  /**image */
  http.post("/api/image/product/1", async () => {
    counterUpload += 1;
    return new HttpResponse(null, {
      status: 403
    })
  }),

  http.get("/api/images/product/1", async () => {
    return HttpResponse.json({
      success: true,
      data: images,
    });
  }),

  //change to patch!!
  http.get("/api/images/position/down/1", async () => {
    counterImage += 1;
    return new HttpResponse(null, {
      status: 403
    })
  }),

  http.get("/api/images/position/up/2", async () => {
    counterImage += 1;
    return new HttpResponse(null, {
      status: 403
    })
  }),

  http.delete("/api/images/1", async () => {
    counterImage += 1;
    return new HttpResponse(null, {
      status: 403
    })
  }),

  http.delete("/api/images/1,2", async () => {
    counterDeleteImages += 1;
    return new HttpResponse(null, {
      status: 403
    })
  }),

  http.delete("/api/images/2", async () => {
    counterDeleteOneImage += 1;
    return new HttpResponse(null, {
      status: 403
    })
  }),
);

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
    demo_status: 1 //!!!
  },
};


const images = responseGetProduct.data.images;

let counterUpload = 0;
let counterImage = 0;

let counterDeleteImages = 0;
let counterDeleteOneImage = 0;
let counter = 0;

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  counter = 0;
  counterUpload = 0;
  counterImage = 0;
  counterDeleteImages = 0;
  counterDeleteOneImage = 0;

  storage.setItem('auth', jsonStore2.auth )
  storage.setItem('config', jsonStore2.config )

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

const setup_edit_product = async () => {
  await setupEdit();
  await waitForAjax();
};

describe("Product edit or add images", () => {
  /**
   * products images
   */
  describe("Products images tests for demo mode", () => {
    it("upload one image danger", async () => {
      expect(counterUpload).toBe(0);
      await setup_edit_product();

      expect(counterUpload).toBe(0);

      const uploadImages = screen.queryByRole("upload_images"); //const uploadImages = screen.getByLabelText(/upload images/i) //second option
      await userEvent.upload(uploadImages, [
        new File(["phpunittest1"], "phpunittest1.jpg", { type: "image/jpg" }),
        new File(["phpunittest2"], "phpunittest2.jpg", { type: "image/jpg" }),
      ]);

      await waitFor(() => {
        //expect(counterUpload).toBe(2);

        const alertDangerAfter = screen.queryByRole("alert_danger");
        expect(alertDangerAfter).toBeInTheDocument();

        const msg = trans.ttt("is_demo_true");
        expect(screen.queryByText(msg)).toBeInTheDocument();
      });
    });

    it("image show", async () => {
      expect(counterUpload).toBe(0);
      await setup_edit_product();
      expect(counterUpload).toBe(0); //this test working properly, - because it is separate test file

      const delImage = screen.queryAllByRole("del_image");
      const positionDownImages = screen.queryAllByRole("down_image");
      const positionUpImages = screen.queryAllByRole("up_image");

      expect(delImage.length).toBe(2);
      expect(positionDownImages.length).toBe(2);
      expect(positionUpImages.length).toBe(2);
    });

    it("upload images is prohibit without edit product danger", async () => {
      //await setup_edit_product();
      await setupAdd();
      await waitForAjax();

      expect(counterUpload).toBe(0);

      //expect(counterUpload).toBe(0);
      const uploadImages = screen.queryByRole("upload_images"); //const uploadImages = screen.getByLabelText(/upload images/i) //second option
      await userEvent.upload(uploadImages, [
        new File(["phpunittest1"], "phpunittest1.jpg", { type: "image/jpg" }),
        new File(["phpunittest2"], "phpunittest2.jpg", { type: "image/jpg" }),
      ]);

      await waitFor(() => {
        expect(counterUpload).toBe(0);
      });
    });

    it("image delete danger", async () => {
      confirmSpy.mockReturnValueOnce(true);
      await setup_edit_product();

      expect(counterImage).toBe(0);
      const delImage = screen.queryAllByRole("del_image");
      await userEvent.click(delImage[0]);

      await waitFor(() => {
        expect(counterImage).toBe(1);

        const alertDangerAfter = screen.queryByRole("alert_danger");
        expect(alertDangerAfter).toBeInTheDocument();

        const msg = trans.ttt("is_demo_true");
        expect(screen.queryByText(msg)).toBeInTheDocument();
      });
    });

    it("delete many images danger", async () => {
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
        expect(counterDeleteOneImage).toBe(0);
        expect(counterDeleteImages).toBe(1);

        const alertDangerAfter = screen.queryByRole("alert_danger");
        expect(alertDangerAfter).toBeInTheDocument();

        const msg = trans.ttt("is_demo_true");
        expect(screen.queryByText(msg)).toBeInTheDocument();
      });
    });

    it("danger delete all images by selecting select all", async () => {
      confirmSpy.mockReturnValueOnce(true);
      await setup_edit_product();

      const checkboxSelectedAllItems = screen.queryByRole("selected_all_items");
      await userEvent.click(checkboxSelectedAllItems);

      const deleteImages = screen.queryByRole("delete_many_images");
      await userEvent.click(deleteImages);

      await waitFor(() => {

        expect(counterDeleteOneImage).toBe(0);
        expect(counterDeleteImages).toBe(1);

        const alertDangerAfter = screen.queryByRole("alert_danger");
        expect(alertDangerAfter).toBeInTheDocument();

        const msg = trans.ttt("is_demo_true");
        expect(screen.queryByText(msg)).toBeInTheDocument();
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

    it("delete one image danger", async () => {
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

        expect(counterDeleteOneImage).toBe(1);
        expect(counterDeleteImages).toBe(0);

        const alertDangerAfter = screen.queryByRole("alert_danger");
        expect(alertDangerAfter).toBeInTheDocument();

        const msg = trans.ttt("is_demo_true");
        expect(screen.queryByText(msg)).toBeInTheDocument();

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

    it("image position down danger", async () => {
      await setup_edit_product();

      expect(counterImage).toBe(0);

      const positionDownImages = screen.queryAllByRole("down_image");
      await userEvent.click(positionDownImages[0]);

      await waitFor(() => {
        expect(counterImage).toBe(1);

        const alertDangerAfter = screen.queryByRole("alert_danger");
        expect(alertDangerAfter).toBeInTheDocument();

        const msg = trans.ttt("is_demo_true");
        expect(screen.queryByText(msg)).toBeInTheDocument();
      });
    });

    it("image position up danger", async () => {
      await setup_edit_product();
      expect(counterImage).toBe(0);

      const positionUpImages = screen.queryAllByRole("up_image");
      await userEvent.click(positionUpImages[1]);

      await waitFor(() => {
        expect(counterImage).toBe(1);

        const alertDangerAfter = screen.queryByRole("alert_danger");
        expect(alertDangerAfter).toBeInTheDocument();

        const msg = trans.ttt("is_demo_true");
        expect(screen.queryByText(msg)).toBeInTheDocument();
      });
    });
  });
});
