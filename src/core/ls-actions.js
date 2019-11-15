//localstorage actions

export var inMemoryHistory = []

export function initHistory() {
    var hst = window.localStorage.getItem('xhrHistory')
    
    if (!hst) {
      window.localStorage.setItem('xhrHistory', '[]')
    }else {
      inMemoryHistory = JSON.parse(hst)
    }
     

  }
  
  export function addHistory(saveToHistory) {
    saveToHistory.dateAdded = new Date().toISOString()

    
    if (inMemoryHistory.length > 100) {
      //delete the oldest request to free up space
      removeTwoHistoryItems(inMemoryHistory)
    }
  
    inMemoryHistory.unshift(saveToHistory) //add history to start of array
  
    try {
      window.localStorage.setItem('xhrHistory', JSON.stringify(inMemoryHistory))
    }
    catch (e) {
      removeTwoHistoryItems(inMemoryHistory)
    }
  }
  
  export function clearXhrHistory() {
    window.localStorage.setItem('xhrHistory', '[]')
    inMemoryHistory= []
  }
  
  //ensure we dont submit duplicate requests
  function isItTheSameReq(saveToHistory, theLastReq) {
    if (!theLastReq) return false
    if (saveToHistory.parameters === theLastReq.parameters && saveToHistory.routeId === theLastReq.routeId) return true
    return false
  }
  
  
  function removeTwoHistoryItems(hst) {
    hst.splice(hst.length - 1, 2)
  }