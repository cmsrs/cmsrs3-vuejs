import {
  render,
  router,
  screen,
  waitFor,
  //waitForElementToBeRemoved,
  //fireEvent,
} from "../../test/helper.js";
import LoginPage from "./LoginPage.vue";
import MenuPagesPage from "./MenuPagesPage.vue";
import UsersPage from "./UsersPage.vue";
import UserEditPage from "./UserEditPage.vue";


import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import userEvent from "@testing-library/user-event";
//import trans from "../helpers/trans.js"
import storage from "../state/storage.js";
import { afterAll, beforeAll } from "vitest";
import jsonStoreModule from "../../test/jsonStore.js";
const jsonStore = jsonStoreModule.getJsonStore();

let requestBody;
let counter = 0;
const server = setupServer(
  http.post("/api/login", async ({ request }) => {
    requestBody = await request.json();
    counter += 1;

    const jsonRes = {
      success: false,
      error: "some error text",
    };

    return HttpResponse.json(jsonRes);
  }),
);

beforeAll(() => server.listen());

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

//let emailInput, passwordInput, button;
const setup = async () => {
  render(LoginPage);
};

const authJson = jsonStore.auth;
const loginSuccess = http.post("/api/login", async ({ request }) => {
  counter += 1;
  requestBody = await request.json();
  const jsonRes = {
    success: true,
    data: authJson,
  };

  return HttpResponse.json(jsonRes);
});

const configJson = jsonStore.config;
const configSuccess = http.get("/api/config", async () => {
  const jsonRes = {
    success: true,
    data: configJson,
  };

  return HttpResponse.json(jsonRes);
});

describe("Login page", () => {
  describe("Layout", () => {
    it("has login header", async () => {
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
    const setupFilled = async (email, password) => {
      await setup();

      const emailInput = screen.queryByLabelText("E-mail");
      const passwordInput = screen.queryByLabelText("Password");
      const button = screen.queryByRole("button_login");

      await userEvent.type(emailInput, email);
      await userEvent.type(passwordInput, password);
      return {
        elements: {
          button,
          emailInput,
          passwordInput,
        },
      };
    };

    const emailWrong = "wrong@example.com";
    const passwordWrong = "PasswordRsWrong";

    const emailGood = "user_rs@example.com";
    const passwordGood = "PasswordRs";

    it("enables the button when email and password inputs are filled", async () => {
      const {
        elements: { button },
      } = await setupFilled(emailWrong, passwordWrong);
      expect(button).toBeEnabled();
    });

    it("send wrong data to server", async () => {
      const {
        elements: { button, emailInput },
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
      expect(alertDanger).toBeInTheDocument();

      //when we type sth for example in the email input, the alert_danger should be removed
      await userEvent.type(emailInput, "c");
      const alertDangerAfter = screen.queryByRole("alert_danger");
      expect(alertDangerAfter).not.toBeInTheDocument();
    });

    it("send good data to server", async () => {
      //todo
      server.use(loginSuccess);
      server.use(configSuccess);

      const {
        elements: { button },
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
        expect(router.currentRoute.value.path).toBe('/pages')
      });

      const auth = storage.getItem("auth");
      const config = storage.getItem("config");

      expect(auth).toEqual(authJson);
      expect(config).toEqual(configJson);
    });
  });

  describe("prevent go to another pages when user is not auth", () => {  
    const setupTmp = async (path, objPage) => {
      router.push(path)
      await router.isReady()
      render(objPage);
    };
    
    it("try to redirect to pages", async () => {
      await setupTmp('/pages', MenuPagesPage)
      expect(screen.queryByTestId('pages-page')).toBeInTheDocument()
      await waitFor(() => {
        expect(router.currentRoute.value.path).toBe('/')      
      });      
    });      

    it("try to redirect to users", async () => {
      await setupTmp('/users', UsersPage)      
      expect(screen.queryByTestId('users-page')).toBeInTheDocument()
      await waitFor(() => {
        expect(router.currentRoute.value.path).toBe('/')
      });      
    });      

    it("try to redirect to user add page", async () => {
      await setupTmp('/user/add', UserEditPage)      
      expect(screen.queryByTestId('user-edit-page')).toBeInTheDocument()
      await waitFor(() => {
        expect(router.currentRoute.value.path).toBe('/')
      });      
    });      

    it("try to redirect to user edit page", async () => {
      await setupTmp('/user/edit/1001', UserEditPage)      
      expect(screen.queryByTestId('user-edit-page')).toBeInTheDocument()
      await waitFor(() => {
        expect(router.currentRoute.value.path).toBe('/')
      });      
    });      

    it("try to redirect fake page", async () => {
      router.push('/fake123')
      await router.isReady()
      await waitFor(() => {
        expect(router.currentRoute.value.path).toBe('/fake123')
      });      
    });      


  });
});
