export type TimesheetStatus = "draft" | "pending" | "approved" | "rejected";

export type EntryType = "Project" | "Vacation" | "Sick" | "Holiday";

const STATUS_BADGE_CLASSES: Record<TimesheetStatus, string> = {
  pending:
    "border-transparent bg-status-pending-bg text-status-pending hover:bg-status-pending-bg",
  approved:
    "border-transparent bg-status-approved-bg text-status-approved hover:bg-status-approved-bg",
  rejected:
    "border-transparent bg-status-rejected-bg text-status-rejected hover:bg-status-rejected-bg",
  draft:
    "border-transparent bg-status-draft-bg text-status-draft hover:bg-status-draft-bg",
};

const STATUS_LABELS: Record<TimesheetStatus, string> = {
  draft: "Draft",
  pending: "Pending Approval",
  approved: "Approved",
  rejected: "Rejected",
};

const ENTRY_TYPE_BADGE_CLASSES: Record<EntryType, string> = {
  Project:
    "border-transparent bg-type-project-bg text-type-project hover:bg-type-project-bg",
  Vacation:
    "border-transparent bg-type-vacation-bg text-type-vacation hover:bg-type-vacation-bg",
  Sick: "border-transparent bg-type-sick-bg text-type-sick hover:bg-type-sick-bg",
  Holiday:
    "border-transparent bg-type-holiday-bg text-type-holiday hover:bg-type-holiday-bg",
};

export function getStatusBadgeClasses(status: string | null | undefined): string {
  const key = (status?.toLowerCase() ?? "draft") as TimesheetStatus;
  return STATUS_BADGE_CLASSES[key] ?? STATUS_BADGE_CLASSES.draft;
}

export function getStatusLabel(status: string | null | undefined): string {
  const key = (status?.toLowerCase() ?? "draft") as TimesheetStatus;
  return STATUS_LABELS[key] ?? status ?? "Draft";
}

export function getEntryTypeBadgeClasses(type: string): string {
  return (
    ENTRY_TYPE_BADGE_CLASSES[type as EntryType] ??
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary"
  );
}

export function getLeaveTypeBadgeClasses(type: string): string {
  if (type === "Vacation") {
    return "inline-block rounded px-2 py-1 text-sm bg-type-vacation-bg text-type-vacation";
  }
  return "inline-block rounded px-2 py-1 text-sm bg-type-sick-bg text-type-sick";
}
