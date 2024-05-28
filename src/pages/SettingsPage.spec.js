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

const setupSettings = async () => {
  return render(SettingsPage);
};

describe("Layout", () => {
  it("settings header", async () => {
    await setupSettings();
    const header = screen.queryByRole("heading", { name: "Settings" });
    expect(header).toBeInTheDocument();
  });

});
