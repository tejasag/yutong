export interface WebSocketMessage {
  type: string;
  reason: string;
  payload: { [key: string]: any };
  envelope_id: string;
  retry_attempt?: number; // type: events_api
  retry_reason?: string; // type: events_api
  accepts_response_payload?: boolean; // type: events_api, slash_commands, interactive
}
