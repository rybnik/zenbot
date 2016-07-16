var n = require('numbro')

module.exports = function container (get, set, clear) {
  var c = get('constants')
  var config = get('config')
  var get_timestamp = get('utils.get_timestamp')
  return function log_trades (exchange, trades) {
    if (!trades.length) return
    trades = trades.slice().sort(function (a, b) {
      if (a.size > b.size) return -1
      if (a.size < b.size) return 1
      return 0
    })
    var min_time
    var ticker = trades.slice(0, c.log_trades_limit).map(function (trade) {
      min_time = min_time ? Math.min(min_time, trade.time) : trade.time
      return trade.side + ' ' + n(trade.size).format('0.000').white + ' ' + config.asset + ' at '.grey + n(trade.price).format('0.000').yellow + ' ' + config.currency.yellow
    }).join(', ')
    ticker = get_timestamp(min_time).grey + ' ' + ticker
    get('logger').info(('[' + exchange.slug + ']').cyan + ' processed ' + trades.length + ' trades. ' + ticker)
  }
}