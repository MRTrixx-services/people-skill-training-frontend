"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import axios from "axios"
import { useAuth } from "./AuthContext"

// Action types
const ZOOM_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_CONNECTION_STATUS: "SET_CONNECTION_STATUS",
  SET_MEETINGS: "SET_MEETINGS",
  SET_WEBINARS: "SET_WEBINARS",
  SET_RECORDINGS: "SET_RECORDINGS",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  ADD_MEETING: "ADD_MEETING",
  UPDATE_MEETING: "UPDATE_MEETING",
  REMOVE_MEETING: "REMOVE_MEETING",
}

// Initial state
const initialState = {
  isConnected: false,
  connectionStatus: null,
  meetings: [],
  webinars: [],
  recordings: [],
  isLoading: false,
  error: null,
}

// Reducer
const zoomReducer = (state, action) => {
  switch (action.type) {
    case ZOOM_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    case ZOOM_ACTIONS.SET_CONNECTION_STATUS:
      return {
        ...state,
        isConnected: action.payload.is_connected,
        connectionStatus: action.payload,
        isLoading: false,
      }
    case ZOOM_ACTIONS.SET_MEETINGS:
      return {
        ...state,
        meetings: action.payload,
        isLoading: false,
      }
    case ZOOM_ACTIONS.SET_WEBINARS:
      return {
        ...state,
        webinars: action.payload,
        isLoading: false,
      }
    case ZOOM_ACTIONS.SET_RECORDINGS:
      return {
        ...state,
        recordings: action.payload,
        isLoading: false,
      }
    case ZOOM_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    case ZOOM_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }
    case ZOOM_ACTIONS.ADD_MEETING:
      return {
        ...state,
        meetings: [...state.meetings, action.payload],
      }
    case ZOOM_ACTIONS.UPDATE_MEETING:
      return {
        ...state,
        meetings: state.meetings.map((meeting) => (meeting.id === action.payload.id ? action.payload : meeting)),
      }
    case ZOOM_ACTIONS.REMOVE_MEETING:
      return {
        ...state,
        meetings: state.meetings.filter((meeting) => meeting.id !== action.payload),
      }
    default:
      return state
  }
}

// Create context
const ZoomContext = createContext(null)

// Zoom Provider Component
export const ZoomProvider = ({ children }) => {
  const [state, dispatch] = useReducer(zoomReducer, initialState)
  const { isAuthenticated } = useAuth()

  // Check connection status on mount
  useEffect(() => {
    if (isAuthenticated) {
      checkConnectionStatus()
    }
  }, [isAuthenticated])

  // Check Zoom connection status
  const checkConnectionStatus = async () => {
    dispatch({ type: ZOOM_ACTIONS.SET_LOADING, payload: true })

    try {
      const response = await axios.get("/zoom/connection/status/")
      dispatch({
        type: ZOOM_ACTIONS.SET_CONNECTION_STATUS,
        payload: response.data,
      })
    } catch (error) {
      console.error("Error checking Zoom connection:", error)
      dispatch({
        type: ZOOM_ACTIONS.SET_ERROR,
        payload: "Failed to check Zoom connection status",
      })
    }
  }

  // Get Zoom authorization URL
  const getAuthorizationUrl = async (redirectUri, state = null) => {
    try {
      const response = await axios.post("/zoom/auth/url/", {
        redirect_uri: redirectUri,
        state: state,
      })
      return response.data.authorization_url
    } catch (error) {
      console.error("Error getting Zoom auth URL:", error)
      throw new Error("Failed to get authorization URL")
    }
  }

  // Handle OAuth callback
  const handleOAuthCallback = async (code, redirectUri, state = null) => {
    dispatch({ type: ZOOM_ACTIONS.SET_LOADING, payload: true })

    try {
      const response = await axios.post("/zoom/auth/callback/", {
        code,
        redirect_uri: redirectUri,
        state,
      })

      // Refresh connection status
      await checkConnectionStatus()

      return response.data
    } catch (error) {
      console.error("Error handling OAuth callback:", error)
      dispatch({
        type: ZOOM_ACTIONS.SET_ERROR,
        payload: error.response?.data?.error || "Failed to connect to Zoom",
      })
      throw error
    }
  }

  // Disconnect from Zoom
  const disconnectZoom = async () => {
    dispatch({ type: ZOOM_ACTIONS.SET_LOADING, payload: true })

    try {
      await axios.post("/zoom/disconnect/")
      dispatch({
        type: ZOOM_ACTIONS.SET_CONNECTION_STATUS,
        payload: { is_connected: false },
      })
    } catch (error) {
      console.error("Error disconnecting from Zoom:", error)
      dispatch({
        type: ZOOM_ACTIONS.SET_ERROR,
        payload: "Failed to disconnect from Zoom",
      })
    }
  }

  // Create Zoom meeting for webinar
  const createZoomMeeting = async (webinarId, meetingType = "meeting") => {
    dispatch({ type: ZOOM_ACTIONS.SET_LOADING, payload: true })

    try {
      const response = await axios.post("/zoom/meetings/create/", {
        webinar_id: webinarId,
        meeting_type: meetingType,
      })

      dispatch({
        type: ZOOM_ACTIONS.ADD_MEETING,
        payload: response.data.meeting,
      })

      return response.data
    } catch (error) {
      console.error("Error creating Zoom meeting:", error)
      dispatch({
        type: ZOOM_ACTIONS.SET_ERROR,
        payload: error.response?.data?.error || "Failed to create Zoom meeting",
      })
      throw error
    }
  }

  // Get user's meetings
  const fetchMeetings = async () => {
    dispatch({ type: ZOOM_ACTIONS.SET_LOADING, payload: true })

    try {
      const response = await axios.get("/zoom/meetings/")
      dispatch({
        type: ZOOM_ACTIONS.SET_MEETINGS,
        payload: response.data.results || response.data,
      })
    } catch (error) {
      console.error("Error fetching meetings:", error)
      dispatch({
        type: ZOOM_ACTIONS.SET_ERROR,
        payload: "Failed to fetch meetings",
      })
    }
  }

  // Get user's webinars
  const fetchWebinars = async () => {
    dispatch({ type: ZOOM_ACTIONS.SET_LOADING, payload: true })

    try {
      const response = await axios.get("/zoom/webinars/")
      dispatch({
        type: ZOOM_ACTIONS.SET_WEBINARS,
        payload: response.data.results || response.data,
      })
    } catch (error) {
      console.error("Error fetching webinars:", error)
      dispatch({
        type: ZOOM_ACTIONS.SET_ERROR,
        payload: "Failed to fetch webinars",
      })
    }
  }

  // Get recordings
  const fetchRecordings = async () => {
    dispatch({ type: ZOOM_ACTIONS.SET_LOADING, payload: true })

    try {
      const response = await axios.get("/zoom/recordings/")
      dispatch({
        type: ZOOM_ACTIONS.SET_RECORDINGS,
        payload: response.data.results || response.data,
      })
    } catch (error) {
      console.error("Error fetching recordings:", error)
      dispatch({
        type: ZOOM_ACTIONS.SET_ERROR,
        payload: "Failed to fetch recordings",
      })
    }
  }

  // Sync recordings for a webinar
  const syncRecordings = async (webinarId) => {
    dispatch({ type: ZOOM_ACTIONS.SET_LOADING, payload: true })

    try {
      const response = await axios.post(`/zoom/recordings/sync/${webinarId}/`)

      // Refresh recordings list
      await fetchRecordings()

      return response.data
    } catch (error) {
      console.error("Error syncing recordings:", error)
      dispatch({
        type: ZOOM_ACTIONS.SET_ERROR,
        payload: "Failed to sync recordings",
      })
      throw error
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: ZOOM_ACTIONS.CLEAR_ERROR })
  }

  // Context value
  const value = {
    // State
    ...state,
    // Actions
    checkConnectionStatus,
    getAuthorizationUrl,
    handleOAuthCallback,
    disconnectZoom,
    createZoomMeeting,
    fetchMeetings,
    fetchWebinars,
    fetchRecordings,
    syncRecordings,
    clearError,
  }

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>
}

// Custom hook to use Zoom context
export const useZoom = () => {
  const context = useContext(ZoomContext)
  if (!context) {
    throw new Error("useZoom must be used within a ZoomProvider")
  }
  return context
}

export default ZoomContext
