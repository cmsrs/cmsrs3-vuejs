import {
  render, 
  screen,
  waitFor,  
  waitForElementToBeRemoved
} from "@testing-library/vue";
import UserEditPage from "./UserEditPage.vue";
import { createStore } from "vuex";
import { setupServer } from "msw/node";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";
import trans from "../helpers/trans.js";

//global.window.confirm = jest.fn(() => true);

const responseGetClient = {
  success: 1,
  data: {
    id: 1,
    name: "Robert Test",
    email: "rob@unittest.com",
    email_verified_at: null,
    role: "client",
    created_at: "2024-04-04T09:50:48.000000Z",
    updated_at: "2024-04-04T09:50:48.000000Z"
  }  
};


let server = setupServer(

  rest.get("/api/clients/1", (req, res, ctx) => {
    counter += 1;
    return res(
      ctx.status(200),
      ctx.json(
        responseGetClient
      )
    );
  }),

  rest.put("/api/clients/1", (req, res, ctx) => {
    counter += 1;
    return res(
      ctx.status(200),
      ctx.json({
        success: true
      })
    );
  }),

  rest.post("/api/clients", (req, res, ctx) => {
    counter += 1;
    return res(
      ctx.status(200),
      ctx.json({
        success: true
      })
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

const setupEdit = async () => {
  render(UserEditPage, {
    props: {
      mode: 'edit',
      id: '1'
    },    
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

const setupAdd = async () => {
  render(UserEditPage, {
    props: {
      mode: 'add'
    },    
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
  const spinner = screen.queryByRole("pre_loader_add_edit_client");
  expect(spinner).not.toBeNull();
  await waitForElementToBeRemoved(spinner);
};


describe("User edit page", () => {
  describe("Layout", () => {
    it( 'has edit client header', async ()  => {
      await setupEdit();
      const header = screen.queryByRole("heading", { name: "Edit client" });
      expect(header).toBeInTheDocument();
    });

    it( 'has add client header', async ()  => {
      await setupAdd();
      const header = screen.queryByRole("heading", { name: "Add client" });
      expect(header).toBeInTheDocument();
    });
  });

  
  describe("Interactions", () => {
    it( 'load client data', async ()  => {
      await setupEdit();
      await waitForAjax();
      expect(counter).toBe(1); //mount      
    });

    it( 'new data', async ()  => {
      await setupAdd();
      expect(counter).toBe(0); 
    });

    it( 'load edit client', async ()  => {
      await setupEdit();
      await waitForAjax();
      expect(counter).toBe(1);

      const email = screen.queryByPlaceholderText("email");
      expect(email).toHaveValue(responseGetClient.data.email);

      const name = screen.queryByPlaceholderText("name");
      expect(name).toHaveValue(responseGetClient.data.name);

      const password = screen.queryByPlaceholderText("password");
      expect(password).toHaveValue("");

      const password_confirmation = screen.queryByPlaceholderText("password confirmation");
      expect(password_confirmation).toHaveValue("");
    });

    it( 'load add client', async ()  => {
      await setupAdd();
      expect(counter).toBe(0);

      const email = screen.queryByPlaceholderText("email");
      expect(email).toHaveValue("");

      const name = screen.queryByPlaceholderText("name");
      expect(name).toHaveValue("");

      const password = screen.queryByPlaceholderText("password");
      expect(password).toHaveValue("");

      const password_confirmation = screen.queryByPlaceholderText("password confirmation");
      expect(password_confirmation).toHaveValue("");
    });


    it( 'edit client', async ()  => {
      await setupEdit();
      await waitForAjax();
      expect(counter).toBe(1);

      const email = screen.queryByPlaceholderText("email");
      await userEvent.type( email , 'aaaa@example.com');//email is not changeable in edit mode


      const name = screen.queryByPlaceholderText("name");
      await userEvent.type( name , 'aaaaaaaaaaaaa');

      const password = screen.queryByPlaceholderText("password");
      await userEvent.type( password , 'abc');

      const password_confirmation = screen.queryByPlaceholderText("password confirmation");
      await userEvent.type( password_confirmation , 'abc');


      const buttonSubmit = screen.queryByRole("button_save_edit_client" );
      await userEvent.click(buttonSubmit);
      expect(counter).toBe(2);      

      const successMsg = trans.ttt( 'success_client_edit' );
      expect( successMsg ).not.toBe( '');
      await screen.findByText(
       successMsg
      );

    });


    it( 'add client', async ()  => {
      await setupAdd();
      //await waitForAjax();
      expect(counter).toBe(0);

      const email = screen.queryByPlaceholderText("email");
      await userEvent.type( email , 'aaaabb@example.com');//email is not changeable in edit mode


      const name = screen.queryByPlaceholderText("name");
      await userEvent.type( name , 'aaaaaaaaaaaaa');

      const password = screen.queryByPlaceholderText("password");
      await userEvent.type( password , 'abc');

      const password_confirmation = screen.queryByPlaceholderText("password confirmation");
      await userEvent.type( password_confirmation , 'abc');


      const buttonSubmit = screen.queryByRole("button_save_edit_client" );
      await userEvent.click(buttonSubmit);
      expect(counter).toBe(1);      

      const successMsg = trans.ttt( 'success_client_add' );
      expect( successMsg ).not.toBe('');
      await screen.findByText(
       successMsg
      );
    });


  });

  describe("Interactions validation errors", () => {

    const responseError = {
      success: false,
      error: {
        name: ["The name field is required."],
        email: ["The email has already been taken."],
        password: [
          "The password must be at least 8 characters.",
          "The password confirmation does not match."
        ]
      }
    };

    let server = setupServer(
    
      rest.post("/api/clients", (req, res, ctx) => {
        counter += 1;
        return res(
          ctx.status(200),
          ctx.json(
            responseError          
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
        
    it( 'add client with errors', async ()  => {
      await setupAdd();
      //await waitForAjax();
      expect(counter).toBe(0);

      const email = screen.queryByPlaceholderText("email");
      await userEvent.type( email , 'aaaabb@example.com');//email is not changeable in edit mode


      const name = screen.queryByPlaceholderText("name");
      await userEvent.type( name , 'aaaaaaaaaaaaa');

      const password = screen.queryByPlaceholderText("password");
      await userEvent.type( password , 'abc');

      const password_confirmation = screen.queryByPlaceholderText("password confirmation");
      await userEvent.type( password_confirmation , 'abc');


      const buttonSubmit = screen.queryByRole("button_save_edit_client" );
      await userEvent.click(buttonSubmit);
      expect(counter).toBe(1);      

      const alertDangerAfter = screen.queryByRole("alert_danger");
      expect( alertDangerAfter ).not.toBeInTheDocument();

      await waitFor(() => {    
        const alertDangerAfter2 = screen.queryByRole("alert_danger");
        expect( alertDangerAfter2 ).toBeInTheDocument();
  
        const email2 = screen.queryByPlaceholderText("email");
        expect(email2).toHaveClass("is-invalid");      

        const name2 = screen.queryByPlaceholderText("name");
        expect(name2).toHaveClass("is-invalid");      

        const password2 = screen.queryByPlaceholderText("password");
        expect(password2).toHaveClass("is-invalid");      

        const password_confirmation2 = screen.queryByPlaceholderText("password confirmation");
        expect(password_confirmation2).toHaveClass("is-invalid");              
  
      });
    });


  });


});