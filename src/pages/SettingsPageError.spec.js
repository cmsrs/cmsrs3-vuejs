import { render,waitFor, screen } from "../../test/helper.js";
import "../../test/afterlogin.js";

import SettingsPage from "./SettingsPage.vue";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import userEvent from "@testing-library/user-event";
import trans from "../helpers/trans.js";
import storage from "../state/storage.js";
import { afterAll, beforeAll } from "vitest";

let counterToggle = 0;
let counterCacheClear = 0;
let counterCreateSitemap = 0;
const successMsgToggle = "Cache enabled";

let responseToggle = {
  success: 1,
  data: {
    value: 1,
    message: successMsgToggle,
  },
};

let server = setupServer(
  http.post("/api/config/toggle-cache-enable-file", () => {
    counterToggle += 1;
    return new HttpResponse(null, {
      status: 500
    })
  }),

  http.put("/api/config/clearcache", () => {
    counterCacheClear += 1;
    return new HttpResponse(null, {
      status: 500
    })
  }),

  http.put("/api/config/createsitemap", () => {
    counterCreateSitemap += 1;
    return new HttpResponse(null, {
      status: 500
    })
  }),
);

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  counterToggle = 0;
  counterCacheClear = 0;
  counterCreateSitemap = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

const setupSettings = async () => {
  return render(SettingsPage);
};

/*
describe("Layout", () => {
  it("settings header", async () => {
    await setupSettings();
    const header = screen.queryByRole("heading", { name: "Settings" });
    expect(header).toBeInTheDocument();
  });

  it("display all checkbox for is_cache_enable is true see afterlogin.js file", async () => {
    await setupSettings();

    //it is always exists
    const s3 = trans.ttt("create_sitemap");
    await screen.findByText(s3);

    //depends on is_cache_enable == true
    const s1 = trans.ttt("toggle_cache_enable");
    await screen.findByText(s1);

    //depends on is_cache_enable == true
    const s2 = trans.ttt("clear_cache");
    await screen.findByText(s2);

    const r3 = screen.queryByRole("create_sitemap");
    expect(r3).toBeInTheDocument();
    const r1 = screen.queryByRole("toggle_cache_enable");
    expect(r1).toBeInTheDocument();
    const r2 = screen.queryByRole("clear_cache");
    expect(r2).toBeInTheDocument();
  });
});

describe("Layout for is_cache_enable is true", () => {
  const jsonStore2 = {
    auth: {
      token: "abcde12345",
    },
    //this data came from api/config and save to local storage
    config: {
      page_types: ["cms", "gallery", "main_page"],
      langs: ["en"],
      default_lang: "en",
      cache_enable: 0,
      is_cache_enable: 0, //!!
    },
  };

  const setupSettings2 = async () => {
    localStorage.clear();
    storage.setItem("auth", jsonStore2.auth);
    storage.setItem("config", jsonStore2.config);

    return render(SettingsPage);
  };

  it("input with cache not available ", async () => {
    await setupSettings2();

    const r3 = screen.queryByRole("create_sitemap");
    expect(r3).toBeInTheDocument();

    const r1 = screen.queryByRole("toggle_cache_enable");
    expect(r1).not.toBeInTheDocument();
    const r2 = screen.queryByRole("clear_cache");
    expect(r2).not.toBeInTheDocument();
  });
});
*/

describe("Interaction server Error", () => {
  it("cache enable by click input toggle cache", async () => {
    await setupSettings();

    const isCacheEnable0 = storage.getItem("config").is_cache_enable;
    expect(isCacheEnable0).toBe(0);

    expect(counterToggle).toBe(0);

    const changeCacheEnable = screen.queryByRole("toggle_cache_enable");
    await userEvent.click(changeCacheEnable);

    await waitFor(() => {

      const alertDangerAfter = screen.queryByRole("alert_danger");
      expect(alertDangerAfter).toBeInTheDocument();

      const msg = trans.ttt("internal_problem");
      expect(screen.queryByText(msg)).toBeInTheDocument();
    });

    // expect(counterToggle).toBe(1);

    // const alertSuccessAfter = screen.queryByRole("alert_success");
    // expect(alertSuccessAfter).toBeInTheDocument();

    // await screen.findByText(successMsgToggle);

    // const isCacheEnable1 = storage.getItem("config").is_cache_enable;
    // expect(isCacheEnable1).toBe(1);

    // const changeCacheEnableToFalse = screen.queryByRole("toggle_cache_enable");
    // await userEvent.click(changeCacheEnableToFalse);
    // expect(counterToggle).toBe(2);

    // const alertSuccessAfter2 = screen.queryByRole("alert_success");
    // expect(alertSuccessAfter2).toBeInTheDocument();

    // const isCacheEnable2 = storage.getItem("config").is_cache_enable;
    // //expect(isCacheEnable2).toBe(0); //it should be 0 - but we need change server response depend on post request
  });

  it("cache clear", async () => {
    await setupSettings();

    expect(counterCacheClear).toBe(0);

    const clearCache = screen.queryByRole("clear_cache");
    await userEvent.click(clearCache);

    await waitFor(() => {

      const alertDangerAfter = screen.queryByRole("alert_danger");
      expect(alertDangerAfter).toBeInTheDocument();

      const msg = trans.ttt("internal_problem");
      expect(screen.queryByText(msg)).toBeInTheDocument();
    });



    // expect(counterCacheClear).toBe(1);

    // const alertSuccessAfter = screen.queryByRole("alert_success");
    // expect(alertSuccessAfter).toBeInTheDocument();

    // await screen.findByText(trans.ttt("cache_was_cleared"));
  });

  it("create sitemap", async () => {
    await setupSettings();

    expect(counterCreateSitemap).toBe(0);

    const createSitemap = screen.queryByRole("create_sitemap");
    await userEvent.click(createSitemap);

    await waitFor(() => {

      const alertDangerAfter = screen.queryByRole("alert_danger");
      expect(alertDangerAfter).toBeInTheDocument();

      const msg = trans.ttt("internal_problem");
      expect(screen.queryByText(msg)).toBeInTheDocument();
    });

    // expect(counterCreateSitemap).toBe(1);

    // const alertSuccessAfter = screen.queryByRole("alert_success");
    // expect(alertSuccessAfter).toBeInTheDocument();

    // await screen.findByText(trans.ttt("sitemap_was_created"));
  });
});
