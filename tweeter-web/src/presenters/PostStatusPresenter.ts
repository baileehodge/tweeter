import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
    setIsLoading: (value: boolean) => void;
    setPost: (value: string) => void;
    post: string;
    currentUser: User | null
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private _statusService: StatusService | null = null;

    public constructor(view: PostStatusView) {
        super(view);
    }

    public get statusService() {
        if(this._statusService == null) {
            this._statusService = new StatusService();
        }
        return this._statusService;
    }

    public async submitPost (authToken: AuthToken | null, post: string) {
        await this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);
            this.view.displayInfoMessage("Posting status...", 0);

            const status = new Status(post, this.view.currentUser!, Date.now());

            await this.statusService.postStatus(authToken!, status);
            
            this.view.setPost(post);
            this.view.displayInfoMessage("Status posted!", 2000);
            this.view.clearLastInfoMessage();
        }, "post status");

            this.view.setIsLoading(false);
        }
    };

