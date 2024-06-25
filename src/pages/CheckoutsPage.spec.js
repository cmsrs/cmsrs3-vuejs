import {
  render,
  router,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "../../test/helper.js";
import "../../test/afterlogin.js";

import CheckoutsPage from "./CheckoutsPage.vue";
import storage from "../state/storage.js";
import trans from "../helpers/trans.js";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll } from "vitest";
import { API_SECRET } from "../config.js";
const apiSecret = API_SECRET ? "/" + API_SECRET : "";

//const confirmSpy = vi.spyOn(window, "confirm");

const responseGetCheckouts = {
  success: 1,
  data: {
    current_page: 1,
    data: [
      {
        id: 4,
        price_total: 3128,
        price_deliver: 14,
        price_total_add_deliver: 3142,
        user_id: 2,
        email: "client3@cmsrs.pl",
        first_name: "Jan",
        last_name: "Kowalski",
        address: "kolejowa 3 m 2",
        country: "Polska",
        city: "Warszawa",
        telephone: "1234567123",
        postcode: "03-456",
        is_pay: null,
        created_at: "2024-06-17T12:11:48.000000Z",
        baskets: [
          {
            qty: 5,
            price: 112,
            product_id: 1,
            product_name: "name11",
            product_url: "/cms/books/programmer/name11",
          },
          {
            qty: 8,
            price: 321,
            product_id: 2,
            product_name: "name22",
            product_url: "/cms/books/programmer/name22",
          },
        ],
      },
      {
        id: 31,
        price_total: 14819,
        price_deliver: 14,
        price_total_add_deliver: 14833,
        user_id: 2,
        email: "client30@cmsrs.pl",
        first_name: "Jan",
        last_name: "Kowalski",
        address: "kolejowa 30 m 2",
        country: "Polska",
        city: "Warszawa",
        telephone: "1234567123",
        postcode: "03-456",
        is_pay: null,
        created_at: "2024-06-17T12:11:48.000000Z",
        baskets: [
          {
            qty: 32,
            price: 112,
            product_id: 1,
            product_name: "name11",
            product_url: "/cms/books/programmer/name11",
          },
          {
            qty: 35,
            price: 321,
            product_id: 2,
            product_name: "name22",
            product_url: "/cms/books/programmer/name22",
          },
        ],
      },
    ],
    first_page_url:
      "http://127.0.0.1:8000/api" +
      apiSecret +
      "/checkouts/pagination/en/price_total_add_deliver/asc?page=1",
    from: 1,
    last_page: 1,
    last_page_url:
      "http://127.0.0.1:8000/api" +
      apiSecret +
      "/checkouts/pagination/en/price_total_add_deliver/asc?page=1",
    links: [
      {
        url: null,
        label: "« Previous",
        active: false,
      },
      {
        url:
          "http://127.0.0.1:8000/api" +
          apiSecret +
          "/checkouts/pagination/en/price_total_add_deliver/asc?page=1",
        label: "1",
        active: true,
      },
      {
        url: null,
        label: "Next »",
        active: false,
      },
    ],
    next_page_url: null,
    path:
      "http://127.0.0.1:8000/api" +
      apiSecret +
      "/checkouts/pagination/en/price_total_add_deliver/asc",
    per_page: 10,
    prev_page_url: null,
    to: 2,
    total: 2,
  },
};

const responseGetCheckoutsPl = {
  success: 1,
  data: {
    current_page: 1,
    data: [
      {
        id: 4,
        price_total: 3128,
        price_deliver: 14,
        price_total_add_deliver: 3142,
        user_id: 2,
        email: "client3@cmsrs.pl",
        first_name: "Jan",
        last_name: "Kowalski",
        address: "kolejowa 3 m 2",
        country: "Polska",
        city: "Warszawa",
        telephone: "1234567123",
        postcode: "03-456",
        is_pay: null,
        created_at: "2024-06-17T12:11:48.000000Z",
        baskets: [
          {
            qty: 5,
            price: 112,
            product_id: 1,
            product_name: "name11pl",
            product_url: "/cms/books/programmer/name11pl",
          },
          {
            qty: 8,
            price: 321,
            product_id: 2,
            product_name: "name22pl",
            product_url: "/cms/books/programmer/name22pl",
          },
        ],
      },
      {
        id: 31,
        price_total: 14819,
        price_deliver: 14,
        price_total_add_deliver: 14833,
        user_id: 2,
        email: "client30@cmsrs.pl",
        first_name: "Jan",
        last_name: "Kowalski",
        address: "kolejowa 30 m 2",
        country: "Polska",
        city: "Warszawa",
        telephone: "1234567123",
        postcode: "03-456",
        is_pay: null,
        created_at: "2024-06-17T12:11:48.000000Z",
        baskets: [
          {
            qty: 32,
            price: 112,
            product_id: 1,
            product_name: "name11pl",
            product_url: "/cms/books/programmer/name11pl",
          },
          {
            qty: 35,
            price: 321,
            product_id: 2,
            product_name: "name22pl",
            product_url: "/cms/books/programmer/name22pl",
          },
        ],
      },
    ],
    first_page_url:
      "http://127.0.0.1:8000/api" +
      apiSecret +
      "/checkouts/pagination/en/price_total_add_deliver/asc?page=1",
    from: 1,
    last_page: 1,
    last_page_url:
      "http://127.0.0.1:8000/api" +
      apiSecret +
      "/checkouts/pagination/en/price_total_add_deliver/asc?page=1",
    links: [
      {
        url: null,
        label: "« Previous",
        active: false,
      },
      {
        url:
          "http://127.0.0.1:8000/api" +
          apiSecret +
          "/checkouts/pagination/en/price_total_add_deliver/asc?page=1",
        label: "1",
        active: true,
      },
      {
        url: null,
        label: "Next »",
        active: false,
      },
    ],
    next_page_url: null,
    path:
      "http://127.0.0.1:8000/api" +
      apiSecret +
      "/checkouts/pagination/en/price_total_add_deliver/asc",
    per_page: 10,
    prev_page_url: null,
    to: 2,
    total: 2,
  },
};

let server = setupServer(
  http.get(
    "/api" + apiSecret + "/checkouts/pagination/en/created_at/desc",
    () => {
      counter += 1;
      return HttpResponse.json(responseGetCheckouts);
    },
  ),

  http.get(
    "/api" + apiSecret + "/checkouts/pagination/pl/created_at/desc",
    () => {
      counter += 1;
      return HttpResponse.json(responseGetCheckoutsPl);
    },
  ),

  http.get(
    "/api" + apiSecret + "/checkouts/pagination/en/price_total_add_deliver/asc",
    () => {
      counter += 1;
      return HttpResponse.json(responseGetCheckouts);
    },
  ),

  http.get(
    "/api" +
      apiSecret +
      "/checkouts/pagination/en/price_total_add_deliver/desc",
    () => {
      counter += 1;
      return HttpResponse.json(responseGetCheckouts);
    },
  ),

  http.patch("/api" + apiSecret + "/checkouts/4", () => {
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
  render(CheckoutsPage);
};

const waitForAjax = async () => {
  const spinner = screen.queryByRole("pre_loader_search_checkout");
  expect(spinner).not.toBeNull();
  await waitForElementToBeRemoved(spinner);
};

describe("Checkouts page", () => {
  describe("Layout", () => {
    it("has checkouts header", async () => {
      await setup();
      const header = screen.queryByRole("heading", { name: "Checkouts" });
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
      const name1 = responseGetCheckoutsPl.data.data[0].price_total_add_deliver;
      await screen.findByText(name1);
      //const sku1 = responseGetCheckoutsPl.data.data[0].sku;
      //await screen.findByText(sku1);

      const name2 = responseGetCheckoutsPl.data.data[1].price_total_add_deliver;
      await screen.findByText(name2);
      //const sku2 = responseGetCheckoutsPl.data.data[1].sku;
      //await screen.findByText(sku2);
    });

    it("change lang from Polish to England", async () => {
      localStorage.clear();
      storage.setItem("auth", jsonStore2.auth);
      storage.setItem("config", jsonStore2.config);
      await setup();
      await waitForAjax();

      const name1 = responseGetCheckoutsPl.data.data[0].price_total_add_deliver;
      await screen.findByText(name1);

      const checkoutPl = screen.queryAllByRole("price_total_add_deliver_pl");
      expect(checkoutPl.length).toBe(2);

      const checkoutEn = screen.queryAllByRole("price_total_add_deliver_en");
      expect(checkoutEn.length).toBe(0);

      const langEn = screen.queryByRole("lang_en");
      await userEvent.click(langEn);

      await waitFor(() => {
        const name2 = responseGetCheckouts.data.data[0].price_total_add_deliver;
        screen.findByText(name2);
        //screen.findByText('aaaaaaaaaaaaaaaaaaaaaaaa');

        const checkoutEn = screen.queryAllByRole("price_total_add_deliver_en");
        expect(checkoutEn.length).toBe(2);

        const checkoutPl = screen.queryAllByRole("price_total_add_deliver_pl");
        expect(checkoutPl.length).toBe(0);
      });
    });
  });

  describe("Interactions", () => {
    it("show data in table", async () => {
      await setup();
      await waitForAjax();
      const name1 = responseGetCheckouts.data.data[0].price_total_add_deliver;
      await screen.findByText(name1);
      //const sku1 = responseGetCheckouts.data.data[0].sku;
      //await screen.findByText(sku1);

      const name2 = responseGetCheckouts.data.data[1].price_total_add_deliver;
      await screen.findByText(name2);
      //const sku2 = responseGetCheckouts.data.data[1].sku;
      //await screen.findByText(sku2);
    });

    it("sorting asc by price_total_add_deliver", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1);
      const button = screen.queryByRole("sorting_price_total_add_deliver_asc");
      await userEvent.click(button);
      expect(counter).toBe(2);

      const name1 = responseGetCheckouts.data.data[0].price_total_add_deliver;
      await screen.findByText(name1);
    });

    it("sorting desc by price_total_add_deliver", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1);
      const button = screen.queryByRole("sorting_price_total_add_deliver_desc");
      await userEvent.click(button);
      expect(counter).toBe(2);

      const name1 = responseGetCheckouts.data.data[0].price_total_add_deliver;
      await screen.findByText(name1);
    });

    it("search checkout", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const search = await screen.queryByRole("button_search_checkout");
      userEvent.click(search);
      await waitFor(() => {
        expect(counter).toBe(2);
      });
    });

    it("change checkout to is pay", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const editCheckouts = await screen.queryAllByRole("edit_checkout");
      userEvent.click(editCheckouts[0]);

      await waitFor(() => {
        expect(counter).toBe(3); //update and refresh
        const alertSuccessAfter = screen.queryByRole("alert_success");
        expect(alertSuccessAfter).toBeInTheDocument();

        const s1 = trans.ttt("success_edit_checkout");
        expect(screen.queryByText(s1)).toBeInTheDocument();

        //api must be changed in order to execute this tests:
        //const ExpectedText = "Paid";
        //expect(screen.queryByText(ExpectedText)).toBeInTheDocument();
      });
    });

    /** skip */
    it.skip("change pagination page", async () => {
      await setup();
      await waitForAjax();

      const aHref = screen.queryAllByRole("pagination_links");

      expect(counter).toBe(1); //mount
      await userEvent.click(aHref[1]);
      expect(counter).toBe(2); //mount+click
    });

    it.skip("delete checkout", async () => {
      //todo in future
      confirmSpy.mockReturnValueOnce(true);
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const checkoutDel = await screen.queryAllByRole("del_checkout");
      userEvent.click(checkoutDel[0]);

      await waitFor(() => {
        expect(counter).toBe(3);
        const alertSuccessAfter = screen.queryByRole("alert_success");
        expect(alertSuccessAfter).toBeInTheDocument();
      });
    });

    it.skip("edit checkout", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const checkoutDel = await screen.queryAllByRole("edit_checkout");
      userEvent.click(checkoutDel[0]);
      //todo
    });

    it.skip("add checkout", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const checkoutAdd = await screen.queryByRole("button_add_checkout");
      userEvent.click(checkoutAdd);
      //todo
    });
  });
});
