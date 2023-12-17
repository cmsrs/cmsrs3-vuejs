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


const pages  = [
  {
    id: 1,
    published: 0,
    commented: 0,
    after_login: 0,
    position: 1,
    type: 'main_page',
    menu_id: null, 
    page_id: null, 
    title:{
        en: 'test p2'
    },
    short_title: {
        en:  'p22'
    },
    description:{
        en: 'test1234'
    },
    content: {
        en: 'lorem ipsum'
    }   
  },
  {
    id: 2,
    published: 0,
    commented: 0,
    after_login: 0,
    position: 1,
    type: 'inner',
    menu_id: null, 
    page_id: null, 
    title:{
        en: 'inner test p2'
    },
    short_title: {
        en:  'inner p22'
    },
    description:{
        en: 'inner test1234'
    },
    content: {
        en: 'inner lorem ipsum'
    }   
  }
];  

let requestBody;
let counter = 0;
const server = setupServer(
  //?token=abcde12345
  rest.post("/api/pages", (req, res, ctx) => {
    requestBody = req.body;
    counter += 1;
    return res(ctx.status(200));
  }),
  rest.get("/api/pages", (req, res, ctx) => {
    requestBody = req.body;
    //counter2 += 1;
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: pages
      })
    );
  
    //return res(ctx.status(200));
  })

);


const getPages = rest.get("/api/pages", (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      success: true,
      data: pages
    })
  );
});

beforeAll(() => {
  server.listen();
});

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
      //server.use(getPages);
      //const title =  screen.findByTestId("title_en");
      //console.log(title); //null ?

      //console.log(pages[0]['title']['en']);
      await screen.findByText(
        "Pages not related to menu"
      );

      //console.log(shortTitle);
      await screen.findByText(
        pages[0]['short_title']['en']
      );

      const title = screen.queryByPlaceholderText("title en");
      //console.log(title); //HTMLInputElement { [Symbol(_assign)]: [Function (anonymous)] }
      await userEvent.type(title, pages[0]['title']['en']);

      //const shortTitle2 = 'short Title 2';
      const shortTitle = screen.queryByPlaceholderText("short title en");
      await userEvent.type(shortTitle, pages[0]['short_title']['en']);
      //await userEvent.type(shortTitle, shortTitle2);

      const description = screen.queryByPlaceholderText("description en");
      await userEvent.type(description, pages[0]['description']['en']);

      const pageTypeDropdown = screen.queryByLabelText("Page type:");
      await userEvent.selectOptions(pageTypeDropdown, "main_page");
      expect(pages[0]['type']).toBe("main_page");

      const content = screen.queryByPlaceholderText("content en");
      await userEvent.type(content, pages[0]['content']['en']);

      const spinnerBeforClick = screen.queryByRole("pre_loader_save_edit_page");
      expect(spinnerBeforClick).toBeNull();

      const button = screen.queryByRole("button_save_edit_page" );
      await userEvent.click(button);

      const spinnerAfterClick = screen.queryByRole("pre_loader_save_edit_page");
      expect(spinnerAfterClick).not.toBeNull();

      await waitForElementToBeRemoved(spinnerAfterClick);
      expect(counter).toBe(1);      
      //console.log(requestBody); //why requestBody is empty ? todo

      await screen.findByText(
        "Pages not related to menu"
      );

      await screen.findByText(
        pages[0]['short_title']['en']
      );
      
    });

    it( 'show Inner boxes', async ()  => {
      await setup();
      await screen.findByText(
        "Inner boxes"
      );
    
      await screen.findByText(
        pages[1]['short_title']['en']+' (2)'
      );
    });

    it( 'not show langs because one lang exist', async ()  => {
      await setup();

      const changeLang = screen.queryByRole("change_lang");
      expect(changeLang).toBeNull();
    });

    it( 'add new menu', async ()  => {
      await setup();

      const button = screen.queryByRole("button_add_menu" );
      await userEvent.click(button);

      const addMenuPlaceholder = screen.queryByPlaceholderText("Menu name en");
      expect(addMenuPlaceholder).not.toBe(null);      
    });

    it( 'del new menu', async ()  => {
      await setup();

      const button = screen.queryByRole("button_add_menu" );
      await userEvent.click(button);

      const newMenu = screen.queryByRole("new_menu");
      expect(newMenu).not.toBe(null);      

      const addMenuPlaceholder = screen.queryByPlaceholderText("Menu name en");
      await userEvent.type(addMenuPlaceholder, 'New menu name');
      //expect(addMenuPlaceholder).not.toBe(null);      

      const icon = screen.queryByRole("del_menu_0");
      await userEvent.click(icon);

      const newMenuAfterClick = screen.queryByRole("new_menu");
      expect(newMenuAfterClick).toBe(null);      

    });

    it( 'save new menu', async ()  => {
      await setup();

      const button = screen.queryByRole("button_add_menu" );
      await userEvent.click(button);

      const addMenuPlaceholder = screen.queryByPlaceholderText("Menu name en");
      await userEvent.type(addMenuPlaceholder, 'New menu name');
      //expect(addMenuPlaceholder).not.toBe(null);      

      const icon = screen.queryByRole("save_menu_0");
      await userEvent.click(icon);

      //TODO!!!
    });

  });

  describe("Interactions many langs", () => {
    const jsonStore2 = {
      auth: {
        isLoggedIn: true,
        token:  "abcde12345",
        email: "user_rs@mail.com",
        password: "PasswordRs"
      },
      config: {
        page_types: ['cms', 'gallery', 'main_page'],
        langs: ['pl', 'en'], //!!
        defaultLang: 'pl', //!!
        cache_enable: 1
      }
    };
    
    const store2 = createStore({
      state: jsonStore2,
    });
    
    const setup2 = async () => {
      render(MenuPagesPage, {
        global: {
          plugins: [store2],
          mocks: {
            $router: {
              push: () => {},
            },
          },
        },
      });
    };

    it( 'show langs', async ()  => {
      await setup2();
      const changeLang = screen.queryByRole("change_lang");
      expect(changeLang).toBeInTheDocument();      
    });
    
  });  
  
});