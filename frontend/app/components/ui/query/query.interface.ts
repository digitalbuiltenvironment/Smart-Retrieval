export interface QueryMenuHandler {
  showUpload: boolean,
  setShowUpload: (showUpload: boolean) => void,
  showChat: boolean,
  setShowChat: (showChat: boolean) => void,
  showManage: boolean,
  setShowManage: (showManage: boolean) => void,
  setCollSelectedId: (collSelectedId: string) => void,
}