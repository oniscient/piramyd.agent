import React, { useEffect, useState } from "react"
import { VSCodeProgressRing, VSCodeDivider } from "@vscode/webview-ui-toolkit/react"
import { vscode } from "../../utils/vscode"
import { useExtensionState } from "../../context/ExtensionStateContext"

const PiramydStatsView = () => {
	const { piramydStats, piramydToken } = useExtensionState() as any
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (piramydToken) {
			setLoading(true)
			vscode.postMessage({ type: "piramydGetStats" })
		}
	}, [piramydToken])

	useEffect(() => {
		if (piramydStats) {
			setLoading(false)
		}
	}, [piramydStats])

	if (!piramydToken) {
		return <div className="p-4 text-vscode-descriptionForeground">Please login to view statistics.</div>
	}

	if (loading && !piramydStats) {
		return <div className="flex justify-center p-8"><VSCodeProgressRing /></div>
	}

	if (!piramydStats) {
		return <div className="p-4 text-vscode-descriptionForeground">No usage statistics available.</div>
	}

	return (
		<div className="flex flex-col gap-4 p-4">
			<h2 className="text-xl font-bold text-vscode-foreground">Usage Statistics</h2>

			<div className="grid grid-cols-2 gap-4">
				<div className="p-4 bg-vscode-sideBar-background rounded">
					<p className="text-sm text-vscode-descriptionForeground">Total Requests</p>
					<p className="text-2xl font-bold">{piramydStats.total_requests}</p>
				</div>
				<div className="p-4 bg-vscode-sideBar-background rounded">
					<p className="text-sm text-vscode-descriptionForeground">Total Tokens</p>
					<p className="text-2xl font-bold">{piramydStats.total_tokens?.toLocaleString()}</p>
				</div>
				<div className="p-4 bg-vscode-sideBar-background rounded col-span-2">
					<p className="text-sm text-vscode-descriptionForeground">Total Cost (USD)</p>
					<p className="text-2xl font-bold text-vscode-charts-green">${piramydStats.total_cost_usd}</p>
				</div>
			</div>

			<VSCodeDivider />

			<h3 className="text-lg font-semibold text-vscode-foreground">Model Stats</h3>
			<div className="flex flex-col gap-2">
				{piramydStats.model_stats?.map((stat: any) => (
					<div key={stat.model} className="flex justify-between p-2 border-b border-vscode-panel-border">
						<span className="font-medium">{stat.model}</span>
						<div className="flex gap-4 text-sm">
							<span>{stat.count} reqs</span>
							<span className="text-vscode-descriptionForeground">{stat.tokens?.toLocaleString()} tokens</span>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default PiramydStatsView
