const MfBot = require('./lib/mf-bot')
const account = require('./account.json')

MfBot.sign_in(account)
  .then(MfBot.fetch_account_ids)
  .then(MfBot.acquire_all)
  .catch(console.error)
