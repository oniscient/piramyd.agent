import { vi, describe, it, expect } from "vitest"
import { PiramydHandler } from "../piramyd"
import { ApiHandlerOptions } from "../../../shared/api"

// Mock OpenAI client
vi.mock("openai", () => {
	return {
		default: vi.fn().mockImplementation(() => ({
			chat: {
				completions: {
					create: vi.fn().mockResolvedValue({
						choices: [{ message: { content: "Hello from Piramyd!" } }],
						usage: { prompt_tokens: 10, completion_tokens: 5 },
					}),
				},
			},
		})),
	}
})

describe("PiramydHandler", () => {
	const mockOptions: ApiHandlerOptions = {
		piramydApiKey: "test-key",
		piramydBaseUrl: "https://api.piramyd.cloud/v1",
		apiModelId: "gpt-5-turbo",
	}

	it("should initialize with correct options", () => {
		const handler = new PiramydHandler(mockOptions)
		expect(handler).toBeDefined()
		const model = handler.getModel()
		expect(model.id).toBe("gpt-5-turbo")
	})

	it("should use default model if apiModelId is missing", () => {
		const handler = new PiramydHandler({ ...mockOptions, apiModelId: undefined })
		const model = handler.getModel()
		expect(model.id).toBe("gpt-5-turbo")
	})

	it("should use default baseURL if missing", () => {
		const handler = new PiramydHandler({ ...mockOptions, piramydBaseUrl: undefined })
		expect((handler as any).baseURL).toBe("https://api.piramyd.cloud/v1")
	})
})
