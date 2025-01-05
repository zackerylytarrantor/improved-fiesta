import { LanguageModelChatRequestOptions, LanguageModelChatSelector, CancellationToken, LanguageModelChatMessage, LogOutputChannel } from "vscode";
export declare const logger: LogOutputChannel;
export default class CopilotRequest {
    private readonly systemMessagesOrPrompts;
    private readonly modelSelector;
    private readonly modelOptions;
    private readonly endMark;
    private readonly maxRounds;
    static readonly DEFAULT_END_MARK = "<|endofresponse|>";
    static readonly DEFAULT_MAX_ROUNDS = 2;
    static readonly DEFAULT_MODEL_SELECTOR: LanguageModelChatSelector;
    static readonly DEFAULT_MODEL_OPTIONS: LanguageModelChatRequestOptions;
    static readonly NOT_CANCELLABLE: CancellationToken;
    constructor(systemMessagesOrPrompts?: LanguageModelChatMessage[], modelSelector?: LanguageModelChatSelector, modelOptions?: LanguageModelChatRequestOptions, endMark?: string, maxRounds?: number);
    chatRequest(userMessage: LanguageModelChatMessage[], modelOptions?: LanguageModelChatRequestOptions, cancellationToken?: CancellationToken): Promise<string>;
    private selectModel;
    private sendRequest;
}
