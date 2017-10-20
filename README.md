# mf-bot-node

某家計簿アプリの口座情報を更新するためのBotです。

## Usage

### Prepare account.json

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Run Example

```
$ node exec_test.js
```

### Deploy to Lambda

_Required to set up Lambda function with aws-cli or web console_

Default function name is ``MfBot`` in ``package.json``, so modify it as needed.

```
$ npm i
$ npm run deploy
```

And set up scheduling wiht CloudWatch to execute periodically.
