import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {Step, StepLabel, Stepper} from "@mui/material";
import {useCallback, useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useAuthentication from "../../hooks/useAuthentication";
import Address from "../address/Address";
import Button from "@mui/material/Button";
import OrderDetails from "../orderDetails/OrderDetails";
import {createOrder} from "../../api/orderAPIs";
import useServices from "../../hooks/useServices";

const PlaceOrder = () => {

	const {ServicesCtx} = useServices();
	const {broadcastMessage} = useContext(ServicesCtx);
	const [activeStep, setActiveStep] = useState(1);
	const {AuthCtx} = useAuthentication();
	const {loggedInUserId, accessToken} = useContext(AuthCtx);
	const navigate = useNavigate();
	const location = useLocation();
	let json = location.state;
	if(json === null || json === undefined) {
		json = null;
	} else {
		json = JSON.parse(json);
		if(json === null || json === undefined ||
		json["product"]["id"] === undefined || json["product"]["id"] === null ||
		json["quantity"] === undefined || json["quantity"] === null) {
			json = null;
		}
	}
	const initPageData = useCallback((data = json, redirect = navigate, showMessage = broadcastMessage) => {
		if(data === null) {
			showMessage("Invalid access. Redirecting to home...", "warning");
			redirect("/home");
		}
	}, [json, navigate, broadcastMessage]);
	useEffect(() => {
		initPageData();
	}, [initPageData]);

	const [orderDetails, setOrderDetails] = useState({
		quantity: (json !== null) ? (json.quantity || null) : null,
		user: loggedInUserId,
		product: (json !== null) ? (json.product.id || null) : null,
		address: null,
		addressObject : null
	});

	let stepperArray = [
		{
			labelOrder: 1,
			label: "Items",
			completed: true,
		},
		{
			labelOrder: 2,
			label: "Select Address",
			completed: false,
		},
		{
			labelOrder: 3,
			label: "Confirm Order",
			completed: false,
		},
	];

	const [stepsForOrdering, setStepsForOrdering] = useState(stepperArray);

	let saveAddressForDelivery = (obj) => {
		setOrderDetails({
			...orderDetails,
			address: (obj !== null) ? obj.id : null,
			addressObject: obj,
		});
	};

	let moveToPreviousStep = () => {
		if(activeStep === 1) {
			navigate("/product/view", {
				state: JSON.stringify({
					value: json.product,
				})
			});
		} else {
			let arr = [];
			for(let i = 0; i < stepsForOrdering.length; i++) {
				if(i === activeStep - 1) {
					arr.push({
						...stepsForOrdering[activeStep - 1],
						completed: false,
					});
				} else {
					arr.push(stepsForOrdering[i]);
				}
			}
			setStepsForOrdering(arr);
			setActiveStep(activeStep - 1);
		}
	};

	let validateAndMoveToNextStep = () => {
		if(activeStep === 1) {
			if(orderDetails.address === undefined || orderDetails.address === null) {

			} else {
				let arr = [];
				for(let i = 0; i < stepsForOrdering.length; i++) {
					if(i === activeStep) {
						arr.push({
							...stepsForOrdering[activeStep],
							completed: true,
						});
					} else {
						arr.push(stepsForOrdering[i]);
					}
				}
				setStepsForOrdering(arr);
				setActiveStep(activeStep + 1);
			}
		}
	};

	let confirmAndPlaceOrder = () => {
		createOrder(orderDetails, accessToken).then(() => {
			broadcastMessage("Order placed successfully!", "success");
			navigate("/home");
		}).catch(() => {
			broadcastMessage("Please select address!", "error");
		});
	};

	return (
		<Box sx={{flexGrow: 1}}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Stepper 
							activeStep={activeStep}
							sx={{width: "80%"}}
						>
							{
								stepsForOrdering !== null && stepsForOrdering.length > 0 &&
								stepsForOrdering.map((element, index) => {
									return (
										<Step
											key={"step_" + index}
											active={index === activeStep}
											index={index}
											last={(index === 2)}
											completed={element.completed}
										>
											<StepLabel>
												{element.label}
											</StepLabel>
										</Step>
									);
								})
							}
						</Stepper>
					</div>
				</Grid>
				{
					activeStep === 1 &&
					<Grid item xs={12}>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<Address
								callbackFunction={saveAddressForDelivery}
							/>
						</div>
					</Grid>
				}
				{
					activeStep === 2 &&
					<Grid item xs={12}>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<OrderDetails
								quantity={orderDetails.quantity}
								product={json.product}
								address={orderDetails.addressObject}
							/>
						</div>
					</Grid>
				}
				<Grid item xs={12}>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Button variant="text"
								color="disabled"
								onClick={() => moveToPreviousStep()}
						>
							BACK
						</Button>
						{
							activeStep === 1 &&
							<Button variant="contained"
									color="primary"
									onClick={() => validateAndMoveToNextStep()}
									sx={{}}
							>
								NEXT
							</Button>
						}
						{
							activeStep === 2 &&
							<Button variant="contained"
									color="primary"
									onClick={() => confirmAndPlaceOrder()}
							>
								PLACE ORDER
							</Button>
						}
					</div>
				</Grid>
			</Grid>
		</Box>
	);
};

export default PlaceOrder;