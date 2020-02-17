const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function isSameDay(date1, date2){
  return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
}

function isOneWeekDay(date1, date2) {
  return date1 > date2;
}

function GetWeek(date){
  switch(date.getDay()){
    case 0:
      return '星期日';
    case 1:
      return '星期一';
    case 2:
      return '星期二';
    case 3:
      return '星期三';
    case 4:
      return '星期四';
    case 5:
      return '星期五';
    case 6:
      return '星期六';
  }
}

const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  var formatStr = '';
  var today = new Date();
  if(isSameDay(date, today))
    formatStr = [hour, minute, second].map(formatNumber).join(':');
  else if (isSameDay(date, new Date(today.setDate(today.getDate() - 1))))
    formatStr = '昨天 ' + [hour, minute, second].map(formatNumber).join(':');
  else if (isOneWeekDay(date, new Date(today.setDate(today.getDate() - 6))))
    formatStr = GetWeek(date) + ' ' + [hour, minute, second].map(formatNumber).join(':');
  else
    formatStr = [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':');
  return formatStr;
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
  formatTime2: formatTime2,
  formatDate: formatDate,
  formatNumber: formatNumber,
  compare: compare
}
