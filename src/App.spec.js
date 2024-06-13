import {
  render,
  router,
  screen,
  waitFor,
  //waitForElementToBeRemoved,
  //fireEvent,
} from "../test/helper.js";
import "../test/afterlogin.js";
import functions from "./helpers/functions.js";
import storage from "./state/storage.js";
import App from "./App.vue";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll } from "vitest";

const successMsgToggle = "Cache enabled";
let responseToggle = {
  success: 1,
  data: {
    value: 1,
    message: successMsgToggle,
  },
};

let counterToggle = 0;
let counter = 0;
let server = setupServer(
  http.post("/api/config/toggle-cache-enable-file", () => {
    counterToggle += 1;
    return HttpResponse.json(responseToggle);
  }),

  http.get("/api/logout", async () => {
    counter += 1;
    const jsonRes = {
      success: true,
      message: "You have successfully logged out.",
    };

    return HttpResponse.json(jsonRes);
  }),

  http.get("/api/pages", async () => {
    const jsonRes = {
      success: true,
      data: [],
    };

    return HttpResponse.json(jsonRes);
  }),

  http.get("/api/menus", async () => {
    const jsonRes = {
      success: true,
      data: [],
    };

    return HttpResponse.json(jsonRes);
  }),
);

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  counter = 0;
  counterToggle = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

const jsonStore2 = {
  auth: {
    token: "abcde12345",
  },
  //this data came from api/config and save to local storage
  config: {
    page_types: ["cms", "gallery", "main_page"],
    langs: ["en"],
    default_lang: "en",
    cache_enable: 1, //!!
    is_cache_enable: 0, //!!
  },
};

const setupStorage = async () => {
  localStorage.clear();
  storage.setItem("auth", jsonStore2.auth);
  storage.setItem("config", jsonStore2.config);
};

const setup = async (path) => {
  router.push(path);
  await router.isReady();
  render(App);
};

describe("sign out", () => {
  it("sign out exist", async () => {
    await setup("/");
    const linkSignOut = await screen.findByRole("link_sign_out");
    expect(linkSignOut).toBeInTheDocument();
  });

  it("click sign out link", async () => {
    await setup("/pages");
    const { token } = functions.retrieveParamsFromStorage();
    expect(token).not.toBe(0);
    const linkSignOut = await screen.findByRole("link_sign_out");
    expect(counter).toBe(0);
    expect(router.currentRoute.value.path).toBe("/pages");
    await userEvent.click(linkSignOut);
    await waitFor(() => {
      expect(counter).toBe(1);
      const { token } = functions.retrieveParamsFromStorage();
      expect(token).toBe(0);
      expect(screen.queryByTestId("login-page")).toBeInTheDocument();
      expect(router.currentRoute.value.path).toBe("/");
    });
  });
});

describe("change cache in nav bar", () => {
  it("in nav bar cache enable by click input toggle cache", async () => {
    setupStorage();
    await setup("/pages");

    const isCacheEnable0 = storage.getItem("config").is_cache_enable;
    expect(isCacheEnable0).toBe(0);
    expect(counterToggle).toBe(0);

    const changeCacheEnable = await screen.queryByRole(
      "toggle_cache_enable_in_nav_bar",
    );
    await userEvent.click(changeCacheEnable);
    expect(counterToggle).toBe(1);

    const alertSuccessAfter = screen.queryByRole("alert_success");
    expect(alertSuccessAfter).not.toBeInTheDocument();

    await screen.findByText("cache enable"); //appear in nav bar

    const isCacheEnable1 = storage.getItem("config").is_cache_enable;
    expect(isCacheEnable1).toBe(1);
  });
});

describe("prevent redirect when user is auth", () => {
  it("prevent redirect lo login page when user is auth", async () => {
    await setup("/");
    const { token } = functions.retrieveParamsFromStorage();
    expect(token).not.toBe(0);

    await waitFor(() => {
      expect(screen.queryByTestId("pages-page")).toBeInTheDocument();
      expect(router.currentRoute.value.path).toBe("/pages");
    });
  });
});
