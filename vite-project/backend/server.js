const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin');

dotenv.config();
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for specified frontend origins
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5173'], 
    methods: ['GET', 'POST', 'OPTIONS'], 
    allowedHeaders: ['Content-Type'] 
}));

// Serve static HTML files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Firebase Admin SDK
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const registrationsCollection = db.collection('registrations');


// Function to generate keywords for partial matching (first 5 characters)
function generateKeywords(specialization) {
    const keywords = new Set();
    const firstFiveChars = specialization.slice(0, 5).toLowerCase(); // Get the first 5 characters
    keywords.add(firstFiveChars); // Add first 5 characters as keyword
    return Array.from(keywords);
}

// API route to handle form submission (Offer Service - Registration)
app.post('/api/submit-registration', async (req, res) => {
    try {
        // Extract the registration data
        const { city, specialization, ...otherData } = req.body;

        // Normalize the city and specialization to lowercase
        const normalizedCity = city ? city.toLowerCase() : '';
        const normalizedSpecialization = specialization ? specialization.toLowerCase() : '';

        // Generate keywords for partial matching (first 5 characters)
        const keywords = specialization ? generateKeywords(normalizedSpecialization) : [];

        // Prepare the data to be saved to Firestore
        const registrationData = {
            ...otherData,  // Keep other fields as they are
            city: normalizedCity,  // Store the city in lowercase
            specialization: normalizedSpecialization,  // Store specialization in lowercase
            keywords,  // Store generated keywords array
        };

        // Log the normalized data (optional)
        console.log('Normalized registration data:', registrationData);

        // Save to Firestore
        const registrationRef = await registrationsCollection.add(registrationData);
        console.log('Document written with ID: ', registrationRef.id);

        // Send success response
        res.sendFile(path.join(__dirname, 'success.html'));
    } catch (error) {
        console.error('Error saving registration:', error.message); 
        res.status(400).json({ error: 'Error saving registration: ' + error.message });
    }
});

// API route to handle search for paramedical professionals (Get Service)
app.post('/api/search-paramedical', async (req, res) => {
    const { city, specialization } = req.body;

    try {
        let query = registrationsCollection;

        // Exact match for city
        if (city) {
            const lowercaseCity = city.toLowerCase();
            query = query.where('city', '==', lowercaseCity); // Exact match for city
        }

        // Partial match for specialization (first 5 characters)
        if (specialization) {
            const firstFiveChars = specialization.slice(0, 5).toLowerCase(); // Get first 5 characters
            query = query.where('keywords', 'array-contains', firstFiveChars); // Match against first 5 characters
        }

        const snapshot = await query.get();
        const results = [];
        snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }));

        res.json(results);
    } catch (error) {
        console.error('Error fetching search results:', error.message);
        res.status(500).json({ error: 'Error fetching search results' });
    }
});


// API route to fetch professional details by email
app.get('/api/professional', async (req, res) => {
    const { email } = req.query; // Use query parameter for email

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const querySnapshot = await registrationsCollection
            .where('email', '==', email)
            .get();

        if (querySnapshot.empty) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        // Assuming email is unique, fetch the first matching document
        const professional = querySnapshot.docs[0];
        res.json({ id: professional.id, ...professional.data() });
    } catch (error) {
        console.error('Error fetching professional details:', error.message);
        res.status(500).json({ error: 'Error fetching professional details' });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
