const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const compare = property => {
  return function(a, b){
    if (a[property] && b[property]){
      if (typeof (a[property]) == 'number' && typeof (b[property]) == 'number')
        return a[property] - b[property];
      else if (typeof (a[property]) == 'string' && typeof (b[property]) == 'string')
        return a[property].charCodeAt(0) - b[property].charCodeAt(0);
    }
    else{
      return 0;
    }
  }
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  compare: compare
}
