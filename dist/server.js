"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = process.env.PORT || 5000;
const server = app_1.default.listen(port, () => {
    try {
        console.log(`😀 Server is running on port ${process.env.PORT}`);
    }
    catch (error) {
        console.log(`😡 Failed to start server - ${error.message}`);
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
//# sourceMappingURL=server.js.map