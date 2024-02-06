import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "./components/layout/Layout";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { initCatalog } from "./store/actions/metadataAction";

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
  const dispatch = useDispatch();
  const initPageData = useCallback(
    (dispatchEvent = dispatch) => {
      dispatchEvent(initCatalog());
    },
    [dispatch]
  );
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
