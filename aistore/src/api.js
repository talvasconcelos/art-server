const API = 'http://localhost:3000/api/'//'https://nudeart.herokuapp.com/api/'

export const callBackendAPI = async (target) => {
    const response = await fetch(`${API}${target}`)
    const body = await response.json()

    if (response.status !== 200) {
        throw Error(body.message)
    }
    // console.log(body)
    return body
}

export const postAPIupdate = async (target, data) => {
    const response = await fetch(`${API}${target}`, {
        method: 'POST',
        body: data ? JSON.stringify(data) : '',
        headers:{
            'Content-Type': 'application/json'
          }
    })
    const body = await response.json()

    if (response.status !== 200) {
        throw Error(body.message)
    }
    // console.log(body)
    return body
}