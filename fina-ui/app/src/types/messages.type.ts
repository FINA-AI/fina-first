import { FiType } from "./fi.type";
import { UserType } from "./user.type";
import { CommAttachmentType } from "./communicator.common.type";

export interface MessageFilterType {
  title?: string;
  contains?: string;
  status?: string;
  dateAfter?: Date | number;
  dateBefore?: Date | number;
  fis?: FiType[] | string;
  author?: UserType[];
  recipients?: MessageFilterRecipientType[] | string;
  content?: string;
  authors?: string;
  notReplied?: boolean;
  ignoredReply?: boolean;
  hasAttachments?: boolean;
  bookmarked?: boolean;
  important?: boolean;
  markType: string[];
  hasAttachment?: boolean;
  unread?: boolean;
}

export interface MessageFilterRecipientType {
  code: string;
  description: string;
  id: number;
  group: boolean;
  login: string;
}

export interface RecipientType {
  descriptionStrId: number;
  description: string;
  id: number;
  login: string;
  new: boolean;
  messageId: number;
  name: string;
  status: string;
  readDate: number;
  hasPendingMessage?: boolean;
  lastConversationMessage?: string;
  pendingMessageCount?: number;
}

export interface RecipientFilterType {
  statuses?: string[];
  sortField?: string;
  sortDirection?: string;
  recipients?: number;
}

export interface RootMessageType {
  id: number;
  title: string;
  content: string;
  attachments?: CommAttachmentType[];
  bookmarked?: boolean;
  creationDate: number;
  hasAcceptPermission: boolean;
  hasAttachments: boolean;
  hasPendingMessage: boolean;
  lastConversationMessageDate: number;
  new: boolean;
  self: boolean;
  sendDate: number;
  status: string;
  user: string;
  userId: number;
  userLogin: string;
  userIds: number[];
  recipientCount: number;
  newMessages: number;
  replyToUserId: number;
  rootMessageId: number;
  readDate?: number;
}

export interface ConversationMessageType {
  attachments?: CommAttachmentType[];
  content: string;
  creationDate: number;
  hasAcceptPermission: boolean;
  hasAttachments: boolean;
  hasPendingMessage: boolean;
  id: number;
  lastConversationMessageDate: number;
  markType?: ConversationMarkType;
  new: boolean;
  newMessages: number;
  plainContent?: string;
  readDate?: number;
  recipientCount: number;
  rejectionNote: string | null;
  replyToId: number;
  replyToUserId: number;
  self: boolean;
  sendDate: number;
  sign: boolean;
  status: string;
  title: string;
  user: string;
  userId: number;
  userIds: number[];
  userLogin: string;
  bookmarked?: boolean;
  temporaryContent?: string;
}

export interface ConversationMessage
  extends RootMessageType,
    ConversationMessageType {}

export interface MessageReadStatus {
  readMessageId: number;
  readMessageUserId: number;
}

export type ConversationMarkType = "BOOKMARK" | "IMPORTANT" | null;
