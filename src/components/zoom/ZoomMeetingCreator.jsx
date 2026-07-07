"use client"

import { useState } from "react"
import { useZoom } from "../../contexts/ZoomContext"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle, Video, Users, CheckCircle } from "lucide-react"

const ZoomMeetingCreator = ({ webinar, onMeetingCreated }) => {
  const { createZoomMeeting, isLoading, error, clearError } = useZoom()
  const [meetingType, setMeetingType] = useState("meeting")
  const [isCreating, setIsCreating] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCreateMeeting = async () => {
    if (!webinar) return

    setIsCreating(true)
    setSuccess(false)
    clearError()

    try {
      const result = await createZoomMeeting(webinar.id, meetingType)
      setSuccess(true)

      if (onMeetingCreated) {
        onMeetingCreated(result)
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Error creating Zoom meeting:", error)
    } finally {
      setIsCreating(false)
    }
  }

  // Check if webinar already has a Zoom meeting
  const hasZoomMeeting = webinar?.zoom_meeting_id || webinar?.zoom_join_url

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Zoom Meeting Setup
        </CardTitle>
        <CardDescription>Create a Zoom meeting or webinar for "{webinar?.title}"</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Zoom meeting created successfully!</AlertDescription>
          </Alert>
        )}

        {hasZoomMeeting ? (
          <div className="space-y-3">
            <Alert className="border-blue-200 bg-blue-50">
              <Video className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                This webinar already has a Zoom meeting configured.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Meeting ID:</span>
                <p className="text-gray-900 font-mono">{webinar.zoom_meeting_id}</p>
              </div>
              {webinar.zoom_join_url && (
                <div>
                  <span className="font-medium text-gray-600">Join URL:</span>
                  <a
                    href={webinar.zoom_join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {webinar.zoom_join_url}
                  </a>
                </div>
              )}
              {webinar.zoom_password && (
                <div>
                  <span className="font-medium text-gray-600">Password:</span>
                  <p className="text-gray-900 font-mono">{webinar.zoom_password}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Meeting Type</label>
              <Select value={meetingType} onValueChange={setMeetingType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Meeting</div>
                        <div className="text-xs text-gray-500">Up to 100 participants</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="webinar">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Webinar</div>
                        <div className="text-xs text-gray-500">Up to 10,000 attendees</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <h4 className="font-medium mb-2">
                {meetingType === "webinar" ? "Webinar Features:" : "Meeting Features:"}
              </h4>
              <ul className="space-y-1 text-gray-600">
                {meetingType === "webinar" ? (
                  <>
                    <li>• Large audience capacity (up to 10,000)</li>
                    <li>• Registration management</li>
                    <li>• Q&A and polling features</li>
                    <li>• Attendee view-only mode</li>
                    <li>• Professional webinar controls</li>
                  </>
                ) : (
                  <>
                    <li>• Interactive participation (up to 100)</li>
                    <li>• Screen sharing for all</li>
                    <li>• Breakout rooms available</li>
                    <li>• Collaborative features</li>
                    <li>• Waiting room control</li>
                  </>
                )}
              </ul>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <h4 className="font-medium text-blue-800 mb-1">Recommendation:</h4>
              <p className="text-blue-700">
                {webinar?.max_attendees > 100
                  ? "Use Webinar for large audiences and professional presentations."
                  : "Use Meeting for smaller, interactive sessions."}
              </p>
            </div>

            <Button onClick={handleCreateMeeting} disabled={isCreating || isLoading} className="w-full">
              {isCreating ? (
                <>Creating {meetingType}...</>
              ) : (
                <>Create Zoom {meetingType === "webinar" ? "Webinar" : "Meeting"}</>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ZoomMeetingCreator
