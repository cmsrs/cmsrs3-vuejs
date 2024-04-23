import {
  render,
  router,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  fireEvent,
} from "../../test/helper.js";
import "../../test/afterlogin.js";

import MenuPagesPage from "./MenuPagesPage.vue";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import userEvent from "@testing-library/user-event";
import trans from "../helpers/trans.js";
import storage from "../state/storage.js";
import { afterAll, beforeAll } from "vitest";
//import { afterAll, beforeAll, describe, expect } from "vitest";


const contentPl = "lorem ipsum pl";
const contentEn = "lorem ipsum en";
const pages = [
  {
    id: 1,
    published: 1,
    commented: 0,
    after_login: 0,
    position: 1,
    type: "main_page",
    menu_id: null,
    page_id: null,
    title: {
      pl: "test p2 pl",
      en: "test p2 en",            
    },
    short_title: {
      pl: "p22 pl",            
      en: "p22 en",
    },
    description: {
      pl: "test1234 pl",                        
      en: "test1234 en",
    },
    content: {
      pl: contentPl,
      en: contentEn,
    },
  }
];

let counter = 0;
let counter2 = 0;
let counterMenu = 0;
let server = setupServer(

  http.get("/api/pages", async () => {
    const jsonRes = {
      success: true,
      data: pages,
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
  counter2 = 0;
  counterMenu = 0;
  server.resetHandlers();
});

afterAll(() => {
  server.close()

});



const waitForAjaxes = async () => {
  const spinner = screen.queryByRole("pre_loader_save_edit_page");
  expect(spinner).not.toBeNull();
  await waitForElementToBeRemoved(spinner);
};

describe("Pages page", () => {

  describe("Interactions many langs", () => {
    const jsonStore2 = {
      auth: {
        isLoggedIn: true,
        token: "abcde12345",
        email: "user_rs@mail.com",
        password: "PasswordRs",
      },
      config: {
        page_types: ["cms", "gallery", "main_page"],
        langs: ["pl", "en"], //!!
        default_lang: "pl", //!!
        cache_enable: 1,
      },
    };

    const setup2 = async () => {
      localStorage.clear();
      storage.setItem("auth", jsonStore2.auth);
      storage.setItem("config", jsonStore2.config);

      render(MenuPagesPage);
    };


    it("click change lang", async () => {

      await setup2();
      await waitForAjaxes();

      //console.log('---------------');

      //await waitFor(() => {
        const pageEdit = screen.queryAllByRole("edit_page");
        const firstEditPage = pageEdit[0];
        await userEvent.click(firstEditPage);
  
        screen.findByText("test p2 pl");            
        const langEn = screen.queryByRole("lang_en");
        await userEvent.click(langEn);

        await waitFor(() => {
          screen.findByText("test p2 en");    
        });    

      //});
    });
    

  });

});
