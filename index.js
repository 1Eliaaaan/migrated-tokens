require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { io } = require('socket.io-client');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// CORS Configuration
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : [];

const corsOptions = {
    origin: (origin, callback) => {
        console.log('--- CORS ---');
        console.log('Request Origin:', origin);
        console.log('Allowed Origins:', allowedOrigins);
        console.log('--- END CORS ---');
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'https://api.arenapro.io/tokens?order=migration_time.desc&lp_deployed=eq.true&limit=10';
const TOKENS_FILE_PATH = path.join(__dirname, 'tokens.json');
const ABOUT_TO_MIGRATE_API_URL = process.env.ABOUT_TO_MIGRATE_API_URL || 'https://api.arenapro.io/tokens?order=latest_supply_eth.desc&lp_deployed=eq.false&limit=10';
const ABOUT_TO_MIGRATE_FILE_PATH = path.join(__dirname, 'tokensAboutToMigrate.json');
const EXTERNAL_WS_URL = process.env.EXTERNAL_WS_URL || 'https://rugfi-bk-v2-production.up.railway.app/';

const socket = io(EXTERNAL_WS_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

socket.on('connect', () => {
    console.log(`Connected to external WebSocket server at ${EXTERNAL_WS_URL}`);
});

socket.on('disconnect', (reason) => {
    console.log(`Disconnected from external WebSocket server: ${reason}`);
});

socket.on('connect_error', (error) => {
    console.error(`Connection error with external WebSocket server: ${error.message}`);
});

const fetchTokens = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching tokens:', error.message);
        return null;
    }
};

const fetchTokensAboutToMigrate = async () => {
    try {
        const response = await axios.get(ABOUT_TO_MIGRATE_API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching tokens about to migrate:', error.message);
        return null;
    }
};

const fetchRugVerifierData = async (creatorAddress) => {

    try {
        const response = await axios.get(`https://rugfi-bk-v2-production.up.railway.app/api/token/rug-verifier/${creatorAddress}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error(`Error fetching rug verifier data for ${creatorAddress}:`, error.message);
        return {
            success: false,
            totalTokens: 0,
            totalRugs: 0
        };
    }
};

const readTokensFromFile = async () => {
    try {
        await fs.access(TOKENS_FILE_PATH);
        const fileContent = await fs.readFile(TOKENS_FILE_PATH, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // If file doesn't exist or is empty/invalid json
        return [];
    }
};

const readTokensAboutToMigrateFromFile = async () => {
    try {
        await fs.access(ABOUT_TO_MIGRATE_FILE_PATH);
        const fileContent = await fs.readFile(ABOUT_TO_MIGRATE_FILE_PATH, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // If file doesn't exist or is empty/invalid json
        return [];
    }
};

const transformTokenData = (tokens) => {
    if (!tokens || !Array.isArray(tokens)) {
        return [];
    }
    return tokens.map(token => ({
        tokenId: token.token_id,
        tokenSupply: "10000000000000000000000000000",
        creatorAddress: token.creator_address,
        creatorAddressFake: token.creator_address,
        tokenContractAddress: token.token_contract_address,
        tokenName: token.token_name,
        tokenSymbol: token.token_symbol,
        createdAt: new Date(token.create_time * 1000).toISOString(),
        rugData: token.rugData || null,
        arenaUserInfo: {
            community: {
                photoURL: token.photo_url,
                tokenName: token.token_name,
                transactionHash: token.transaction_hash,
                bcGroupId: token.token_id,
                isLP: token.lp_deployed,
                isOfficial: null,
                owner: {
                    twitterId: token.creator_twitter_handle,
                    twitterHandle: token.creator_twitter_handle,
                    twitterName: token.creator_twitter_handle,
                    twitterPicture: token.creator_twitter_pfp_url,
                    twitterFollowers: token.creator_twitter_followers,
                    ixHandle: token.creator_twitter_handle,
                    handle: token.creator_twitter_handle
                },
                stats: {
                    totalVolume: token.latest_total_volume_usd,
                    txs: token.latest_transaction_count,
                    price: token.latest_price_usd,
                    lastPrice: token.latest_price_usd,
                    marketCap: token.latest_price_usd,
                    lastMarketCap: token.latest_price_usd,
                    marketCapUsd: token.latest_price_usd,
                    totalSupply: token.latest_supply_eth,
                    createdOn: new Date(token.create_time * 1000).toISOString(),
                    holders: token.latest_holder_count,
                }
            }
        }
    }));
};

const writeTokensToFile = async (tokens) => {
    try {
        await fs.writeFile(TOKENS_FILE_PATH, JSON.stringify(tokens, null, 2));
    } catch (error) {
        console.error('Error writing tokens to file:', error.message);
    }
};

const writeTokensAboutToMigrateToFile = async (tokens) => {
    try {
        await fs.writeFile(ABOUT_TO_MIGRATE_FILE_PATH, JSON.stringify(tokens, null, 2));
    } catch (error) {
        console.error('Error writing tokens about to migrate to file:', error.message);
    }
};

const monitorTokens = async () => {
    console.log('Checking for new tokens...');
    const rawTokens = await fetchTokens();
    if (!rawTokens) {
        return;
    }

    const newTokens = transformTokenData(rawTokens);
    const oldTokens = await readTokensFromFile();

    // Simple comparison by stringifying the objects
    if (JSON.stringify(newTokens) !== JSON.stringify(oldTokens)) {
        console.log('Token data has changed. Updating file and notifying external server.');
        await writeTokensToFile(newTokens);
        if (socket.connected) {
            socket.emit('token_graduate_update', newTokens);
            console.log('Event "token_graduate_update" sent to external server.');
        } else {
            console.log('Cannot send event, socket is not connected.');
        }
    } else {
        console.log('No changes detected.');
    }
};

const monitorTokensAboutToMigrate = async () => {
    console.log('Checking for new tokens about to migrate...');
    const rawTokens = await fetchTokensAboutToMigrate();
    if (!rawTokens) {
        return;
    }

    const oldTokens = await readTokensAboutToMigrateFromFile();
    // Create a map for quick lookup by tokenId
    const oldTokensMap = new Map();
    for (const t of oldTokens) {
        oldTokensMap.set(t.tokenId, t);
    }

    // For each token, if it exists in oldTokens, reuse rugData; otherwise, fetch it
    const tokensWithRugData = await Promise.all(
        rawTokens.map(async (token) => {
            const oldToken = oldTokensMap.get(token.token_id);
            if (oldToken && oldToken.rugData) {
                return {
                    ...token,
                    rugData: oldToken.rugData
                };
            } else {
                const rugData = await fetchRugVerifierData(token.creator_address);
                return {
                    ...token,
                    rugData
                };
            }
        })
    );

    const newTokens = transformTokenData(tokensWithRugData);

    // Simple comparison by stringifying the objects
    if (JSON.stringify(newTokens) !== JSON.stringify(oldTokens)) {
        console.log('Tokens about to migrate data has changed. Updating file and notifying external server.');
        await writeTokensAboutToMigrateToFile(newTokens);
        if (socket.connected) {
            socket.emit('token_about_to_migrate_update', newTokens);
            console.log('Event "token_about_to_migrate_update" sent to external server.');
        } else {
            console.log('Cannot send event, socket is not connected.');
        }
    } else {
        console.log('No changes detected in tokens about to migrate.');
    }
};

app.get('/tokens', async (req, res) => {
    try {
        const tokens = await readTokensFromFile();
        res.json(tokens);
    } catch (error) {
        console.error('Error reading tokens for API endpoint:', error.message);
        res.status(500).json({ error: 'Failed to retrieve token data.' });
    }
});

app.get('/tokens-about-to-migrate', async (req, res) => {
    try {
        const tokens = await readTokensAboutToMigrateFromFile();
        res.json(tokens);
    } catch (error) {
        console.error('Error reading tokens about to migrate for API endpoint:', error.message);
        res.status(500).json({ error: 'Failed to retrieve tokens about to migrate data.' });
    }
});

app.listen(PORT, () => {
    console.log(`Monitoring service is running on http://localhost:${PORT}`);
    // Start monitoring immediately and then every 3 seconds
    monitorTokens();
    monitorTokensAboutToMigrate();
    setInterval(monitorTokens, process.env.TOKENS_INTERVAL);
    setInterval(monitorTokensAboutToMigrate, process.env.TOKENS_ABOUT_TO_INTERVAL);
}); 