
export const togglEye=(id)=>{
   let elm = document.getElementById(id)
   let elmAtr =  elm.getAttribute("type")
   let atr = elmAtr==="password"?"text":"password"
   elm.setAttribute("type",atr)
}