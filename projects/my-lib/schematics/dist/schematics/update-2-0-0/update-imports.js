"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImports = updateImports;
function replaceImportPath(source) {
    return source.replace(/(['"])my-lib\1/g, '$1library$1');
}
function updateImports(tree, context) {
    tree.visit(filePath => {
        if (filePath.endsWith('.ts')) {
            const buffer = tree.read(filePath);
            if (!buffer) {
                return;
            }
            const content = buffer.toString('utf-8');
            const updated = replaceImportPath(content);
            if (updated !== content) {
                tree.overwrite(filePath, updated);
                context.logger.info(`Updated imports in ${filePath}`);
            }
        }
    });
}
//# sourceMappingURL=update-imports.js.map