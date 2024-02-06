import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {ShoppingCart} from "@mui/icons-material";
import {useContext, useState} from "react";
import AppBarSearch from "../appBarSearch/AppBarSearch";
import {BrowserRouter as Router, Link, Navigate, Route, Routes} from "react-router-dom";
import Grid from '@mui/material/Grid';
import Home from "../home/Home";
import Login from "../login/Login";
import SignUp from "../signup/SignUp";
import Footer from "../footer/Footer";
import ErrorPage from "../errorPage/ErrorPage";
import Logout from "../logout/Logout";
import useAuthentication from "../../hooks/useAuthentication";
import ProtectedRoute from "../protectedRoute/ProtectedRoute";
import ProductPage from "../productPage/ProductPage";
import {createProduct, modifyProduct} from "../../api/productAPIs";
import ProductDetails from "../productDetails/ProductDetails";
import PlaceOrder from "../placeOrder/PlaceOrder";
import BroadcastMessage from "../broadcastMessage/BroadcastMessage";

const Layout = () => {
	const [anchorElNav, setAnchorElNav] = useState(null);
	const {AuthCtx} = useAuthentication();
	const {loggedInUser, hasRole} = useContext(AuthCtx);

	const pages = [
		{
			id: "1",
			label: "Home",
			url: "/home",
			visible: loggedInUser != null,
		},
		{
			id: "2",
			label: "Add Product",
			url: "/product/add",
			visible: loggedInUser != null && hasRole(["ADMIN"]),
		},
		{
			id: "3",
			label: "Login",
			url: "/login",
			visible: loggedInUser == null,
		},
		{
			id: "4",
			label: "Sign Up",
			url: "/signup",
			visible: loggedInUser == null,
		},
	];

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	return (
		<Router>
			<AppBar sx={{ bgcolor: "#3f51b5", position: 'fixed' }}>
				<Container maxWidth={false}>
					<Toolbar disableGutters>
						<ShoppingCart sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
						<Typography
							variant="h6"
							noWrap
							component="a"
							href="/home"
							sx={{
								mr: 2,
								display: { xs: 'none', md: 'flex' },
								fontFamily: 'monospace',
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							upGrad E-Shop
						</Typography>

						<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleOpenNavMenu}
								color="inherit"
							>
								<MenuIcon />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'left',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'left',
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: 'block', md: 'none' },
								}}
							>
								{pages.map((element) => {
									if (element.visible) {
										return (
											<MenuItem key={"menu_item_" + element.id} onClick={handleCloseNavMenu}>
												<Link key={"link_" + element.id} to={element.url} style={{textDecoration: "none"}}>
													<Typography textAlign="center">{element.label}</Typography>
												</Link>
											</MenuItem>
										);
									}
									return null;
								})}
								{
									loggedInUser != null &&
									<MenuItem key="5" onClick={handleCloseNavMenu}>
										<Logout />
									</MenuItem>
								}
							</Menu>
						</Box>

						<ShoppingCart sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
						<Typography
							variant="h6"
							noWrap
							component="a"
							href=""
							sx={{
								mr: 2,
								display: { xs: 'flex', md: 'none' },
								flexGrow: 1,
								fontFamily: 'monospace',
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							upGrad E-Shop
						</Typography>

						<Box sx={{ flexGrow: 1 }} />

						{loggedInUser != null && <AppBarSearch />}

						<Box sx={{ flexGrow: 1 }} />
						<Box sx={{ display: { xs: 'none', md: 'flex' } }}>
							{pages.map((element) => {
								if (element.visible) {
									return (
										<Link key={"main_link_" + element.id} to={element.url} style={{ textDecoration: "none" }}>
											<Button
												key={"button_link_" + element.id}
												sx={{ my: 2, color: 'white', display: 'block', textTransform: "none" }}
											>
												<u>{element.label}</u>
											</Button>
										</Link>
									);
								}
								return null;
							})}
							{
								loggedInUser != null &&
								<Logout sx={{ my: 2, ml: 2, color: 'white', display: 'block' }}/>
							}
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
			<Container maxWidth={false} sx={{marginBottom: "30px", marginTop: "85px"}}>
				<Grid container spacing={2} sx={{paddingTop: "24px"}}>
					<Routes>
						<Route
							path="/"
							element={
								<Navigate to="/home" />
							}
						/>
						<Route
							path="/home"
							element={
								<ProtectedRoute>
									<Home/>
								</ProtectedRoute>
							}
						/>
						<Route
							path="/login"
							element={
								<Login/>
							}
						/>
						<Route
							path="/signup"
							element={
								<SignUp/>
							}
						/>
						<Route
							path="/product/add"
							element={
								<ProtectedRoute role={["ADMIN"]}>
									<ProductPage
										mode={"CREATE"}
										buttonText="SAVE PRODUCT"
										headingText="Add Product"
										callbackFunction={createProduct}
									/>
								</ProtectedRoute>
							}
						/>
						<Route
							path="/product/modify"
							element={
								<ProtectedRoute role={["ADMIN"]}>
									<ProductPage
										mode={"MODIFY"}
										buttonText="MODIFY PRODUCT"
										headingText="Modify Product"
										callbackFunction={modifyProduct}
									/>
								</ProtectedRoute>
							}
						/>
						<Route
							path="/product/view"
							element={
								<ProtectedRoute >
									<ProductDetails	/>
								</ProtectedRoute>
							}
						/>
						<Route
							path="/product/order"
							element={
								<ProtectedRoute >
									<PlaceOrder	/>
								</ProtectedRoute>
							}
						/>
						<Route
							path="*"
							element={
								<ErrorPage />
							}
						/>
					</Routes>
				</Grid>
			</Container>
			<Footer />
			<BroadcastMessage />
		</Router>
	);
};

export default Layout;