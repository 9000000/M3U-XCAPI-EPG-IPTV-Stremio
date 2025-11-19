const { getRouter } = require("stremio-addon-sdk");
const createAddon = require("./addon");
const fs = require('fs');
const path = require('path');
const { tryParseConfigToken } = require('./cryptoConfig');

// NOTE: In a serverless environment, cold starts will rebuild & preload every time.
// You may wish to add a timeout guard or skip full preload if execution time is tight.

let cachedInterface = null;
let cachedConfigKey = null;

async function getInterface(eventConfig = {}) {
    const key = JSON.stringify(eventConfig);
    if (cachedInterface && cachedConfigKey === key) {
        return cachedInterface;
    }
    cachedInterface = await createAddon(eventConfig);
    cachedConfigKey = key;
    return cachedInterface;
}

module.exports = async function (req, res) {
    // Serve static files
    if (req.url === '/' || req.url === '/index.html') {
        try {
            const filePath = path.join(__dirname, 'src', 'index.html');
            const content = fs.readFileSync(filePath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
            return;
        } catch (e) {
            console.error('[SERVERLESS] Error reading index.html:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Could not load landing page' }));
            return;
        }
    }

    // Serve configure pages
    if (req.url === '/configure-direct' || req.url.startsWith('/configure-direct?')) {
        try {
            const filePath = path.join(__dirname, 'src', 'html', 'direct-config.html');
            const content = fs.readFileSync(filePath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
            return;
        } catch (e) {
            console.error('[SERVERLESS] Error reading direct-config.html:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Could not load configuration page' }));
            return;
        }
    }

    if (req.url === '/configure-xtream' || req.url.startsWith('/configure-xtream?')) {
        try {
            const filePath = path.join(__dirname, 'src', 'html', 'xtream-config.html');
            const content = fs.readFileSync(filePath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
            return;
        } catch (e) {
            console.error('[SERVERLESS] Error reading xtream-config.html:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Could not load configuration page' }));
            return;
        }
    }

    // Health check
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }));
        return;
    }

    try {
        // Parse URL to extract config token
        const urlParts = req.url.split('/').filter(p => p);
        let userConfig = {};
        
        // Check if first part is a config token (not a known route)
        if (urlParts.length > 0 && !['health', 'configure-direct', 'configure-xtream'].includes(urlParts[0])) {
            const configEncoded = urlParts[0];
            try {
                userConfig = tryParseConfigToken(configEncoded);
                console.log('[SERVERLESS] Config parsed:', { 
                    provider: userConfig.provider || 'direct',
                    hasM3uUrl: !!userConfig.m3uUrl,
                    hasXtreamUrl: !!userConfig.xtreamUrl
                });
            } catch(e) {
                console.error('[SERVERLESS] Invalid config token:', e.message);
                res.statusCode = 400;
                res.end(JSON.stringify({ 
                    error: 'Invalid configuration token',
                    detail: e.message,
                    hint: 'Please reconfigure your addon at /configure-direct or /configure-xtream'
                }));
                return;
            }
        }

        // Ensure provider is set
        if (!userConfig.provider) {
            userConfig.provider = userConfig.useXtream || userConfig.xtreamUrl ? 'xtream' : 'direct';
        }

        // Validate required fields based on provider
        if (userConfig.provider === 'direct' && !userConfig.m3uUrl) {
            res.statusCode = 400;
            res.end(JSON.stringify({ 
                error: 'Direct provider requires m3uUrl',
                hint: 'Please configure your addon at /configure-direct'
            }));
            return;
        }

        if (userConfig.provider === 'xtream' && !userConfig.xtreamUrl) {
            res.statusCode = 400;
            res.end(JSON.stringify({ 
                error: 'Xtream provider requires xtreamUrl',
                hint: 'Please configure your addon at /configure-xtream'
            }));
            return;
        }

        const addonInterface = await getInterface(userConfig);
        const router = getRouter(addonInterface);
        router(req, res, function () {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Not found' }));
        });
    } catch (e) {
        console.error('[SERVERLESS] Error:', e);
        res.statusCode = 500;
        res.end(JSON.stringify({ 
            error: 'Serverless addon error',
            detail: process.env.DEBUG_MODE === 'true' ? e.message : undefined
        }));
    }
};