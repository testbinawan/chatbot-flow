export type BotFlowData = {
  id: number;
  bot_template_id: number;
  bot_flow_type_id: number;
  next_flow_id: number;
  timeout_duration: number;
  is_initial: number;
  is_active: number;
  created_at: string;
  update_at: string;
  bot_flow_type?: string;
  total_bot_dialogs?: number;
}