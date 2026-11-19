// Import the useEffect hook so the form can react when a table row is selected.
import { useEffect } from "react";
// Import the Material UI building blocks used for layout and inputs.
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormHelperText,
  Stack,
} from "@mui/material";
// Import connect so the component receives store data and can dispatch actions.
import { connect } from "react-redux";
// Import the reusable hook that owns the form values and errors.
import useForm from "./useForm";
// Import the candidate action creators and the shared email regex.
import * as actions from "../actions/dCandidate";
import { EMAIL_PATTERN } from "../actions/dCandidate";

// Blank values used when creating a new candidate or after a reset.
const initialFieldValues = {
  fullName: "",
  mobile: "",
  email: "",
  age: "",
  bloodGroup: "",
  address: "",
};

// Form component that creates and edits a single donation candidate.
const DCandidateForm = ({ onNotify, ...props }) => {
  // Create the form state without automatic validation.
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useForm(initialFieldValues, null, props.setCurrentId);

  // Validate either the supplied fields or the whole form when called with no argument.
  const validate = (fieldValues = values) => {
    // Copy the existing errors so untouched fields keep their state.
    const temp = { ...errors };

    // A name is required and may not be only whitespace.
    if ("fullName" in fieldValues) {
      temp.fullName = fieldValues.fullName?.trim()
        ? ""
        : "This field is required.";
    }
    // A mobile number is required and may not be only whitespace.
    if ("mobile" in fieldValues) {
      temp.mobile = fieldValues.mobile?.trim()
        ? ""
        : "This field is required.";
    }
    // A blood group must be selected from the dropdown.
    if ("bloodGroup" in fieldValues) {
      temp.bloodGroup = fieldValues.bloodGroup
        ? ""
        : "This field is required.";
    }
    // Email is required and must look like an address.
    if ("email" in fieldValues) {
      const email = fieldValues.email?.trim() ?? "";
      temp.email = !email
        ? "This field is required."
        : EMAIL_PATTERN.test(email)
          ? ""
          : "Email is not valid.";
    }
    // Age is required and must stay inside the range the API accepts.
    if ("age" in fieldValues) {
      const age = Number(fieldValues.age);
      temp.age = !fieldValues.age
        ? "This field is required."
        : Number.isInteger(age) && age >= 1 && age <= 120
          ? ""
          : "Age must be a whole number between 1 and 120.";
    }

    // Store the recalculated errors so the inputs can show them.
    setErrors({ ...temp });

    // Full-form validation only reports true when every field is valid.
    if (fieldValues === values) {
      return Object.values(temp).every((value) => value === "");
    }
    return false;
  };

  // Update a field in state and validate just that field.
  const onChange = (event) => {
    handleInputChange(event);
    validate({ [event.target.name]: event.target.value });
  };

  // The form edits an existing record when an id has been selected.
  const isEditing = props.currentId !== 0;

  // Submit either creates a new candidate or updates the selected one.
  const handleSubmit = (event) => {
    event.preventDefault();

    // Stop here when client-side validation fails.
    if (!validate()) {
      return;
    }

    // Clear the form and show a confirmation after a successful save.
    const onSuccess = () => {
      resetForm();
      onNotify(isEditing ? "Updated successfully" : "Created successfully");
    };

    // Pick the correct thunk and keep the returned promise for error handling.
    const request = isEditing
      ? props.updateDCandidate(props.currentId, values, onSuccess)
      : props.createDCandidate(values, onSuccess);

    // Surface API validation or network problems as an error toast.
    request.catch((error) => onNotify(error.message, "error"));
  };

  // Load the selected record into the form whenever the id changes.
  useEffect(() => {
    // Nothing to load when the form is in "create" mode.
    if (props.currentId === 0) {
      return;
    }

    // Find the record that matches the selected id.
    const selected = props.dCandidateList.find(
      (record) => record.id === props.currentId
    );

    // Guard against ids that are no longer in the list.
    if (!selected) {
      return;
    }

    // Copy the record into the form and clear stale validation errors.
    setValues({ ...selected });
    setErrors({});
  }, [props.currentId, props.dCandidateList, setValues, setErrors]);

  return (
    // Disable native browser validation so Material UI messages are used.
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Left column holds the identity fields. */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack spacing={2}>
            <TextField
              name="fullName"
              variant="outlined"
              label="Full Name"
              value={values.fullName}
              onChange={onChange}
              // Only pass error props when a message exists.
              {...(errors.fullName && {
                error: true,
                helperText: errors.fullName,
              })}
            />
            <TextField
              name="email"
              variant="outlined"
              label="Email"
              type="email"
              value={values.email}
              onChange={onChange}
              {...(errors.email && { error: true, helperText: errors.email })}
            />
            <FormControl variant="outlined" error={Boolean(errors.bloodGroup)}>
              <InputLabel>Blood Group</InputLabel>
              <Select
                name="bloodGroup"
                label="Blood Group"
                value={values.bloodGroup}
                onChange={onChange}
              >
                {/* Empty item lets the user clear the selection. */}
                <MenuItem value="">Select Blood Group</MenuItem>
                <MenuItem value="A+">A +ve</MenuItem>
                <MenuItem value="A-">A -ve</MenuItem>
                <MenuItem value="B+">B +ve</MenuItem>
                <MenuItem value="B-">B -ve</MenuItem>
                <MenuItem value="AB+">AB +ve</MenuItem>
                <MenuItem value="AB-">AB -ve</MenuItem>
                <MenuItem value="O+">O +ve</MenuItem>
                <MenuItem value="O-">O -ve</MenuItem>
              </Select>
              {/* Helper text mirrors the error for the select control. */}
              {errors.bloodGroup && (
                <FormHelperText>{errors.bloodGroup}</FormHelperText>
              )}
            </FormControl>
          </Stack>
        </Grid>

        {/* Right column holds the contact details. */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack spacing={2}>
            <TextField
              name="mobile"
              variant="outlined"
              label="Mobile"
              value={values.mobile}
              onChange={onChange}
              {...(errors.mobile && { error: true, helperText: errors.mobile })}
            />
            <TextField
              name="age"
              variant="outlined"
              label="Age"
              type="number"
              value={values.age}
              onChange={onChange}
              {...(errors.age && { error: true, helperText: errors.age })}
            />
            <TextField
              name="address"
              variant="outlined"
              label="Address"
              value={values.address}
              onChange={onChange}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="primary" type="submit">
                {/* The button text reflects whether a record is being edited. */}
                {isEditing ? "Update" : "Submit"}
              </Button>
              <Button variant="outlined" onClick={resetForm}>
                Reset
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

// Read the candidate list so edit mode can prepopulate the form.
const mapStateToProps = (state) => ({
  dCandidateList: state.dCandidate.list,
});

// Map the create and update thunks onto component props.
const mapActionToProps = {
  createDCandidate: actions.create,
  updateDCandidate: actions.update,
};

// Connect the component to the Redux store.
export default connect(mapStateToProps, mapActionToProps)(DCandidateForm);
