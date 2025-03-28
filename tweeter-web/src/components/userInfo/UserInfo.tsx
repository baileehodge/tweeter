import "./UserInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "./userInfoHook";
import { UserInfoPresenter } from "../../presenters/UserInfoPresenter";
import { MessageView } from "../../presenters/Presenter";

const UserInfo = () => {
    const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
        useToastListener();

    const { currentUser, authToken, displayedUser, setDisplayedUser } =
        useUserInfoHook();

    const presenterGenerator = (view: MessageView) =>
        new UserInfoPresenter(view);

    const listener: MessageView = {
        displayErrorMessage: displayErrorMessage,
        displayInfoMessage: displayInfoMessage,
        clearLastInfoMessage: clearLastInfoMessage
    };

    const [presenter] = useState(presenterGenerator(listener));

    if (!displayedUser) {
        setDisplayedUser(currentUser!);
    }

    useEffect(() => {
        presenter.setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
        presenter.setNumbFollowees(authToken!, displayedUser!);
        presenter.setNumbFollowers(authToken!, displayedUser!);
    }, [displayedUser]);

    const switchToLoggedInUser = (event: React.MouseEvent): void => {
        event.preventDefault();
        setDisplayedUser(currentUser!);
    };

    const followDisplayedUser = async (
        event: React.MouseEvent
    ): Promise<void> => {
        event.preventDefault();

        try {
            presenter.isLoading = true;
            displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

            const [followerCount, followeeCount] = await presenter.follow(
                authToken!,
                displayedUser!
            );

            presenter.isFollower = true;
            presenter.followerCount = followerCount;
            presenter.followeeCount = followeeCount;
        } catch (error) {
            displayErrorMessage(
                `Failed to follow user because of exception: ${error}`
            );
        } finally {
            clearLastInfoMessage();
            presenter.isLoading = false;
        }
    };

    const unfollowDisplayedUser = async (
        event: React.MouseEvent
    ): Promise<void> => {
        event.preventDefault();

        try {
            presenter.isLoading = true;
            displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

            const [followerCount, followeeCount] = await presenter.unfollow(
                authToken!,
                displayedUser!
            );

            presenter.isFollower = false;
            presenter.followerCount = followerCount;
            presenter.followeeCount = followeeCount;
        } catch (error) {
            displayErrorMessage(
                `Failed to unfollow user because of exception: ${error}`
            );
        } finally {
            clearLastInfoMessage();
            presenter.isLoading = false;
        }
    };

    return (
        <div className={presenter.isLoading ? "loading" : ""}>
            {currentUser === null ||
            displayedUser === null ||
            authToken === null ? (
                <></>
            ) : (
                <div className="container">
                    <div className="row">
                        <div className="col-auto p-3">
                            <img
                                src={displayedUser.imageUrl}
                                className="img-fluid"
                                width="100"
                                alt="Posting user"
                            />
                        </div>
                        <div className="col p-3">
                            {displayedUser !== currentUser && (
                                <p id="returnToLoggedInUser">
                                    Return to{" "}
                                    <Link
                                        to={""}
                                        onClick={(event) =>
                                            switchToLoggedInUser(event)
                                        }
                                    >
                                        logged in user
                                    </Link>
                                </p>
                            )}
                            <h2>
                                <b>{displayedUser.name}</b>
                            </h2>
                            <h3>{displayedUser.alias}</h3>
                            <br />
                            {presenter.followeeCount > -1 &&
                                presenter.followerCount > -1 && (
                                    <div>
                                        Followees: {presenter.followeeCount}{" "}
                                        Followers: {presenter.followerCount}
                                    </div>
                                )}
                        </div>
                        <form>
                            {displayedUser !== currentUser && (
                                <div className="form-group">
                                    {presenter.isFollower ? (
                                        <button
                                            id="unFollowButton"
                                            className="btn btn-md btn-secondary me-1"
                                            type="submit"
                                            style={{ width: "6em" }}
                                            onClick={(event) =>
                                                unfollowDisplayedUser(event)
                                            }
                                        >
                                            {presenter.isLoading ? (
                                                <span
                                                    className="spinner-border spinner-border-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            ) : (
                                                <div>Unfollow</div>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            id="followButton"
                                            className="btn btn-md btn-primary me-1"
                                            type="submit"
                                            style={{ width: "6em" }}
                                            onClick={(event) =>
                                                followDisplayedUser(event)
                                            }
                                        >
                                            {presenter.isLoading ? (
                                                <span
                                                    className="spinner-border spinner-border-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            ) : (
                                                <div>Follow</div>
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserInfo;
