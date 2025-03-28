import {
    AppNavbarPresenter,
    AppNavbarView
} from "tweeter-web/src/presenters/AppNavbarPresenter";
import {
    mock,
    instance,
    verify,
    spy,
    when,
    anything,
    capture
} from "@typestrong/ts-mockito";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockUserService: UserService;

    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockAppNavbarView = mock<AppNavbarView>();
        const mockAppNavbarViewInstance = instance(mockAppNavbarView);

        const appNavbarPresenterSpy = spy(
            new AppNavbarPresenter(mockAppNavbarViewInstance)
        );
        appNavbarPresenter = instance(appNavbarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);

        when(appNavbarPresenterSpy.userService).thenReturn(
            mockUserServiceInstance
        );
    });

    it("tells the view to display a logging out message.", async () => {
        await appNavbarPresenter.logout(authToken);

        verify(
            mockAppNavbarView.displayInfoMessage("Logging out...", 0)
        ).once();
    });

    it("calls logout on the user service with the correct auth token.", async () => {
        await appNavbarPresenter.logout(authToken);
        verify(mockUserService.logout(authToken)).once();
    });

    it("tells the view to clear the last info message and clear the user info when logout is successful.", async () => {
        await appNavbarPresenter.logout(authToken);

        verify(mockAppNavbarView.displayErrorMessage(anything())).never();
        verify(mockAppNavbarView.clearLastInfoMessage()).once();
        verify(mockAppNavbarView.clearUserInfo()).once();
    });

    it("tells the view to display an error message and does not tell it to clear the last info message or clear the user info when logout is not successful.", async () => {
        const error = new Error("An error occurred");
        when(mockUserService.logout(authToken)).thenThrow(error);

        await appNavbarPresenter.logout(authToken);

        let [capturedErrorMessage] = capture(
            mockAppNavbarView.displayErrorMessage
        ).last();
        // expect(capturedErrorMessage).toEqual(authToken);
        console.log(capturedErrorMessage);

        verify(
            mockAppNavbarView.displayErrorMessage(
                "Failed to log out because of exception: An error occurred"
            )
        ).once();

        verify(mockAppNavbarView.displayErrorMessage(anything())).once();
        verify(mockAppNavbarView.clearLastInfoMessage()).never();
        verify(mockAppNavbarView.clearUserInfo()).never();
    });
});
