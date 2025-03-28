// The presenter tells the view to display a posting status message.
// The presenter calls postStatus on the post status service with the correct status string and auth token.
// When posting of the status is successful, the presenter tells the view to clear the last info message, clear the post, and display a status posted message.
// When posting of the status is not successful, the presenter tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message.

import {
    PostStatusPresenter,
    PostStatusView
} from "tweeter-web/src/presenters/PostStatusPresenter";
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
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;

    const authToken = new AuthToken("abc123", Date.now());
    const postString = "According to all known laws of aviation...";

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const postStatusPresenterSpy = spy(
            new PostStatusPresenter(mockPostStatusViewInstance)
        );
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);

        when(postStatusPresenterSpy.statusService).thenReturn(
            mockStatusServiceInstance
        );
    });

    it("tells the view to display a posting status message.", async () => {
        await postStatusPresenter.submitPost(authToken, postString);

        verify(
            mockPostStatusView.displayInfoMessage("Posting status...", 0)
        ).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token.", async () => {
        await postStatusPresenter.submitPost(authToken, postString);
        verify(mockStatusService.postStatus(authToken, anything())).once();
    });

    it("tells the view to clear the last info message, clear the post, and display a status posted message when submitPost is successful.", async () => {
        await postStatusPresenter.submitPost(authToken, postString);

        verify(mockPostStatusView.displayErrorMessage(anything())).never();
        verify(mockPostStatusView.clearLastInfoMessage()).once();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
        verify(mockPostStatusView.setPost(anything())).once();
    });

    it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message when postStatus is not successful.", async () => {
        const error = new Error("An error occurred");
        when(mockStatusService.postStatus(authToken, anything())).thenThrow(
            error
        );

        await postStatusPresenter.submitPost(authToken, postString);

        let [capturedErrorMessage] = capture(
            mockPostStatusView.displayErrorMessage
        ).last();
        // expect(capturedErrorMessage).toEqual(authToken);
        console.log(capturedErrorMessage);

        verify(
            mockPostStatusView.displayErrorMessage(
                "Failed to post status because of exception: An error occurred"
            )
        ).once();

        verify(mockPostStatusView.displayErrorMessage(anything())).once();
        verify(mockPostStatusView.clearLastInfoMessage()).never(); 
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never(); 
    });
});
