import {
  render, 
  screen, 
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/vue";
import MenuPagesPage from "./MenuPagesPage.vue";

import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
//import store from "../state/store";
import { createStore } from "vuex";

const jsonStore = {
  auth: {
    isLoggedIn: true,
    token:  "abcde12345",
    email: "user_rs@mail.com",
    password: "PasswordRs"
  },
  config: {
    page_types: ['cms', 'gallery'],
    langs: ['en'],
    cache_enable: 1
  }
};

const store = createStore({
  state: jsonStore,
});


const setup = async () => {
  render(MenuPagesPage, {
    global: {
      plugins: [store],
      mocks: {
        $router: {
          push: () => {},
        },
      },
    },
  });
};

    
describe("Pages page", () => {
  describe("Layout", () => {
    it( 'has pages header', async ()  => {
        await setup();
        const header = screen.queryByRole("heading", { name: "CMS - menus and pages" });
        expect(header).toBeInTheDocument();  //bez zalogowania widzimy header - nie wiem czy to jest dobry test.
    });

  });

  describe("Interactions", () => {

    it( 'has user login in order to see pages and get access to config', async ()  => {
      await setup();
      expect(store.state.auth.isLoggedIn).toBeTruthy();
      expect(store.state.config.langs[0]).toEqual('en');
    });

  });
  
});