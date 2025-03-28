import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { OverlayTrigger, Tooltip } from "react-bootstrap";



// button
interface ButtonProps {
    icon: string;
    tooltip: string;
    message: string;
    displayInfoMessageWithDarkBackground: (message: string) => void;
}

const Button = ({ icon, tooltip, message, displayInfoMessageWithDarkBackground }: ButtonProps) => {
    return (
        <button
            type="button"
            className="btn btn-link btn-floating mx-1"
            onClick={() => displayInfoMessageWithDarkBackground(message)}
        >
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`${icon}Tooltip`}>{tooltip}</Tooltip>}
            >
                <FontAwesomeIcon icon={["fab", getIconName(icon)]} />
            </OverlayTrigger>
        </button>
    );
};



// not button

interface Props {
    displayInfoMessageWithDarkBackground: (message: string) => void;

}

const OAuth = (props: Props) => {
    const buttons = [
        { icon: "google", tooltip: "Google", message: "Google registration is not implemented." },
        { icon: "facebook", tooltip: "Facebook", message: "Facebook registration is not implemented." },
        { icon: "twitter", tooltip: "Twitter", message: "Twitter registration is not implemented." },
        { icon: "linkedin", tooltip: "LinkedIn", message: "LinkedIn registration is not implemented." },
        { icon: "github", tooltip: "GitHub", message: "GitHub registration is not implemented." },
    ];
    return (
        <div className="text-center mb-3">
            {buttons.map((button, index) => (
                <Button
                    key={index}
                    icon={button.icon}
                    tooltip={button.tooltip}
                    message={button.message}
                    displayInfoMessageWithDarkBackground={props.displayInfoMessageWithDarkBackground}
                />
            ))}

        </div>

    );
};

// converting a string to an icon name, even thought they're the same thing?
const getIconName = (icon: string): IconName => {
    const iconMap: { [key: string]: IconName } = {
        google: 'google',
        facebook: 'facebook',
        twitter: 'twitter',
        linkedin: 'linkedin',
        github: 'github',
    };

    return iconMap[icon] || 'google';  // default to google
};

export default OAuth;