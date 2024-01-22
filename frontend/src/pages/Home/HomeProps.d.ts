interface HomeProps {
    setUser: React.Dispatch<
        React.SetStateAction<{
            username: string;
            room: string;
        } | null>
    >;
}
