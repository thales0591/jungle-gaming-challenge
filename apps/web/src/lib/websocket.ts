import { useEffect, useRef, useCallback } from "react"
import { useAuthStore } from "@/lib/store"

export type WebSocketEvent =
  | { type: "task:created"; data: any }
  | { type: "task:updated"; data: any }
  | { type: "comment:new"; data: any }
  | { type: "notification:new"; data: any }

type WebSocketEventHandler = (event: WebSocketEvent) => void

const WS_URL = "ws://localhost:3001"

export function useWebSocket(onMessage?: WebSocketEventHandler) {
  const { token, isAuthenticated } = useAuthStore((state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }))
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    if (!isAuthenticated || !token) {
      return
    }

    try {
      const ws = new WebSocket(`${WS_URL}?token=${token}`)

      ws.onopen = () => {
        console.log("[v0] WebSocket connected")
        reconnectAttemptsRef.current = 0
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log("[v0] WebSocket message received:", data)
          if (onMessage) {
            onMessage(data)
          }
        } catch (error) {
          console.error("[v0] Failed to parse WebSocket message:", error)
        }
      }

      ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
      }

      ws.onclose = () => {
        console.log("[v0] WebSocket disconnected")
        wsRef.current = null

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
          console.log(`[v0] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`)

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        }
      }

      wsRef.current = ws
    } catch (error) {
      console.error("[v0] Failed to create WebSocket connection:", error)
    }
  }, [isAuthenticated, token, onMessage])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const send = useCallback((data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    } else {
      console.warn("[v0] WebSocket is not connected")
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    send,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
  }
}
