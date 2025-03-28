import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { AuthPresenter } from "./AuthPresenter";
import { Buffer } from "buffer";
import { View } from "./Presenter";

export class RegisterPresenter extends AuthPresenter {
    private userService: UserService;

    private _imageBytes: Uint8Array = new Uint8Array();
    private _imageUrl: string = "";
    private _imageFileExtension: string = "";

    public constructor(view: View) {
        super(view);
        this.userService = new UserService();
    }

    private set imageBytes(value: Uint8Array) {
        this._imageBytes = value;
    }

    private set imageUrl(value: string) {
        this._imageUrl = value;
    }

    private set imageFileExtension(value: string) {
        this._imageFileExtension = value;
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        return this.userService.serverRegister(
            firstName,
            lastName,
            alias,
            password,
            userImageBytes,
            imageFileExtension
        );
    }

    public handleImageFile = (file: File | undefined) => {
        if (file) {
            this.imageUrl = URL.createObjectURL(file);

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                // Remove unnecessary file metadata from the start of the string.
                const imageStringBase64BufferContents =
                    imageStringBase64.split("base64,")[1];

                const bytes: Uint8Array = Buffer.from(
                    imageStringBase64BufferContents,
                    "base64"
                );

                this.imageBytes = bytes;
            };
            reader.readAsDataURL(file);

            // Set image file extension (and move to a separate method)
            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
                this.imageFileExtension = fileExtension;
            }
        } else {
            this.imageUrl = "";
            this.imageBytes = new Uint8Array();
        }
    };

    private getFileExtension = (file: File): string | undefined => {
        return file.name.split(".").pop();
    };
}
