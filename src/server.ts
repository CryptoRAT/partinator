import app from './app';
import {isMainModule} from "@utils/instanceUtils.ts";
import path from "path";
import fs from "fs";

const PORT = process.env.PORT || 3000;

const startServer = (port = PORT) => {
    return app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

if(isMainModule(module)) {
    const designSystemPath = path.resolve(__dirname, 'node_modules', '@adminjs', 'design-system', 'package.json');
    const pkgContent = JSON.parse(fs.readFileSync(designSystemPath, 'utf8'));
    console.log(pkgContent.exports);
    startServer();
}
