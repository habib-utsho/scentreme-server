import app from "./app";
import { env } from "./app/config/env";


const port = env.PORT || 5000;

const server = app.listen(port, () => {
    try {
        console.log(`😀 Server is running on port ${env.PORT}`)
    } catch (error: any) {
        console.log(`😡 Failed to start server - ${error.message}`)
    }
});


process.on('unhandledRejection', (reason, promise) => {
    console.log('😡 Unhandled Rejection at:', promise, 'reason:', reason);
    if (server) {
        server.close(() => {
            console.log('😡 Server closed due to unhandled promise rejection');
            process.exit(1);
        });
    }
});

process.on('uncaughtException', (error) => {
    console.log('😡 Uncaught Exception:', error);
    if (server) {
        server.close(() => {
            console.log('😡 Server closed due to uncaught exception');
            process.exit(1);
        });
    }
});