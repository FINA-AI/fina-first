/**
 * Repository (Document Management) module types
 */
import { AuditFields, Permission } from './common.types';

// Node (file or folder)
export interface RepositoryNode extends AuditFields {
  id: string;
  nodeId: string;
  name: string;
  path: string;
  nodeType: 'file' | 'folder' | 'site';
  mimeType?: string;
  size?: number;
  content?: string;
  properties?: Record<string, any>;
  permissions?: Permission[];
  isFolder: boolean;
  hasChildren?: boolean;
  parentId?: string;
}

// Site
export interface Site extends AuditFields {
  id: string;
  shortName: string;
  title: string;
  description?: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'MODERATED';
  sitePreset?: string;
  isFavorite?: boolean;
  isMember?: boolean;
  role?: 'MANAGER' | 'COLLABORATOR' | 'CONTRIBUTOR' | 'CONSUMER';
}

// Site member
export interface SiteMember {
  id: string;
  person: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  role: 'MANAGER' | 'COLLABORATOR' | 'CONTRIBUTOR' | 'CONSUMER';
}

// Version
export interface DocumentVersion extends AuditFields {
  id: string;
  versionLabel: string;
  nodeId: string;
  name: string;
  mimeType: string;
  size: number;
  comment?: string;
  isMajorVersion: boolean;
}

// Share link
export interface ShareLink extends AuditFields {
  id: string;
  nodeId: string;
  sharedId: string;
  name: string;
  expiresAt?: string;
  sharedBy: string;
  link: string;
}

// Recent file
export interface RecentFile extends AuditFields {
  id: string;
  nodeId: string;
  name: string;
  path: string;
  mimeType: string;
  size: number;
  lastAccessed: string;
}

// Breadcrumb item
export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}
