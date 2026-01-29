import React, { memo } from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { ProviderSettings } from "@roo-code/types"
import { useAppTranslation } from "@src/i18n/TranslationContext"
import { useRouterModels } from "@src/components/ui/hooks/useRouterModels"
import { ModelPicker } from "../ModelPicker"

interface PiramydProps {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: <K extends keyof ProviderSettings>(field: K, value: ProviderSettings[K]) => void
}

const Piramyd = ({ apiConfiguration, setApiConfigurationField }: PiramydProps) => {
	const { t } = useAppTranslation()
	const { data: routerModels } = useRouterModels()

	return (
		<div className="flex flex-col gap-3">
			<VSCodeTextField
				value={apiConfiguration.piramydApiKey || ""}
				onInput={(e: any) => setApiConfigurationField("piramydApiKey", e.target.value)}
				type="password"
				placeholder="sk-..."
			>
				Piramyd API Key
			</VSCodeTextField>

			<VSCodeTextField
				value={apiConfiguration.piramydBaseUrl || "https://api.piramyd.cloud/v1"}
				onInput={(e: any) => setApiConfigurationField("piramydBaseUrl", e.target.value)}
				placeholder="https://api.piramyd.cloud/v1"
			>
				Base URL
			</VSCodeTextField>

			<ModelPicker
				apiConfiguration={apiConfiguration}
				setApiConfigurationField={setApiConfigurationField}
				defaultModelId="gpt-5-turbo"
				models={routerModels?.piramyd || {}}
				modelIdKey="apiModelId"
				serviceName="Piramyd"
				serviceUrl="https://piramyd.cloud"
			/>
		</div>
	)
}

export default Piramyd
