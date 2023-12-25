import { User } from "@/types";

interface RoomProps {
    user: User;
    setUser: React.Dispatch<
        React.SetStateAction<{
            username: string;
            room: string;
        } | null>
    >;
}
