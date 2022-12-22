const getSortedList = (messageArr, results) => {
    messageArr = results.concat(messageArr)
    messageArr = messageArr.map(it => JSON.stringify(it));
    messageArr = [...new Set(messageArr)]
    messageArr = messageArr.map(it => JSON.parse(it));
    messageArr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    return messageArr
}

export {
    getSortedList
}