"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyLspEdit = void 0;
const vscode_1 = require("vscode");
const util_1 = require("./util");
function applyLspEdit(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!uri) {
            uri = yield (0, util_1.getTargetGuideMardown)();
        }
        const fileContent = (yield (0, util_1.readResponseFromFile)(uri)).toString();
        yield vscode_1.commands.executeCommand("sts/copilot/agent/lspEdits", uri.toString(), fileContent);
    });
}
exports.applyLspEdit = applyLspEdit;
//# sourceMappingURL=guideApply.js.map