import { render, router, screen, waitFor, waitForElementToBeRemoved, fireEvent } from '../../test/helper.js'
import LoginPage from "./LoginPage.vue";
import { setupServer } from "msw/node"
import {  HttpResponse, http } from "msw"
import userEvent from "@testing-library/user-event"
//import trans from "../helpers/trans.js"
import storage from "../state/storage.js"
import { afterAll, beforeAll } from 'vitest'
//import jsonStoreModule from "./jsonStore.js"
//const jsonStore = jsonStoreModule.getJsonStore()

/*
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/vue";
import LoginPage from "./LoginPage.vue";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import store from "../state/store";
import { resetAuthState } from "../state/store";
import storage from "../state/storage";
*/

let requestBody;
let counter = 0;
const server = setupServer(
  http.post("/api/login", async ({ request }) => {
    requestBody = await request.json()
    counter += 1;

    const jsonRes = {
      success: false,
      error: "some error text"
    }
  
    return HttpResponse.json(
      jsonRes
    )
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

afterAll(() => server.close());


//let emailInput, passwordInput, button;
const setup = async () => {
    render(LoginPage)
};

const loginSuccess = http.post("/api/login", async ({ request }) => {
  counter += 1;
  requestBody = await request.json()
  const jsonRes = {
    success: true,
    data: {
      token: "abcde12345"
    }
  }

  return HttpResponse.json(
    jsonRes
  )
  
});

const configJson = {
  page_types: ['cms', 'gallery'],
  langs: ['en', 'pl'],
  cache_enable: 1
};

const configSuccess = http.get("/api/config", async () => {

  const jsonRes = {
    success: true,
    data: configJson
  }

  return HttpResponse.json(
    jsonRes
  )

});

describe("Login page", () => {
    describe("Layout", () => {
        it( 'has login header', async ()  => {
            await setup();
            const header = screen.queryByRole("heading", { name: "Login" });
            expect(header).toBeInTheDocument();
        });

        it("has email input", async () => {
            await setup();
            const input = screen.queryByLabelText("E-mail");
            expect(input).toBeInTheDocument();
        });
        it("has password input", async () => {
          await setup();
          const input = screen.queryByLabelText("Password");
          expect(input).toBeInTheDocument();
        });
        it("has password type for password input", async () => {
          await setup();
          const input = screen.queryByLabelText("Password");
          expect(input.type).toBe("password");
        });
        it("has Login button", async () => {
          await setup();
          const button = screen.queryByRole("button_login");
          expect(button).toBeInTheDocument();
        });
        it("disables the button initially", async () => {
          await setup();
          const button = screen.queryByRole("button_login");
          expect(button).toBeDisabled();
        });
    });

    describe("Interactions", () => {
      const setupFilled = async (email, password ) => {
        await setup()        

        const emailInput = screen.queryByLabelText("E-mail");
        const passwordInput = screen.queryByLabelText("Password");
        const button = screen.queryByRole("button_login");
    
        await userEvent.type(emailInput, email);
        await userEvent.type(passwordInput, password);
        return {
          elements: {
            button,
            emailInput,
            passwordInput
          }      
        }
      }

      const emailWrong = "wrong@example.com";
      const passwordWrong = "PasswordRsWrong";

      const emailGood = "user_rs@example.com";
      const passwordGood = "PasswordRs";  

      // const setupFilledOk = async () => {
      //   return await setupFilled(emailOk, passwordOk)
      // };

      // const setupFilledWrong = async (emailWrong, passwordWrong) => {
      //   return await setupFilled(emailWrong, passwordWrong)
      // };

      it("enables the button when email and password inputs are filled", async () => {
        const {
          elements: { button }
        } = await setupFilled(emailWrong, passwordWrong);
        expect(button).toBeEnabled();
      });

      it("send wrong data to server", async () => {
        const {
          elements: { button }
        } = await setupFilled(emailWrong, passwordWrong);
        
        expect(counter).toBe(0);        
        await userEvent.click(button);
        expect(counter).toBe(1);        
        const spinner = screen.queryByRole("pre_loader_login");
        await waitFor(() => {
          expect(spinner).not.toBeInTheDocument();
          expect(requestBody).toEqual({
            email: emailWrong,
            password: passwordWrong,
          });  
        });

        //show wrong msg - todo
      });

      it("send good data to server", async () => { //todo
        server.use(loginSuccess);
        server.use(configSuccess);
        
        const {
          elements: { button }
        } = await setupFilled(emailGood, passwordGood);
        
        expect(counter).toBe(0);        
        await userEvent.click(button);
        expect(counter).toBe(1);        
        const spinner = screen.queryByRole("pre_loader_login");
        await waitFor(() => {
          expect(spinner).not.toBeInTheDocument();
          expect(requestBody).toEqual({
            email: emailGood,
            password: passwordGood,
          });  
        });

        //show good msg - todo

      });




    });


    describe.skip("Interactions_old", () => {
      const emailOk = "user_rs@mail.com";
      const passwordOk = "PasswordRs";

      const setupFilled = async () => {
        await setup();
        await userEvent.type(emailInput, emailOk);
        await userEvent.type(passwordInput, passwordOk);
      };

      it("enables the button when email and password inputs are filled", async () => {
        await setupFilled();
        expect(button).toBeEnabled();
      });

      it("displays spinner after clicking the button", async () => {
        await setupFilled();
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
        await userEvent.click(button);
        expect(screen.queryByRole("status")).toBeInTheDocument();
      });

      it("hides spinner after api call finishes with fail response", async () => {
        await setupFilled();
        await userEvent.click(button);
        const spinner = screen.queryByRole("status");
        await waitFor(() => {
          expect(spinner).not.toBeInTheDocument();
        });
      });

      it("send token from backend after clicking the button", async () => {
        await setupFilled();
        await userEvent.click(button);
        const spinner = screen.queryByRole("status");
        await waitForElementToBeRemoved(spinner);
        expect(requestBody).toEqual({
          email: "user_rs@mail.com",
          password: "PasswordRs",
        });
      });

      it("disables the button when there is an api call", async () => {
        await setupFilled();
        await userEvent.click(button);
        await userEvent.click(button);
        const spinner = screen.queryByRole("status");
        await waitForElementToBeRemoved(spinner);
        expect(counter).toBe(1);
      });

      it("displays authentication fail message", async () => {
        await setupFilled();
        await userEvent.click(button);
        const errorMessage = await screen.findByText("Invalid login credentials");
        expect(errorMessage).toBeInTheDocument();
      });

      it("clears authentication fail message when email field is changed", async () => {
        await setupFilled();
        await userEvent.click(button);
        const errorMessage = await screen.findByText("Invalid login credentials");
        await userEvent.type(emailInput, "new@mail.com");
        expect(errorMessage).not.toBeInTheDocument();
      });

      it("clears authentication fail message when password field is changed", async () => {
        await setupFilled();
        await userEvent.click(button);
        const errorMessage = await screen.findByText("Invalid login credentials");
        await userEvent.type(passwordInput, "Newpassword");
        expect(errorMessage).not.toBeInTheDocument();
      });

      it("stores authorization values in storage", async () => {
        //await setupFilled();
        await setup()
        //console.log('test123')
        //await setup()
        //await setupFilled();        
        //server.use(loginSuccess);
        //server.use(configSuccess);

        /*
        expect(store.state.config).toBeFalsy();
        await userEvent.click(button);
        const spinner = screen.queryByRole("status");
        await waitForElementToBeRemoved(spinner);
        const storedState = storage.getItem("auth");
        expect(storedState.token).toBe("abcde12345");
        expect(storedState.email).toBe(emailOk);
        expect(storedState.password).toBe(passwordOk);
        //expect(store.state.config).toMatchObject(configJson);    

        //Sign Out
        storage.clear();
        resetAuthState();
        */
      });


      // * it is not working propobly user is still login - todo
      it("stores config in storage", async () => {        
        server.use(loginSuccess);
        server.use(configSuccess);
        await setupFilled();
        /*
        expect(store.state.config).toBeFalsy();
        await userEvent.click(button);
        const spinner = screen.queryByRole("status");
        await waitForElementToBeRemoved(spinner);
        //expect(store.state.config).toMatchObject(configJson);
        expect(store.state.config.page_types).toMatchObject(configJson.page_types);
        expect(store.state.config.langs).toMatchObject(configJson.langs);
        expect(store.state.config.cache_enable).toBe(1);
        expect(store.state.config.defaultLang).toBe('en');

        const storedStateConfig = storage.getItem("config"); //when we refresh /pages the config not disaapear
        expect(storedStateConfig.page_types).toMatchObject(configJson.page_types);
        expect(storedStateConfig.langs).toMatchObject(configJson.langs);
        expect(storedStateConfig.cache_enable).toBe(1);
        expect(storedStateConfig.defaultLang).toBe('en');
        

        storage.clear();
        resetAuthState();
        */
      });


    });

});
