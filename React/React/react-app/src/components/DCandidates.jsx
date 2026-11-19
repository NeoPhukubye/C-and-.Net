// Import the hooks used for component state and the initial data load.
import { useState, useEffect } from "react";
// Import connect so the table can read the list and dispatch actions.
import { connect } from "react-redux";
// Import the Material UI components used to render the page.
import {
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ButtonGroup,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
// Import the icons used by the edit and delete buttons.
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// Import every candidate action creator as a namespace.
import * as actions from "../actions/dCandidate";
// Import the form that creates and edits records.
import DCandidateForm from "./DCandidateForm";

// Container component that renders the form and the candidate table.
const DCandidates = (props) => {
  // Id of the row being edited; zero means "create a new record".
  const [currentId, setCurrentId] = useState(0);
  // Controls the toast message shown after an operation completes.
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // Tracks the first load so a spinner can be shown instead of an empty table.
  const [loading, setLoading] = useState(true);
  // Pull the fetch thunk out of props so it can be used as an effect dependency.
  const { fetchAllDCandidates } = props;

  // Load all candidates once when the page mounts.
  useEffect(() => {
    let cancelled = false;

    fetchAllDCandidates()
      .catch((error) => {
        if (!cancelled) {
          setToast({ open: true, message: error.message, severity: "error" });
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    // Prevent state updates if the component unmounts mid-request.
    return () => {
      cancelled = true;
    };
  }, [fetchAllDCandidates]);

  // Helper that opens the toast with a message and severity.
  const notify = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  // Ask for confirmation before deleting a record.
  const onDelete = (id) => {
    if (!window.confirm("Are you sure to delete this record?")) {
      return;
    }

    // Delete on the server then confirm with a toast.
    props
      .deleteDCandidate(id, () => notify("Deleted successfully", "info"))
      .catch((error) => notify(error.message, "error"));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Grid container spacing={3}>
        {/* Left side renders the create/edit form. */}
        <Grid size={{ xs: 12, md: 6 }}>
          <DCandidateForm
            currentId={currentId}
            setCurrentId={setCurrentId}
            onNotify={notify}
          />
        </Grid>

        {/* Right side renders the table of saved candidates. */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TableContainer>
            <Table>
              <TableHead
                sx={{
                  "& .MuiTableCell-head": {
                    fontWeight: 600,
                    fontSize: "1.05rem",
                  },
                }}
              >
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Blood Group</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Show a spinner while the initial request is in flight. */}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                )}

                {/* Show a friendly message when there is nothing to list. */}
                {!loading && props.dCandidateList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No candidates yet. Add one using the form.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {/* One row per candidate, keyed by the database id. */}
                {props.dCandidateList.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{record.fullName}</TableCell>
                    <TableCell>{record.mobile}</TableCell>
                    <TableCell>{record.bloodGroup}</TableCell>
                    <TableCell>
                      <ButtonGroup variant="text">
                        {/* Selecting a row puts the form into edit mode. */}
                        <Button
                          aria-label={`Edit ${record.fullName}`}
                          onClick={() => setCurrentId(record.id)}
                        >
                          <EditIcon color="primary" />
                        </Button>
                        {/* Delete asks for confirmation first. */}
                        <Button
                          aria-label={`Delete ${record.fullName}`}
                          onClick={() => onDelete(record.id)}
                        >
                          <DeleteIcon color="error" />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Toast that reports the result of create, update and delete calls. */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

// Read the candidate list from the Redux store.
const mapStateToProps = (state) => ({
  dCandidateList: state.dCandidate.list,
});

// Map the fetch and delete thunks onto component props.
const mapActionToProps = {
  fetchAllDCandidates: actions.fetchAll,
  deleteDCandidate: actions.Delete,
};

// Connect the component to the Redux store.
export default connect(mapStateToProps, mapActionToProps)(DCandidates);
