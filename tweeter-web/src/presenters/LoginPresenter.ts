import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { AuthPresenter } from "./AuthPresenter";
import { View } from "./Presenter";

export class LoginPresenter extends AuthPresenter {
    private userService: UserService;
    

    public constructor(view: View) {
        super(view);
        this.userService = new UserService();
    }

    // is the ? thing here gonna cause issues later?
    public async login(
        alias: string,
        password: string,
        url?: string
    ): Promise<[User, AuthToken]> {
        return this.userService.serverLogin(alias, password, url)
    }

}
