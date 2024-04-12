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

const authJson = {
  token: "abcde12345"
}

const loginSuccess = http.post("/api/login", async ({ request }) => {
  counter += 1;
  requestBody = await request.json()
  const jsonRes = {
    success: true,
    data: authJson
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

        const alertDanger = screen.queryByRole("alert_danger");
        expect( alertDanger ).toBeInTheDocument();
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

        const auth = storage.getItem('auth');
        const config = storage.getItem('config');

        expect(auth).toEqual(authJson)
        expect(config).toEqual(configJson)

      });
    });


});
