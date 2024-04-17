import {
  render,
  router,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  fireEvent,
} from "../test/helper.js";
import "../test/afterlogin.js";
import functions from "./helpers/functions.js";
import App from "./App.vue";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll } from "vitest";

let counter = 0;
let server = setupServer(

  http.get("/api/logout", async () => {
    counter += 1;
    const jsonRes = {
      success: true,
      message: 'You have successfully logged out.',
    };

    return HttpResponse.json(jsonRes);
  }),

);

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

const setup = async () => {
  render(App);
};

describe("sign out", () => {
  it("sign out exist", async () => {
    await setup();
    const linkSignOut = await screen.findByRole("link_sign_out");
    expect(linkSignOut).toBeInTheDocument();
  });    

  it("click sign out link", async () => {
    await setup();
    const { token } = functions.retrieveParamsFromStorage();
    expect(token).not.toBe(0);

    const linkSignOut = await screen.findByRole("link_sign_out");
    expect(counter).toBe(0);
    await userEvent.click(linkSignOut);
    await waitFor(() => {
      expect(counter).toBe(1);
      const { token } = functions.retrieveParamsFromStorage();
      expect(token).toBe(0);
      expect(screen.queryByTestId('login-page')).toBeInTheDocument()
    })
  });    


})  

