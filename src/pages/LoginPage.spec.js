import LoginPage from "./LoginPage.vue";
import {render, screen} from "@testing-library/vue";


it( 'has login header', ()  => {
    render(LoginPage);
    const header = screen.queryByRole("heading", { name: "Login" });
    expect(header).toBeInTheDocument();
});