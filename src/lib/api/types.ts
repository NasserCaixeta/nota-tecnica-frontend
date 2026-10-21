export type ParticipationStatus = "pending" | "approved" | "rejected" | "suspended";
export type UserProfileType = "customer" | "workshop_owner" | "admin";
export type GarageValidationStatus =
  | "pending_documents"
  | "under_review"
  | "active"
  | "rejected"
  | "payment_required";
export type VehicleRelationshipType =
  | "owner"
  | "spouse"
  | "family"
  | "company_representative"
  | "fleet_responsible"
  | "recent_buyer"
  | "authorized_driver"
  | "other";
export type ValidationDocumentType =
  | "crlv"
  | "owner_authorization"
  | "relationship_proof"
  | "company_contract_or_power_of_attorney"
  | "representative_identity"
  | "fleet_authorization"
  | "purchase_receipt_or_atpv"
  | "driver_identity";

export type UserRead = {
  id: number;
  full_name: string;
  email: string;
  cpf: string;
  profile_type: UserProfileType;
  is_admin: boolean;
  participation_status: ParticipationStatus;
  participation_version: number;
  participation_reason: string | null;
  capabilities: string[];
  phone?: string;
  city: string;
  state: string;
};

export type GaragePermissions = {
  can_add_maintenance: boolean;
  can_upload_documents: boolean;
  can_submit_review: boolean;
  can_share_history: boolean;
  can_generate_sale_report: boolean;
};

export type GarageVehicleItem = {
  vehicle_id: number;
  vehicle_link_id: number;
  plate: string;
  brand: string;
  model: string;
  model_year: number;
  relationship_type: VehicleRelationshipType;
  garage_status: GarageValidationStatus;
  verification_rejection_reason: string | null;
  review_attempts: number;
  permissions: GaragePermissions;
  documents: {
    required: ValidationDocumentType[];
    uploaded: ValidationDocumentType[];
    missing: ValidationDocumentType[];
  };
  maintenance_alerts: Array<Record<string, string>>;
  recommended_workshops: Array<{
    workshop_id: number;
    trade_name: string;
    city: string;
    state: string;
    score: number;
  }>;
  created_at: string;
  updated_at: string;
};

export type GarageDashboard = {
  summary: {
    total: number;
    pending_documents: number;
    under_review: number;
    active: number;
    rejected: number;
    payment_required: number;
    has_free_vehicle_slot: boolean;
  };
  vehicles: GarageVehicleItem[];
};
