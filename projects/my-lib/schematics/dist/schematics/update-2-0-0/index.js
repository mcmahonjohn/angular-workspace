"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateToV2 = updateToV2;
const update_imports_1 = require("./update-imports");
function updateToV2() {
    return (tree, context) => {
        (0, update_imports_1.updateImports)(tree, context);
        return tree;
    };
}
//# sourceMappingURL=index.js.map