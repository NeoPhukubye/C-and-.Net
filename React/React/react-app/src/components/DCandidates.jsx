import { useState, useEffect } from "react";
import { connect } from "react-redux";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as actions from "../actions/dCandidate";
import DCandidateForm from "./DCandidateForm";

const DCandidates = (props) => {
  const [currentId, setCurrentId] = useState(0);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    props.fetchAllDCandidates();
  }, []);

  const notify = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const onDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      props.deleteDCandidate(id, () => notify("Deleted successfully", "info"));
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DCandidateForm
            currentId={currentId}
            setCurrentId={setCurrentId}
            onNotify={notify}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ "& .MuiTableCell-head": { fontWeight: 600, fontSize: "1.05rem" } }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Blood Group</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.dCandidateList.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{record.fullName}</TableCell>
                    <TableCell>{record.mobile}</TableCell>
                    <TableCell>{record.bloodGroup}</TableCell>
                    <TableCell>
                      <ButtonGroup variant="text">
                        <Button onClick={() => setCurrentId(record.id)}>
                          <EditIcon color="primary" />
                        </Button>
                        <Button onClick={() => onDelete(record.id)}>
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

const mapStateToProps = (state) => ({
  dCandidateList: state.dCandidate.list,
});

const mapActionToProps = {
  fetchAllDCandidates: actions.fetchAll,
  deleteDCandidate: actions.Delete,
};

export default connect(mapStateToProps, mapActionToProps)(DCandidates);