import { User } from "../../../types";

interface InputMessageProps {
    user: User;
    setMessages: React.Dispatch<
        React.SetStateAction<Record<string, React.ReactNode>>
    >;
}
