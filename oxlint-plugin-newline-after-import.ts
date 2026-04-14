/**
 * oxlint-plugin-newline-after-import.ts
 *
 * Enforces one (or more) blank lines after the last top-level import
 * statement — equivalent to eslint-plugin-import-x/newline-after-import.
 *
 * Requires: Node >=22.18.0 / ^20.19.0, Deno, or Bun (native TS stripping).
 *
 * Usage in .oxlintrc.json:
 *   {
 *     "jsPlugins": ["./oxlint-plugin-newline-after-import.ts"],
 *     "rules": {
 *       "newline-after-import/newline-after-import": "error"
 *     }
 *   }
 */

// ---------------------------------------------------------------------------
// Types — subset of the ESLint plugin API used here
// ---------------------------------------------------------------------------

interface Position {
  line: number;
  column: number;
}

interface SourceLocation {
  start: Position;
  end: Position;
}

interface BaseNode {
  type: string;
  loc: SourceLocation;
  range: [number, number];
  parent?: BaseNode;
}

interface ImportDeclarationNode extends BaseNode {
  type: "ImportDeclaration";
}

interface ProgramNode extends BaseNode {
  type: "Program";
  body: BaseNode[];
}

interface Token {
  range: [number, number];
  loc: SourceLocation;
}

interface Comment extends Token {
  type: "Line" | "Block";
  value: string;
}

interface SourceCode {
  text: string;
  getLastToken?(node: BaseNode): Token | null;
  getFirstToken?(node: BaseNode): Token | null;
  getCommentsBefore?(node: BaseNode): Comment[];
}

interface ReportFixer {
  insertTextAfter(node: BaseNode | Comment, text: string): unknown;
  replaceTextRange(range: [number, number], text: string): unknown;
}

interface RuleContext {
  options: [RuleOptions?];
  sourceCode: SourceCode;
  report(descriptor: {
    node: BaseNode;
    messageId: string;
    data: Record<string, unknown>;
    fix(fixer: ReportFixer): unknown;
  }): void;
}

interface RuleOptions {
  count?: number;
  exactCount?: boolean;
  considerComments?: boolean;
}

interface RuleVisitor {
  ImportDeclaration(node: ImportDeclarationNode): void;
  "Program:exit"(node: ProgramNode): void;
}

interface Rule {
  meta: {
    type: string;
    fixable: string;
    schema: unknown[];
    messages: Record<string, string>;
  };
  create(context: RuleContext): RuleVisitor;
}

interface Plugin {
  meta: { name: string; version: string };
  rules: Record<string, Rule>;
}

// ---------------------------------------------------------------------------
// Rule implementation
// ---------------------------------------------------------------------------

const rule: Rule = {
  create(context: RuleContext): RuleVisitor {
    const options: RuleOptions = context.options[0] ?? {};
    const requiredCount = options.count ?? 1;
    const exactCount = options.exactCount ?? false;
    const considerComments = options.considerComments ?? false;

    const topLevelImports: ImportDeclarationNode[] = [];

    return {
      ImportDeclaration(node: ImportDeclarationNode): void {
        if (node.parent?.type === "Program") {
          topLevelImports.push(node);
        }
      },

      "Program:exit"(program: ProgramNode): void {
        if (topLevelImports.length === 0) {
          return;
        }

        const lastImport = topLevelImports.at(-1);

        if (!lastImport) {
          return;
        }

        const { body } = program;
        const lastImportIndex = body.indexOf(lastImport);
        const nextStatement = body[lastImportIndex + 1];

        if (typeof nextStatement !== "object") {
          return;
        }

        // With considerComments, walk past any comment that sits flush against
        // the import block (no gap between anchor and comment).
        let anchorNode: BaseNode | Comment = lastImport;

        if (considerComments) {
          const commentsBefore =
            context.sourceCode.getCommentsBefore?.(nextStatement) ?? [];

          for (const comment of commentsBefore) {
            if (comment.loc.start.line === anchorNode.loc.end.line + 1) {
              anchorNode = comment;
            }
          }
        }

        const blankLines =
          nextStatement.loc.start.line - anchorNode.loc.end.line - 1;

        const tooFew = blankLines < requiredCount;
        const tooMany = exactCount && blankLines > requiredCount;

        if (!tooFew && !tooMany) {
          return;
        }

        context.report({
          data: { count: requiredCount, found: blankLines },
          fix(fixer: ReportFixer): unknown {
            if (tooFew) {
              const needed = requiredCount - blankLines;
              return fixer.insertTextAfter(anchorNode, "\n".repeat(needed));
            }

            // tooMany — trim excess blank lines between anchor and next statement.
            const anchorToken =
              context.sourceCode.getLastToken?.(anchorNode as BaseNode) ?? null;
            const nextToken =
              context.sourceCode.getFirstToken?.(nextStatement) ?? null;

            if (!anchorToken || !nextToken) {
              return null;
            }

            const replacement = "\n".repeat(requiredCount + 1);
            return fixer.replaceTextRange(
              [anchorToken.range[1], nextToken.range[0]],
              replacement
            );
          },
          messageId: tooMany ? "tooMany" : "missing",
          node: lastImport,
        });
      },
    };
  },

  meta: {
    fixable: "whitespace",
    messages: {
      missing:
        "Expected {{count}} empty line(s) after import statements, but found {{found}}.",
      tooMany:
        "Expected exactly {{count}} empty line(s) after import statements, but found {{found}}.",
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          considerComments: { default: false, type: "boolean" },
          count: { default: 1, minimum: 1, type: "integer" },
          exactCount: { default: false, type: "boolean" },
        },
        type: "object",
      },
    ],
    type: "layout",
  },
};

// ---------------------------------------------------------------------------
// Plugin export
// ---------------------------------------------------------------------------

const plugin: Plugin = {
  meta: {
    name: "newline-after-import",
    version: "1.0.0",
  },
  rules: {
    "newline-after-import": rule,
  },
};

export default plugin;
