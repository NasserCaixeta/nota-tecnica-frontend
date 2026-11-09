import { uiFixtures } from './admin-ui';
import type { UserRead } from '../../src/lib/api/types';
import type { MaintenanceRecord, PublishedService } from '../../src/lib/api/maintenance';
import type { VehicleHistoryPreview } from '../../src/lib/api/public';

export const customer: UserRead = {
  ...uiFixtures['/users/me'], id: 2, is_admin: false, capabilities: ['customer'],
  full_name: 'Mariana de Albuquerque e Silva — cliente de testes',
  email: 'mariana.albuquerque.silva@example.com',
};
export const customerService: MaintenanceRecord = {
  ...uiFixtures['/maintenance-records/42'] as MaintenanceRecord,
  author_user_id: 2, customer_user_id: 2, origin: 'customer',
  permissions: { can_edit: true, can_submit: true, can_acknowledge: false, can_dispute: false, can_invite: false, can_review: false },
};
export const publishedService: PublishedService = uiFixtures['/history/vehicles/ABC1D23'].records[0];
export const preview: VehicleHistoryPreview = {
  plate: 'ABC1D23', vehicle_found: true, maintenance_count: 3,
  first_maintenance_date: '2025-01-10', last_maintenance_date: '2026-10-01',
  categories: ['mechanical', 'inspection'], distinct_workshop_count: 2, completeness_score: 'medium',
};
export const clientFixtures: Record<string, unknown> = {
  ...uiFixtures,
  '/users/me': customer,
  '/maintenance-records/42': customerService,
  '/vehicles/11/maintenance-records': [customerService, { ...publishedService, id: 43 }],
  '/workshops/7/maintenance-records': [uiFixtures['/maintenance-records/42']],
  '/customer-services/pending': [{ ...customerService, origin: 'workshop', customer_acknowledgement: 'awaiting_customer', permissions: { ...customerService.permissions, can_edit: false, can_submit: false, can_acknowledge: true, can_dispute: true } }],
  '/public/vehicles/ABC1D23/history-preview': preview,
};
export type ScreenCase = { name: string; path: string; anonymous?: boolean; pending?: boolean; expectedAlert?: string };
// Every non-admin leaf route in src/app/router.tsx, plus invalid recovery and 404.
export const clientScreens: ScreenCase[] = [
  { name: 'landing', path: '/', anonymous: true },
  { name: 'consulta', path: '/consultar', anonymous: true },
  { name: 'ranking', path: '/oficinas', anonymous: true },
  { name: 'perfil-oficina', path: '/oficinas/7', anonymous: true },
  { name: 'login', path: '/entrar', anonymous: true },
  { name: 'cadastro', path: '/cadastro', anonymous: true },
  { name: 'recuperacao', path: '/esqueci-senha', anonymous: true },
  { name: 'nova-senha', path: '/redefinir-senha#synthetic-reset-token', anonymous: true },
  { name: 'nova-senha-sem-link', path: '/redefinir-senha', anonymous: true, expectedAlert: 'Abra o link pessoal' },
  { name: 'convite', path: '/convite-servico', anonymous: true },
  { name: 'participacao', path: '/app/participacao', pending: true },
  { name: 'conta', path: '/app/conta' },
  { name: 'notificacoes', path: '/app/notificacoes' },
  { name: 'pedido', path: '/app/compras/visual-order' },
  { name: 'assinatura', path: '/app/assinatura' },
  { name: 'historico', path: '/app/historico/ABC1D23' },
  { name: 'servicos-pendentes', path: '/app/servicos-pendentes' },
  { name: 'servico', path: '/app/manutencoes/42' },
  { name: 'atendimentos-oficina', path: '/app/oficinas/7/servicos' },
  { name: 'garagem', path: '/app/garagem' },
  { name: 'adicionar-veiculo', path: '/app/garagem/novo' },
  { name: 'veiculo', path: '/app/garagem/11' },
  { name: 'documentos-veiculo', path: '/app/garagem/11/documentos' },
  { name: 'nova-manutencao', path: '/app/garagem/11/manutencoes/nova' },
  { name: 'minhas-oficinas', path: '/app/oficinas' },
  { name: 'nova-oficina', path: '/app/oficinas/nova' },
  { name: 'representacao-oficina', path: '/app/oficinas/reivindicar' },
  { name: 'nao-encontrada', path: '/pagina-inexistente', anonymous: true },
];
