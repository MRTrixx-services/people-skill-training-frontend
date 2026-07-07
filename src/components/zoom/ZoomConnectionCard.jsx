"use client"

import { useState } from "react"
import { useZoom } from "../../contexts/ZoomContext"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { AlertCircle, CheckCircle, ExternalLink, RefreshCw, Unlink } from "lucide-react"
import { Alert, AlertDescription } from "../ui/alert"

const ZoomConnectionCard = () => {
  const {
    isConnected,
    connectionStatus,
    isLoading,
    error,
    getAuthorizationUrl,
    disconnectZoom,
    checkConnectionStatus,
    clearError,
  } = useZoom()

  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    clearError()

    try {
      const redirectUri = `${window.location.origin}/zoom/callback`
      const authUrl = await getAuthorizationUrl(redirectUri)

      // Open Zoom authorization in a new window
      const authWindow = window.open(authUrl, "zoom-auth", "width=500,height=600,scrollbars=yes,resizable=yes")

      // Listen for the callback
      const checkClosed = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkClosed)
          setIsConnecting(false)
          // Check connection status after window closes
          setTimeout(() => {
            checkConnectionStatus()
          }, 1000)
        }
      }, 1000)
    } catch (error) {
      console.error("Error connecting to Zoom:", error)
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectZoom()
    } catch (error) {
      console.error("Error disconnecting from Zoom:", error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Zoom Integration
              {isConnected ? (
                <Badge variant="success" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Not Connected
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Connect your Zoom account to create and manage webinars</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={checkConnectionStatus} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isConnected && connectionStatus ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <p className="text-gray-900">{connectionStatus.user_email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Token Expires:</span>
                <p className="text-gray-900">{formatDate(connectionStatus.token_expires_at)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Scope:</span>
                <p className="text-gray-900">{connectionStatus.scope || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Last Sync:</span>
                <p className="text-gray-900">{formatDate(connectionStatus.last_sync)}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDisconnect}
                disabled={isLoading}
                className="flex items-center gap-2 bg-transparent"
              >
                <Unlink className="w-4 h-4" />
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Connect your Zoom account to start creating webinars and managing meetings directly from this platform.
            </p>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Features you'll get:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create Zoom meetings and webinars</li>
                <li>• Automatic recording management</li>
                <li>• Participant tracking and analytics</li>
                <li>• Seamless integration with your webinars</li>
              </ul>
            </div>

            <Button onClick={handleConnect} disabled={isConnecting || isLoading} className="flex items-center gap-2">
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Connect to Zoom
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ZoomConnectionCard
