import useToastListener from "../toaster/ToastListenerHook";
import { AuthToken, User } from "tweeter-shared";
import { FakeData } from "tweeter-shared";
import useUserInfoHook from "./userInfoHook"

const useUserNavigationHook = () => {
    const {setDisplayedUser, currentUser, authToken} = useUserInfoHook();
    const {displayErrorMessage} = useToastListener();

    const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };

    const getUser = async (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();

        try {
            const alias = extractAlias(event.target.toString());

            const user = await getUser(authToken!, alias);

            if (!!user) {
                if (currentUser!.equals(user)) {
                    setDisplayedUser(currentUser!);
                } else {
                    setDisplayedUser(user);
                }
            }
        } catch (error) {
            displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
    };

    return { navigateToUser };
}

export default useUserNavigationHook;