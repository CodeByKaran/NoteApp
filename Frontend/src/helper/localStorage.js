

export const setItem = (Bool)=>{
 localStorage.setItem("isLogged",`${Bool}`)
}


export const getItem = (key)=>{
return localStorage.getItem(`${key}`)
}


export const setAnyLocal =(key,value)=>{
  localStorage.setItem(`${key}`,`${value}`)
}


export const clearLocal=(key)=>{
  localStorage.removeItem(`${key}`)
}