
export const getUserId=()=>{
    let location = window.location.href.split("/")
    return location[location.length-1]
}


export const getUserIdInEditPage=()=>{
    let location = window.location.href.split("/")
    return location[location.length-2]
}


export const getUserIdInDelApi=()=>{
    let location = window.location.href.split("/")
    console.log(location);
    return location[location.length-3]
}