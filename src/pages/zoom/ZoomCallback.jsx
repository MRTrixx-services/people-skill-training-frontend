"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useZoom } from "../../contexts/ZoomContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

const ZoomCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { handleOAuthCallback } = useZoom()
  const [status, setStatus] = useState("processing") // processing, success, error
  const [message, setMessage] = useState("")

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code")
      const state = searchParams.get("state")
      const error = searchParams.get("error")

      if (error) {
        setStatus("error")
        setMessage(`Authorization failed: ${error}`)
        return
      }

      if (!code) {
        setStatus("error")
        setMessage("No authorization code received")
        return
      }

      try {
        const redirectUri = `${window.location.origin}/zoom/callback`
        await handleOAuthCallback(code, redirectUri, state)

        setStatus("success")
        setMessage("Successfully connected to Zoom!")

        // Close the popup window if this is running in a popup
        if (window.opener) {
          window.opener.postMessage({ type: "zoom-auth-success" }, window.location.origin)
          window.close()
        } else {
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate("/instructor/dashboard")
          }, 2000)
        }
      } catch (error) {
        console.error("OAuth callback error:", error)
        setStatus("error")
        setMessage(error.message || "Failed to connect to Zoom")

        if (window.opener) {
          window.opener.postMessage({ type: "zoom-auth-error", error: error.message }, window.location.origin)
          window.close()
        }
      }
    }

    processCallback()
  }, [searchParams, handleOAuthCallback, navigate])

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-600" />
      case "error":
        return <AlertCircle className="w-8 h-8 text-red-600" />
      default:
        return <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case "success":
        return "Connection Successful!"
      case "error":
        return "Connection Failed"
      default:
        return "Connecting to Zoom..."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{getStatusIcon()}</div>
          <CardTitle>{getStatusTitle()}</CardTitle>
          <CardDescription>
            {status === "processing" && "Please wait while we connect your Zoom account..."}
            {status === "success" && "Your Zoom account has been successfully connected."}
            {status === "error" && "There was an issue connecting your Zoom account."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {message && (
            <Alert variant={status === "error" ? "destructive" : "default"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "success" && !window.opener && (
            <p className="text-sm text-gray-600 text-center mt-4">Redirecting to dashboard...</p>
          )}

          {status === "error" && !window.opener && (
            <div className="text-center mt-4">
              <button
                onClick={() => navigate("/instructor/dashboard")}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ZoomCallback
