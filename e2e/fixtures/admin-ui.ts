import type { UserRead, GarageDashboard, GarageVehicleItem } from "../../src/lib/api/types";
import type { AdminGarageVehicleLinkRead, MaintenanceReviewDetail } from "../../src/lib/api/admin";
import type { WorkshopClaimRead, WorkshopRead } from "../../src/lib/api/workshops";
import type { MaintenanceRecord, DisputeRead } from "../../src/lib/api/maintenance";
import type { PaymentConfig, PaymentOrder, SubscriptionSummary, PaidHistory } from "../../src/lib/api/payments";
import type { Notification } from "../../src/lib/api/notifications";

type CompleteUser=UserRead & Record<string,unknown>;
type RequiredRoutes={
 "/users/me":CompleteUser;
 "/admin/participants":CompleteUser[];
 "/admin/garage/vehicle-links/pending":AdminGarageVehicleLinkRead[];
 "/admin/garage/vehicle-links/11":AdminGarageVehicleLinkRead;
 "/admin/workshop-claims":WorkshopClaimRead[];
 "/admin/maintenance-reviews":MaintenanceRecord[];
 "/admin/maintenance-reviews/42":MaintenanceReviewDetail;
 "/admin/service-disputes":DisputeRead[];
 "/garage":GarageDashboard;
 "/garage/vehicles/11":GarageVehicleItem;
 "/workshops/me":WorkshopRead[];
 "/payments/config":PaymentConfig;
 "/payments/orders/visual-order":PaymentOrder;
 "/payments/subscription":SubscriptionSummary;
 "/history/vehicles/ABC1D23":PaidHistory;
 "/notifications":Notification[];
};
// All data is synthetic. Only known GET routes are fulfilled; writes require
// an explicit handler in the individual scenario and never reach the VPS.
export const uiFixtures:RequiredRoutes & Record<string,unknown> = {
  "/users/me": {
    "id": 1,
    "full_name": "Administração do piloto",
    "email": "admin@example.com",
    "cpf": "52998224725",
    "phone": "11999990000",
    "birth_date": "1990-01-01",
    "profile_type": "customer",
    "zip_code": "01001000",
    "street": "Rua sintética",
    "number": "1",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "complement": null,
    "is_active": true,
    "is_admin": true,
    "participation_status": "approved",
    "participation_version": 1,
    "participation_reason": null,
    "capabilities": [
      "customer",
      "admin"
    ],
    "created_at": "2026-10-01T10:00:00Z",
    "updated_at": "2026-10-01T10:00:00Z"
  },
  "/admin/participants": [
    {
      "id": 2,
      "full_name": "Mariana de Albuquerque e Silva — participante de testes com nome extenso",
      "email": "mariana.albuquerque.silva@example.com",
      "cpf": "52998224725",
      "phone": "11999990000",
      "birth_date": "1990-01-01",
      "profile_type": "customer",
      "zip_code": "01001000",
      "street": "Rua sintética",
      "number": "1",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "complement": null,
      "is_active": true,
      "is_admin": false,
      "participation_status": "pending",
      "participation_version": 1,
      "participation_reason": null,
      "capabilities": [],
      "created_at": "2026-10-01T10:00:00Z",
      "updated_at": "2026-10-01T10:00:00Z"
    }
  ],
  "/admin/workshop-claims": [
    {
      "id": 7,
      "workshop_id": 7,
      "user_id": 2,
      "user_full_name": "Mariana de Albuquerque e Silva — participante de testes com nome extenso",
      "trade_name": "Oficina Mecânica Horizonte — atendimento especializado",
      "cnpj": "04252011000110",
      "status": "pending",
      "review_version": 1,
      "reason": null,
      "documents": [
        {
          "id": 2,
          "owner_user_id": 2,
          "vehicle_id": null,
          "vehicle_link_id": null,
          "maintenance_record_id": null,
          "maintenance_revision_id": null,
          "service_dispute_id": null,
          "document_type": "other",
          "validation_document_type": "company_contract_or_power_of_attorney",
          "file_name": "comprovante-documental-do-vinculo-com-veiculo-ABC1D23-versao-completa.pdf",
          "content_type": "application/pdf",
          "review_status": "pending",
          "review_version": 1,
          "upload_status": "uploaded",
          "storage_verified": true,
          "rejection_reason": null,
          "file_size_bytes": 32000
        },
        {
          "id": 3,
          "owner_user_id": 2,
          "vehicle_id": null,
          "vehicle_link_id": null,
          "maintenance_record_id": null,
          "maintenance_revision_id": null,
          "service_dispute_id": null,
          "document_type": "other",
          "validation_document_type": "representative_identity",
          "file_name": "comprovante-documental-do-vinculo-com-veiculo-ABC1D23-versao-completa.pdf",
          "content_type": "application/pdf",
          "review_status": "pending",
          "review_version": 1,
          "upload_status": "uploaded",
          "storage_verified": false,
          "rejection_reason": null,
          "file_size_bytes": 32000
        }
      ]
    }
  ],
  "/admin/garage/vehicle-links/pending": [
    {
      "vehicle_link_id": 11,
      "vehicle_id": 11,
      "user_id": 2,
      "plate": "ABC1D23",
      "relationship_type": "owner",
      "garage_status": "under_review",
      "required_documents": [
        "crlv"
      ],
      "uploaded_documents": [
        "crlv"
      ],
      "missing_documents": [],
      "verification_rejection_reason": null,
      "review_attempts": 1,
      "review_version": 1,
      "approved_documents": [],
      "awaiting_review_documents": [
        "crlv"
      ],
      "rejected_documents": [],
      "documents": [
        {
          "id": 1,
          "owner_user_id": 2,
          "vehicle_id": 11,
          "vehicle_link_id": 11,
          "maintenance_record_id": null,
          "maintenance_revision_id": null,
          "service_dispute_id": null,
          "document_type": "other",
          "validation_document_type": "crlv",
          "file_name": "comprovante-documental-do-vinculo-com-veiculo-ABC1D23-versao-completa.pdf",
          "content_type": "application/pdf",
          "review_status": "pending",
          "review_version": 1,
          "upload_status": "uploaded",
          "storage_verified": true,
          "rejection_reason": null,
          "file_size_bytes": 32000
        }
      ],
      "admin_review_note": null,
      "user_full_name": "Mariana de Albuquerque e Silva — participante de testes com nome extenso",
      "submitted_for_review_at": "2026-10-30T10:00:00Z",
      "reviewed_at": null
    }
  ],
  "/admin/garage/vehicle-links/11": {
    "vehicle_link_id": 11,
    "vehicle_id": 11,
    "user_id": 2,
    "plate": "ABC1D23",
    "relationship_type": "owner",
    "garage_status": "under_review",
    "required_documents": [
      "crlv"
    ],
    "uploaded_documents": [
      "crlv"
    ],
    "missing_documents": [],
    "verification_rejection_reason": null,
    "review_attempts": 1,
    "review_version": 1,
    "approved_documents": [],
    "awaiting_review_documents": [
      "crlv"
    ],
    "rejected_documents": [],
    "documents": [
      {
        "id": 1,
        "owner_user_id": 2,
        "vehicle_id": 11,
        "vehicle_link_id": 11,
        "maintenance_record_id": null,
        "maintenance_revision_id": null,
        "service_dispute_id": null,
        "document_type": "other",
        "validation_document_type": "crlv",
        "file_name": "comprovante-documental-do-vinculo-com-veiculo-ABC1D23-versao-completa.pdf",
        "content_type": "application/pdf",
        "review_status": "pending",
        "review_version": 1,
        "upload_status": "uploaded",
        "storage_verified": true,
        "rejection_reason": null,
        "file_size_bytes": 32000
      }
    ],
    "admin_review_note": null,
    "user_full_name": "Mariana de Albuquerque e Silva — participante de testes com nome extenso",
    "submitted_for_review_at": "2026-10-30T10:00:00Z",
    "reviewed_at": null
  },
  "/admin/maintenance-reviews": [
    {
      "visibility": "private",
      "id": 42,
      "vehicle_id": 11,
      "author_user_id": 2,
      "workshop_id": 7,
      "origin": "workshop",
      "service_date": "2026-10-01",
      "odometer": 51000,
      "category": "mechanical",
      "vehicle_system": "engine",
      "description": "Revisão preventiva com substituição de óleo, filtros e conferência dos sistemas do veículo",
      "labor_cost": "150.00",
      "parts_cost": "280.00",
      "total_cost": "430.00",
      "warranty_months": 3,
      "entry_date": "2026-10-01",
      "promised_delivery_date": "2026-10-02",
      "actual_delivery_date": "2026-10-02",
      "status": "completed",
      "created_at": "2026-10-01T10:00:00Z",
      "updated_at": "2026-10-01T10:00:00Z",
      "current_revision_id": 8,
      "editorial_status": "submitted",
      "admin_status": "pending",
      "customer_acknowledgement": "awaiting_customer",
      "customer_user_id": 2,
      "review_version": 3,
      "public_description": null,
      "review_reason": null,
      "published": false,
      "dispute_open": false,
      "superseded_by_id": null,
      "permissions": {
        "can_edit": false,
        "can_submit": false,
        "can_acknowledge": false,
        "can_dispute": false,
        "can_invite": false,
        "can_review": false
      }
    }
  ],
  "/admin/maintenance-reviews/42": {
    "visibility": "private",
    "id": 42,
    "vehicle_id": 11,
    "author_user_id": 2,
    "workshop_id": 7,
    "origin": "workshop",
    "service_date": "2026-10-01",
    "odometer": 51000,
    "category": "mechanical",
    "vehicle_system": "engine",
    "description": "Revisão preventiva com substituição de óleo, filtros e conferência dos sistemas do veículo",
    "labor_cost": "150.00",
    "parts_cost": "280.00",
    "total_cost": "430.00",
    "warranty_months": 3,
    "entry_date": "2026-10-01",
    "promised_delivery_date": "2026-10-02",
    "actual_delivery_date": "2026-10-02",
    "status": "completed",
    "created_at": "2026-10-01T10:00:00Z",
    "updated_at": "2026-10-01T10:00:00Z",
    "current_revision_id": 8,
    "editorial_status": "submitted",
    "admin_status": "pending",
    "customer_acknowledgement": "awaiting_customer",
    "customer_user_id": 2,
    "review_version": 3,
    "public_description": null,
    "review_reason": null,
    "published": false,
    "dispute_open": false,
    "superseded_by_id": null,
    "permissions": {
      "can_edit": false,
      "can_submit": false,
      "can_acknowledge": false,
      "can_dispute": false,
      "can_invite": false,
      "can_review": false
    },
    "documents": [
      {
        "id": 1,
        "owner_user_id": 2,
        "vehicle_id": 11,
        "vehicle_link_id": 11,
        "maintenance_record_id": 42,
        "maintenance_revision_id": 8,
        "service_dispute_id": null,
        "document_type": "invoice",
        "validation_document_type": null,
        "file_name": "comprovante-documental-do-vinculo-com-veiculo-ABC1D23-versao-completa.pdf",
        "content_type": "application/pdf",
        "review_status": "pending",
        "review_version": 1,
        "upload_status": "uploaded",
        "storage_verified": true,
        "rejection_reason": null,
        "file_size_bytes": 32000
      }
    ]
  },
  "/admin/service-disputes": [
    {
      "id": 1,
      "record_id": 42,
      "revision_id": 8,
      "customer_user_id": 2,
      "reason": "Cliente solicita conferência do serviço e do comprovante anexado pela oficina.",
      "status": "open",
      "resolution": null,
      "resolution_reason": null,
      "review_version": 1,
      "documents": [
        {
          "id": 1,
          "owner_user_id": 2,
          "vehicle_id": 11,
          "vehicle_link_id": 11,
          "maintenance_record_id": null,
          "maintenance_revision_id": null,
          "service_dispute_id": null,
          "document_type": "other",
          "validation_document_type": "crlv",
          "file_name": "comprovante-documental-do-vinculo-com-veiculo-ABC1D23-versao-completa.pdf",
          "content_type": "application/pdf",
          "review_status": "pending",
          "review_version": 1,
          "upload_status": "uploaded",
          "storage_verified": true,
          "rejection_reason": null,
          "file_size_bytes": 32000
        }
      ],
      "messages": [
        {
          "id": 1,
          "actor_id": 2,
          "body": "Peço revisão das informações de entrega e das peças descritas no atendimento."
        }
      ]
    }
  ],
  "/admin/service-reviews": [
    {
      "id": 1,
      "record_id": 42,
      "revision_id": 8,
      "stars": 4,
      "comment": "Atendimento documentado, com prazo informado e esclarecimento dos serviços executados.",
      "comment_hidden": false,
      "review_version": 1
    }
  ],
  "/admin/service-associations": [
    {
      "id": 1,
      "reason": "Possível duplicidade apresentada pelos envolvidos, exige conferência administrativa.",
      "record": {
        "visibility": "private",
        "id": 42,
        "vehicle_id": 11,
        "author_user_id": 2,
        "workshop_id": 7,
        "origin": "workshop",
        "service_date": "2026-10-01",
        "odometer": 51000,
        "category": "mechanical",
        "vehicle_system": "engine",
        "description": "Revisão preventiva com substituição de óleo, filtros e conferência dos sistemas do veículo",
        "labor_cost": "150.00",
        "parts_cost": "280.00",
        "total_cost": "430.00",
        "warranty_months": 3,
        "entry_date": "2026-10-01",
        "promised_delivery_date": "2026-10-02",
        "actual_delivery_date": "2026-10-02",
        "status": "completed",
        "created_at": "2026-10-01T10:00:00Z",
        "updated_at": "2026-10-01T10:00:00Z",
        "current_revision_id": 8,
        "editorial_status": "submitted",
        "admin_status": "pending",
        "customer_acknowledgement": "awaiting_customer",
        "customer_user_id": 2,
        "review_version": 3,
        "public_description": null,
        "review_reason": null,
        "published": false,
        "dispute_open": false,
        "superseded_by_id": null,
        "permissions": {
          "can_edit": false,
          "can_submit": false,
          "can_acknowledge": false,
          "can_dispute": false,
          "can_invite": false,
          "can_review": false
        }
      },
      "other_record": {
        "visibility": "private",
        "id": 43,
        "vehicle_id": 11,
        "author_user_id": 2,
        "workshop_id": 7,
        "origin": "workshop",
        "service_date": "2026-10-01",
        "odometer": 51000,
        "category": "mechanical",
        "vehicle_system": "engine",
        "description": "Registro do cliente referente ao mesmo atendimento",
        "labor_cost": "150.00",
        "parts_cost": "280.00",
        "total_cost": "430.00",
        "warranty_months": 3,
        "entry_date": "2026-10-01",
        "promised_delivery_date": "2026-10-02",
        "actual_delivery_date": "2026-10-02",
        "status": "completed",
        "created_at": "2026-10-01T10:00:00Z",
        "updated_at": "2026-10-01T10:00:00Z",
        "current_revision_id": 9,
        "editorial_status": "submitted",
        "admin_status": "pending",
        "customer_acknowledgement": "awaiting_customer",
        "customer_user_id": 2,
        "review_version": 3,
        "public_description": null,
        "review_reason": null,
        "published": false,
        "dispute_open": false,
        "superseded_by_id": null,
        "permissions": {
          "can_edit": false,
          "can_submit": false,
          "can_acknowledge": false,
          "can_dispute": false,
          "can_invite": false,
          "can_review": false
        }
      }
    }
  ],
  "/admin/account-requests": [
    {
      "id": 1,
      "user_id": 2,
      "kind": "identity_correction",
      "reason": "Solicito conferência dos dados de identidade para regularização do vínculo.",
      "status": "pending",
      "created_at": "2026-10-30T10:00:00Z"
    }
  ],
  "/garage": {
    "summary": {
      "total": 1,
      "active": 1,
      "pending_documents": 0,
      "under_review": 0,
      "rejected": 0,
      "payment_required": 0,
      "has_free_vehicle_slot": false
    },
    "vehicles": [
      {
        "vehicle_id": 11,
        "vehicle_link_id": 11,
        "plate": "ABC1D23",
        "brand": "Honda",
        "model": "Civic Touring",
        "model_year": 2020,
        "relationship_type": "owner",
        "garage_status": "active",
        "commercial_access": "free",
        "admin_review_note": null,
        "review_version": 1,
        "verification_rejection_reason": null,
        "review_attempts": 1,
        "permissions": {
          "can_add_maintenance": true,
          "can_upload_documents": true,
          "can_submit_review": true,
          "can_share_history": false,
          "can_generate_sale_report": false
        },
        "documents": {
          "required": [
            "crlv"
          ],
          "uploaded": [
            "crlv"
          ],
          "missing": [],
          "missing_uploads": [],
          "awaiting_review": [],
          "rejected": [],
          "approved": [
            "crlv"
          ]
        },
        "maintenance_alerts": [],
        "recommended_workshops": [],
        "created_at": "2026-10-01T10:00:00Z",
        "updated_at": "2026-10-01T10:00:00Z"
      }
    ]
  },
  "/garage/vehicles/11": {
    "vehicle_id": 11,
    "vehicle_link_id": 11,
    "plate": "ABC1D23",
    "brand": "Honda",
    "model": "Civic Touring",
    "model_year": 2020,
    "relationship_type": "owner",
    "garage_status": "active",
    "commercial_access": "free",
    "admin_review_note": null,
    "review_version": 1,
    "verification_rejection_reason": null,
    "review_attempts": 1,
    "permissions": {
      "can_add_maintenance": true,
      "can_upload_documents": true,
      "can_submit_review": true,
      "can_share_history": false,
      "can_generate_sale_report": false
    },
    "documents": {
      "required": [
        "crlv"
      ],
      "uploaded": [
        "crlv"
      ],
      "missing": [],
      "missing_uploads": [],
      "awaiting_review": [],
      "rejected": [],
      "approved": [
        "crlv"
      ]
    },
    "maintenance_alerts": [],
    "recommended_workshops": [],
    "created_at": "2026-10-01T10:00:00Z",
    "updated_at": "2026-10-01T10:00:00Z"
  },
  "/vehicles/11/maintenance-records": [],
  "/workshops/me": [
    {
      "id": 7,
      "legal_name": "Oficina Horizonte Ltda",
      "trade_name": "Oficina Mecânica Horizonte — atendimento especializado",
      "cnpj": "04252011000110",
      "phone": "11999990000",
      "email": "oficina@example.com",
      "city": "São Paulo",
      "state": "SP",
      "zip_code": "01001000",
      "street": "Rua de Testes",
      "number": "10",
      "neighborhood": "Centro",
      "complement": null,
      "specialties": [
        "Mecânica"
      ],
      "source": "owner_claimed",
      "verification_status": "verified"
    }
  ],
  "/workshops/claims/me": [
    {
      "id": 7,
      "workshop_id": 7,
      "user_id": 2,
      "user_full_name": "Mariana de Albuquerque e Silva — participante de testes com nome extenso",
      "trade_name": "Oficina Mecânica Horizonte — atendimento especializado",
      "cnpj": "04252011000110",
      "status": "pending",
      "review_version": 1,
      "reason": null,
      "documents": [
        {
          "id": 2,
          "owner_user_id": 2,
          "vehicle_id": null,
          "vehicle_link_id": null,
          "maintenance_record_id": null,
          "maintenance_revision_id": null,
          "service_dispute_id": null,
          "document_type": "other",
          "validation_document_type": "company_contract_or_power_of_attorney",
          "file_name": "comprovante-documental-do-vinculo-com-veiculo-ABC1D23-versao-completa.pdf",
          "content_type": "application/pdf",
          "review_status": "pending",
          "review_version": 1,
          "upload_status": "uploaded",
          "storage_verified": true,
          "rejection_reason": null,
          "file_size_bytes": 32000
        },
        {
          "id": 3,
          "owner_user_id": 2,
          "vehicle_id": null,
          "vehicle_link_id": null,
          "maintenance_record_id": null,
          "maintenance_revision_id": null,
          "service_dispute_id": null,
          "document_type": "other",
          "validation_document_type": "representative_identity",
          "file_name": "comprovante-documental-do-vinculo-com-veiculo-ABC1D23-versao-completa.pdf",
          "content_type": "application/pdf",
          "review_status": "pending",
          "review_version": 1,
          "upload_status": "uploaded",
          "storage_verified": false,
          "rejection_reason": null,
          "file_size_bytes": 32000
        }
      ]
    }
  ],
  "/workshops/7/maintenance-records": [],
  "/maintenance-records/42": {
    "visibility": "private",
    "id": 42,
    "vehicle_id": 11,
    "author_user_id": 1,
    "workshop_id": 7,
    "origin": "workshop",
    "service_date": "2026-10-01",
    "odometer": 51000,
    "category": "mechanical",
    "vehicle_system": "engine",
    "description": "Revisão preventiva com substituição de óleo, filtros e conferência dos sistemas do veículo",
    "labor_cost": "150.00",
    "parts_cost": "280.00",
    "total_cost": "430.00",
    "warranty_months": 3,
    "entry_date": "2026-10-01",
    "promised_delivery_date": "2026-10-02",
    "actual_delivery_date": "2026-10-02",
    "status": "completed",
    "created_at": "2026-10-01T10:00:00Z",
    "updated_at": "2026-10-01T10:00:00Z",
    "current_revision_id": 8,
    "editorial_status": "submitted",
    "admin_status": "pending",
    "customer_acknowledgement": "awaiting_customer",
    "customer_user_id": 2,
    "review_version": 3,
    "public_description": null,
    "review_reason": null,
    "published": false,
    "dispute_open": false,
    "superseded_by_id": null,
    "permissions": {
      "can_edit": true,
      "can_submit": true,
      "can_acknowledge": false,
      "can_dispute": false,
      "can_invite": true,
      "can_review": false
    },
    "documents": [
      {
        "id": 1,
        "owner_user_id": 2,
        "vehicle_id": 11,
        "vehicle_link_id": 11,
        "maintenance_record_id": 42,
        "maintenance_revision_id": 8,
        "service_dispute_id": null,
        "document_type": "invoice",
        "validation_document_type": null,
        "file_name": "comprovante-documental-do-vinculo-com-veiculo-ABC1D23-versao-completa.pdf",
        "content_type": "application/pdf",
        "review_status": "pending",
        "review_version": 1,
        "upload_status": "uploaded",
        "storage_verified": true,
        "rejection_reason": null,
        "file_size_bytes": 32000
      }
    ]
  },
  "/maintenance-records/42/documents": [
    {
      "id": 1,
      "owner_user_id": 2,
      "vehicle_id": 11,
      "vehicle_link_id": 11,
      "maintenance_record_id": 42,
      "maintenance_revision_id": 8,
      "service_dispute_id": null,
      "document_type": "invoice",
      "validation_document_type": null,
      "file_name": "comprovante-documental-do-vinculo-com-veiculo-ABC1D23-versao-completa.pdf",
      "content_type": "application/pdf",
      "review_status": "pending",
      "review_version": 1,
      "upload_status": "uploaded",
      "storage_verified": true,
      "rejection_reason": null,
      "file_size_bytes": 32000
    }
  ],
  "/maintenance-records/42/duplicates": [],
  "/maintenance-records/42/disputes": [],
  "/maintenance-records/42/revisions": [
    {
      "id": 8,
      "revision_number": 1,
      "snapshot": {
        "visibility": "private",
        "id": 42,
        "vehicle_id": 11,
        "author_user_id": 1,
        "workshop_id": 7,
        "origin": "workshop",
        "service_date": "2026-10-01",
        "odometer": 51000,
        "category": "mechanical",
        "vehicle_system": "engine",
        "description": "Revisão preventiva com substituição de óleo, filtros e conferência dos sistemas do veículo",
        "labor_cost": "150.00",
        "parts_cost": "280.00",
        "total_cost": "430.00",
        "warranty_months": 3,
        "entry_date": "2026-10-01",
        "promised_delivery_date": "2026-10-02",
        "actual_delivery_date": "2026-10-02",
        "status": "completed",
        "created_at": "2026-10-01T10:00:00Z",
        "updated_at": "2026-10-01T10:00:00Z",
        "current_revision_id": 8,
        "editorial_status": "submitted",
        "admin_status": "pending",
        "customer_acknowledgement": "awaiting_customer",
        "customer_user_id": 2,
        "review_version": 3,
        "public_description": null,
        "review_reason": null,
        "published": false,
        "dispute_open": false,
        "superseded_by_id": null,
        "permissions": {
          "can_edit": true,
          "can_submit": true,
          "can_acknowledge": false,
          "can_dispute": false,
          "can_invite": true,
          "can_review": false
        },
        "documents": [
          {
            "id": 1,
            "owner_user_id": 2,
            "vehicle_id": 11,
            "vehicle_link_id": 11,
            "maintenance_record_id": 42,
            "maintenance_revision_id": 8,
            "service_dispute_id": null,
            "document_type": "invoice",
            "validation_document_type": null,
            "file_name": "comprovante-documental-do-vinculo-com-veiculo-ABC1D23-versao-completa.pdf",
            "content_type": "application/pdf",
            "review_status": "pending",
            "review_version": 1,
            "upload_status": "uploaded",
            "storage_verified": true,
            "rejection_reason": null,
            "file_size_bytes": 32000
          }
        ]
      },
      "admin_status": "pending",
      "customer_acknowledgement": "awaiting_customer"
    }
  ],
  "/maintenance-records/42/review": null,
  "/customer-services/pending": [
    {
      "visibility": "private",
      "id": 42,
      "vehicle_id": 11,
      "author_user_id": 1,
      "workshop_id": 7,
      "origin": "workshop",
      "service_date": "2026-10-01",
      "odometer": 51000,
      "category": "mechanical",
      "vehicle_system": "engine",
      "description": "Revisão preventiva com substituição de óleo, filtros e conferência dos sistemas do veículo",
      "labor_cost": "150.00",
      "parts_cost": "280.00",
      "total_cost": "430.00",
      "warranty_months": 3,
      "entry_date": "2026-10-01",
      "promised_delivery_date": "2026-10-02",
      "actual_delivery_date": "2026-10-02",
      "status": "completed",
      "created_at": "2026-10-01T10:00:00Z",
      "updated_at": "2026-10-01T10:00:00Z",
      "current_revision_id": 8,
      "editorial_status": "submitted",
      "admin_status": "pending",
      "customer_acknowledgement": "awaiting_customer",
      "customer_user_id": 2,
      "review_version": 3,
      "public_description": null,
      "review_reason": null,
      "published": false,
      "dispute_open": false,
      "superseded_by_id": null,
      "permissions": {
        "can_edit": true,
        "can_submit": true,
        "can_acknowledge": false,
        "can_dispute": false,
        "can_invite": true,
        "can_review": false
      },
      "documents": [
        {
          "id": 1,
          "owner_user_id": 2,
          "vehicle_id": 11,
          "vehicle_link_id": 11,
          "maintenance_record_id": 42,
          "maintenance_revision_id": 8,
          "service_dispute_id": null,
          "document_type": "invoice",
          "validation_document_type": null,
          "file_name": "comprovante-documental-do-vinculo-com-veiculo-ABC1D23-versao-completa.pdf",
          "content_type": "application/pdf",
          "review_status": "pending",
          "review_version": 1,
          "upload_status": "uploaded",
          "storage_verified": true,
          "rejection_reason": null,
          "file_size_bytes": 32000
        }
      ]
    }
  ],
  "/service-invitations/pending": [],
  "/users/me/identity-requests": [],
  "/users/me/closure-requests": [],
  "/notifications": [
    {
      "id": 1,
      "title": "Análise documental disponível",
      "body": "Confira a decisão e as próximas etapas do vínculo.",
      "link": "/app/garagem/11/documentos",
      "created_at": "2026-10-30T10:00:00Z",
      "read_at": null,
      "kind": "document_reviewed"
    }
  ],
  "/payments/config": {
    "enabled": false,
    "environment": "sandbox",
    "label": "Ambiente de testes",
    "history_price_cents": null,
    "subscription_price_cents": null,
    "history_access_hours": 720,
    "garage_total_limit": 5
  },
  "/payments/subscription": {
    "capacity_limit": 1,
    "free_vehicle_id": 11,
    "can_start_checkout": true,
    "period": null,
    "subscription": null
  },
  "/payments/orders/visual-order": {
    "id": "visual-order",
    "product": "history_access",
    "plate": "ABC1D23",
    "amount_cents": 1900,
    "currency": "BRL",
    "environment": "sandbox",
    "state": "paid",
    "checkout_url": null,
    "benefit_active": false,
    "benefit_expires_at": "2026-10-01T10:00:00Z"
  },
  "/history/vehicles/ABC1D23": {
    "plate": "ABC1D23",
    "access": {
      "source": "purchase",
      "expires_at": "2099-01-01T10:00:00Z"
    },
    "records": [
      {
        "visibility": "published",
        "id": 42,
        "service_date": "2026-10-01",
        "odometer": 51000,
        "category": "mechanical",
        "vehicle_system": "engine",
        "public_description": "Revisão preventiva e troca de óleo",
        "workshop": {
          "id": 7,
          "trade_name": "Oficina Horizonte",
          "verified": true
        },
        "labor_cost": "150.00",
        "parts_cost": "280.00",
        "total_cost": "430.00"
      }
    ]
  },
  "/public/workshops/ranking": {
    "score_version": "pilot_v1",
    "score_explanation": "Avaliação40%, prazo40%, volume20%.",
    "items": [
      {
        "workshop_id": 7,
        "trade_name": "Oficina Horizonte",
        "city": "São Paulo",
        "state": "SP",
        "specialties": [
          "Motor"
        ],
        "completed_services_count": 10,
        "average_total_cost": "430.00",
        "average_labor_cost": "150.00",
        "average_parts_cost": "280.00",
        "on_time_rate": 0.8,
        "average_delivery_days": 1,
        "average_stars": "4",
        "review_count": 10,
        "measured_deadline_count": 10,
        "on_time_count": 8,
        "score": "7.4",
        "eligible_for_ranking": true,
        "sample_label": "sufficient",
        "score_version": "pilot_v1"
      }
    ],
    "unranked_items": []
  },
  "/public/workshops/7/performance": {
    "score_version": "pilot_v1",
    "score_explanation": "Avaliação40%, prazo40%, volume20%.",
    "metrics": {
      "workshop_id": 7,
      "trade_name": "Oficina Horizonte",
      "city": "São Paulo",
      "state": "SP",
      "specialties": [
        "Motor"
      ],
      "completed_services_count": 10,
      "average_total_cost": "430.00",
      "average_labor_cost": "150.00",
      "average_parts_cost": "280.00",
      "on_time_rate": 0.8,
      "average_delivery_days": 1,
      "average_stars": "4",
      "review_count": 10,
      "measured_deadline_count": 10,
      "on_time_count": 8,
      "score": "7.4",
      "eligible_for_ranking": true,
      "sample_label": "sufficient",
      "score_version": "pilot_v1"
    },
    "reviews": []
  },
  "/workshops/7": {
    "id": 7,
    "legal_name": "Oficina Horizonte Ltda",
    "trade_name": "Oficina Mecânica Horizonte — atendimento especializado",
    "cnpj": "04252011000110",
    "phone": "11999990000",
    "email": "oficina@example.com",
    "city": "São Paulo",
    "state": "SP",
    "zip_code": "01001000",
    "street": "Rua de Testes",
    "number": "10",
    "neighborhood": "Centro",
    "complement": null,
    "specialties": [
      "Mecânica"
    ],
    "source": "owner_claimed",
    "verification_status": "verified"
  }
};
export const adminRoutes=[
 ["participantes","/admin/participantes"],["oficinas","/admin/oficinas"],
 ["validacoes","/admin/validacoes"],["validacao-detalhe","/admin/validacoes/11"],
 ["servicos","/admin/servicos"],["servico-detalhe","/admin/servicos/42"],
 ["contestacoes","/admin/contestacoes"],["avaliacoes","/admin/avaliacoes"],
 ["associacoes","/admin/associacoes"],["solicitacoes","/admin/solicitacoes-conta"]
] as const;
