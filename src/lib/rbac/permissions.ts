export const ROLES = ["client","paralegal","attorney","office_admin","super_admin"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "case.view_own","case.view_assigned","case.view_all","case.edit","case.assign",
  "document.upload","document.review","invoice.view_own","invoice.manage",
  "user.manage","cms.edit","audit.view",
  "payment_gateway.view","payment_gateway.create","payment_gateway.edit","payment_gateway.test",
  "payment_gateway.activate","payment_gateway.disable","payment_gateway.rotate_credentials",
  "payment_gateway.manage_webhooks","payment_gateway.view_transactions",
  "payment_gateway.refund","payment_gateway.export",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

// Defaults only. The source of truth is the role_permissions table; admins can change it.
export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  client: ["case.view_own","document.upload","invoice.view_own"],
  paralegal: ["case.view_assigned","case.edit","document.upload","document.review"],
  attorney: ["case.view_assigned","case.edit","document.upload","document.review","invoice.manage","payment_gateway.view_transactions","audit.view"],
  office_admin: ["case.view_all","case.edit","case.assign","document.upload","document.review","invoice.manage","user.manage","cms.edit","audit.view"],
  super_admin: [...PERMISSIONS],
};
