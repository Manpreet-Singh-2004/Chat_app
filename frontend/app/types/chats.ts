export type ChatStatus = "INVITED" | "ACTIVE" | "DECLINED" | "NONE";
export type ChatType = "DM" | "GROUP";

export interface Chat {
  id: string;              // Prisma always uses 'id', not 'chatId'
  createdAt: string;       // Date strings from JSON API
  chatType: ChatType;
  status: ChatStatus;

  // DM Specific
  dmKey?: string | null;
  invitedByUserId?: string | null;

  // Group Specific
  groupIcon?: string | null;
  groupName?: string | null;
  groupAdminUserId?: string | null;

  // Optional: If your API returns relations, you can add them here later
  // messages?: Message[];
  // chatUsers?: ChatUser[];
}