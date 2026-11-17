import { useEffect } from "react";
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
import { connect } from "react-redux";
import useForm from "./useForm";
import * as actions from "../actions/dCandidate";

const initialFieldValues = {
  fullName: "",
  mobile: "",
  email: "",
  age: "",
  bloodGroup: "",
  address: "",
};

const DCandidateForm = ({ onNotify, ...props }) => {
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("fullName" in fieldValues)
      temp.fullName = fieldValues.fullName ? "" : "This field is required.";
    if ("mobile" in fieldValues)
      temp.mobile = fieldValues.mobile ? "" : "This field is required.";
    if ("bloodGroup" in fieldValues)
      temp.bloodGroup = fieldValues.bloodGroup ? "" : "This field is required.";
    if ("email" in fieldValues)
      temp.email = /^$|.+@.+..+/.test(fieldValues.email)
        ? ""
        : "Email is not valid.";

    setErrors({ ...temp });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFieldValues, validate, props.setCurrentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const onSuccess = () => {
        resetForm();
        onNotify("Submitted successfully");
      };
      if (props.currentId === 0) {
        props.createDCandidate(values, onSuccess);
      } else {
        props.updateDCandidate(props.currentId, values, onSuccess);
      }
    }
  };

  useEffect(() => {
    if (props.currentId !== 0) {
      const selected = props.dCandidateList.find(
        (x) => x.id === props.currentId
      );
      if (selected) {
        setValues({ ...selected });
        setErrors({});
      }
    }
  }, [props.currentId]);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack spacing={2}>
            <TextField
              name="fullName"
              variant="outlined"
              label="Full Name"
              value={values.fullName}
              onChange={handleInputChange}
              {...(errors.fullName && {
                error: true,
                helperText: errors.fullName,
              })}
            />
            <TextField
              name="email"
              variant="outlined"
              label="Email"
              value={values.email}
              onChange={handleInputChange}
              {...(errors.email && { error: true, helperText: errors.email })}
            />
            <FormControl variant="outlined" error={Boolean(errors.bloodGroup)}>
              <InputLabel>Blood Group</InputLabel>
              <Select
                name="bloodGroup"
                label="Blood Group"
                value={values.bloodGroup}
                onChange={handleInputChange}
              >
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
              {errors.bloodGroup && (
                <FormHelperText>{errors.bloodGroup}</FormHelperText>
              )}
            </FormControl>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack spacing={2}>
            <TextField
              name="mobile"
              variant="outlined"
              label="Mobile"
              value={values.mobile}
              onChange={handleInputChange}
              {...(errors.mobile && { error: true, helperText: errors.mobile })}
            />
            <TextField
              name="age"
              variant="outlined"
              label="Age"
              type="number"
              value={values.age}
              onChange={handleInputChange}
            />
            <TextField
              name="address"
              variant="outlined"
              label="Address"
              value={values.address}
              onChange={handleInputChange}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" color="primary" type="submit">
                Submit
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

const mapStateToProps = (state) => ({
  dCandidateList: state.dCandidate.list,
});

const mapActionToProps = {
  createDCandidate: actions.create,
  updateDCandidate: actions.update,
};

export default connect(mapStateToProps, mapActionToProps)(DCandidateForm);