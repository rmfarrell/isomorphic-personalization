

function NewUser(cid = '') {
  const cid


  getCid()
    .then((theCid) => {
      cid = theCid
      return login()
    })
    .then(() => RecognizedUser(cid))
    .catch(() => UnrecognizedUser(cid))
    .catch(console.error)

  // try to login
  function login() { }
}


function UnrecognizedUser(cid = '') {
  let history;

  // get data from localStorage
  const data = getData();

  fetchHistory(cid)
    .then((res) => {
      // parse response
      history = res.history;

      return {
        history,
        get data() {
          return data
        },
        setData,
        updateHistory: (...args) => updateHistory(cid, ...args)
      }
    })

  function setData(newData = {}) {
    data = Object.assign(data, newData)
    setLocalStorage('somekey', data)
  }

  function getData() {
    return getLocalStorage('somekey')
  }
}

function RecognizedUser(cid = '') {
  let history

  const data = getData();

  return fetchHistory(cid)
    .then((res) => {
      // parse response
      history = res.history
      return getData()
    })
    .then((res) => {
      data = res.data
    })
    .then(() => {
      return {
        get history() {
          return history
        },
        get data() {
          return data
        },
        setData,
        updateHistory: (...args) => updateHistory(cid, ...args)
      }
    })


  function getData() {
    // fetch auth0 metadata...
    const metaData = (function () { })()
    Object.assign(getLocalStorage('somekey'), metaData)
  }

  function setData(newData = {}) {
    data = Object.assign(data, newData)
    setLocalStorage('somekey', data)

    // unlike the unrecognized user this func is async
    return new Promise()
  }
}

// perhaps this function is called internally so we can:
// 1. not rely on the consuming fucn to call it
// 2. call it only once
function updateHistory(cid = '', site = '', articleType = '') {

}


function getCid() {
  return Promise().resolve('some-cid')
}
