"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { useAuth } from "contexts/AuthContext"
import Icon from "components/AppIcon"

const OAuthCallback = () => {
  const { provider } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [status, setStatus] = useState("processing")
  const [error, setError] = useState("")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const error = searchParams.get("error")

        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }

        if (!code) {
          throw new Error("No authorization code received")
        }

        // Exchange code for tokens
        const response = await fetch(`/api/oauth/${provider}/callback/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            redirect_uri: `${window.location.origin}/auth/callback/${provider}`,
            state,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "OAuth callback failed")
        }

        const data = await response.json()

        // Login user with received tokens
        await login({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user: data.user,
        })

        setStatus("success")

        // Redirect to intended destination
        const redirectTo = state || "/dashboard"
        setTimeout(() => {
          navigate(redirectTo, { replace: true })
        }, 2000)
      } catch (error) {
        console.error("OAuth callback error:", error)
        setError(error.message)
        setStatus("error")

        // Redirect to login after error
        setTimeout(() => {
          navigate("/login", { replace: true })
        }, 3000)
      }
    }

    handleCallback()
  }, [provider, searchParams, navigate, login])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center">
        {status === "processing" && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Loader2" size={32} className="text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Signing you in...</h2>
            <p className="text-muted-foreground">Please wait while we complete your {provider} authentication.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={32} className="text-success" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Success!</h2>
            <p className="text-muted-foreground">
              You have been successfully signed in. Redirecting to your dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-error/10 rounded-full flex items-center justify-center">
              <Icon name="AlertCircle" size={32} className="text-error" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Authentication Failed</h2>
            <p className="text-muted-foreground">{error || "There was an error signing you in. Please try again."}</p>
            <p className="text-sm text-muted-foreground">Redirecting to login page...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OAuthCallback
