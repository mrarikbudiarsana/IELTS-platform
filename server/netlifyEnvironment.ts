// Set before importing the application so function cold starts never load .env
// files, open SQLite, or use development authentication secrets.
process.env.NETLIFY = 'true';
