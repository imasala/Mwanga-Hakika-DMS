import { CustomFieldInstance } from './custom-field-instance'
import { DocumentNote } from './document-note'
import { ObjectWithPermissions } from './object-with-permissions'

export enum DisplayMode {
  TABLE = 'table',
  SMALL_CARDS = 'smallCards',
  LARGE_CARDS = 'largeCards',
}

export enum DisplayField {
  TITLE = 'title',
  DOCUMENT_TYPE = 'documenttype',
  SERVICE_PROVIDER = 'service_provider',
  SERVICE_TYPE = 'service_type',
  DEPARTMENT = 'department',
  TENURE = 'tenure',
  STORAGE_PATH = 'storagepath',
  OWNER = 'owner',
  START_DATE = 'start_date',
  EXPIRY_DATE = 'expiry_date',
  EXPIRY_STATUS = 'expiry_status',
  CREATED = 'created',
  ADDED = 'added',
  TAGS = 'tag',
  CORRESPONDENT = 'correspondent',
  CUSTOM_FIELD = 'custom_field_',
  NOTES = 'note',
  SHARED = 'shared',
  ASN = 'asn',
  PAGE_COUNT = 'pagecount',
}

export const DEFAULT_DISPLAY_FIELDS = [
  {
    id: DisplayField.TITLE,
    name: $localize`Title`,
  },
  {
    id: DisplayField.SERVICE_PROVIDER,
    name: $localize`Service Provider`,
  },
  {
    id: DisplayField.SERVICE_TYPE,
    name: $localize`Service Type`,
  },
  {
    id: DisplayField.DEPARTMENT,
    name: $localize`Department`,
  },
  {
    id: DisplayField.TENURE,
    name: $localize`Tenure`,
  },
  {
    id: DisplayField.START_DATE,
    name: $localize`Start Date`,
  },
  {
    id: DisplayField.EXPIRY_DATE,
    name: $localize`Expiry Date`,
  },
  {
    id: DisplayField.CREATED,
    name: $localize`Date Created`,
  },
  {
    id: DisplayField.ASN,
    name: $localize`Archive Serial Number`,
  },
  {
    id: DisplayField.CORRESPONDENT,
    name: $localize`Correspondent`,
  },
  {
    id: DisplayField.DOCUMENT_TYPE,
    name: $localize`Document Type`,
  },
  {
    id: DisplayField.STORAGE_PATH,
    name: $localize`Storage Path`,
  },
  {
    id: DisplayField.TAGS,
    name: $localize`Tags`,
  },
]

export const DEFAULT_DASHBOARD_VIEW_PAGE_SIZE = 10

export const DEFAULT_DASHBOARD_DISPLAY_FIELDS = [
  DisplayField.CREATED,
  DisplayField.TITLE,
  DisplayField.TAGS,
  DisplayField.CORRESPONDENT,
]

// export const DOCUMENT_SORT_FIELDS = [
//   { field: 'archive_serial_number', name: $localize`ASN` },
//   { field: 'correspondent__name', name: $localize`Correspondent` },
//   { field: 'title', name: $localize`Title` },
//   { field: 'document_type__name', name: $localize`Document type` },
//   { field: 'created', name: $localize`Created` },
//   { field: 'added', name: $localize`Added` },
//   { field: 'modified', name: $localize`Modified` },
//   { field: 'num_notes', name: $localize`Notes` },
//   { field: 'owner', name: $localize`Owner` },
//   { field: 'page_count', name: $localize`Pages` },
// ]

export const DOCUMENT_SORT_FIELDS = [
  { field: 'archive_serial_number', name: $localize`Document No.` },
  { field: 'storage_path__name', name: $localize`Storage Path` },
  { field: 'owner', name: $localize`Owner` },
]

export const DOCUMENT_SORT_FIELDS_FULLTEXT = [
  {
    field: 'score',
    name: $localize`:Score is a value returned by the full text search engine and specifies how well a result matches the given query:Search score`,
  },
]

export interface SearchHit {
  score?: number
  rank?: number

  highlights?: string
  note_highlights?: string
}

export interface Document extends ObjectWithPermissions {
  correspondent?: number

  document_type?: number

  storage_path?: number

  title?: string

  content?: string

  tags?: number[]

  checksum?: string

  // UTC
  created?: string // ISO string

  expiry_date?: string

  expiry_status?: 'valid' | 'expiring_soon' | 'expired' | 'no_expiry'

  service_provider?: string

  service_type?: string

  department?: string

  tenure?: string

  start_date?: string

  modified?: string // ISO string

  added?: string // ISO string

  mime_type?: string

  deleted_at?: string // ISO string

  original_file_name?: string

  archived_file_name?: string

  download_url?: string

  thumbnail_url?: string

  archive_serial_number?: number

  notes?: DocumentNote[]

  __search_hit__?: SearchHit

  custom_fields?: CustomFieldInstance[]

  // write-only field
  remove_inbox_tags?: boolean

  page_count?: number

  duplicate_documents?: Document[]

  // Versioning
  root_document?: number
  versions?: DocumentVersionInfo[]

  // Frontend only
  __changedFields?: string[]
}

export interface DocumentVersionInfo {
  id: number
  added?: Date
  version_label?: string
  checksum?: string
  is_root: boolean
}
