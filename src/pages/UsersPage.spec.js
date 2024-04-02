import {
  render, 
  screen,
  waitForElementToBeRemoved
} from "@testing-library/vue";
import UsersPage from "./UsersPage.vue";
import { createStore } from "vuex";
import { setupServer } from "msw/node";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";

const responseGetClients = {
  success: 1,
  data: {
    current_page: 1,
    data: [
      {
        id: 4,
        name: "Fake Kowalski",
        email: "sth@abc-example.com",
        email_verified_at: null,
        role: "client",
        created_at: "2024-04-01T10:33:02.000000Z",
        updated_at: "2024-04-01T10:33:02.000000Z"
      },
      {
        id: 3,
        name: "First Abc Kowalski",
        email: "fake@example.com",
        email_verified_at: null,
        role: "client",
        created_at: "2024-04-01T10:33:02.000000Z",
        updated_at: "2024-04-01T10:33:02.000000Z"
      }
    ],
    first_page_url: "http://127.0.0.1:8000/api/clients/created_at/desc?page=1",
    from: 1,
    last_page: 1,
    last_page_url: "http://127.0.0.1:8000/api/clients/created_at/desc?page=1",
    links: [
      {
        url: "",
        label: "« Previous",
        active: false
      },
      {
        url: "http://127.0.0.1:8000/api/clients/created_at/desc?page=1", //##
        label: 1,
        active: true
      },
      {
        url: "",
        label: "Next »",
        active: false
      }
    ],
    next_page_url: null,
    path: "http://127.0.0.1:8000/api/clients/created_at/desc",
    per_page: 10,
    prev_page_url: null,
    to: 2,
    total: 2
  }
};


let server = setupServer(
  rest.get("/api/clients/created_at/desc", (req, res, ctx) => {
    counter += 1;
    return res(
      ctx.status(200),
      ctx.json(
        responseGetClients
      )
    );  
  }),

  rest.get("/api/clients/name/asc", (req, res, ctx) => {
    counter += 1;
    return res(
      ctx.status(200),
      ctx.json(
        responseGetClients
      )
    );  
  }),

  rest.get("/api/clients/name/desc", (req, res, ctx) => {
    counter += 1;
    return res(
      ctx.status(200),
      ctx.json(
        responseGetClients
      )
    );  
  }),

);  

beforeAll(() => {
  server.listen();
});

let counter = 0;

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
  render(UsersPage, {
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

const waitForAjax = async () => {
  const spinner = screen.queryByRole("pre_loader_add_client");
  expect(spinner).not.toBeNull();
  await waitForElementToBeRemoved(spinner);
};

describe("Users page", () => {
  describe("Layout", () => {
    it( 'has users header', async ()  => {
      await setup();
      const header = screen.queryByRole("heading", { name: "Users" });
      expect(header).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it( 'show data in table', async ()  => {
      await setup();
      await waitForAjax();
      const name1 = responseGetClients.data.data[0].name;
      await screen.findByText(
        name1
      );
      const email1 = responseGetClients.data.data[0].email;
      await screen.findByText(
        email1
      );

      const name2 = responseGetClients.data.data[1].name;
      await screen.findByText(
        name2
      );
      const email2 = responseGetClients.data.data[1].email;
      await screen.findByText(
        email2
      );
      
    });

    it( 'sorting asc by name', async ()  => {
      await setup();
      await waitForAjax();

      expect(counter).toBe(1);
      const button = screen.queryByRole("sorting_name_asc" );
      await  userEvent.click(button);
      expect(counter).toBe(2);
      
      const name1 = responseGetClients.data.data[0].name;
      await screen.findByText(
        name1
      );
    });    

    it( 'sorting desc by name', async ()  => {
      await setup();
      await waitForAjax();
  
      expect(counter).toBe(1);      
      const button = screen.queryByRole("sorting_name_desc" );
      await  userEvent.click(button);
      expect(counter).toBe(2);      

      const name1 = responseGetClients.data.data[0].name;
      await screen.findByText(
        name1
      );
    });  
    
    it( 'change pagination page', async ()  => {
      await setup();
      await waitForAjax();

      const aHref = screen.queryAllByRole("pagination_links" );

      expect(counter).toBe(1); //mount
      await  userEvent.click(aHref[1]);
      expect(counter).toBe(2); //mount+click     
  
    });      

  });
  
});