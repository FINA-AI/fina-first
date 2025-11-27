import { RecipientType } from "./messages.type";
import { UserType } from "./user.type";
import { CommAttachmentType } from "./communicator.common.type";

export interface NotificationRecipientType {
  id: number;
  login: string;
  messageId: number;
  name: string;
  readDate: number;
  status: string;
}

export interface NotificationFilterType {
  title?: string;
  contains?: string;
  content?: string;
  dateAfter?: number;
  dateBefore?: number;
  recipients?: number[] | string | RecipientType[];
  status?: string;
  authors?: string;
  hasAttachments?: boolean;
  notificationFilterType?: string;
  author?: UserType[];
  hasAttachment?: boolean;
}

export interface RootNotificationType {
  id: number;
  title: string;
  content: string;
  publishDate?: number;
  sendDate?: number;
  creationDate: number | Date;
  status: "CREATED" | "PUBLISHED" | string;
  userIds: number[] | null;
  user: string;
  userDescription: string;
  attachments: CommAttachmentType[];
  sign: boolean;
  userId: number;
  recipientCount: number;
  hasAttachments: boolean;
}
