import { Sheet, styled } from "@mui/joy";

const FormContainer = styled(Sheet)(({ theme }) => ({
    backgroundColor: theme.palette.background.body,
    [theme.breakpoints.up("xs")]: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        gap: theme.spacing(4),
    },
    [theme.breakpoints.up("sm")]: {
        width: "auto",
        height: "auto",
        padding: theme.spacing(4),
        boxShadow: theme.shadow.sm,
    },
}));

export default FormContainer;
