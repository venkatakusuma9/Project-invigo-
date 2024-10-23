const express = require('express');
const mongoose = require('mongoose');
const FacUser = require('./models/userregmodel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const XLSX = require('xlsx');
const usermodel = require('./models/userAnounmodel.js');

// Create the express app
const app = express();

// Ensure the password is URL-encoded if it contains special characters
const encodedPassword = encodeURIComponent('Sath@projects123');
const dbURI = `mongodb+srv://SathwikUK:${encodedPassword}@projects.7zbjzgv.mongodb.net/projects?retryWrites=true&w=majority`;

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connection successful');
}).catch((err) => {
    console.error('Database connection error:', err.message);
});

app.use(express.json());
app.use(cors({ origin: "*" }));

// Multer storage configuration for image uploads
const storage = multer.memoryStorage(); // Store files in memory (Buffer)
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Max file size 10MB
    }
});




app.get('/', (req, res) => {
    return res.send('Hello world!');
});

app.post('/register', upload.single('profileImage'), async (req, res) => {
    try {
        const { fullname, email, mobile, branch, password, confirmPassword } = req.body;

        // Check if profileImage is uploaded
        if (!req.file) {
            return res.status(400).send("Profile image is mandatory");
        }

        const exist = await FacUser.findOne({ email });
        if (exist) {
            return res.status(400).send("User Already Registered");
        }
        if (password !== confirmPassword) {
            return res.status(403).send("Passwords do not match");
        }

        let newuser = new FacUser({
            fullname, email, mobile, branch, password, confirmPassword,
            profileImage: {
                data: req.file.buffer, // Store the image as Buffer
                contentType: req.file.mimetype // Content type of the image
            }
        });

        await newuser.save();
        return res.status(200).send('Registered Successfully');

    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const exist = await FacUser.findOne({ email });
        if (!exist) {
            return res.status(400).send("No user found");
        }
        if (exist.password !== password) {
            return res.status(400).send("Invalid password");
        }
        let payload = {
            user: {
                id: exist.id,
                fullname: exist.fullname
            }
        };
        jwt.sign(payload, 'jwtPassword', { expiresIn: 360000000 }, (err, token) => {
            if (err) throw err;
            return res.json({ token, fullname: exist.fullname });
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Server Error");
    }
});

app.get('/faculty', async (req, res) => {
    try {
        const facultyMembers = await FacUser.find({}, '-password -confirmPassword'); // Exclude sensitive fields
        res.json(facultyMembers);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Function to set column widths to fit the content
function autoFitColumns(worksheet) {
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const colWidths = [];

    for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxWidth = 10;
        for (let R = range.s.r; R <= range.e.r; ++R) {
            const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
            const cell = worksheet[cellAddress];

            if (cell && cell.v) {
                const cellValue = cell.v.toString();
                maxWidth = Math.max(maxWidth, cellValue.length);
            }
        }
        colWidths.push({ wch: maxWidth });
    }

    worksheet['!cols'] = colWidths;
}

app.get('/generate-excel', async (req, res) => {
    try {
        const facultyMembers = await FacUser.find({}, 'fullname branch');
        const data = facultyMembers.map(faculty => ({
            Name: `${faculty.fullname} (${faculty.branch})`,
            Date: ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        autoFitColumns(worksheet);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Faculty Data');

        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename=faculty_data.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/upload-excel', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is required");
        }
        uploadedFileBuffer = req.file.buffer;
        res.send({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).send('Error uploading file');
    }
});

app.get('/search-faculty', async (req, res) => {
    try {
        const { query } = req.query;

        // Search for faculty names based on the query
        const faculty = await FacUser.find({ fullname: { $regex: query, $options: 'i' } });

        return res.json({ faculty });
    } catch (error) {
        console.log("Error fetching faculty suggestions", error.message);
        return res.status(500).send("Internal Server Error");
    }
});

// Extract dates from the uploaded Excel file
app.get('/get-dates', (req, res) => {
    if (!uploadedFileBuffer) {
        return res.status(400).send({ message: 'No file uploaded' });
    }

    const workbook = XLSX.read(uploadedFileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const dates = data[0].slice(2); // Skip the first two columns

    const convertedDates = dates.map(serial => {
        if (typeof serial === 'number') {
            const date = new Date((serial - 25569) * 86400 * 1000); // Convert Excel serial date to JS date
            return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
        } else {
            return serial; // If already in date format, keep as is
        }
    });

    res.send({ dates: convertedDates });
});

app.get('/get-users', (req, res) => {
    try {
        const { date } = req.query;

        if (!uploadedFileBuffer || !date) {
            return res.status(400).send({ message: 'Missing file or date' });
        }

        const workbook = XLSX.read(uploadedFileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const dateIndex = data[0].findIndex(header => {
            if (typeof header === 'number') {
                const headerDate = new Date((header - 25569) * 86400 * 1000).toISOString().split('T')[0];
                return headerDate === date;
            } else {
                return header === date;
            }
        });

        if (dateIndex === -1) {
            return res.status(400).send({ message: 'Date not found' });
        }

        const users = data
            .filter((row, index) => index > 0 && row[dateIndex] === 1) // Skip the header row
            .map(row => ({ username: row[0] })); // Assume the username is in the first column

        res.send({ users });
    } catch (error) {
        console.error('Error in /get-users:', error.message);
        res.status(500).send({ message: 'Server Error', error: error.message });
    }
});
const pdfSchema = new mongoose.Schema({
    filename: String,
    data: Buffer,
    contentType: String,
    title: String, // Add title field
    description: String, // Add description field
    date: String, // Add date field
    session: String, // Add session field
});
const Pdf = mongoose.model('Pdf', pdfSchema);

let uploadedFileBuffer = '';



// other endpoints ...

// Route for handling PDF uploads
app.post('/upload-pdf', upload.single('file'), async (req, res) => {
    try {
        const { title, description, date, session } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        const newPdf = new Pdf({
            filename: file.originalname,
            data: file.buffer,
            contentType: file.mimetype,
            title,
            description,
            date,
            session
        });

        await newPdf.save();
        res.status(200).send('File uploaded and saved to database');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file');
    }
});


// Route for getting the list of PDFs
app.get('/get-pdfs', async (req, res) => {
    try {
        const pdfs = await Pdf.find({}, 'filename title description date session'); // Select only necessary fields
        res.json(pdfs);
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        res.status(500).send('Error fetching PDFs');
    }
});

// Route for downloading a PDF by ID
app.get('/download-pdf/:id', async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        if (!pdf) {
            return res.status(404).send('File not found');
        }

        res.set({
            'Content-Type': pdf.contentType,
            'Content-Disposition': `attachment; filename=${pdf.filename}`,
        });
        res.send(pdf.data);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).send('Error downloading file');
    }
});

app.get("/anoun", async (req, res) => {
    const data = await usermodel.find({});
    res.json({ Success: true, data: data });
});

app.post("/create", async (req, res) => {
    console.log(req.body);
    const data = new usermodel(req.body);
    await data.save();
    res.send({ Success: true, message: "Data saved successfully", data: data });
});

// Update
app.put("/update", async (req, res) => {
    console.log(req.body);
    const { _id, ...rest } = req.body;
    console.log(rest);
    const data = await usermodel.updateOne({ _id: _id }, rest);
    res.send({ Success: true, message: "Data updated successfully", data: data });
});

// Delete
app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const data = await usermodel.deleteOne({ _id: id });
    res.send({ Success: true, message: "Data deleted successfully", data: data });
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
