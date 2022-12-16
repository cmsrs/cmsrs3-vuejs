import LoginPage from "./LoginPage.vue";
import {render, screen} from "@testing-library/vue";


const setup = async () => {
    render(LoginPage);
    /*
    render(LoginPage, {
      global: {
        plugins: [i18n, store],
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
    */
  };


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
});