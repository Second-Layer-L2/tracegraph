export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type HypothesisStatus = 'Supported' | 'Rejected' | 'Unresolved';

export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  timestamp: string;
  src_ip: string;
  dst_ip: string;
  description: string;
}

export interface CaseEvent {
  id: string;
  timestamp: string;
  source: 'zeek_dns' | 'zeek_conn';
  type: 'dns' | 'conn';
  src_ip: string;
  dst_ip: string;
  query?: string;
  qtype?: string;
  rcode?: string;
  src_port?: number;
  dst_port?: number;
  proto?: string;
  service?: string;
  duration?: number;
  bytes?: number;
}

export interface Hypothesis {
  id: string;
  title: string;
  description: string;
  status: HypothesisStatus;
  evidence_ids: string[];
}

export interface Evidence {
  id: string;
  event_ids: string[];
  description: string;
}

export interface CaseData {
  id: string;
  status: string;
  alert: Alert;
  events: CaseEvent[];
  hypotheses: Hypothesis[];
  evidence: Evidence[];
}
