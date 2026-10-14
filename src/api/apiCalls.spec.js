import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import axios from "axios";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

import { useAuthStore } from "../state/store.js";
import "../api/apiCalls.js";

const server = setupServer(
  http.get("/api/test-expired-token", () => {
    return HttpResponse.json({ message: "Token has expired" }, { status: 401 });
  }),
);

describe("JWT expiration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    localStorage.setItem(
      "auth",
      JSON.stringify({ token: "expired-test-token" }),
    );

    server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("clears authentication when API returns 401", async () => {
    const authStore = useAuthStore();

    // Symulujemy zalogowanego użytkownika.
    authStore.setAuth({ token: "expired-test-token" });

    expect(authStore.auth.token).toBe("expired-test-token");

    // Wywołujemy API, które symuluje wygaśnięcie tokenu.
    await expect(axios.get("/api/test-expired-token")).rejects.toMatchObject({
      response: { status: 401 },
    });

    // Interceptor powinien wyczyścić stan autoryzacji.
    expect(authStore.auth.token).toBe(0);
  });

  it("redirects to login when API returns 401", async () => {
    const authStore = useAuthStore();

    authStore.setAuth({ token: "expired-test-token" });

    const redirectSpy = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {});

    await expect(axios.get("/api/test-expired-token")).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(redirectSpy).toHaveBeenCalledWith("/admin/login");
  });
});
