export const getISTTime = () => {
    const nowUTC = new Date()
    const IST_OFFSET = 5.5 * 60 * 60 * 1000
    return new Date(nowUTC.getTime() + IST_OFFSET)
  }
  
  export const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return "00:00:00"
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
  
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
  }
  
  const padZero = (n: number) => (n < 10 ? `0${n}` : n)
  