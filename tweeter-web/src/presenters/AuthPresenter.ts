import { useNavigate } from "react-router-dom";
import useUserInfoHook from "../components/userInfo/userInfoHook";
import { Presenter, View } from "./Presenter";


export abstract class AuthPresenter extends Presenter<
    View
> {

    private _alias = "";
    private _password = "";
    private _isLoading = false;
    private _originalURL?: string;
    protected navigate = useNavigate();
    updateUserInfo = useUserInfoHook();

    protected constructor(view: View) {
        super(view);
    }

    public get alias(): string {
        return this._alias;
    }
    public set alias(value: string) {
        this._alias = value;
    }
    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }
    public set originalURL(value: string) {
        this._originalURL = value;
    }
    public set isLoading(value: boolean) {
        this._isLoading = value;
    }


}
