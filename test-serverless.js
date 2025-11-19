// Test serverless function locally before deploying to Vercel
const handler = require('./serverless');
const http = require('http');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    console.log(`[TEST] ${req.method} ${req.url}`);
    try {
        await handler(req, res);
    } catch (error) {
        console.error('[TEST] Error:', error);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    }
});

server.listen(PORT, () => {
    console.log(`\n🧪 Testing serverless function locally on http://localhost:${PORT}\n`);
    console.log('Available routes:');
    console.log(`  - http://localhost:${PORT}/`);
    console.log(`  - http://localhost:${PORT}/configure-direct`);
    console.log(`  - http://localhost:${PORT}/configure-xtream`);
    console.log(`  - http://localhost:${PORT}/health`);
    console.log('\nPress Ctrl+C to stop\n');
});
