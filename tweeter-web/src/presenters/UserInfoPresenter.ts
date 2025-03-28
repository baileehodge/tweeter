import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export class UserInfoPresenter extends Presenter<MessageView> {
    private userService: UserService;

    private _isLoading = false;
    private _isFollower = false;
    private _followerCount = -1;
    private _followeeCount = -1;

    public constructor(view: MessageView) {
        super(view);
        this.userService = new UserService();
    }

    // getters and setters ////////////////////////

    public get isLoading() {
        return this._isLoading;
    }

    public set isLoading(value: boolean) {
        this._isLoading = value;
    }

    public get isFollower() {
        return this._isLoading;
    }

    public set isFollower(value: boolean) {
        this._isFollower = value;
    }

    public get followerCount() {
        return this._followerCount;
    }

    public set followerCount(value: number) {
        this._followerCount = value;
    }

    public get followeeCount() {
        return this._followeeCount;
    }

    public set followeeCount(value: number) {
        this._followeeCount = value;
    }

    ////////////////////////////////////////////////////

    public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
        await this.doFailureReportingOperation(async () => {
            await this.userService.setFollowerCount(
                await this.userService.getFollowerCount(
                    authToken,
                    displayedUser
                )
            );
        }, "set number of followers");
    }

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        await this.doFailureReportingOperation(async () => {
            await this.userService.setFolloweeCount(
                await this.userService.getFolloweeCount(
                    authToken,
                    displayedUser
                )
            );
        }, "set number of followees");
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(async () => {
            if (currentUser === displayedUser) {
                this.userService.setIsFollower(false);
            } else {
                this.userService.setIsFollower(
                    await this.userService.getIsFollowerStatus(
                        authToken!,
                        currentUser!,
                        displayedUser!
                    )
                );
            }
        }, "set IsFollower status");
    }

    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        return this.userService.follow(authToken, userToFollow);
    }

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        return this.userService.unfollow(authToken, userToUnfollow);
    }
}
