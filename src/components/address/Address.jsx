import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {useCallback, useContext, useEffect, useState} from "react";
import useAuthentication from "../../hooks/useAuthentication";
import {createAddress, fetchAllAddresses} from "../../api/addressAPIs";
import {FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import useServices from "../../hooks/useServices";

const Address = ({callbackFunction}) => {

	let initialState = {
		name: {
			value: "",
			error: false,
			errorMessage: null,
		},
		contactNumber: {
			value: "",
			error: false,
			errorMessage: null,
		},
		street: {
			value: "",
			error: false,
			errorMessage: null,
		},
		city: {
			value: "",
			error: false,
			errorMessage: null,
		},
		state: {
			value: "",
			error: false,
			errorMessage: null,
		},
		landmark: {
			value: "",
			error: false,
			errorMessage: null,
		},
		zipcode: {
			value: "",
			error: false,
			errorMessage: null,
		},
	};

	const [formData, setFormData] = useState(initialState);
	const [selectedAddress, setSelectedAddress] = useState("");
	const [busy, setBusy] = useState(false);
	const {AuthCtx} = useAuthentication();
	const {loggedInUserId, accessToken} = useContext(AuthCtx);
	const [addressList, setAddressList] = useState([]);
	const {ServicesCtx} = useServices();
	const {broadcastMessage} = useContext(ServicesCtx);

	let validateData = () => {
		setBusy(true);
		let data = {
			...formData
		};
		let requestJson = {
			user: loggedInUserId,
		};
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
			createAddress(requestJson, accessToken).then(() => {
				broadcastMessage("Address saved successfully.", "success");
				setBusy(false);
				setFormData(initialState);
				initDropdown();
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
			if(field !== "landmark") {
				valid = false;
				message = "This field is required.";
			}
		} else {
			switch (field) {
				case "name": {
					valid = matchRegex(value, "^([A-Za-z\\s]+)$");
					message = "Please enter valid name.";
					break;
				}
				case "contactNumber": {
					valid = matchRegex(value, "^([7-9]{1}[0-9]{9})$");
					message = "Please enter valid contact number.";
					break;
				}
				case "street": {
					valid = matchRegex(value, "^([A-Za-z0-9,/\\s\\-_@]+)$");
					message = "Please enter valid street.";
					break;
				}
				case "city": {
					valid = matchRegex(value, "^([A-Za-z]+)$");
					message = "Please enter valid city.";
					break;
				}
				case "state": {
					valid = matchRegex(value, "^([A-Za-z\\s]+)$");
					message = "Please enter valid state.";
					break;
				}
				case "landmark": {
					valid = matchRegex(value, "^([A-Za-z0-9,/\\s\\-_@]+)$");
					message = "Please enter valid landmark.";
					break;
				}
				case "zipcode": {
					valid = matchRegex(value, "^([1-9]{1}[0-9]{5})$");
					message = "Please enter valid zip code.";
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

	const handleChange = (event) => {
		setSelectedAddress(event.target.value);
		for(let i = 0; i < addressList.length; i++) {
			if(addressList[i].id === event.target.value) {
				callbackFunction(addressList[i]);
				return;
			}
		}
		callbackFunction(null);
	};

	const initDropdown = useCallback(() => {
		fetchAllAddresses(accessToken).then((json) => {
			setAddressList(json.data);
		}).catch(() => {
			setAddressList([]);
		});
	}, [accessToken]);

	useEffect(() => {
		initDropdown();
	}, [initDropdown]);

	return (
		<Box sx={{flexGrow: 1}}>
			<Grid container spacing={1}>
				<Grid container item spacing={3}>
					<Grid item xs={12}>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<FormControl sx={{ m: 1, width: "60%" }}>
								<InputLabel id="demo-simple-select-label">Select Address</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={selectedAddress}
									label="Select Address"
									onChange={handleChange}
								>
									{
										(addressList === null || addressList.length === 0) &&
										<MenuItem disabled value="">
											No address saved
										</MenuItem>
									}
									{
										addressList !== null && addressList.length > 0 &&
										addressList.map((element, index) => {
											return (
												<MenuItem
													key={"sortBy_" + index}
													value={element.id}
												>
													{element.name + " " + element.zipcode}
												</MenuItem>
											);
										})
									}
								</Select>
							</FormControl>
						</div>
					</Grid>
					<Grid item xs={12}>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<Typography
								variant="subtitle1"
								noWrap
								sx={{
									fontSize: "15px",
									color: 'inherit',
								}}
							>
								OR
							</Typography>
						</div>
					</Grid>
				</Grid>
				<Grid container item spacing={3}>
					<Grid item xs={4}/>
					<Grid item xs={4}>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<Typography
								variant="subtitle1"
								noWrap
								sx={{
									fontSize: "25px",
									color: 'inherit',
								}}
							>
								Add Address
							</Typography>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField id="name"
									   label="Name *"
									   variant="outlined"
									   fullWidth
									   value={formData.name.value}
									   onChange={(event) => saveOnChange("name", event.target.value)}
									   onBlur={(event) => validateAndSave("name", event.target.value)}
									   error={formData.name.error}
									   helperText={formData.name.error && formData.name.errorMessage}
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
							<TextField id="street"
									   label="Street *"
									   variant="outlined"
									   fullWidth
									   value={formData.street.value}
									   onChange={(event) => saveOnChange("street", event.target.value)}
									   onBlur={(event) => validateAndSave("street", event.target.value)}
									   error={formData.street.error}
									   helperText={formData.street.error && formData.street.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField id="city"
									   label="City *"
									   variant="outlined"
									   fullWidth
									   value={formData.city.value}
									   onChange={(event) => saveOnChange("city", event.target.value)}
									   onBlur={(event) => validateAndSave("city", event.target.value)}
									   error={formData.city.error}
									   helperText={formData.city.error && formData.city.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField id="state"
									   label="State *"
									   variant="outlined"
									   fullWidth
									   value={formData.state.value}
									   onChange={(event) => saveOnChange("state", event.target.value)}
									   onBlur={(event) => validateAndSave("state", event.target.value)}
									   error={formData.state.error}
									   helperText={formData.state.error && formData.state.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField id="landmark"
									   label="Landmark"
									   variant="outlined"
									   fullWidth
									   value={formData.landmark.value}
									   onChange={(event) => saveOnChange("landmark", event.target.value)}
									   onBlur={(event) => validateAndSave("landmark", event.target.value)}
									   error={formData.landmark.error}
									   helperText={formData.landmark.error && formData.landmark.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField id="zipcode"
									   label="Zip Code *"
									   variant="outlined"
									   fullWidth
									   value={formData.zipcode.value}
									   onChange={(event) => saveOnChange("zipcode", event.target.value)}
									   onBlur={(event) => validateAndSave("zipcode", event.target.value)}
									   error={formData.zipcode.error}
									   helperText={formData.zipcode.error && formData.zipcode.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<Button variant="contained"
									color="primary"
									fullWidth
									onClick={validateData}
							>
								SAVE ADDRESS
							</Button>
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
};

export default Address;