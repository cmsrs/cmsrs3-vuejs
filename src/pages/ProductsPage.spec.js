import {
  render,
  router,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "../../test/helper.js";
import "../../test/afterlogin.js";

import ProductsPage from "./ProductsPage.vue";
import storage from "../state/storage.js";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll } from "vitest";
import { API_SECRET } from "../config.js";
const apiSecret = API_SECRET ? "/" + API_SECRET : "";

const confirmSpy = vi.spyOn(window, "confirm");

const responseGetProducts = {
  success: 1,
  data: {
    current_page: 1,
    data: [
      {
        id: 1,
        sku: "AN/34534_1",
        price: 101,
        published: 1,
        page_id: 1,
        created_at: "2024-05-07T16:51:24.000000Z",
        updated_at: "2024-05-07T16:51:24.000000Z",
        product_name: "php3 db app_1",
        page_short_title: "page1",
        images: [
          {
            id: 1,
            name: "phpunittest1.jpg",
            position: 1,
            page_id: null,
            product_id: 1,
            created_at: "2024-05-07T16:51:24.000000Z",
            updated_at: "2024-05-07T16:51:24.000000Z",
            alt: {
              en: "description img1 - product image",
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
            created_at: "2024-05-07T16:51:24.000000Z",
            updated_at: "2024-05-07T16:51:24.000000Z",
            alt: {
              en: "",
            },
            fs: {
              org: "/images/product/1/2/phpunittest2.jpg",
              small: "/images/product/1/2/phpunittest2-small.jpg",
              medium: "/images/product/1/2/phpunittest2-medium.jpg",
            },
          },
        ],
      },
      {
        id: 3,
        sku: "app_1_1",
        price: 201,
        published: 0,
        page_id: 2,
        created_at: "2024-05-07T16:51:24.000000Z",
        updated_at: "2024-05-07T16:51:24.000000Z",
        product_name: "php3 db app 2_1",
        page_short_title: "page2",
        images: [
          {
            id: 5,
            name: "phpunittest1.jpg",
            position: 1,
            page_id: null,
            product_id: 3,
            created_at: "2024-05-07T16:51:24.000000Z",
            updated_at: "2024-05-07T16:51:24.000000Z",
            alt: {
              en: "description img1 - product image",
            },
            fs: {
              org: "/images/product/3/5/phpunittest1.jpg",
              small: "/images/product/3/5/phpunittest1-small.jpg",
              medium: "/images/product/3/5/phpunittest1-medium.jpg",
            },
          },
          {
            id: 6,
            name: "phpunittest2.jpg",
            position: 2,
            page_id: null,
            product_id: 3,
            created_at: "2024-05-07T16:51:24.000000Z",
            updated_at: "2024-05-07T16:51:24.000000Z",
            alt: {
              en: "",
            },
            fs: {
              org: "/images/product/3/6/phpunittest2.jpg",
              small: "/images/product/3/6/phpunittest2-small.jpg",
              medium: "/images/product/3/6/phpunittest2-medium.jpg",
            },
          },
        ],
      },
    ],
    first_page_url:
      "http://127.0.0.1:8000/api/products/pagination/en/sku/asc?page=1",
    from: 1,
    last_page: 1,
    last_page_url:
      "http://127.0.0.1:8000/api/products/pagination/en/sku/asc?page=1",
    links: [
      {
        url: null,
        label: "« Previous",
        active: null,
      },
      {
        url: "http://127.0.0.1:8000/api/products/pagination/en/sku/asc?page=1",
        label: 1,
        active: 1,
      },
      {
        url: null,
        label: "Next »",
        active: null,
      },
    ],
    next_page_url: null,
    path: "http://127.0.0.1:8000/api/products/pagination/en/sku/asc",
    per_page: 10,
    prev_page_url: null,
    to: 2,
    total: 2,
  },
};

const responseGetProductsPl = {
  success: 1,
  data: {
    current_page: 1,
    data: [
      {
        id: 1,
        sku: "AN/34534_1",
        price: 101,
        published: 1,
        page_id: 1,
        created_at: "2024-05-07T16:51:24.000000Z",
        updated_at: "2024-05-07T16:51:24.000000Z",
        product_name: "__pl__ php3 db app_1",
        page_short_title: "page1",
        images: [
          {
            id: 1,
            name: "phpunittest1.jpg",
            position: 1,
            page_id: null,
            product_id: 1,
            created_at: "2024-05-07T16:51:24.000000Z",
            updated_at: "2024-05-07T16:51:24.000000Z",
            alt: {
              pl: "__pl__ description img1 - product image",
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
            created_at: "2024-05-07T16:51:24.000000Z",
            updated_at: "2024-05-07T16:51:24.000000Z",
            alt: {
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
      {
        id: 3,
        sku: "app_1_1",
        price: 201,
        published: 0,
        page_id: 2,
        created_at: "2024-05-07T16:51:24.000000Z",
        updated_at: "2024-05-07T16:51:24.000000Z",
        product_name: "php3 db app 2_1",
        page_short_title: "page2",
        images: [
          {
            id: 5,
            name: "phpunittest1.jpg",
            position: 1,
            page_id: null,
            product_id: 3,
            created_at: "2024-05-07T16:51:24.000000Z",
            updated_at: "2024-05-07T16:51:24.000000Z",
            alt: {
              en: "description img1 - product image",
            },
            fs: {
              org: "/images/product/3/5/phpunittest1.jpg",
              small: "/images/product/3/5/phpunittest1-small.jpg",
              medium: "/images/product/3/5/phpunittest1-medium.jpg",
            },
          },
          {
            id: 6,
            name: "phpunittest2.jpg",
            position: 2,
            page_id: null,
            product_id: 3,
            created_at: "2024-05-07T16:51:24.000000Z",
            updated_at: "2024-05-07T16:51:24.000000Z",
            alt: {
              en: "",
            },
            fs: {
              org: "/images/product/3/6/phpunittest2.jpg",
              small: "/images/product/3/6/phpunittest2-small.jpg",
              medium: "/images/product/3/6/phpunittest2-medium.jpg",
            },
          },
        ],
      },
    ],
    first_page_url:
      "http://127.0.0.1:8000/api/products/pagination/en/sku/asc?page=1",
    from: 1,
    last_page: 1,
    last_page_url:
      "http://127.0.0.1:8000/api/products/pagination/en/sku/asc?page=1",
    links: [
      {
        url: null,
        label: "« Previous",
        active: null,
      },
      {
        url: "http://127.0.0.1:8000/api/products/pagination/en/sku/asc?page=1",
        label: 1,
        active: 1,
      },
      {
        url: null,
        label: "Next »",
        active: null,
      },
    ],
    next_page_url: null,
    path: "http://127.0.0.1:8000/api/products/pagination/en/sku/asc",
    per_page: 10,
    prev_page_url: null,
    to: 2,
    total: 2,
  },
};

let server = setupServer(
  http.get(
    "/api" + apiSecret + "/products/pagination/en/created_at/desc",
    () => {
      counter += 1;
      return HttpResponse.json(responseGetProducts);
    },
  ),

  http.get(
    "/api" + apiSecret + "/products/pagination/pl/created_at/desc",
    () => {
      counter += 1;
      return HttpResponse.json(responseGetProductsPl);
    },
  ),

  http.get(
    "/api" + apiSecret + "/products/pagination/en/product_name/asc",
    () => {
      counter += 1;
      return HttpResponse.json(responseGetProducts);
    },
  ),

  http.get(
    "/api" + apiSecret + "/products/pagination/en/product_name/desc",
    () => {
      counter += 1;
      return HttpResponse.json(responseGetProducts);
    },
  ),

  http.delete("/api" + apiSecret + "/products/1", () => {
    counter += 1;
    return HttpResponse.json({
      success: true,
    });
  }),
);

//let lang = 'en';
beforeAll(() => {
  server.listen();
});

let counter = 0;

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

const setup = async () => {
  render(ProductsPage);
};

const waitForAjax = async () => {
  const spinner = screen.queryByRole("pre_loader_add_product");
  expect(spinner).not.toBeNull();
  await waitForElementToBeRemoved(spinner);
};

describe("Products page", () => {
  describe("Layout", () => {
    it("has products header", async () => {
      await setup();
      const header = screen.queryByRole("heading", { name: "Products" });
      expect(header).toBeInTheDocument();
    });
  });

  describe("Interactions change lang", () => {
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
        is_shop: 1,
      },
    };

    it("show data in table in Polish language", async () => {
      localStorage.clear();
      storage.setItem("auth", jsonStore2.auth);
      storage.setItem("config", jsonStore2.config);
      await setup();
      await waitForAjax();
      const name1 = responseGetProductsPl.data.data[0].product_name;
      await screen.findByText(name1);
      const sku1 = responseGetProductsPl.data.data[0].sku;
      await screen.findByText(sku1);

      const name2 = responseGetProductsPl.data.data[1].product_name;
      await screen.findByText(name2);
      const sku2 = responseGetProductsPl.data.data[1].sku;
      await screen.findByText(sku2);
    });

    it("change lang from Polish to England", async () => {
      localStorage.clear();
      storage.setItem("auth", jsonStore2.auth);
      storage.setItem("config", jsonStore2.config);
      await setup();
      await waitForAjax();

      const name1 = responseGetProductsPl.data.data[0].product_name;
      await screen.findByText(name1);

      const productPl = screen.queryAllByRole("product_name_pl");
      expect(productPl.length).toBe(2);

      const productEn = screen.queryAllByRole("product_name_en");
      expect(productEn.length).toBe(0);

      const langEn = screen.queryByRole("lang_en");
      await userEvent.click(langEn);

      await waitFor(() => {
        const name2 = responseGetProducts.data.data[0].product_name;
        screen.findByText(name2);
        //screen.findByText('aaaaaaaaaaaaaaaaaaaaaaaa');

        const productEn = screen.queryAllByRole("product_name_en");
        expect(productEn.length).toBe(2);

        const productPl = screen.queryAllByRole("product_name_pl");
        expect(productPl.length).toBe(0);
      });
    });
  });

  describe("Interactions", () => {
    it("show data in table", async () => {
      await setup();
      await waitForAjax();
      const name1 = responseGetProducts.data.data[0].product_name;
      await screen.findByText(name1);
      const sku1 = responseGetProducts.data.data[0].sku;
      await screen.findByText(sku1);

      const name2 = responseGetProducts.data.data[1].product_name;
      await screen.findByText(name2);
      const sku2 = responseGetProducts.data.data[1].sku;
      await screen.findByText(sku2);
    });

    it("sorting asc by product_name", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1);
      const button = screen.queryByRole("sorting_product_name_asc");
      await userEvent.click(button);
      expect(counter).toBe(2);

      const name1 = responseGetProducts.data.data[0].product_name;
      await screen.findByText(name1);
    });

    it("sorting desc by product_name", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1);
      const button = screen.queryByRole("sorting_product_name_desc");
      await userEvent.click(button);
      expect(counter).toBe(2);

      const name1 = responseGetProducts.data.data[0].product_name;
      await screen.findByText(name1);
    });

    it("change pagination page", async () => {
      await setup();
      await waitForAjax();

      const aHref = screen.queryAllByRole("pagination_links");

      expect(counter).toBe(1); //mount
      await userEvent.click(aHref[1]);
      expect(counter).toBe(2); //mount+click
    });

    it("delete product", async () => {
      confirmSpy.mockReturnValueOnce(true);
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const productDel = await screen.queryAllByRole("del_product");
      userEvent.click(productDel[0]);

      await waitFor(() => {
        expect(counter).toBe(3);
        const alertSuccessAfter = screen.queryByRole("alert_success");
        expect(alertSuccessAfter).toBeInTheDocument();
      });
    });

    it("edit product", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const productDel = await screen.queryAllByRole("edit_product");
      userEvent.click(productDel[0]);
      //todo
    });

    it("add product", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const productAdd = await screen.queryByRole("button_add_product");
      userEvent.click(productAdd);
      //todo
    });

    it("search product", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const search = await screen.queryByRole("button_search_product");
      userEvent.click(search);
      await waitFor(() => {
        expect(counter).toBe(2);
      });
    });
  });
});
