const request = require('request').defaults({jar: true, followAllRedirects: true})
const cheerio = require('cheerio')

const MfBot = {
  CSRF_TOKEN: '',

  set_cstf_token: (body) => {
    const $ = cheerio.load(body)
    MfBot.CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content')
  },

  visit_before_sign_in: () => {
    return new Promise((resolve, reject) => {
      const url = 'https://moneyforward.com/users/sign_in'
      request.get(url, (err, res, body) => err ? reject(err) : resolve(body))
    })
  },

  sign_in: (account) => {
    return new Promise((resolve, reject) => {
      MfBot.visit_before_sign_in().catch(reject).then((body) => {
        const $ = cheerio.load(body)
        const url = 'https://moneyforward.com/session'
        const form = {
          authenticity_token: $('input[name="authenticity_token"]').val(),
          sign_in_session_service: account
        }
        request.post({url, form}, (err, res, body) => {
          if (err) return reject(err)
          const $ = cheerio.load(body)
          if ($('a[href="/users/sign_out"]')[0]) {
            resolve()
          } else {
            reject(new Error('Failed to sign in'))
          }
        })
      })
    })
  },

  fetch_account_ids: () => {
    return new Promise((resolve, reject) => {
      const url = 'https://moneyforward.com/accounts'
      request.get(url, (err, res, body) => {
        if (err) return reject(err)
        MfBot.set_cstf_token(body)
        const $ = cheerio.load(body)
        const ids = []
        $('form').each((i, elem) => {
          if ($(elem).attr('action').match(/\/faggregation_queue2\/(.+)$/)) {
            ids.push(RegExp.$1)
          }
        })
        resolve(ids)
      })
    })
  },

  acquire: (id) => {
    return new Promise((resolve, reject) => {
      const url = `https://moneyforward.com/aggregation_queue/${id}`
      const headers = {'X-CSRF-Token': MfBot.CSRF_TOKEN}
      request.post(url, {headers}, (err, res) => err ? reject(err) : resolve(res.body))
    })
  },

  acquire_all: (ids) => {
    return Promise.all(ids.map(MfBot.acquire))
  }
}

module.exports = MfBot
