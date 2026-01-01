# TODO: Add Repeater for Service Person Joining and End Dates in LeadsForm.jsx

## Tasks
- [ ] Modify form state to use `service_person_dates` as an array of objects with `joining_date` and `end_date`
- [ ] Update initialData handling in useEffect to populate the array
- [ ] Add `addDatePair` function to add new date pair
- [ ] Add `removeDatePair` function to remove a date pair
- [ ] Update `handleChange` to handle array indices for date inputs
- [ ] Replace single date inputs with repeater JSX including add/remove buttons
- [ ] Ensure form submission handles the array (assuming backend can process it)
- [ ] Test that other functionalities remain unchanged
