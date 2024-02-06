import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Link, Navigate} from "react-router-dom";
import {useContext, useState} from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {doSignup} from "../../api/userAuthAPIs";
import useAuthentication from "../../hooks/useAuthentication";
import useServices from "../../hooks/useServices";

const SignUp = () => {

	let initialState = {
		firstName: {
			value: "",
			error: false,
			errorMessage: null,
		},
		lastName: {
			value: "",
			error: false,
			errorMessage: null,
		},
		email: {
			value: "",
			error: false,
			errorMessage: null,
		},
		password: {
			value: "",
			error: false,
			errorMessage: "Please enter valid password.",
		},
		confirmPassword: {
			value: "",
			error: false,
			errorMessage: null,
		},
		contactNumber: {
			value: "",
			error: false,
			errorMessage: null,
		},
	};

	const [formData, setFormData] = useState(initialState);
	const [busy, setBusy] = useState(false);
	const {ServicesCtx} = useServices();
	const {broadcastMessage} = useContext(ServicesCtx);
	const {AuthCtx} = useAuthentication();
	const {loggedInUser} = useContext(AuthCtx);

	let validateData = () => {
		setBusy(true);
		let data = {
			...formData
		};
		let requestJson = {};
		let valid = true;
		for(let k in formData) {
			let json = getValidity(k, formData[k].value);
			data[k] = {
				value: data[k].value,
				error: !json.valid,
				errorMessage: json.message,
			};
			valid = valid && json.valid;
			if(json.valid) {
				requestJson[k] = data[k].value;
			}
		}
		setFormData(data);
		if(valid) {
			doSignup(requestJson).then(json => {
				broadcastMessage(json.message, "success");
				setBusy(false);
				setFormData(initialState);
			}).catch(json => {
				broadcastMessage(json.reason, "error");
				setBusy(false);
			});
		} else {
			setBusy(false);
		}
	};

	let matchRegex = (value, re) => {
		let regex = new RegExp(re);
		return regex.test(value);
	}

	let getValidity = (field, value) => {
		let valid = true;
		let message = null;
		if(value == null || value.length === 0) {
			valid = false;
			message = "This field is required.";
		} else {
			switch (field) {
				case "firstName": {
					valid = matchRegex(value, "^([A-Za-z]+)$");
					message = "Please enter valid first name.";
					break;
				}
				case "lastName": {
					valid = matchRegex(value, "^([A-Za-z]+)$");
					message = "Please enter valid last name.";
					break;
				}
				case "email": {
					valid = matchRegex(value, "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$");
					message = "Please enter valid email address.";
					break;
				}
				case "password": {
					if (value.length < 6 || 40 < value.length) {
						valid = false;
						message = "Password's length must be between 6 and 40."
					} else {
						valid = matchRegex(value, "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,40}$");
						message = "Password must contain at least a symbol (!@#$%^&*), upper and lower case letters and a number.";
					}
					break;
				}
				case "confirmPassword": {
					valid = (value.length > 0 && value === formData.password.value);
					message = "Passwords do not match.";
					break;
				}
				case "contactNumber": {
					valid = matchRegex(value, "^([7-9]{1}[0-9]{9})$");
					message = "Please enter valid contact number.";
					break;
				}
				default : {
					return;
				}
			}
		}
		return {
			valid,
			message
		};
	};

	let validateAndSave = (field, value) => {
		let json = getValidity(field, value);
		let data = {
			...formData
		};
		data[field] = {
			value: data[field].value,
			error: !json.valid,
			errorMessage: json.message,
		}
		setFormData(data);
	};

	let saveOnChange = (field, value) => {
		setFormData({
			...formData,
			[field]:{
				...formData[field],
				value
			}
		});
	};

	if(loggedInUser === null) {
		return (
			<Box sx={{flexGrow: 1}}>
				<Grid container spacing={1}>
					<Grid container item spacing={3}>
						<Grid item xs={4}/>
						<Grid item xs={4}>
							<div style={{display: 'flex', justifyContent: 'center', marginTop: "10%"}}>
								<LockOutlinedIcon style={{
									display: 'inline-block',
									borderRadius: '60px',
									padding: '0.6em 0.6em',
									color: '#ffffff',
									background: "#f50057"
								}}/>
							</div>
							<div style={{display: 'flex', justifyContent: 'center'}}>
								<Typography
									variant="subtitle1"
									noWrap
									sx={{
										fontSize: "25px",
										color: 'inherit',
									}}
								>
									Sign up
								</Typography>
							</div>
							<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
								<TextField id="firstName"
										   label="First Name *"
										   variant="outlined"
										   fullWidth
										   value={formData.firstName.value}
										   onChange={(event) => saveOnChange("firstName", event.target.value)}
										   onBlur={(event) => validateAndSave("firstName", event.target.value)}
										   error={formData.firstName.error}
										   helperText={formData.firstName.error && formData.firstName.errorMessage}
								/>
							</div>
							<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
								<TextField id="lastName"
										   label="Last Name *"
										   variant="outlined"
										   fullWidth
										   value={formData.lastName.value}
										   onChange={(event) => saveOnChange("lastName", event.target.value)}
										   onBlur={(event) => validateAndSave("lastName", event.target.value)}
										   error={formData.lastName.error}
										   helperText={formData.lastName.error && formData.lastName.errorMessage}
								/>
							</div>
							<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
								<TextField id="email"
										   label="Email Address *"
										   variant="outlined"
										   fullWidth
										   type="email"
										   value={formData.email.value}
										   onChange={(event) => saveOnChange("email", event.target.value)}
										   onBlur={(event) => validateAndSave("email", event.target.value)}
										   error={formData.email.error}
										   helperText={formData.email.error && formData.email.errorMessage}
								/>
							</div>
							<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
								<TextField id="password"
										   label="Password *"
										   variant="outlined"
										   fullWidth
										   type="password"
										   value={formData.password.value}
										   onChange={(event) => saveOnChange("password", event.target.value)}
										   onBlur={(event) => validateAndSave("password", event.target.value)}
										   error={formData.password.error}
										   helperText={formData.password.error && formData.password.errorMessage}
								/>
							</div>
							<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
								<TextField id="confirmPassword"
										   label="Confirm Password *"
										   variant="outlined"
										   fullWidth
										   type="password"
										   value={formData.confirmPassword.value}
										   onChange={(event) => saveOnChange("confirmPassword", event.target.value)}
										   onBlur={(event) => validateAndSave("confirmPassword", event.target.value)}
										   error={formData.confirmPassword.error}
										   helperText={formData.confirmPassword.error && formData.confirmPassword.errorMessage}
								/>
							</div>
							<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
								<TextField id="contactNumber"
										   label="Contact Number *"
										   variant="outlined"
										   fullWidth
										   value={formData.contactNumber.value}
										   onChange={(event) => saveOnChange("contactNumber", event.target.value)}
										   onBlur={(event) => validateAndSave("contactNumber", event.target.value)}
										   error={formData.contactNumber.error}
										   helperText={formData.contactNumber.error && formData.contactNumber.errorMessage}
								/>
							</div>
							<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
								<Button variant="contained"
										color="primary"
										fullWidth
										onClick={validateData}
								>
									SIGN UP
								</Button>
							</div>
							<div style={{display: 'flex', justifyContent: 'right', marginTop: "30px"}}>
								<Link to="/login">
									<Typography variant="body1">
										Already have an account? Sign in
									</Typography>
								</Link>
							</div>
						</Grid>
						<Grid item xs={4}/>
					</Grid>
				</Grid>
				<Backdrop
					sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
					open={busy}
				>
					<CircularProgress color="inherit"/>
				</Backdrop>
			</Box>
		);
	} else {
		return (
			<Navigate to="/home"/>
		);
	}
};

export default SignUp;