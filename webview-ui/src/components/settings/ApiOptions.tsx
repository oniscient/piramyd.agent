import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { useDebounce } from "react-use"
import { VSCodeLink } from "@vscode/webview-ui-toolkit/react"

import {
	type ProviderSettings,
	DEFAULT_CONSECUTIVE_MISTAKE_LIMIT,
} from "@roo-code/types"

import { vscode } from "@src/utils/vscode"
import { useAppTranslation } from "@src/i18n/TranslationContext"
import { useRouterModels } from "@src/components/ui/hooks/useRouterModels"
import { useSelectedModel } from "@src/components/ui/hooks/useSelectedModel"
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@src/components/ui"

import Piramyd from "./providers/Piramyd"
import { noTransform } from "./transforms"
import { ApiErrorMessage } from "./ApiErrorMessage"
import { ThinkingBudget } from "./ThinkingBudget"
import { Verbosity } from "./Verbosity"
import { TodoListSettingsControl } from "./TodoListSettingsControl"
import { TemperatureControl } from "./TemperatureControl"
import { RateLimitSecondsControl } from "./RateLimitSecondsControl"
import { ConsecutiveMistakeLimitControl } from "./ConsecutiveMistakeLimitControl"
import { BookOpenText } from "lucide-react"

export interface ApiOptionsProps {
	uriScheme: string | undefined
	apiConfiguration: ProviderSettings
	setApiConfigurationField: <K extends keyof ProviderSettings>(
		field: K,
		value: ProviderSettings[K],
		isUserAction?: boolean,
	) => void
	fromWelcomeView?: boolean
	errorMessage: string | undefined
	setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>
}

const ApiOptions = ({
	uriScheme,
	apiConfiguration,
	setApiConfigurationField,
	fromWelcomeView,
	errorMessage,
	setErrorMessage,
}: ApiOptionsProps) => {
	const { t } = useAppTranslation()

	const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false)

	const handleInputChange = useCallback(
		<K extends keyof ProviderSettings, E>(
			field: K,
			transform: (event: E) => ProviderSettings[K] = (e: any) => e.target.value,
		) =>
			(event: E | Event) => {
				setApiConfigurationField(field, transform(event as E))
			},
		[setApiConfigurationField],
	)

	const {
		id: selectedModelId,
		info: selectedModelInfo,
	} = useSelectedModel(apiConfiguration)

	const { data: routerModels } = useRouterModels()

	// Update `apiModelId` whenever `selectedModelId` changes.
	useEffect(() => {
		if (selectedModelId && apiConfiguration.apiModelId !== selectedModelId) {
			setApiConfigurationField("apiModelId", selectedModelId, false)
		}
	}, [selectedModelId, setApiConfigurationField, apiConfiguration.apiModelId])

	// Debounced refresh model updates
	useDebounce(
		() => {
			vscode.postMessage({ type: "requestRouterModels", values: { provider: "piramyd" } })
		},
		250,
		[
			apiConfiguration?.piramydApiKey,
			apiConfiguration?.piramydBaseUrl,
		],
	)

	useEffect(() => {
		// Set provider to piramyd if not already
		if (apiConfiguration.apiProvider !== "piramyd") {
			setApiConfigurationField("apiProvider", "piramyd", false)
		}
	}, [apiConfiguration.apiProvider, setApiConfigurationField])

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1 relative">
				<div className="flex justify-between items-center">
					<label className="block font-medium">Piramyd Agent Settings</label>
					<VSCodeLink href="https://piramyd.cloud/docs" target="_blank" className="flex gap-2">
						{t("settings:providers.apiProviderDocs")}
						<BookOpenText className="size-4 inline ml-2" />
					</VSCodeLink>
				</div>
			</div>

			{errorMessage && <ApiErrorMessage errorMessage={errorMessage} />}

			<Piramyd
				apiConfiguration={apiConfiguration}
				setApiConfigurationField={setApiConfigurationField}
			/>

			{!fromWelcomeView && (
				<ThinkingBudget
					key={`piramyd-${selectedModelId}`}
					apiConfiguration={apiConfiguration}
					setApiConfigurationField={setApiConfigurationField}
					modelInfo={selectedModelInfo}
				/>
			)}

			{!fromWelcomeView && selectedModelInfo?.supportsVerbosity && (
				<Verbosity
					apiConfiguration={apiConfiguration}
					setApiConfigurationField={setApiConfigurationField}
					modelInfo={selectedModelInfo}
				/>
			)}

			{!fromWelcomeView && (
				<Collapsible open={isAdvancedSettingsOpen} onOpenChange={setIsAdvancedSettingsOpen}>
					<CollapsibleTrigger className="flex items-center gap-1 w-full cursor-pointer hover:opacity-80 mb-2">
						<span className={`codicon codicon-chevron-${isAdvancedSettingsOpen ? "down" : "right"}`}></span>
						<span className="font-medium">{t("settings:advancedSettings.title")}</span>
					</CollapsibleTrigger>
					<CollapsibleContent className="space-y-3">
						<TodoListSettingsControl
							todoListEnabled={apiConfiguration.todoListEnabled}
							onChange={(field, value) => setApiConfigurationField(field, value)}
						/>
						{selectedModelInfo?.supportsTemperature !== false && (
							<TemperatureControl
								value={apiConfiguration.modelTemperature}
								onChange={handleInputChange("modelTemperature", noTransform)}
								maxValue={2}
								defaultValue={selectedModelInfo?.defaultTemperature}
							/>
						)}
						<RateLimitSecondsControl
							value={apiConfiguration.rateLimitSeconds || 0}
							onChange={(value) => setApiConfigurationField("rateLimitSeconds", value)}
						/>
						<ConsecutiveMistakeLimitControl
							value={
								apiConfiguration.consecutiveMistakeLimit !== undefined
									? apiConfiguration.consecutiveMistakeLimit
									: DEFAULT_CONSECUTIVE_MISTAKE_LIMIT
							}
							onChange={(value) => setApiConfigurationField("consecutiveMistakeLimit", value)}
						/>
					</CollapsibleContent>
				</Collapsible>
			)}
		</div>
	)
}

export default memo(ApiOptions)
