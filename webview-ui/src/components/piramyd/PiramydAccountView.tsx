import React, { useState } from "react"
import { VSCodeButton, VSCodeTextField, VSCodeLink, VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react"
import { vscode } from "../../utils/vscode"
import { useExtensionState } from "../../context/ExtensionStateContext"

const PiramydAccountView = () => {
	const { piramydToken, piramydUser } = useExtensionState() as any
	const [isRegistering, setIsRegistering] = useState(false)
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [email, setEmail] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const handleLogin = () => {
		setLoading(true)
		setError("")
		vscode.postMessage({
			type: "piramydLogin",
			values: { username, password }
		})
	}

	const handleRegister = () => {
		setLoading(true)
		setError("")
		vscode.postMessage({
			type: "piramydRegister",
			values: { username, email, password }
		})
	}

	const handleLogout = () => {
		vscode.postMessage({ type: "piramydLogout" })
	}

	if (piramydToken && piramydUser) {
		return (
			<div className="flex flex-col gap-4 p-4">
				<h2 className="text-xl font-bold text-vscode-foreground">Account</h2>
				<div className="flex flex-col gap-2 p-4 bg-vscode-sideBar-background rounded">
					<p><span className="font-semibold text-vscode-foreground">Username:</span> {piramydUser.username}</p>
					<p><span className="font-semibold text-vscode-foreground">Email:</span> {piramydUser.email}</p>
					<p><span className="font-semibold text-vscode-foreground">Status:</span> {piramydUser.is_active ? "Active" : "Inactive"}</p>
				</div>
				<VSCodeButton onClick={handleLogout} appearance="secondary">Logout</VSCodeButton>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4 p-4">
			<h2 className="text-xl font-bold text-vscode-foreground">{isRegistering ? "Register" : "Login"}</h2>

			<div className="flex flex-col gap-3">
				<VSCodeTextField
					value={username}
					onInput={(e: any) => setUsername(e.target.value)}
					placeholder="Username"
				>
					Username
				</VSCodeTextField>

				{isRegistering && (
					<VSCodeTextField
						value={email}
						onInput={(e: any) => setEmail(e.target.value)}
						placeholder="Email"
					>
						Email
					</VSCodeTextField>
				)}

				<VSCodeTextField
					value={password}
					type="password"
					onInput={(e: any) => setPassword(e.target.value)}
					placeholder="Password"
				>
					Password
				</VSCodeTextField>

				{error && <p className="text-vscode-errorForeground text-sm">{error}</p>}

				{loading ? (
					<VSCodeProgressRing />
				) : (
					<VSCodeButton onClick={isRegistering ? handleRegister : handleLogin}>
						{isRegistering ? "Register" : "Login"}
					</VSCodeButton>
				)}

				<div className="text-sm">
					{isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
					<VSCodeLink
						style={{ cursor: "pointer" }}
						onClick={() => setIsRegistering(!isRegistering)}
					>
						{isRegistering ? "Login here" : "Register here"}
					</VSCodeLink>
				</div>
			</div>
		</div>
	)
}

export default PiramydAccountView
