import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import path from 'path';
// Charger les variables d'environnement
const result = dotenv.config();
console.log(' Résultat du chargement .env:', result);
console.log(' Variables d\'environnement chargées:', {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? ' Définie' : ' Non définie',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? ' Définie' : ' Non définie'
});
// Gestionnaire d'erreurs global
process.on('uncaughtException', (err) => {
    console.error('❌ Erreur non interceptée:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesse rejetée non gérée:', reason);
});
// Initialisation de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variables d\'environnement Supabase manquantes');
}
const supabase = createClient(supabaseUrl, supabaseKey);
// Création de l'application Express
const app = express();
// Middleware de logging
app.use((req, _res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// Configuration de CORS
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = process.env.NODE_ENV === 'production'
            ? ['https://circuitsbellefontaine.fr', 'https://www.circuitsbellefontaine.fr']
            : ['http://localhost:8081'];
        console.log('🔒 Requête CORS de:', origin);
        console.log('✅ Origines autorisées:', allowedOrigins);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Non autorisé par CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Middleware pour parser le JSON
app.use(express.json());
// Servir les fichiers statiques du build frontend
const __dirname = new URL('.', import.meta.url).pathname.replace(/^\/[A-Za-z]:/, '');
const staticPath = path.join(__dirname, '../dist');
console.log('📁 Chemin des fichiers statiques:', staticPath);
app.use(express.static(staticPath));
// Création du routeur
const router = Router();
// Test du serveur
router.get("/", (_req, res) => {
    res.send(" API Express fonctionne !");
});
// Route d'inscription (sécurisée)
router.post("/signup", async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password || !firstName || !lastName) {
            res.status(400).json({
                error: "Tous les champs sont requis (email, mot de passe, prénom, nom)"
            });
            return;
        }
        console.log(' Tentative d\'inscription:', { email, firstName, lastName });
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`,
                },
            },
        });
        if (error) {
            console.error(" Erreur lors de l'inscription:", error);
            res.status(400).json({ error: error.message });
            return;
        }
        if (!data.user) {
            res.status(400).json({ error: "Erreur lors de la création de l'utilisateur" });
            return;
        }
        // Création du profil utilisateur
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([
            {
                id: data.user.id,
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`,
                email: email,
            }
        ]);
        if (profileError) {
            console.error(" Erreur lors de la création du profil:", profileError);
            res.status(400).json({ error: "Erreur lors de la création du profil" });
            return;
        }
        res.json({
            message: " Utilisateur inscrit avec succès",
            user: data.user
        });
    }
    catch (error) {
        console.error(" Erreur inattendue:", error);
        res.status(500).json({
            error: "Une erreur inattendue est survenue"
        });
    }
});
// Utiliser le routeur pour les routes API
app.use('/api', router);
// Toutes les autres routes renvoient vers l'index.html
app.get('*', (req, res) => {
    console.log('🌐 Route catch-all pour:', req.url);
    res.sendFile(path.join(staticPath, 'index.html'));
});
// Démarrer le serveur
const startServer = async () => {
    try {
        const port = process.env.PORT || '3000';
        console.log('⚙️ Variables d\'environnement:');
        console.log('- NODE_ENV:', process.env.NODE_ENV);
        console.log('- PORT:', port);
        console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Défini' : '❌ Non défini');
        console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Défini' : '❌ Non défini');
        app.listen(port, () => {
            console.log(`🚀 Serveur démarré sur le port ${port}`);
        });
    }
    catch (error) {
        console.error('❌ Erreur au démarrage du serveur:', error);
        process.exit(1);
    }
};
startServer().catch(err => {
    console.error('❌ Erreur lors du démarrage du serveur:', err);
    process.exit(1);
});
