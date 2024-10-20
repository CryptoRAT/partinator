import app from './app';
import {isMainModule} from "@utils/instanceUtils.ts";

const PORT = process.env.PORT || 3000;

const startServer = (port = PORT) => {
    return app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

if(isMainModule(module)) {
    startServer();
}