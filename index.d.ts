import { ExtensionContext, LogOutputChannel } from "vscode";
export declare const REQUIRED_EXTENSION = "github.copilot-chat";
export declare const logger: LogOutputChannel;
export declare function activateCopilotFeatures(context: ExtensionContext): Promise<void>;
