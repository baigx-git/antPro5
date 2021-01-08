// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const {currentUser} = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    isPermission: (data: string) => {
      return currentUser?.authorities.some((item:any)=>data===item.authority)
    },
    isMenu: (route) => {
      if(currentUser && currentUser.authorities){
        if ( route.path === '/log' || route.path === '/task'||route.path === '/list'|| route.path === '/detail'|| route.path === '/userManager') {
          return currentUser?.authorities.some((item: any) => {return item.authority === 'ROLE_ADMIN'})
        }
      }
      return false
    }


  };
}
