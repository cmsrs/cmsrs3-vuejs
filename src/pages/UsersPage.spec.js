import {
  render,
  router,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "../../test/helper.js";
import "../../test/afterlogin.js";

import UsersPage from "./UsersPage.vue";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll } from "vitest";
import { API_SECRET } from "../config.js";
const apiSecret = API_SECRET ? "/" + API_SECRET : "";

const confirmSpy = vi.spyOn(window, "confirm");

const responseGetClients = {
  success: 1,
  data: {
    current_page: 1,
    data: [
      {
        id: 1,
        name: "Fake Kowalski",
        email: "sth@abc-example.com",
        email_verified_at: null,
        role: "client",
        created_at: "2024-04-01T10:33:02.000000Z",
        updated_at: "2024-04-01T10:33:02.000000Z",
      },
      {
        id: 2,
        name: "First Abc Kowalski",
        email: "fake@example.com",
        email_verified_at: null,
        role: "client",
        created_at: "2024-04-01T10:33:02.000000Z",
        updated_at: "2024-04-01T10:33:02.000000Z",
      },
    ],
    first_page_url: "http://127.0.0.1:8000/api/clients/created_at/desc?page=1",
    from: 1,
    last_page: 1,
    last_page_url: "http://127.0.0.1:8000/api/clients/created_at/desc?page=1",
    links: [
      {
        url: "",
        label: "« Previous",
        active: false,
      },
      {
        url: "http://127.0.0.1:8000/api/clients/created_at/desc?page=1", //##
        label: 1,
        active: true,
      },
      {
        url: "",
        label: "Next »",
        active: false,
      },
    ],
    next_page_url: null,
    path: "http://127.0.0.1:8000/api/clients/created_at/desc",
    per_page: 10,
    prev_page_url: null,
    to: 2,
    total: 2,
  },
};

let server = setupServer(
  http.get("/api" + apiSecret + "/clients/created_at/desc", () => {
    counter += 1;
    return HttpResponse.json(responseGetClients);
  }),

  http.get("/api" + apiSecret + "/clients/name/asc", () => {
    counter += 1;
    return HttpResponse.json(responseGetClients);
  }),

  http.get("/api" + apiSecret + "/clients/name/desc", () => {
    counter += 1;
    return HttpResponse.json(responseGetClients);
  }),

  http.delete("/api" + apiSecret + "/clients/1", () => {
    counter += 1;
    return HttpResponse.json({
      success: true,
    });
  }),
);

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
  render(UsersPage);
};

const waitForAjax = async () => {
  const spinner = screen.queryByRole("pre_loader_add_client");
  expect(spinner).not.toBeNull();
  await waitForElementToBeRemoved(spinner);
};

describe("Users page", () => {
  describe("Layout", () => {
    it("has users header", async () => {
      await setup();
      const header = screen.queryByRole("heading", { name: "Users" });
      expect(header).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("show data in table", async () => {
      await setup();
      await waitForAjax();
      const name1 = responseGetClients.data.data[0].name;
      await screen.findByText(name1);
      const email1 = responseGetClients.data.data[0].email;
      await screen.findByText(email1);

      const name2 = responseGetClients.data.data[1].name;
      await screen.findByText(name2);
      const email2 = responseGetClients.data.data[1].email;
      await screen.findByText(email2);
    });

    it("sorting asc by name", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1);
      const button = screen.queryByRole("sorting_name_asc");
      await userEvent.click(button);
      expect(counter).toBe(2);

      const name1 = responseGetClients.data.data[0].name;
      await screen.findByText(name1);
    });

    it("sorting desc by name", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1);
      const button = screen.queryByRole("sorting_name_desc");
      await userEvent.click(button);
      expect(counter).toBe(2);

      const name1 = responseGetClients.data.data[0].name;
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

    it("delete client", async () => {
      confirmSpy.mockReturnValueOnce(true);
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const clientDel = await screen.queryAllByRole("del_client");
      userEvent.click(clientDel[0]);

      await waitFor(() => {
        expect(counter).toBe(3);
        const alertSuccessAfter = screen.queryByRole("alert_success");
        expect(alertSuccessAfter).toBeInTheDocument();
      });
    });

    it("edit client", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const clientDel = await screen.queryAllByRole("edit_client");
      userEvent.click(clientDel[0]);
      //todo
    });

    it("add client", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const clientAdd = await screen.queryByRole("button_add_client");
      userEvent.click(clientAdd);
      //todo
    });

    it("search client", async () => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1); //mount
      const search = await screen.queryByRole("button_search_client");
      userEvent.click(search);
      await waitFor(() => {
        expect(counter).toBe(2);
      });
    });
  });
});
