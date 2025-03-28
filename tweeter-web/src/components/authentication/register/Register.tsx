import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import useUserInfoHook from "../../userInfo/userInfoHook";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import { RegisterPresenter } from "../../../presenters/RegisterPresenter";
import { View } from "../../../presenters/Presenter";

interface Props {
    originalUrl?: string;
    presenter?: RegisterPresenter;
}

const Register = (props: Props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [alias, setAlias] = useState("");
    const [password, setPassword] = useState("");
    const [imageBytes] = useState<Uint8Array>(new Uint8Array());
    const [imageUrl] = useState<string>("");
    const [imageFileExtension] = useState<string>("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { updateUserInfo } = useUserInfoHook();
    const { displayErrorMessage } = useToastListener();

    const listener: View = {
        displayErrorMessage: displayErrorMessage
    };

    const [presenter] = useState(
        props.presenter ?? new RegisterPresenter(listener)
    );

    const checkSubmitButtonStatus = (): boolean => {
        return (
            !firstName ||
            !lastName ||
            !alias ||
            !password ||
            !imageUrl ||
            !imageFileExtension
        );
    };

    const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key == "Enter" && !checkSubmitButtonStatus()) {
            doRegister();
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        presenter.handleImageFile(file);
    };

    const doRegister = async () => {
        try {
            setIsLoading(true);

            const [user, authToken] = await presenter.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageFileExtension
            );

            updateUserInfo(user, user, authToken, rememberMe);
            navigate("/");
        } catch (error) {
            displayErrorMessage(
                `Failed to register user because of exception: ${error}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const inputFieldGenerator = () => {
        return (
            <>
                <div className="form-floating">
                    <input
                        type="text"
                        className="form-control"
                        size={50}
                        id="firstNameInput"
                        placeholder="First Name"
                        onKeyDown={registerOnEnter}
                        onChange={(event) => setFirstName(event.target.value)}
                    />
                    <label htmlFor="firstNameInput">First Name</label>
                </div>
                <div className="form-floating">
                    <input
                        type="text"
                        className="form-control"
                        size={50}
                        id="lastNameInput"
                        placeholder="Last Name"
                        onKeyDown={registerOnEnter}
                        onChange={(event) => setLastName(event.target.value)}
                    />
                    <label htmlFor="lastNameInput">Last Name</label>
                </div>
                <AuthenticationFields
                    onEnter={registerOnEnter}
                    setAlias={setAlias}
                    setPassword={setPassword}
                />
                <div className="form-floating mb-3">
                    <input
                        type="file"
                        className="d-inline-block py-5 px-4 form-control bottom"
                        id="imageFileInput"
                        onKeyDown={registerOnEnter}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="imageFileInput">User Image</label>
                    <img src={imageUrl} className="img-thumbnail" alt=""></img>
                </div>
            </>
        );
    };

    const switchAuthenticationMethodGenerator = () => {
        return (
            <div className="mb-3">
                Already registered? <Link to="/login">Sign in</Link>
            </div>
        );
    };

    return (
        <AuthenticationFormLayout
            headingText="Please Register"
            submitButtonLabel="Register"
            oAuthHeading="Register with:"
            inputFieldGenerator={inputFieldGenerator}
            switchAuthenticationMethodGenerator={
                switchAuthenticationMethodGenerator
            }
            setRememberMe={setRememberMe}
            submitButtonDisabled={checkSubmitButtonStatus}
            isLoading={isLoading}
            submit={doRegister}
        />
    );
};

export default Register;
