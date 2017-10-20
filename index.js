const MfBot = require('./lib/mf-bot')
const account = require('./account.json')

exports.handler = (event, context, callback) => {
  MfBot.sign_in(account)
    .then(MfBot.fetch_account_ids)
    .then(MfBot.acquire_all)
    .then(() => callback(null, {result: true}))
    .catch((err) => callback(err, {result: false, error: err.message}))
}
