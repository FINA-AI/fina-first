import {
  MessageFilterType,
  RecipientType,
  RootMessageType,
} from "./messages.type";
import {
  NotificationFilterType,
  NotificationRecipientType,
  RootNotificationType,
} from "./notifications.type";
import { EditorState } from "draft-js";

export type CommunicatorStatusType =
  | "CREATED"
  | "OUTBOX"
  | "DELETED"
  | "INBOX"
  | "ACCEPTED"
  | "PENDING"
  | "REJECTED"
  | "SENT"
  | "READ"
  | "PUBLISHED"
  | string;

export interface CommAttachmentType extends File {
  id?: number;
  plainName?: string;
  searchTerm?: string;
  showTime?: boolean;
  contentLength?: number;
}

export type CommFilterType = MessageFilterType | NotificationFilterType;

export type CommSelectedRoot = RootMessageType | RootNotificationType | null;

export type CommRecipientType =
  | RecipientType
  | NotificationRecipientType
  | null;

export type CommRootCreateModalData =
  | (Omit<RootMessageType, "content"> & { content: EditorState })
  | (Omit<RootNotificationType, "content"> & { content: EditorState });

export type CommReviewModalType = {
  open: boolean;
  message: { content: string } | null;
  files?: [];
};
