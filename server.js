const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let records = [
    { id: 1, title: "Complete CC Assignment", description: "Deploy app on Azure VM", category: "Task" },
    { id: 2, title: "Pushkar Uplenchwar", description: "Roll No: 31386, Class: TE", category: "Student" }
];

app.get('/api/records', (req, res) => {
    res.json(records);
});

app.post('/api/records', (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: "Title and Description are required" });
    }
    const newRecord = {
        id: records.length + 1,
        title: title,
        description: description,
        category: category || "General"
    };
    records.push(newRecord);
    res.status(201).json(newRecord);
});

app.delete('/api/records/:id', (req, res) => {
    const id = parseInt(req.params.id);
    records = records.filter(item => item.id !== id);
    res.json({ message: "Record deleted successfully" });
});

// Using standard string concatenation to avoid copy-paste backtick errors
const htmlPage = "<!DOCTYPE html>\n" +
"<html lang='en'>\n" +
"<head>\n" +
"    <meta charset='UTF-8'>\n" +
"    <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n" +
"    <title>Cloud Deployment Dashboard</title>\n" +
"    <style>\n" +
"        body { font-family: sans-serif; background-color: #f4f6f9; padding: 20px; }\n" +
"        .container { max-width: 800px; margin: auto; background: white; padding: 30px; border-radius: 8px; }\n" +
"        h1 { text-align: center; }\n" +
"        .status { text-align: center; color: #28a745; font-weight: bold; margin-bottom: 20px; }\n" +
"        form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; background: #eef2f7; padding: 20px; }\n" +
"        input, textarea, select, button { padding: 10px; font-size: 16px; border: 1px solid #ccc; }\n" +
"        button { background-color: #007bff; color: white; border: none; cursor: pointer; }\n" +
"        .card { border: 1px solid #dee2e6; padding: 15px; margin-bottom: 15px; position: relative; }\n" +
"        .delete-btn { position: absolute; right: 15px; top: 15px; background: #dc3545; color: white; border: none; padding: 5px; cursor: pointer; }\n" +
"    </style>\n" +
"</head>\n" +
"<body>\n" +
"    <div class='container'>\n" +
"        <h1>Cloud Application Deployment Dashboard</h1>\n" +
"        <div class='status'>● System Status: Online & Live on Azure</div>\n" +
"        \n" +
"        <form id='recordForm'>\n" +
"            <input type='text' id='title' placeholder='Title / Name' required>\n" +
"            <textarea id='description' placeholder='Description / Details' required></textarea>\n" +
"            <select id='category'>\n" +
"                <option value='Task'>Task Management</option>\n" +
"                <option value='Student'>Student Record</option>\n" +
"            </select>\n" +
"            <button type='submit'>Add Entry to Cloud Database</button>\n" +
"        </form>\n" +
"\n" +
"        <h2>Live Records</h2>\n" +
"        <div id='recordsContainer'>Loading data...</div>\n" +
"    </div>\n" +
"\n" +
"    <script>\n" +
"        async function fetchRecords() {\n" +
"            const res = await fetch('/api/records');\n" +
"            const data = await res.json();\n" +
"            const container = document.getElementById('recordsContainer');\n" +
"            container.innerHTML = '';\n" +
"            data.forEach(item => {\n" +
"                container.innerHTML += '<div class=\"card\"><h3>' + item.title + '</h3><p>' + item.description + '</p><button class=\"delete-btn\" onclick=\"deleteRecord(' + item.id + ')\">Delete</button></div>';\n" +
"            });\n" +
"        }\n" +
"\n" +
"        document.getElementById('recordForm').addEventListener('submit', async (e) => {\n" +
"            e.preventDefault();\n" +
"            const title = document.getElementById('title').value;\n" +
"            const description = document.getElementById('description').value;\n" +
"            const category = document.getElementById('category').value;\n" +
"            await fetch('/api/records', {\n" +
"                method: 'POST',\n" +
"                headers: { 'Content-Type': 'application/json' },\n" +
"                body: JSON.stringify({ title, description, category })\n" +
"            });\n" +
"            document.getElementById('recordForm').reset();\n" +
"            fetchRecords();\n" +
"        });\n" +
"\n" +
"        async function deleteRecord(id) {\n" +
"            await fetch('/api/records/' + id, { method: 'DELETE' });\n" +
"            fetchRecords();\n" +
"        }\n" +
"\n" +
"        fetchRecords();\n" +
"    </script>\n" +
"</body>\n" +
"</html>";

app.get('/', (req, res) => {
    res.send(htmlPage);
});

app.listen(PORT, () => {
    console.log("Server is running successfully on port " + PORT);
});