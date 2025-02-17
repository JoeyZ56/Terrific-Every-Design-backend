# Utility Function: convertArrayFields

- This function is designed to convert array fields into comma-separated strings within an object (typically req.body from a form submission).

### Breakdown of the Function

    const convertArrayFields = (formData, fields) => {
    fields.forEach((field) => {
        if (Array.isArray(formData[field])) {
        formData[field] = formData[field].join(",");
        }
    });
    };

## What It Does

### 1. Iterates over a list of field names (fields).

• The function expects an array of field names (e.g., ["roofingInfo", "specialRequest"]).

### 2. Checks if each field in formData is an array.

    if (Array.isArray(formData[field]))

• This ensures that only actual arrays are processed.

### 3. Converts the array into a comma-separated string.

    formData[field] = formData[field].join(",");

• The .join(",") method turns an array like ["A", "B", "C"] into "A,B,C".

## Why is this Needed?

• When submitting form data, some fields (like multi-select options) may be received as arrays.

• Databases like MongoDB or email templates may expect them as comma-separated strings instead.

• This function ensures consistency when storing or sending data.

## Example Usage

### Before Conversion (req.body contains arrays):

    req.body = {
    name: "John Doe",
    email: "john@example.com",
    roofingInfo: ["Metal", "Shingles"],
    specialRequest: ["Extra Panel", "Battery Backup"],
    };

### Calling the Function:

    const arrayFields = ["roofingInfo", "specialRequest"];
    convertArrayFields(req.body, arrayFields);

### After Conversion (req.body has strings instead of arrays):

    req.body = {
    name: "John Doe",
    email: "john@example.com",
    roofingInfo: "Metal,Shingles",
    specialRequest: "Extra Panel,Battery Backup",
    };
