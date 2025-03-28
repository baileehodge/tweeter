import { AuthToken } from "tweeter-shared";
import { MessageView, Presenter} from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AppNavbarView extends MessageView {
    clearUserInfo: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
    private _userService: UserService | null = null;

    public constructor(view: AppNavbarView) {
        super(view);
    }

    public get userService() {
        if(this._userService == null) {
            this._userService = new UserService();
        }
        return this._userService;
    }

    public async logout(authToken: AuthToken | null): Promise<void> {
        this.view.displayInfoMessage("Logging out...", 0);
        await this.doFailureReportingOperation(async () => {
            await this.userService.logout(authToken!);
            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
        }, "log out");
    }


}