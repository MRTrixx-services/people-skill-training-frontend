"use client"
import { useAuth } from "../../contexts/AuthContext"
import { useZoom } from "../../contexts/ZoomContext"
import ZoomConnectionCard from "../../components/zoom/ZoomConnectionCard"
import ZoomRecordingsList from "../../components/zoom/ZoomRecordingsList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Video, Users, Calendar, BarChart3 } from "lucide-react"

const ZoomIntegrationPage = () => {
  const { user } = useAuth()
  const { isConnected, meetings, webinars, recordings } = useZoom()

  const stats = [
    {
      title: "Total Meetings",
      value: meetings.length,
      icon: Video,
      color: "text-blue-600",
    },
    {
      title: "Total Webinars",
      value: webinars.length,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Recordings",
      value: recordings.length,
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Completed",
      value: recordings.filter((r) => r.status === "completed").length,
      icon: BarChart3,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Zoom Integration</h1>
        <p className="text-gray-600">Manage your Zoom connection and view your meetings, webinars, and recordings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ZoomConnectionCard />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
              <CardDescription>Your Zoom activity overview</CardDescription>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 mb-2`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.title}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>Connect to Zoom to view stats</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Role:</span>
                <Badge variant="outline">{user?.role}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={isConnected ? "success" : "secondary"}>
                  {isConnected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm text-gray-900">{user?.email}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isConnected && (
        <div className="space-y-6">
          <ZoomRecordingsList />
        </div>
      )}
    </div>
  )
}

export default ZoomIntegrationPage
