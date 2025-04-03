import React from "react";
import Login from "tweeter-web/src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { Presenter } from "../../../../src/presenters/Presenter";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import '@testing-library/jest-dom';

describe("Login Component", () => {
    it("starts with the sign-in button is disabled.", () => {
        const { signInButton } = renderLoginAndGetElements("/");
        expect(signInButton).toBeDisabled();
    });

    it("it enables the sign-in button when both the alias and password fields have text.", async () => {
        const { signInButton, aliasField, passwordField, user } =
            renderLoginAndGetElements("/");

        await user.type(aliasField, "a");
        await user.type(passwordField, "b");

        expect(signInButton).toBeEnabled();
    });

    it("disables the sign-in button if either the alias or password field is cleared.", async () => {
        const { signInButton, aliasField, passwordField, user } =
            renderLoginAndGetElements("/");

        await user.type(aliasField, "a");
        await user.type(passwordField, "b");
        expect(signInButton).toBeEnabled();

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();

        await user.type(aliasField, "1");
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    });

    it("calls the presenter's login method with correct parameters when the sign-in button is pressed.", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const originalUrl = "https://baileehodge.com";
        const alias = "@NoahK";
        const password = "SongsAboutDrinking";

        const { signInButton, aliasField, passwordField, user } =
            renderLoginAndGetElements(originalUrl, mockPresenterInstance);

        await user.type(aliasField, alias);
        await user.type(passwordField, password);

        await user.click(signInButton);

        verify(mockPresenter.login(alias, password, originalUrl)).once();
    });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
    return render(
        // fails without MemoryRouter
        <MemoryRouter>
            {!!presenter ? (
                <Login originalUrl={originalUrl} presenter={presenter} />
            ) : (
                <Login originalUrl={originalUrl} />
            )}
        </MemoryRouter>
    );
};

const renderLoginAndGetElements = (
    originalUrl: string,
    presenter?: LoginPresenter
) => {
    const user = userEvent.setup();

    renderLogin(originalUrl);

    const signInButton = screen.getByRole("Button", { name: /sign in/i });
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return { signInButton, aliasField, passwordField, user };
};
