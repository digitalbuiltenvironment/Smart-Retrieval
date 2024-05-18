export interface AdminMenuHandler {
  showNewRequest: boolean,
  setShowNewRequest: (showNewRequest: boolean) => void,
  showUsers: boolean,
  setShowUsers: (showUsers: boolean) => void,
  showCollections: boolean,
  setShowCollections: (showCollections: boolean) => void,
}