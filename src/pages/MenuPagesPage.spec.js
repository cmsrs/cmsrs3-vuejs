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

let requestBody;
let counter = 0;
const server = setupServer(
  rest.post("/api/pages", (req, res, ctx) => {
    requestBody = req.body;
    counter += 1;
    return res(ctx.status(200));
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});


const jsonStore = {
  auth: {
    isLoggedIn: true,
    token:  "abcde12345",
    email: "user_rs@mail.com",
    password: "PasswordRs"
  },
  config: {
    page_types: ['cms', 'gallery', 'main_page'],
    langs: ['en'], //!!
    defaultLang: 'en', //!!
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
      expect(store.state.config.defaultLang).toEqual(store.state.config.langs[0]);
    });

    it( 'create main_page', async ()  => {
      await setup();
      //const title =  screen.findByTestId("title_en");
      //console.log(title); //null ?

      const title = screen.queryByPlaceholderText("title en");
      //console.log(title); //HTMLInputElement { [Symbol(_assign)]: [Function (anonymous)] }
      await userEvent.type(title, 'main page title');

      const shortTitle = screen.queryByPlaceholderText("short title en");
      await userEvent.type(shortTitle, 'main page short title');

      const description = screen.queryByPlaceholderText("description en");
      await userEvent.type(description, 'main page description to google');

      const pageTypeDropdown = screen.queryByLabelText("Page type:");
      await userEvent.selectOptions(pageTypeDropdown, "main_page");

      const content = screen.queryByPlaceholderText("content en");
      await userEvent.type(content, 'main page content');

      const spinnerBeforClick = screen.queryByRole("pre_loader_save_edit_page");
      expect(spinnerBeforClick).toBeNull();

      const button = screen.queryByRole("button_save_edit_page" );
      await userEvent.click(button);

      const spinnerAfterClick = screen.queryByRole("pre_loader_save_edit_page");
      expect(spinnerAfterClick).not.toBeNull();

      await waitForElementToBeRemoved(spinnerAfterClick);
      
    });

  });
  
});