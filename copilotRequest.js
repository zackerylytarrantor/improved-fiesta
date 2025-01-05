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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const vscode_1 = require("vscode");
exports.logger = vscode_1.window.createOutputChannel("Spring tools agent", { log: true });
class CopilotRequest {
    constructor(systemMessagesOrPrompts = [], modelSelector = CopilotRequest.DEFAULT_MODEL_SELECTOR, modelOptions = CopilotRequest.DEFAULT_MODEL_OPTIONS, endMark = CopilotRequest.DEFAULT_END_MARK, maxRounds = CopilotRequest.DEFAULT_MAX_ROUNDS) {
        this.systemMessagesOrPrompts = systemMessagesOrPrompts;
        this.modelSelector = modelSelector;
        this.modelOptions = modelOptions;
        this.endMark = endMark;
        this.maxRounds = maxRounds;
    }
    chatRequest(userMessage, modelOptions = CopilotRequest.DEFAULT_MODEL_OPTIONS, cancellationToken = CopilotRequest.NOT_CANCELLABLE) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = [...this.systemMessagesOrPrompts];
            let answer = '';
            let rounds = 0;
            return vscode_1.window.withProgress({
                location: vscode_1.ProgressLocation.Window,
                title: "Copilot request",
                cancellable: true
            }, (progress, cancellation) => __awaiter(this, void 0, void 0, function* () {
                progress.report({ message: "processing..." });
                if (cancellation.isCancellationRequested) {
                    exports.logger.info("Chat request cancelled");
                    return 'Chat request cancelled';
                }
                const _send = (message) => __awaiter(this, void 0, void 0, function* () {
                    rounds++;
                    let response = '';
                    messages.push(...message);
                    try {
                        messages.forEach(m => exports.logger.info(m.content));
                        response = yield this.sendRequest(messages, modelOptions, cancellationToken);
                        answer += response;
                        exports.logger.info(`Response: \n`, response);
                    }
                    catch (e) {
                        if (e instanceof vscode_1.LanguageModelError) {
                            exports.logger.error(e.message, e.code);
                            throw e;
                        }
                        else {
                            const cause = e.cause || e;
                            exports.logger.error(`Failed to chat with copilot`, e.message, e.stack);
                            throw cause;
                        }
                    }
                    messages.push(new vscode_1.LanguageModelChatMessage(vscode_1.LanguageModelChatMessageRole.Assistant, response));
                    return answer.trim().endsWith(this.endMark);
                });
                let completeResponse = yield _send(userMessage);
                while (!completeResponse && rounds < this.maxRounds) {
                    completeResponse = yield _send([new vscode_1.LanguageModelChatMessage(vscode_1.LanguageModelChatMessageRole.User, `continue your response from where you left off, or end your response with "//${this.endMark}" to finish the conversation.`)]);
                }
                exports.logger.debug('rounds', rounds);
                return answer.replace("//" + this.endMark, "");
            }));
        });
    }
    selectModel() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const model = (_a = (yield vscode_1.lm.selectChatModels(this.modelSelector))) === null || _a === void 0 ? void 0 : _a[0];
            if (!model) {
                const models = yield vscode_1.lm.selectChatModels();
                throw new Error(`No suitable model, available models: [${models.map(m => m.name).join(', ')}]. Please make sure you have installed the latest "GitHub Copilot Chat" (v0.16.0 or later).`);
            }
            return model;
        });
    }
    sendRequest(messages, modelOptions, cancellationToken) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const response = [];
            const model = yield this.selectModel();
            const chatResponse = yield model.sendRequest(messages, modelOptions !== null && modelOptions !== void 0 ? modelOptions : this.modelOptions, cancellationToken);
            try {
                for (var _d = true, _e = __asyncValues(chatResponse.text), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        const fragment = _c;
                        response.push(fragment);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return response.join('');
        });
    }
}
exports.default = CopilotRequest;
CopilotRequest.DEFAULT_END_MARK = '<|endofresponse|>';
CopilotRequest.DEFAULT_MAX_ROUNDS = 2;
CopilotRequest.DEFAULT_MODEL_SELECTOR = { vendor: 'copilot', family: 'gpt-3.5-turbo' };
CopilotRequest.DEFAULT_MODEL_OPTIONS = { modelOptions: {} };
CopilotRequest.NOT_CANCELLABLE = { isCancellationRequested: false, onCancellationRequested: () => vscode_1.Disposable.from() };
//# sourceMappingURL=copilotRequest.js.map