/**
 * @fileoverview Require InputSignal type annotation for input() from @angular/core
 */

export const requireInputSignalType = {
  meta: {
    type: "problem",
    docs: {
      description: "Require InputSignal type annotation for input() from @angular/core",
      recommended: false
    },
    fixable: "code",
    schema: []
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        if (
          node.init &&
          node.init.type === "CallExpression" &&
          node.init.callee.name === "input" &&
          node.init.typeParameters &&
          node.init.typeParameters.params.length === 1
        ) {
          const typeArg = context.getSourceCode().getText(node.init.typeParameters.params[0]);
          if (
            !node.id.typeAnnotation ||
            !/InputSignal\s*</.test(context.getSourceCode().getText(node.id.typeAnnotation))
          ) {
            context.report({
              node: node.id,
              message: "input() must be typed as InputSignal<{{typeArg}}>",
              data: { typeArg },
              fix(fixer) {
                return fixer.insertTextAfter(
                  node.id,
                  `: InputSignal<${typeArg}>`
                );
              }
            });
          }
        }
      },
      PropertyDefinition(node) {
        if (
          node.value &&
          node.value.type === "CallExpression" &&
          node.value.callee.name === "input" &&
          node.value.typeParameters &&
          node.value.typeParameters.params.length === 1
        ) {
          const typeArg = context.getSourceCode().getText(node.value.typeParameters.params[0]);
          if (
            !node.typeAnnotation ||
            !/InputSignal\s*</.test(context.getSourceCode().getText(node.typeAnnotation))
          ) {
            context.report({
              node,
              message: "input() must be typed as InputSignal<{{typeArg}}>",
              data: { typeArg },
              fix(fixer) {
                return fixer.insertTextAfter(
                  node.key,
                  `: InputSignal<${typeArg}>`
                );
              }
            });
          }
        }
      }
    };
  }
};
