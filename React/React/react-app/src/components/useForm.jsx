import { useState } from "react";

// Custom hook that keeps form values and validation errors together.
const useForm = (initialFieldValues, validate, setCurrentId) => {
  // Holds the current field values, starting from the supplied defaults.
  const [values, setValues] = useState(initialFieldValues);
  // Holds one error message per field keyed by the field name.
  const [errors, setErrors] = useState({});

  // Update a single field and validate only that field.
  const handleInputChange = (event) => {
    // Read which field changed and its new value.
    const { name, value } = event.target;

    // Merge the change into the previous values using a functional update.
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Validate the changed field so feedback appears while typing.
    if (validate) {
      validate({ [name]: value });
    }
  };

  // Restore the initial values and leave edit mode.
  const resetForm = () => {
    // Reset every field back to its default value.
    setValues({ ...initialFieldValues });
    // Clear all validation messages.
    setErrors({});
    // Deselect the row being edited when the setter is available.
    if (setCurrentId) {
      setCurrentId(0);
    }
  };

  // Expose the state and helpers the form needs.
  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  };
};

export default useForm;
