import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import { LoginPresenter } from "../../../presenters/LoginPresenter";
import useUserInfoHook from "../../userInfo/userInfoHook";
import { View } from "../../../presenters/Presenter";

interface Props {
    originalUrl?: string;
    presenter?: LoginPresenter;
}

const Login = (props: Props) => {
    const [alias, setAlias] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false); // staying in view because doLogin stays

    const { displayErrorMessage } = useToastListener();

    const listener: View = {
        displayErrorMessage: displayErrorMessage
    };

    const [presenter] = useState(props.presenter ?? new LoginPresenter(listener));

    const { updateUserInfo } = useUserInfoHook();
    const navigate = useNavigate();

    const checkSubmitButtonStatus = (): boolean => {
        return !alias || !password;
    };

    const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key == "Enter" && !checkSubmitButtonStatus()) {
            presenter.alias = alias;
            presenter.password = password;
            if (props.originalUrl) {
                presenter.originalURL = props.originalUrl;
            }
            doLogin();
        }
    };

    const inputFieldGenerator = () => {
        return (
            <AuthenticationFields
                onEnter={loginOnEnter}
                setAlias={setAlias}
                setPassword={setPassword}
            />
        );
    };

    const switchAuthenticationMethodGenerator = () => {
        return (
            <div className="mb-3">
                Not registered? <Link to="/register">Register</Link>
            </div>
        );
    };

    const doLogin = async () => {
        // included in view layer bc hook is UI
        try {
            presenter.isLoading = true;
            const [user, authToken] = await presenter.login(alias, password);
            updateUserInfo(user, user, authToken, rememberMe);
            if (!!props.originalUrl) {
                navigate(props.originalUrl);
            } else {
                navigate("/");
            }
        } catch (error) {
            displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        } finally {
            presenter.isLoading = false;
        }
    };

    return (
        <AuthenticationFormLayout
            headingText="Please Sign In"
            submitButtonLabel="Sign in"
            oAuthHeading="Sign in with:"
            inputFieldGenerator={inputFieldGenerator}
            switchAuthenticationMethodGenerator={
                switchAuthenticationMethodGenerator
            }
            setRememberMe={setRememberMe}
            submitButtonDisabled={checkSubmitButtonStatus}
            isLoading={presenter.isLoading}
            submit={doLogin}
        />
    );
};

export default Login;
