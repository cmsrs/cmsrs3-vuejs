import {
  render, 
  screen, 
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/vue";
import UsersPage from "./UsersPage.vue";

import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import store from "../state/store";
import storage from "../state/storage";

/*
let requestBody;
let counter = 0;
const server = setupServer(
  rest.post("/api/login", (req, res, ctx) => {
    requestBody = req.body;
    counter += 1;
    return res(
      ctx.status(404), //TODO it sould be 401
      ctx.json({
        success: false,
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
*/


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


describe("Users page", () => {
  describe("Layout", () => {
    it( 'has users header', async ()  => {
        await setup();
        const header = screen.queryByRole("heading", { name: "Users" });
        expect(header).toBeInTheDocument();  //bez zalogowania widzimy header - nie wiem czy to jest dobry test.
    });
    describe("Interactions", () => {

    });      
  });

  
});