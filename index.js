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
// const API_URL = process.env.API_URL || 'https://api.arenapro.io/tokens?order=migration_time.desc&lp_deployed=eq.true&limit=10';
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
        // const response = await axios.get(API_URL);
        const data = [
    {
        "row_id": 112755,
        "chain_id": 43114,
        "creator_address": "0x71d605d6a07565d9d2115e910d109df446a937a0",
        "contract_address": "0x2196e106af476f57618373ec028924767c758464",
        "group_id": "100000000000",
        "total_supply_eth": "10000000000",
        "token_name": "GLADIUS",
        "token_symbol": "GLADIUS",
        "a": 677781,
        "b": 0,
        "curve_scaler": "41408599077",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0x764bccf768277234bfa81353db645c7f7d774f13",
        "token_contract_address": "0x34a1d2105dd1b658a48ead516a9ce3032082799c",
        "create_time": 1758005812,
        "transaction_hash": "0x1613881c160e5f2a59222938e2366535ec2f9c9d591453571dd1041732b27426",
        "migration_time": 1758005812,
        "migration_transaction_hash": "0x1613881c160e5f2a59222938e2366535ec2f9c9d591453571dd1041732b27426",
        "photo_url": "https://static.starsarena.com/uploads/2747327d-cc5b-5cb0-02f7-662caf7ae2a51758005626844.jpeg",
        "description": "The AI companion of @TheArenaApp",
        "latest_trade_absolute_order": "68817350032104",
        "latest_price_eth": 0.20545789858589908,
        "latest_total_volume_eth": 2149023.724287621,
        "latest_transaction_count": 1,
        "latest_holder_count": 3253,
        "latest_supply_eth": "9999991855",
        "is_official": false,
        "creator_twitter_handle": "ArenaGladius",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/6a8a3c7b-0b36-2bb9-c1aa-b7976eea3e401758051007935.png",
        "creator_twitter_followers": 328,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.0004110927186834844,
        "whitelist_info": null,
        "lp_paired_with": "ARENA",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 0.00200086110834825,
        "creator_total_tokens": 1,
        "volume1Change": "1.868421",
        "volume24Change": "-0.868653",
        "latest_total_volume_usd": 0
    },
    {
        "row_id": 143642,
        "chain_id": 43114,
        "creator_address": "0x4ed128e27d867dbb793325f1b559ee4eeb847f18",
        "contract_address": "0x2196e106af476f57618373ec028924767c758464",
        "group_id": "100000002224",
        "total_supply_eth": "10000000000",
        "token_name": "Bears and Salmon",
        "token_symbol": "BANDS",
        "a": 677781,
        "b": 0,
        "curve_scaler": "41408599077",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0x0000000000000000000000000000000000000000",
        "token_contract_address": "0x635d08c0e2ff1fa2f19f89db3552c7ab4158af29",
        "create_time": 1765825131,
        "transaction_hash": "0xc73707733d176e8928b4e3fc3ad02b74d934c5852825423c185830ed5d35d222",
        "migration_time": 1765825131,
        "migration_transaction_hash": "0xc73707733d176e8928b4e3fc3ad02b74d934c5852825423c185830ed5d35d222",
        "photo_url": "https://static.starsarena.com/uploads/dc941d38-7843-2090-53ef-6714498af7501765824628572.jpeg",
        "description": " ",
        "latest_trade_absolute_order": "73836579010017",
        "latest_price_eth": 0.08559578625533812,
        "latest_total_volume_eth": 2149023.724287621,
        "latest_transaction_count": 3,
        "latest_holder_count": 2299,
        "latest_supply_eth": "10000113063",
        "is_official": false,
        "creator_twitter_handle": "bears_salmon",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/e69789ac-a337-c8be-d4f1-f064cf6e86a81752412459318.png",
        "creator_twitter_followers": 4713,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.00017126527975679575,
        "whitelist_info": {
            "start_time": 1765825131,
            "duration": 240,
            "max_allocation": 5000000,
            "max_amount": 5000000,
            "wallet_count": 1241,
            "included_communities": [
                "6",
                "19",
                "28"
            ],
            "includes_csv": true
        },
        "lp_paired_with": "ARENA",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 0.00200086110834825,
        "creator_total_tokens": 1,
        "volume1Change": "0.03071",
        "volume24Change": "-0.74457",
        "latest_total_volume_usd": 2750786.6310469806
    },
    {
        "row_id": 94,
        "chain_id": 43114,
        "creator_address": "0x9d0ea1d445f09d7382440d142571aab2c5f8ba56",
        "contract_address": "0x8315f1eb449dd4b779495c3a0b05e5d194446c6e",
        "group_id": "92",
        "total_supply_eth": "10000000000",
        "token_name": "Integrity DAO",
        "token_symbol": "ID",
        "a": 901,
        "b": 0,
        "curve_scaler": "232210432401",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0xb2146cde0b735b77bed85daa3e95443043ea3427",
        "token_contract_address": "0x34a528da3b2ea5c6ad1796eba756445d1299a577",
        "create_time": 1746569730,
        "transaction_hash": "0x31f8d8b8d68070ffd7afb42cea7617c96a2f16e2cfcffff099accf96eac719bf",
        "migration_time": 1746572030,
        "migration_transaction_hash": "0x062143dafccb25c0cdb6e158d7bbd8d5b5264b70387bc1642f0737cf23157bbb",
        "photo_url": "https://static.starsarena.com/uploads/efbabe77-93c3-f6fb-c64e-361b581b82421746569637992.jpeg",
        "description": " ",
        "latest_trade_absolute_order": "70001395027060",
        "latest_price_eth": 0.0000033997742750437463,
        "latest_total_volume_eth": 175886658.59488228,
        "latest_transaction_count": 1038,
        "latest_holder_count": 5921,
        "latest_supply_eth": "10000355433",
        "is_official": false,
        "creator_twitter_handle": "CryptoEsq",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/f573f785-295b-50d5-e560-9dd55ae2a22e1755473929545.png",
        "creator_twitter_followers": 7925,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.00004662989644995016,
        "whitelist_info": null,
        "lp_paired_with": "AVAX",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 13.715586,
        "creator_total_tokens": 1,
        "volume1Change": "0",
        "volume24Change": "-0.959949",
        "latest_total_volume_usd": 0
    },
    {
        "row_id": 40110,
        "chain_id": 43114,
        "creator_address": "0xb7f31172423ce3431c26c8df23289aaa9c603889",
        "contract_address": "0x8315f1eb449dd4b779495c3a0b05e5d194446c6e",
        "group_id": "39075",
        "total_supply_eth": "10000000000",
        "token_name": "LETS GET IN SHAPE",
        "token_symbol": "GYM",
        "a": 901,
        "b": 0,
        "curve_scaler": "232210432401",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0x0c2f5998abbb53239e377245428349bc76955ff6",
        "token_contract_address": "0x58f1e680a87e44a6f9ff77b32c421ed77f5d1ab4",
        "create_time": 1749193469,
        "transaction_hash": "0xa102a4383b9e1b5cef01e75eb57b9851021551ca9f4e6996f460abf70c30141f",
        "migration_time": 1751366592,
        "migration_transaction_hash": "0x2e6a3ea663e33b96a7c7c2f307ae4de833a86313eb21f962bc837dcfc5ac32f0",
        "photo_url": "https://static.starsarena.com/uploads/2cdb4377-f1f4-fede-d03a-8a0e0e781a4f1749193331632.jpeg",
        "description": "Join 💪<span class=\"currency\">$GYM</span> community to get in shape! Inspiration & motivation. Open to everyone, no matter age or gender. 💪",
        "latest_trade_absolute_order": "67466653004010",
        "latest_price_eth": 0.000003360878645002357,
        "latest_total_volume_eth": 1833.610829471736,
        "latest_transaction_count": 640,
        "latest_holder_count": 4743,
        "latest_supply_eth": "9999999403",
        "is_official": false,
        "creator_twitter_handle": "PursuingImpact",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/b32a6405-572f-15f9-a8cc-70eadc135ae11741009409555.png",
        "creator_twitter_followers": 303,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.0000460964200910933,
        "whitelist_info": null,
        "lp_paired_with": "AVAX",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 13.715586,
        "creator_total_tokens": 1,
        "volume1Change": "-1",
        "volume24Change": "-0.533333",
        "latest_total_volume_usd": 0
    },
    {
        "row_id": 71174,
        "chain_id": 43114,
        "creator_address": "0x25e289a9c0a8d84e5262587e833e4a2e009c204d",
        "contract_address": "0x8315f1eb449dd4b779495c3a0b05e5d194446c6e",
        "group_id": "67914",
        "total_supply_eth": "10000000000",
        "token_name": "MEOW",
        "token_symbol": "MEOW",
        "a": 901,
        "b": 0,
        "curve_scaler": "232210432401",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0xc2d319183eda0ca465bacfff5b66ccba592ba267",
        "token_contract_address": "0x9209e7ebd056d72c5996220e99df6049253debcf",
        "create_time": 1750366924,
        "transaction_hash": "0x92d95ea1d54225c926aa26e7f0cb1e5d11396a4d67b227a4b00691589dea46ac",
        "migration_time": 1750367017,
        "migration_transaction_hash": "0x1fa48c6b6cada267b6909c3458af4b087e1a1bc3a1dff659466dde1fd3556209",
        "photo_url": "https://static.starsarena.com/uploads/d2e1f0c1-8975-24d7-add3-15bf817ca2791750436604826.jpeg",
        "description": "The cat stays meowing",
        "latest_trade_absolute_order": "69898291007012",
        "latest_price_eth": 0.0000028688324821660255,
        "latest_total_volume_eth": 997043.1201410333,
        "latest_transaction_count": 192,
        "latest_holder_count": 38818,
        "latest_supply_eth": "10010203005",
        "is_official": false,
        "creator_twitter_handle": "real_n3o",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/3b3f5557-5a5a-9593-0eee-6b03b5e5f2e21749683298765.png",
        "creator_twitter_followers": 53643,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.00003934771862874159,
        "whitelist_info": null,
        "lp_paired_with": "AVAX",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 13.715586,
        "creator_total_tokens": 1,
        "volume1Change": "0",
        "volume24Change": "0.981481",
        "latest_total_volume_usd": 0
    },
    {
        "row_id": 89439,
        "chain_id": 43114,
        "creator_address": "0xb2bdcd98b04db45eeb45683e57bf1cdf9320f486",
        "contract_address": "0x8315f1eb449dd4b779495c3a0b05e5d194446c6e",
        "group_id": "85979",
        "total_supply_eth": "10000000000",
        "token_name": "APIX",
        "token_symbol": "APIX",
        "a": 901,
        "b": 0,
        "curve_scaler": "232210432401",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0x5d891b396cff26e9ae351c2cccee99e4e8e67a0e",
        "token_contract_address": "0x1edf79e77693561e80072becbcce1e16dc356aca",
        "create_time": 1751317070,
        "transaction_hash": "0x4372842a4d3ae9fee24c5b888c43543977faf778e517dcd3a4ed933830761e33",
        "migration_time": 1751317072,
        "migration_transaction_hash": "0x65e9233620cc9ab44db0dee38a3b20d3959ba45a53a1f3de2be57fb984c96067",
        "photo_url": "https://static.starsarena.com/uploads/4e518713-cf92-3cb5-e2b9-6a2fcaa00d331751317020596.jpeg",
        "description": " ",
        "latest_trade_absolute_order": "66210054001011",
        "latest_price_eth": 0.0000025443191682094746,
        "latest_total_volume_eth": 510.3427481014303,
        "latest_transaction_count": 8,
        "latest_holder_count": 4719,
        "latest_supply_eth": "9999972684",
        "is_official": false,
        "creator_twitter_handle": "Kripto0sman",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/2fa3d8b8-156a-77eb-c8fc-0dd286650d721738132090127.png",
        "creator_twitter_followers": 3661,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.00003489682836302552,
        "whitelist_info": null,
        "lp_paired_with": "AVAX",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 13.715586,
        "creator_total_tokens": 1,
        "volume1Change": "0",
        "volume24Change": "-0.784913",
        "latest_total_volume_usd": 0
    },
    {
        "row_id": 144435,
        "chain_id": 43114,
        "creator_address": "0xf8b31563ea65091a1b247e4338b150c1d6feec7a",
        "contract_address": "0x2196e106af476f57618373ec028924767c758464",
        "group_id": "100000002443",
        "total_supply_eth": "10000000000",
        "token_name": "Cryptopia123",
        "token_symbol": "TOPIA",
        "a": 677781,
        "b": 0,
        "curve_scaler": "41408599077",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0x0000000000000000000000000000000000000000",
        "token_contract_address": "0xdf50ad73b92c758bbf94869b4b7b9128bbe4a475",
        "create_time": 1767479422,
        "transaction_hash": "0x6b1e5f2467e3e3ed6f8fec8fc58d79cf8b1f9d9c2764c3209025fe718cb6774a",
        "migration_time": 1767479422,
        "migration_transaction_hash": "0x6b1e5f2467e3e3ed6f8fec8fc58d79cf8b1f9d9c2764c3209025fe718cb6774a",
        "photo_url": "https://static.starsarena.com/uploads/3f8ba9af-20da-7c23-ad0b-e71bdb6500e11767478829321.jpeg",
        "description": " ",
        "latest_trade_absolute_order": "75009950060095",
        "latest_price_eth": 0.01565827989987116,
        "latest_total_volume_eth": 2149023.724287621,
        "latest_transaction_count": 1,
        "latest_holder_count": 1588,
        "latest_supply_eth": "9999968263",
        "is_official": false,
        "creator_twitter_handle": "GeilerGo",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/8394063c-b7fe-5ace-c669-850cc2393e5b1752228724561.png",
        "creator_twitter_followers": 700,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.00003133004327528334,
        "whitelist_info": {
            "start_time": 1767479422,
            "duration": 1800,
            "max_allocation": 20000000,
            "max_amount": 20000000,
            "wallet_count": 369,
            "included_communities": [],
            "includes_csv": true
        },
        "lp_paired_with": "ARENA",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 0.00200086110834825,
        "creator_total_tokens": 12,
        "volume1Change": "-0.926442",
        "volume24Change": "0.316192",
        "latest_total_volume_usd": 194456.32839379707
    },
    {
        "row_id": 42989,
        "chain_id": 43114,
        "creator_address": "0xcffde4a2e9211a3fee2344d0c86e224eab7926ff",
        "contract_address": "0x8315f1eb449dd4b779495c3a0b05e5d194446c6e",
        "group_id": "41952",
        "total_supply_eth": "10000000000",
        "token_name": "LAMBO",
        "token_symbol": "LAMBO",
        "a": 901,
        "b": 0,
        "curve_scaler": "232210432401",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0x9283fe7e74459a67cf49ab541810fd599b3cdc5d",
        "token_contract_address": "0x6f43ff77a9c0cf552b5b653268fbfe26a052429b",
        "create_time": 1749334830,
        "transaction_hash": "0x7ad095ddb1be1e4ea7670d3405559ec2a1b46ad08bf6792f68c944b2544a6a05",
        "migration_time": 1749334918,
        "migration_transaction_hash": "0xfa6c72a3c5255d82ef1e9f90d4ac9389517b840a9af83b2ff487359081db5336",
        "photo_url": "https://static.starsarena.com/uploads/5682c771-1dce-bda5-9da7-1947b459d4d01749334752886.jpeg",
        "description": " ",
        "latest_trade_absolute_order": "69864703007023",
        "latest_price_eth": 0.00000160508378226114,
        "latest_total_volume_eth": 2231806.1790908887,
        "latest_transaction_count": 449,
        "latest_holder_count": 18228,
        "latest_supply_eth": "10000059064",
        "is_official": false,
        "creator_twitter_handle": "goldsmols",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/0f5d723c-138a-fc78-007b-2bd8407a20851754634717128.png",
        "creator_twitter_followers": 4161,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.00002201466465280794,
        "whitelist_info": null,
        "lp_paired_with": "AVAX",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 13.715586,
        "creator_total_tokens": 1,
        "volume1Change": "0",
        "volume24Change": "3.263157",
        "latest_total_volume_usd": 0
    },
    {
        "row_id": 53163,
        "chain_id": 43114,
        "creator_address": "0x5dd019ce1d1b39b8f7e89c71dcce9634ba9c810f",
        "contract_address": "0x8315f1eb449dd4b779495c3a0b05e5d194446c6e",
        "group_id": "51962",
        "total_supply_eth": "10000000000",
        "token_name": "WOLFI",
        "token_symbol": "WOLFI",
        "a": 901,
        "b": 0,
        "curve_scaler": "232210432401",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0x140aa517428b56f857ea3c24a0d60fedc9ead39f",
        "token_contract_address": "0x5ddc8d968a94cf95cfeb7379f8372d858b9c797d",
        "create_time": 1749667519,
        "transaction_hash": "0x108fd6683abe89e26c400875f1b4e540735d93b4e9e2390e022e1daf9ce633fe",
        "migration_time": 1749667519,
        "migration_transaction_hash": "0x108fd6683abe89e26c400875f1b4e540735d93b4e9e2390e022e1daf9ce633fe",
        "photo_url": "https://static.starsarena.com/uploads/e34a2b1f-4ca8-51b7-7208-ec37eafe7bd41749665702212.jpeg",
        "description": " ",
        "latest_trade_absolute_order": "69716423017079",
        "latest_price_eth": 8.758522890018406e-7,
        "latest_total_volume_eth": 5554550.497445062,
        "latest_transaction_count": 193,
        "latest_holder_count": 13085,
        "latest_supply_eth": "10010301439",
        "is_official": false,
        "creator_twitter_handle": "ExcelBaller",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/bc89bd48-25e2-d88c-9e7a-60f706e7b1cd1751309544897.png",
        "creator_twitter_followers": 16310,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.0000120128273931016,
        "whitelist_info": null,
        "lp_paired_with": "AVAX",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 13.715586,
        "creator_total_tokens": 1,
        "volume1Change": "0",
        "volume24Change": "-0.268817",
        "latest_total_volume_usd": 0
    },
    {
        "row_id": 19603,
        "chain_id": 43114,
        "creator_address": "0x69cf89a23691d36f67a940763444d12dca6c6dd1",
        "contract_address": "0x8315f1eb449dd4b779495c3a0b05e5d194446c6e",
        "group_id": "20083",
        "total_supply_eth": "10000000000",
        "token_name": "GreatestOfAVAXTrenches",
        "token_symbol": "GOAT",
        "a": 901,
        "b": 0,
        "curve_scaler": "232210432401",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0xd7fba76254ff5840aeebb94299426278594d7142",
        "token_contract_address": "0xb9c188bc558a82a1ee9e75ae0857df443f407632",
        "create_time": 1747400412,
        "transaction_hash": "0x5abc278b7c9d88c5cb49b6c5548807a558c9eec91379115523fb75e04bfe8e71",
        "migration_time": 1747402712,
        "migration_transaction_hash": "0x3801ca8452cffb16ba8eac7e416126244cb0669eda39f578745ad634f45a2952",
        "photo_url": "https://static.starsarena.com/uploads/f25d55d9-5a71-0d3c-04b8-a2d12f39b15d1752830922472.jpeg",
        "description": "Baaaaaaaaaaaa www.goatavax.xyz",
        "latest_trade_absolute_order": "70130825008049",
        "latest_price_eth": 7.157316721317527e-7,
        "latest_total_volume_eth": 71534.95805346528,
        "latest_transaction_count": 368,
        "latest_holder_count": 6173,
        "latest_supply_eth": "9999999999",
        "is_official": false,
        "creator_twitter_handle": "TonyRiggatoni",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/2ba0bd0d-1e84-a3f9-e5c8-11b177f6f5611750076961826.png",
        "creator_twitter_followers": 1018,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.000009816679302046858,
        "whitelist_info": null,
        "lp_paired_with": "AVAX",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 13.715586,
        "creator_total_tokens": 1,
        "volume1Change": "0",
        "volume24Change": "-0.789473",
        "latest_total_volume_usd": 0
    },
    {
        "row_id": 811,
        "chain_id": 43114,
        "creator_address": "0x66561e74e32c32010f6bbfa118e1ab085a6f0b9c",
        "contract_address": "0x8315f1eb449dd4b779495c3a0b05e5d194446c6e",
        "group_id": "747",
        "total_supply_eth": "10000000000",
        "token_name": "Vitrene",
        "token_symbol": "VIT",
        "a": 901,
        "b": 0,
        "curve_scaler": "232210432401",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0x4c5129c4cebfe556b8e57ba00aee7424e12dc65f",
        "token_contract_address": "0xde34c06de75fb446b5e7b8dd272d014f2a19009d",
        "create_time": 1746637626,
        "transaction_hash": "0x1e450f0669cabdb1b24337b99ff3cfa92a1e76bb2cb962a4d54b755a4cee2804",
        "migration_time": 1765123998,
        "migration_transaction_hash": "0x4804a9f3187b551907ff2798d88551660e85ce0025b6a11fd05bd507822099df",
        "photo_url": "https://static.starsarena.com/uploads/11e4031c-0311-344a-292a-e51e2bddef7a1751301363618.jpeg",
        "description": "Utility token Art NFT1/1 AI Philosophy http://linktr.ee/vitrene https://t.me/+J1H43QP8QQU5YTZk",
        "latest_trade_absolute_order": "73287926001008",
        "latest_price_eth": 5.757592703840001e-7,
        "latest_total_volume_eth": 1808.2759701940693,
        "latest_transaction_count": 1268,
        "latest_holder_count": 481,
        "latest_supply_eth": "10000000000",
        "is_official": false,
        "creator_twitter_handle": "vit_rene2502",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/e0011d0e-bdde-6734-e2b9-8ec12f999be91761021586892.png",
        "creator_twitter_followers": 2520,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.000007896875788249005,
        "whitelist_info": null,
        "lp_paired_with": "AVAX",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 13.715586,
        "creator_total_tokens": 1,
        "volume1Change": "0.333333",
        "volume24Change": "-0.525096",
        "latest_total_volume_usd": 10919.473267854177
    },
    {
        "row_id": 20018,
        "chain_id": 43114,
        "creator_address": "0x625f5aba8410f93ad6dd21f89b3f2b747c4cc389",
        "contract_address": "0x8315f1eb449dd4b779495c3a0b05e5d194446c6e",
        "group_id": "20497",
        "total_supply_eth": "10000000000",
        "token_name": "Emini Spaghettini",
        "token_symbol": "EMINI",
        "a": 901,
        "b": 0,
        "curve_scaler": "232210432401",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0x3526b00f6fa99ac2bd05bad2d54efed175129361",
        "token_contract_address": "0x8cf71b4f445a47f234a0dc61034708a4087bead0",
        "create_time": 1747412863,
        "transaction_hash": "0x65aba2c15c610b8b39cdf9ad5a20daa6a7255e4957a59c0928b424ad6c464df3",
        "migration_time": 1747413438,
        "migration_transaction_hash": "0x325e4f649dbd4470b0d99c7ce3fbeb24dbaa5a62126d4afe672c1da8024690c3",
        "photo_url": "https://static.starsarena.com/uploads/8052dc31-fbbd-732a-6309-d3027f695e551747412849225.jpeg",
        "description": "CEO of Avalancini  <span class=\"currency\">$EMINI</span> is a Cultural Phenomenon Bringing Italian Brain rot to Avax",
        "latest_trade_absolute_order": "68798426011032",
        "latest_price_eth": 5.143323617961869e-7,
        "latest_total_volume_eth": 22612.123306809073,
        "latest_transaction_count": 332,
        "latest_holder_count": 4025,
        "latest_supply_eth": "10000000006",
        "is_official": false,
        "creator_twitter_handle": "DanoManoNFT",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/be34c204-bb1f-9a05-7281-643038ccddaf1763334140190.png",
        "creator_twitter_followers": 1520,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.000007054369740798716,
        "whitelist_info": null,
        "lp_paired_with": "AVAX",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 13.715586,
        "creator_total_tokens": 1,
        "volume1Change": "0",
        "volume24Change": "-0.987012",
        "latest_total_volume_usd": 0
    },
    {
        "row_id": 20911,
        "chain_id": 43114,
        "creator_address": "0x0d8c24532276b0ffbdae3580790ded57bc3f2a8f",
        "contract_address": "0x8315f1eb449dd4b779495c3a0b05e5d194446c6e",
        "group_id": "21390",
        "total_supply_eth": "10000000000",
        "token_name": "BEATKOIN",
        "token_symbol": "BEAT",
        "a": 901,
        "b": 0,
        "curve_scaler": "232210432401",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0x35f9ce499e34bd5f9868c90426c90cdb517f3eb9",
        "token_contract_address": "0xebc95b090d00467abc8c205c7984c56d7bf4620a",
        "create_time": 1747447692,
        "transaction_hash": "0x54b4dc64c84867b65b124f21313dffe10603f250ad8fccfd89ef315b711d700a",
        "migration_time": 1754697667,
        "migration_transaction_hash": "0xbddcac8dad8772d35839b275c3cbd05293e78076d2e58efc3853272b71750ba7",
        "photo_url": "https://static.starsarena.com/uploads/415355a4-1e67-4bc3-43d4-84ecf3a8e8191747447631901.jpeg",
        "description": " ",
        "latest_trade_absolute_order": "66779250006031",
        "latest_price_eth": 4.369121393688348e-7,
        "latest_total_volume_eth": 556.3701888557454,
        "latest_transaction_count": 115,
        "latest_holder_count": 261,
        "latest_supply_eth": "10000000000",
        "is_official": false,
        "creator_twitter_handle": "BEATKOIN_ETH",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/983595d0-18b2-6666-8522-cff306acae701734528828272.png",
        "creator_twitter_followers": 416,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.00000599250602195724,
        "whitelist_info": null,
        "lp_paired_with": "AVAX",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 13.715586,
        "creator_total_tokens": 1,
        "volume1Change": "0",
        "volume24Change": "-1",
        "latest_total_volume_usd": 0
    },
    {
        "row_id": 105204,
        "chain_id": 43114,
        "creator_address": "0x14e08a85446308604cadf9672eef74e5174a741d",
        "contract_address": "0x8315f1eb449dd4b779495c3a0b05e5d194446c6e",
        "group_id": "101733",
        "total_supply_eth": "10000000000",
        "token_name": "Degen Hours",
        "token_symbol": "SLEEP",
        "a": 901,
        "b": 0,
        "curve_scaler": "232210432401",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0x1cc27009a277e8caab13406bdeabbe4adab81543",
        "token_contract_address": "0x2f0ec0ed7d746936f1aeac5702816d38329ee9e6",
        "create_time": 1753283988,
        "transaction_hash": "0x5206da75cb2ec933bfd4cf740403ac98b6d93b6aa1f8d1e065f3edfad661d81e",
        "migration_time": 1753284851,
        "migration_transaction_hash": "0x5e91bce791733e91241aff20e501db58aaedd08789d38eeb2ef301645bf456aa",
        "photo_url": "https://static.starsarena.com/uploads/c5dc227e-8da1-c565-8d39-9ce9f7683b7b1753283739429.jpeg",
        "description": " ",
        "latest_trade_absolute_order": "66150308002026",
        "latest_price_eth": 2.722028828771442e-7,
        "latest_total_volume_eth": 509.6810611472361,
        "latest_transaction_count": 59,
        "latest_holder_count": 4198,
        "latest_supply_eth": "9999998287",
        "is_official": false,
        "creator_twitter_handle": "gratefulrecover",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/28dbc908-d528-16f1-ee98-5000aad59dde1747235368512.png",
        "creator_twitter_followers": 2421,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.000003733422049549399,
        "whitelist_info": {
            "start_time": 1753283988,
            "duration": 2700,
            "max_allocation": 100000000,
            "max_amount": null,
            "wallet_count": 2,
            "included_communities": [],
            "includes_csv": true
        },
        "lp_paired_with": "AVAX",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 13.715586,
        "creator_total_tokens": 1,
        "volume1Change": "0",
        "volume24Change": "1",
        "latest_total_volume_usd": 0
    },
    {
        "row_id": 40918,
        "chain_id": 43114,
        "creator_address": "0x48e4b2fd66f69eedb59fb27384d4be21e2aeffa7",
        "contract_address": "0x8315f1eb449dd4b779495c3a0b05e5d194446c6e",
        "group_id": "39882",
        "total_supply_eth": "10000000000",
        "token_name": "supercycle (real)",
        "token_symbol": "SUPER",
        "a": 901,
        "b": 0,
        "curve_scaler": "232210432401",
        "lp_deployed": true,
        "lp_percentage": 0.27,
        "sale_percentage": 0.73,
        "group_fee": 0,
        "governor_contract": "0x0000000000000000000000000000000000000000",
        "pair_address": "0x017c5608a8ab29ab23093726cf7c64e5ef88e191",
        "token_contract_address": "0xca2e0f72653337d05b1abcebea5718a4a3e57a0b",
        "create_time": 1749260395,
        "transaction_hash": "0x64fe94a2c91d5816d547c9bdb3478607db909149436557f86146d48ed066e4ee",
        "migration_time": 1749260412,
        "migration_transaction_hash": "0x199898226cd9a0c1e228d43939c792f472bddebd2777801100bfdc7b291ce329",
        "photo_url": "https://static.starsarena.com/uploads/43707e8e-b814-325a-ad6a-998019816c4d1751302241671.jpeg",
        "description": " ",
        "latest_trade_absolute_order": "70001496019025",
        "latest_price_eth": 2.660569470710161e-7,
        "latest_total_volume_eth": 532.6956938665033,
        "latest_transaction_count": 29,
        "latest_holder_count": 3838,
        "latest_supply_eth": "10000000002",
        "is_official": false,
        "creator_twitter_handle": "Crypto__Wizzard",
        "creator_twitter_pfp_url": "https://static.starsarena.com/uploads/b205144a-3778-7edf-9e86-afa7d0b4b7e21749091529244.png",
        "creator_twitter_followers": 3164,
        "latest_avax_price": 13.715586,
        "latest_price_usd": 0.0000036491269384499698,
        "whitelist_info": null,
        "lp_paired_with": "AVAX",
        "latest_arena_price": 0.00200086110834825,
        "latest_native_token_price": 13.715586,
        "creator_total_tokens": 1,
        "volume1Change": "0",
        "volume24Change": "-0.971428",
        "latest_total_volume_usd": 0
    }
]
        return data;
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