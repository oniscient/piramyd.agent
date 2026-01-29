import { Anthropic } from "@anthropic-ai/sdk"
import { type ModelInfo, openAiModelInfoSaneDefaults } from "@roo-code/types"
import { type ApiHandlerOptions } from "../../shared/api"
import { ApiStream } from "../transform/stream"
import { BaseOpenAiCompatibleProvider } from "./base-openai-compatible-provider"
import { getModelsFromCache } from "./fetchers/modelCache"

export class PiramydHandler extends BaseOpenAiCompatibleProvider<string> {
	constructor(options: ApiHandlerOptions) {
		super({
			providerName: "Piramyd",
			baseURL: options.piramydBaseUrl || "https://api.piramyd.cloud/v1",
			defaultProviderModelId: "gpt-5-turbo",
			providerModels: {}, // Models will be fetched dynamically
			...options,
			apiKey: options.piramydApiKey,
		})
	}

	override async *createMessage(
		systemPrompt: string,
		messages: Anthropic.Messages.MessageParam[],
	): ApiStream {
		yield* super.createMessage(systemPrompt, messages)
	}

	override getModel(): { id: string; info: ModelInfo } {
		const modelId = this.options.apiModelId || this.defaultProviderModelId
		const cachedModels = getModelsFromCache("piramyd")
		const info = cachedModels?.[modelId] || openAiModelInfoSaneDefaults
		return {
			id: modelId,
			info,
		}
	}
}
