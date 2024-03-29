import Home from "@/pages/Home";
import Room from "@/pages/Room";
import socket from "@/socket";
import { User } from "@/types";
import checkConnection from "@/utils/checkConnection";
import { useEffect, useState } from "react";

function App() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        checkConnection(socket);

        const onConnect = () => {
            console.log(socket.id);
        };

        socket.on("connect", onConnect);

        return () => {
            socket.off("connect", onConnect);
            socket.disconnect();
        };
    }, []);

    return user === null ? (
        <Home setUser={setUser} />
    ) : (
        <Room user={user} setUser={setUser} />
    );
}

export default App;
