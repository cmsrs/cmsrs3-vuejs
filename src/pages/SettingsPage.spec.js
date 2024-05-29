import {
  render,
  router,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "../../test/helper.js";
import "../../test/afterlogin.js";

import SettingsPage from "./SettingsPage.vue";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import userEvent from "@testing-library/user-event";
import trans from "../helpers/trans.js";
import storage from "../state/storage.js";
import { afterAll, beforeAll } from "vitest";

let counterToggle = 0;
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
    return HttpResponse.json(responseToggle);
  }),
);

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  counterToggle = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

const setupSettings = async () => {
  return render(SettingsPage);
};

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

describe("Interaction", () => {
  it("cache enable by click input toggle cache", async () => {
    await setupSettings();

    expect(counterToggle).toBe(0);

    const changeCacheEnable = screen.queryByRole("toggle_cache_enable");
    await userEvent.click(changeCacheEnable);
    expect(counterToggle).toBe(1);

    const alertSuccessAfter = screen.queryByRole("alert_success");
    expect(alertSuccessAfter).toBeInTheDocument();

    await screen.findByText(successMsgToggle);
  });
});
