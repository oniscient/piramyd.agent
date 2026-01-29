import axios from "axios"
import { type ModelRecord, openAiModelInfoSaneDefaults } from "@roo-code/types"
import { DEFAULT_HEADERS } from "../constants"

export async function getPiramydModels(baseUrl?: string, apiKey?: string): Promise<ModelRecord> {
	try {
		const effectiveBaseUrl = baseUrl || "https://api.piramyd.cloud/v1"
		const response = await axios.get(`${effectiveBaseUrl}/models`, {
			headers: {
				...DEFAULT_HEADERS,
				...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
			},
		})

		const models = response.data?.data || []
		const modelRecord: ModelRecord = {}

		models.forEach((model: any) => {
			modelRecord[model.id] = {
				...openAiModelInfoSaneDefaults,
				contextWindow: model.context_length ? parseInt(model.context_length) * 1000 : 128000,
				supportsImages: model.capabilities?.includes("vision") || false,
				supportsComputerUse: false,
				supportsPromptCache: false,
			}
		})

		return modelRecord
	} catch (error) {
		console.error("Error fetching Piramyd models:", error)
		return {}
	}
}
