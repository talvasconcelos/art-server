const testFN = () => {
    console.log('debug test #1')
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({error: false, msg: 'test function'})
        }, Math.random() * 1000)
    })
}

const callTest = async () => {
    console.log('debug #1')
    const testOutput = await testFN()
        // .then((res) => {
        //     console.log('debug #2')
        //     const output = `This is the output from the test function: ${res.msg}`
        //     console.log('debug #3')
        //     return console.log(output)
        // })
        .catch(console.error)
    console.log('debug #2')
    const output = `This is the output from the test function: ${testOutput.msg}`
    console.log('debug #3')
    return console.log(output)
}

callTest()

