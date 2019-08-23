const API = 'https://nudeart.herokuapp.com/api/'

export const callBackendAPI = async (target) => {
    console.log('Ping API')
    const response = await fetch(`${API}${target}`)
    const body = await response.json()

    if (response.status !== 200) {
        throw Error(body.message)
    }
    console.log(body)
    return body
}