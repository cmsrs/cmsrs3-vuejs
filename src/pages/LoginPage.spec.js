import {
  render, 
  screen, 
  waitForElementToBeRemoved
} from "@testing-library/vue";
import LoginPage from "./LoginPage.vue";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import store from "../state/store";
import storage from "../state/storage";


let requestBody;
let counter = 0;
const server = setupServer(
  rest.post("/api/login", (req, res, ctx) => {
    requestBody = req.body;
    counter += 1;
    return res(
      ctx.status(404), //TODO it sould be 401
      ctx.json({
        success: true,
        error: "some error text"
        })
    );
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

afterAll(() => server.close());


let emailInput, passwordInput, button;
const setup = async () => {
    //render(LoginPage);
    
    render(LoginPage, {
      global: {
        plugins: [store],
        mocks: {
          $router: {
            push: () => {},
          },
        },
      },
    });
    
    emailInput = screen.queryByLabelText("E-mail");
    passwordInput = screen.queryByLabelText("Password");
    button = screen.queryByRole("button", { name: "Login" });
};




const loginSuccess = rest.post("/api/login", (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      success: true,
      data: {
        token: "abcde12345"
      }
    })
  );
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
          const button = screen.queryByRole("button", { name: "Login" });
          expect(button).toBeInTheDocument();
        });
        it("disables the button initially", async () => {
          await setup();
          const button = screen.queryByRole("button", { name: "Login" });
          expect(button).toBeDisabled();
        });        
    });

    describe("Interactions", () => {
      const setupFilled = async () => {
        await setup();
        await userEvent.type(emailInput, "user100@mail.com");
        await userEvent.type(passwordInput, "wrongPass");
      };

      it("enables the button when email and password inputs are filled", async () => {
        await setupFilled();
        expect(button).toBeEnabled();
      });

      it("stores authorization header value in storage", async () => {
        server.use(loginSuccess);
        await setupFilled();
        await userEvent.click(button);
        const spinner = screen.queryByRole("status");
        await waitForElementToBeRemoved(spinner);
        const storedState = storage.getItem("auth");
        expect(storedState.header).toBe("Bearer abcde12345");
      });
  
    });

});