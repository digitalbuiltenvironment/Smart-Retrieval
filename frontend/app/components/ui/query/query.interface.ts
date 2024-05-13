export interface QueryMenuHandler {
  showUpload: boolean,
  setShowUpload: (showUpload: boolean) => void,
  showChat: boolean,
  setShowChat: (showChat: boolean) => void,
  showManage: boolean,
  setShowManage: (showManage: boolean) => void,
}

export interface QueryCollectionManageHandler {
  collSelected: string,
  handleCollSelect: (collectionId: string) => void,
}