"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const meal_plan_1 = __importDefault(require("./routes/meal-plan"));
const error_1 = require("./middleware/error");
const auth_1 = require("./middleware/auth");
const config_1 = require("./config");
const mongodb_1 = require("mongodb");
const supabase_js_1 = require("@supabase/supabase-js");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize database
if (process.env.NODE_ENV !== 'production') {
    (0, db_1.initDatabase)().catch(console.error);
}
// Routes
app.use('/api/meal-plan', auth_1.authMiddleware, meal_plan_1.default);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
// Debug endpoint til að skoða environment breytur (án viðkvæmra lykla)
app.get('/env-debug', (_req, res) => {
    res.json({
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set',
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'set' : 'not set',
        SUPABASE_URL: process.env.SUPABASE_URL ? 'set' : 'not set',
        SUPABASE_KEY: process.env.SUPABASE_KEY ? 'set' : 'not set',
    });
});
app.get('/db-debug', async (_req, res) => {
    // Prófa MongoDB
    let mongoStatus = 'not checked';
    try {
        const client = new mongodb_1.MongoClient(config_1.config.databaseUrl);
        await client.connect();
        await client.db().admin().ping();
        mongoStatus = 'connected';
        await client.close();
    }
    catch (err) {
        mongoStatus = 'error: ' + (err instanceof Error ? err.message : String(err));
    }
    // Prófa Supabase
    let supabaseStatus = 'not checked';
    try {
        const supabase = (0, supabase_js_1.createClient)(config_1.config.supabaseUrl, config_1.config.supabaseKey);
        const { error } = await supabase.from('meal_plans').select('*').limit(1);
        if (error) {
            supabaseStatus = 'error: ' + error.message;
        }
        else {
            supabaseStatus = 'connected';
        }
    }
    catch (err) {
        supabaseStatus = 'error: ' + (err instanceof Error ? err.message : String(err));
    }
    res.json({
        mongodb: mongoStatus,
        supabase: supabaseStatus
    });
});
// Error handling
app.use(error_1.errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
