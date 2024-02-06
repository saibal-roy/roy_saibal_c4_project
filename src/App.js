import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "./components/layout/Layout";
import { useDispatch } from "react-redux";
import { useCallback, useContext, useEffect } from "react";
import { initCatalog } from "./store/actions/metadataAction";
import useAuthentication from "./hooks/useAuthentication";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    disabled: {
      main: "#56595c",
    },
  },
});

function App() {
  const { AuthCtx } = useAuthentication();
  const { accessToken } = useContext(AuthCtx);
  const dispatch = useDispatch();

  const initPageData = useCallback(() => {
    dispatch(initCatalog(accessToken));
  }, [dispatch, accessToken]);

  useEffect(() => {
    initPageData();
  }, [initPageData]);

  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
}

export default App;
