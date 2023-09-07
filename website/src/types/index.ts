export interface ErrorResponse {
  statusCode: number
  code: number
  message: string
}

export interface File {
  id: string
  name: string
  type: string
  size: number
  userId: string
  folderId: string
  createdAt: string
  updatedAt: string
}

export interface Folder {
  id: string
  name: string
  userId: string
  createdAt: string
  updatedAt: string
  parentId?: string
}
