import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Basic "Hello World" route
app.get('/', (_, res) => {
    res.send('Hello World!');
});

// Only start server if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
