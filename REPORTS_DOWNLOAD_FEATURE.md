# Reports Download Feature - CSV & PDF Export

## Feature Added
Added download buttons to the Reports module that allow users to export the filtered leads table data as CSV or PDF files.

## What Was Added

### Download Buttons
Two new download buttons appear above the leads table:
1. **Download CSV** (Green button) - Exports data as a comma-separated values file
2. **Download PDF** (Red button) - Exports data as a formatted PDF document

### Features

#### CSV Export
- **File Format**: `.csv` (comma-separated values)
- **Columns Included**: First Name, Last Name, Email, Phone, Company, Status
- **File Name**: `leads_report_YYYY-MM-DD.csv` (includes current date)
- **Data**: All filtered leads from the table
- **Compatibility**: Opens in Excel, Google Sheets, and other spreadsheet applications

#### PDF Export
- **File Format**: `.pdf` (Portable Document Format)
- **Title**: "Leads Report"
- **Filter Information**: Shows applied filters (From date, To date, Status)
- **Statistics**: Includes summary stats (Total, Converted, Lost, Conversion Rate, Loss Rate)
- **Table**: Formatted table with all lead data
- **File Name**: `leads_report_YYYY-MM-DD.pdf` (includes current date)
- **Styling**: Professional black header, compact 8pt font for data

### User Experience

1. **Visibility**: Download buttons only appear when:
   - Data is loaded (not loading)
   - No errors occurred
   - At least one lead is in the table

2. **Validation**: If user clicks download with no data, shows alert: "No data to download"

3. **Icons**: Both buttons have download icons for better UX

4. **Colors**:
   - CSV: Green (`bg-green-600`) - commonly associated with Excel/spreadsheets
   - PDF: Red (`bg-red-600`) - commonly associated with PDF files

## Implementation Details

### Dependencies Used
- **jsPDF**: For PDF generation (already installed)
- **jspdf-autotable**: For creating tables in PDF (already installed)
- **Native Blob API**: For CSV file creation

### Code Changes

**File**: `src/modules/Reports/Reports.jsx`

#### 1. Added Imports
```javascript
import jsPDF from "jspdf";
import "jspdf-autotable";
```

#### 2. Added Download Functions

**downloadCSV()**: 
- Creates CSV content from leads array
- Properly escapes data with quotes
- Creates blob and triggers download

**downloadPDF()**:
- Creates new jsPDF document
- Adds title and filter information
- Includes statistics summary
- Generates formatted table using autoTable
- Saves with current date in filename

#### 3. Added UI Buttons
```jsx
{!loading && !error && leads.length > 0 && (
  <div className="flex gap-3 mb-4">
    <button onClick={downloadCSV}>Download CSV</button>
    <button onClick={downloadPDF}>Download PDF</button>
  </div>
)}
```

## Files Modified

1. **src/modules/Reports/Reports.jsx**
   - Added imports for jsPDF and jspdf-autotable
   - Added `downloadCSV()` function (lines 93-128)
   - Added `downloadPDF()` function (lines 131-194)
   - Added download buttons UI (lines 253-276)

2. **public/dashboard.html**
   - Updated build file references

## Testing

After this feature:
1. ✅ Go to Reports module
2. ✅ Apply filters (optional)
3. ✅ See download buttons above the table
4. ✅ Click "Download CSV" - CSV file downloads
5. ✅ Click "Download PDF" - PDF file downloads
6. ✅ Open files to verify data is correct
7. ✅ Verify filter info appears in PDF
8. ✅ Verify statistics appear in PDF

## Example Output

### CSV File Content
```csv
"First Name","Last Name","Email","Phone","Company","Status"
"Shifat","Rasul","shifaterasul342bd@gmail.com","01871769835","-","contracting"
"Shifat","Rasul","shifaterasulbd@gmail.com","01871769666","-","customer"
```

### PDF File Content
```
Leads Report

Filters Applied:
From: 2026-01-22
To: 2026-01-23
Status: Contracting/Pricing

Total Leads: 2 | Converted: 0 | Lost: 0 | Conversion Rate: 0% | Loss Rate: 0%

[Formatted Table with all lead data]
```

## Benefits

1. **Data Portability**: Users can export and share reports easily
2. **Offline Analysis**: CSV can be analyzed in Excel/Sheets
3. **Professional Reports**: PDF provides formatted, printable reports
4. **Filter Context**: PDF includes filter information for reference
5. **Date Stamped**: Files include date in filename for organization
6. **No Server Load**: Export happens client-side (no API calls)

## No Breaking Changes

✅ All existing functionality remains unchanged:
- Filtering still works
- Statistics still calculate correctly
- Table still displays properly
- All existing features preserved

## Build Process

```bash
npm run build
```

This generates new build files referenced in `public/dashboard.html`.

