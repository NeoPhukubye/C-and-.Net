import { Provider } from "react-redux";
import { Container, Typography } from "@mui/material";
import { store } from "./actions/store";
import DCandidates from "./components/DCandidates";

function App() {
  return (
    <Provider store={store}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Donation Candidate Management
        </Typography>
        <DCandidates />
      </Container>
    </Provider>
  );
}

export default App;