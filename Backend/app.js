// Importation du framework Express pour créer l'application web
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDefinition from "./swagger.js";

// Importation des routes définies dans d'autres fichiers
import userRoutes from './route/userRoute.js';
import roleRoutes from './route/roleRoute.js';
import taskRoutes from './route/taskRoute.js';
import categoryRoutes from './route/categoryRoute.js';
import familiesRoutes from './route/familiesRoute.js';
import rewardRoutes from './route/rewardRoute.js';
import rewardTypeRoutes from './route/reward_typeRoute.js';
import roomsRoutes from './route/roomsRoute.js';
import taskRoomRoutes from './route/task_roomRoute.js';
import userFamiliesRoutes from './route/user_familiesRoute.js';
import validationTasksRoutes from './route/validation_tasksRoute.js';
import authRoutes from './route/authRoute.js';
import permissionsRoutes from './route/permissionsRoute.js';

// Création de l'application Express
const app = express();

// Définition du port d'écoute (utilise la variable d'environnement PORT ou 3000 par défaut)
const PORT = process.env.PORT || 3000;

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Documentation Swagger disponible sur /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

// Middleware pour gérer les requêtes CORS
app.use(cors());

// Utilisation des routes avec leurs préfixes respectifs
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/tasks', taskRoutes);
app.use('/categories', categoryRoutes);
app.use('/families', familiesRoutes);
app.use('/rewards', rewardRoutes);
app.use('/reward-types', rewardTypeRoutes);
app.use('/rooms', roomsRoutes);
app.use('/task-rooms', taskRoomRoutes);
app.use('/user-families', userFamiliesRoutes);
app.use('/validation-tasks', validationTasksRoutes);
app.use('/login', authRoutes);
app.use('/permissions', permissionsRoutes);

// Démarrage du serveur sur le port spécifié
app.listen(PORT, () => {
    console.log(`Server Express is running on port ${PORT}`);
});