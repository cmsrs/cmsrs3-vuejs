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

const menus  = [
  {
    id: 1,
    position: 1,
    name: {
      en: 'test menu1'
    }
  },
  {
    id: 2,
    position: 2,
    name: {
      en: 'test menu2'
    }
  }  
];

let requestBody;
let counter = 0;
let counterMenu = 0;
let server = setupServer(
  //?token=abcde12345
  rest.post("/api/pages", (req, res, ctx) => {
    requestBody = req.body;
    counter += 1;
    return res(ctx.status(200));
  }),
  rest.post("/api/menus", (req, res, ctx) => {
    requestBody = req.body;
    counterMenu += 1;
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
  }),
    
  rest.get("/api/menus", (req, res, ctx) => {
    requestBody = req.body;
    //counter2 += 1;
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: menus
      })
    );
  
    //return res(ctx.status(200));
  }),
  

);

/*
const getPages = rest.get("/api/pages", (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      success: true,
      data: pages
    })
  );
});

//don't use
const getMenus = rest.get("/api/menus", (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      success: true,
      data: menus
    })
  );
});
*/

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  counter = 0;
  counterMenu = 0;  
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

const waitForAjaxes = async () => {
  const spinner = screen.queryByRole("pre_loader_save_edit_page");
  expect(spinner).not.toBeNull();
  await waitForElementToBeRemoved(spinner);
};

describe("Pages page", () => {
  describe("Layout", () => {
    it( 'has pages header', async ()  => {
        await setup();
        await waitForAjaxes();        
        const header = screen.queryByRole("heading", { name: "CMS - menus and pages" });
        expect(header).toBeInTheDocument();  //bez zalogowania widzimy header - nie wiem czy to jest dobry test.
    });

  });

  describe("Interactions", () => {

    it( 'has user login in order to see pages and get access to config', async ()  => {
      await setup();
      await waitForAjaxes();      
      expect(store.state.auth.isLoggedIn).toBeTruthy();
      expect(store.state.config.langs[0]).toEqual('en');
      expect(store.state.config.defaultLang).toEqual(store.state.config.langs[0]);
    });

    it( 'create main_page', async ()  => {
      await setup();
      await waitForAjaxes();      
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
      await waitForAjaxes();      
      await screen.findByText(
        "Inner boxes"
      );
    
      await screen.findByText(
        pages[1]['short_title']['en']+' (2)'
      );
    });

    it( 'not show langs because one lang exist', async ()  => {
      await setup();
      await waitForAjaxes();      

      const changeLang = screen.queryByRole("change_lang");
      expect(changeLang).toBeNull();
    });

    it( 'add new menu', async ()  => {
      await setup();
      await waitForAjaxes();      

      const button = screen.queryByRole("button_add_menu" );
      await userEvent.click(button);

      const addMenuPlaceholder = screen.queryByPlaceholderText("Menu name en");
      expect(addMenuPlaceholder).not.toBe(null);      
    });

    it( 'del new menu', async ()  => {
      await setup();
      await waitForAjaxes();      

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

    const setup_display_message_err = async () => {
      const button = screen.queryByRole("button_add_menu" );
      await userEvent.click(button);

      //const addMenuPlaceholder = screen.queryByPlaceholderText("Menu name en");
      //await userEvent.type(addMenuPlaceholder, 'New menu name');
      const alertDangerBefor = screen.queryByRole("alert_danger");
      expect( alertDangerBefor ).not.toBeInTheDocument();

      const icon = screen.queryByRole("save_menu_0");
      await userEvent.click(icon);

      const alertDangerAfter = screen.queryByRole("alert_danger");
      expect( alertDangerAfter ).toBeInTheDocument();
    };


    it( 'save new menu - display error and clear msg after change menu name', async ()  => {
      await setup();
      await waitForAjaxes();

      await setup_display_message_err();

      const addMenuPlaceholder = screen.queryByPlaceholderText("Menu name en");
      await userEvent.type(addMenuPlaceholder, 'N');

      const alertDangerAfter2 = screen.queryByRole("alert_danger");
      expect( alertDangerAfter2 ).not.toBeInTheDocument();
    });

    it( 'save new menu - display error and clear msg after delete menu', async ()  => {
      await setup();
      await waitForAjaxes();

      await setup_display_message_err();

      const icon = screen.queryByRole("del_menu_0");
      await userEvent.click(icon);

      const alertDangerAfter2 = screen.queryByRole("alert_danger");
      expect( alertDangerAfter2 ).not.toBeInTheDocument();
    });

    it( 'save new menu - display error and clear msg after save menu again', async ()  => {
      await setup();
      await waitForAjaxes();

      await setup_display_message_err();

      const icon = screen.queryByRole("save_menu_0");
      await userEvent.click(icon);

      const alertDangerAfter2 = screen.queryByRole("alert_danger");
      expect( alertDangerAfter2 ).toBeInTheDocument();
    });


    it( 'save new menu - display good message and click add menu button', async ()  => {
      await setup();
      await waitForAjaxes();
      //const spinner = screen.queryByRole("pre_loader_save_edit_page");
      //expect(spinner).not.toBeNull();
      //await waitForElementToBeRemoved(spinner);
    

      const button = screen.queryByRole("button_add_menu" );
      await userEvent.click(button);

      const addMenuPlaceholder = screen.queryByPlaceholderText("Menu name en");
      await userEvent.type(addMenuPlaceholder, 'New menu name');

      const alertSuccessBefor = screen.queryByRole("alert_success");
      expect( alertSuccessBefor ).not.toBeInTheDocument();

      expect(counterMenu).toBe(0);      
      const spinnerBeforClick = screen.queryByRole("pre_loader_add_menu");
      expect(spinnerBeforClick).toBeNull();

      const icon = screen.queryByRole("save_menu_0");
      await userEvent.click(icon);

      const spinnerAfterClick = screen.queryByRole("pre_loader_add_menu");
      expect(spinnerAfterClick).not.toBeNull();

      await waitForElementToBeRemoved(spinnerAfterClick);

      expect(counterMenu).toBe(1);      
      const alertSuccessAfter = screen.queryByRole("alert_success");
      expect( alertSuccessAfter ).toBeInTheDocument();

      //and again we click add menu and alert_success should be dissapeared
      const button2 = screen.queryByRole("button_add_menu" );
      await userEvent.click(button2);
      const alertSuccessAfter2 = screen.queryByRole("alert_success");
      expect( alertSuccessAfter2 ).not.toBeInTheDocument();

    });


    it( 'show saved two menus', async ()  => {
      await setup();
      await waitForAjaxes();

      await waitFor(() => {
        const menus = screen.queryAllByRole("menu");
        expect(menus.length).toBe(2);
        menus.forEach((menu, index) => {
          expect(menu).toBeInTheDocument();
        });
      });    
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
      await waitForAjaxes();
            
      const changeLang = screen.queryByRole("change_lang");
      expect(changeLang).toBeInTheDocument();      
    });
    
  });  
  
});