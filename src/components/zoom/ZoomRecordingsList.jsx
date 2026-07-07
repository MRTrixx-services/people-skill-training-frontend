"use client"

import { useEffect, useState } from "react"
import { useZoom } from "../../contexts/ZoomContext"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Alert, AlertDescription } from "../ui/alert"
import {
  Play,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  FileText,
  Video,
  Mic,
  AlertCircle,
  ExternalLink,
} from "lucide-react"

const ZoomRecordingsList = ({ webinarId = null }) => {
  const { recordings, isLoading, error, fetchRecordings, syncRecordings, clearError } = useZoom()

  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    fetchRecordings()
  }, [])

  const handleSyncRecordings = async () => {
    if (!webinarId) return

    setIsSyncing(true)
    clearError()

    try {
      await syncRecordings(webinarId)
    } catch (error) {
      console.error("Error syncing recordings:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const getRecordingIcon = (recordingType) => {
    switch (recordingType) {
      case "shared_screen_with_speaker_view":
      case "shared_screen_with_gallery_view":
      case "speaker_view":
      case "gallery_view":
      case "shared_screen":
        return <Video className="w-4 h-4" />
      case "audio_only":
        return <Mic className="w-4 h-4" />
      case "audio_transcript":
      case "chat_file":
        return <FileText className="w-4 h-4" />
      default:
        return <Play className="w-4 h-4" />
    }
  }

  const getRecordingTypeLabel = (recordingType) => {
    const labels = {
      shared_screen_with_speaker_view: "Screen + Speaker",
      shared_screen_with_gallery_view: "Screen + Gallery",
      speaker_view: "Speaker View",
      gallery_view: "Gallery View",
      shared_screen: "Screen Share",
      audio_only: "Audio Only",
      audio_transcript: "Transcript",
      chat_file: "Chat File",
      timeline: "Timeline",
    }
    return labels[recordingType] || recordingType
  }

  const getStatusBadge = (status) => {
    const variants = {
      completed: "success",
      processing: "warning",
      failed: "destructive",
    }

    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatFileSize = (sizeMB) => {
    if (!sizeMB) return "N/A"
    return sizeMB >= 1024 ? `${(sizeMB / 1024).toFixed(1)} GB` : `${sizeMB} MB`
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  // Filter recordings by webinar if webinarId is provided
  const filteredRecordings = webinarId
    ? recordings.filter(
        (recording) => recording.zoom_meeting?.webinar === webinarId || recording.zoom_webinar?.webinar === webinarId,
      )
    : recordings

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Zoom Recordings
            </CardTitle>
            <CardDescription>{webinarId ? "Recordings for this webinar" : "All your Zoom recordings"}</CardDescription>
          </div>
          <div className="flex gap-2">
            {webinarId && (
              <Button variant="outline" size="sm" onClick={handleSyncRecordings} disabled={isSyncing || isLoading}>
                <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                Sync
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={fetchRecordings} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && filteredRecordings.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading recordings...
          </div>
        ) : filteredRecordings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Play className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recordings found</p>
            {webinarId && <p className="text-sm mt-2">Recordings will appear here after your webinar is completed</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecordings.map((recording) => (
              <div key={recording.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getRecordingIcon(recording.recording_type)}
                    <div>
                      <h4 className="font-medium">{getRecordingTypeLabel(recording.recording_type)}</h4>
                      <p className="text-sm text-gray-600">
                        {recording.meeting_topic || recording.webinar_topic || "Untitled"}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(recording.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(recording.recording_start)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(recording.duration_minutes)}</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Size:</span> {formatFileSize(recording.file_size_mb)}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Format:</span> {recording.file_type}
                  </div>
                </div>

                {recording.status === "completed" && (
                  <div className="flex gap-2">
                    {recording.play_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(recording.play_url, "_blank")}
                        className="flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Play
                      </Button>
                    )}
                    {recording.download_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(recording.download_url, "_blank")}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(recording.download_url, "_blank")}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View in Zoom
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ZoomRecordingsList
