// Import the Redux provider so connected components can reach the store.
import { Provider } from "react-redux";
// Import the Material UI theme helpers and layout components.
import {
  Container,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
// Import the configured Redux store.
import { store } from "./actions/store";
// Import the page that lists and edits candidates.
import DCandidates from "./components/DCandidates";

// Build a small Material UI theme with a blood-red primary colour.
const theme = createTheme({
  palette: {
    // Use a red palette to match the donation theme.
    primary: { main: "#b71c1c" },
    // A neutral page background keeps the table readable.
    background: { default: "#fafafa" },
  },
  // Slightly round the corners of cards, buttons and inputs.
  shape: { borderRadius: 8 },
});

// Root component that wires the theme, layout and store together.
function App() {
  return (
    // Provide the theme to every Material UI component below.
    <ThemeProvider theme={theme}>
      {/* Normalise browser styles before rendering the app. */}
      <CssBaseline />
      {/* Provide the Redux store to connected components. */}
      <Provider store={store}>
        {/* Top navigation bar with the application title. */}
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div">
              Donation Candidate Management
            </Typography>
          </Toolbar>
        </AppBar>
        {/* Centred content area that holds the form and table. */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <DCandidates />
        </Container>
      </Provider>
    </ThemeProvider>
  );
}

// Export the component so main.jsx can render it.
export default App;
