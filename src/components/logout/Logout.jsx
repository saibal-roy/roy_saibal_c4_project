import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import useAuthentication from "../../hooks/useAuthentication";
import {useContext} from "react";

const Logout = ({sx}) => {

	const {AuthCtx} = useAuthentication();
	const {logout} = useContext(AuthCtx);

	if(sx === null || sx === undefined) {
		sx = {};
	}
	const navigate = useNavigate();

	let performLogout = () => {
		logout().then(() => {
			navigate("/login");
		});
	}

	return (
		<Button sx={sx}
				variant="contained"
				color="secondary"
				onClick={() => performLogout()}>
			LOGOUT
		</Button>
	);
};

export default Logout;