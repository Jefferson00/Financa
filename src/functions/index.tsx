
/*Define a data de inicio */
function setDtInicio(date: Date) {
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    let dtInicio
    if (month < 10) {
        dtInicio = year.toString() + '0' + month.toString()
    } else {
        dtInicio = year.toString() + month.toString()
    }

    return parseInt(dtInicio)
}

/*Define a data fim */
function setDtFim(mensal: Boolean, contRepeat: number, date: Date) {
    let dtFim
    if (mensal) {
        dtFim = "209912"
    } else {
        let month = (date.getMonth() + 1)
        let year = date.getFullYear()
        for (var x = 1; x < contRepeat; x++) {
            month = month + 1
            if (month > 12) {
                month = 1
                year = year + 1
            }
        }
        if (month < 10) {
            dtFim = year.toString() + '0' + month.toString()
        } else {
            dtFim = year.toString() + month.toString()
        }
    }
    return parseInt(dtFim)
}

function toFrequency(dtfim: number, dtInicio: number){
    var outputFim = [], outputInicio = [],
    sDtfim = dtfim.toString(),
    sDtInicio = dtInicio.toString()

    

    for (var i = 0, len = sDtfim.length; i < len; i += 1) {
        outputFim.push(+sDtfim.charAt(i));
    }

    for (var i = 0, len = sDtInicio.length; i < len; i += 1) {
        outputInicio.push(+sDtInicio.charAt(i));
    }

    let test:string = ''

    let yearFim = test.concat(outputFim[0].toString(),outputFim[1].toString(),outputFim[2].toString(),outputFim[3].toString())
    let monthFim = test.concat(outputFim[4].toString(),outputFim[5].toString())
    let monthInicio = test.concat(outputInicio[4].toString(),outputInicio[5].toString())
    let yearInicio = test.concat(outputInicio[0].toString(),outputInicio[1].toString(),outputInicio[2].toString(),outputInicio[3].toString())
 
    
    let frequencia = parseInt(monthFim)-parseInt(monthInicio) + (12* (parseInt(yearFim) - parseInt(yearInicio)))
    console.log(frequencia)
    return frequencia 
}

function toMonthAndYear(dt: number){
    var outputDt = [],
    sDt = dt.toString()

    for (var i = 0, len = sDt.length; i < len; i += 1) {
        outputDt.push(+sDt.charAt(i));
    }

    let test:string = ''

    let year = test.concat(outputDt[0].toString(),outputDt[1].toString(),outputDt[2].toString(),outputDt[3].toString())
    let month = test.concat(outputDt[4].toString(),outputDt[5].toString())

    return {year:year,month:month}
}

function currencyFormatter(value:any) {
    if (!Number(value)) return "";
  
    const amount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency:'BRL',
    }).format(value/100);
    //amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    return `${amount}`;
  }

  function convertDtToStringMonth(dt: number) {
    let month: number = dt % 100
    switch (month) {
        case 1:
            return 'Jan'
            break
        case 2:
            return 'Fev'
            break
        case 3:
            return 'Mar'
            break
        case 4:
            return 'Abr'
            break
        case 5:
            return 'Mai'
            break
        case 6:
            return 'Jun'
            break
        case 7:
            return 'Jul'
            break
        case 8:
            return 'Ago'
            break
        case 9:
            return 'Set'
            break
        case 10:
            return 'Out'
            break
        case 11:
            return 'Nov'
            break
        case 12:
            return 'Dez'
            break
        default:
            return 'err'
            break
    }
}

function sumValues(arr:any){
    let cash = arr.reduce(function(prev:any,curr:any){
        prev[curr[0]] = curr[1]
        return prev
    },{})

    let sum: any = Object.values(cash).reduce(function(a:any,b:any){
        return a + b
    },0)

    return Number(sum.toFixed(2))
}

const formatNumber = (amount:any, decimalCount = 2, decimal = ",", thousands = ".") => {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i:any = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  };


function nextMonth(selectedMonth:any, selectedYear:any) {
    let nextMonth = selectedMonth + 1
    let nextYear = selectedYear
    if (nextMonth > 12) {
      nextMonth = 1
      nextYear = nextYear + 1
    }
    let teste1 = {
        dt : '0',
        nextMonth,
        nextYear,
    }
    if (nextMonth < 10) {
      teste1.dt = nextYear.toString() + '0' + nextMonth.toString()
    } else {
      teste1.dt = nextYear.toString() + nextMonth.toString()
    }
    return teste1
  }

function prevMonth(selectedMonth:any, selectedYear:any) {
    let prevMonth = selectedMonth - 1
    let prevYear = selectedYear
    if (prevMonth < 1) {
      prevMonth = 12
      prevYear = prevYear - 1
    }
    let teste1 = {
        dt : '0',
        prevMonth,
        prevYear,
    }
    if (prevMonth < 10) {
      teste1.dt = prevYear.toString() + '0' + prevMonth.toString()
    } else {
      teste1.dt = prevYear.toString() + prevMonth.toString()
    }
    return teste1
  }

  function selectLastMonth(month: number, year: number) {
    let lastMonth = month - 1
    let lastYear = year
    if (lastMonth == 0) {
      lastMonth = 12
      lastYear = year - 1
    }

    return { lastMonth: lastMonth, lastYear: lastYear }
  }

export default{
    setDtInicio,
    setDtFim,
    currencyFormatter,
    convertDtToStringMonth,
    sumValues,
    formatNumber,
    nextMonth,
    prevMonth,
    toFrequency,
    toMonthAndYear,
    selectLastMonth,
}

