# adonis-v6-sendgrid-mail

A lightweight AdonisJS v6 Mail transport for sending emails using [SendGrid](https://sendgrid.com/). This package integrates seamlessly with the `@adonisjs/mail` package, allowing you to send emails efficiently in your AdonisJS applications.

## Features

- Simple integration with AdonisJS Mail.
- Supports standard email fields (`to`, `from`, `subject`, `html`, `text`, `cc`, `bcc`, `replyTo`).
- Configurable via SendGrid API key.
- TypeScript support with full type definitions.

_Note:_ This is a basic implementation focused on sending standard emails. More advanced features like bulk sending, attachments, and custom SendGrid options are planned for future releases. Stay tuned!

## Installation

Install the package via npm:

```bash
npm install adonis-sendgrid-mail
```

Ensure you have `@adonisjs/mail` installed in your AdonisJS project, as it is a peer dependency:

```
npm install @adonisjs/mail
```

You'll also need a SendGrid account and an API key. Sign up at [SendGrid](https://sendgrid.com/) and generate an API key if you don’t already have one.

## Configuration

To use this transport, configure it in your AdonisJS mail configuration file (typically `config/mail.ts`). Here's a basic example:

### Example: Basic Configuration

```
import { sendGridTransport } from 'adonis-v6-sendgrid-mail'
import env from '#start/env'
import { defineConfig } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'sendgrid', // Set SendGrid as the default mailer

  from: {
    address: env.get('MAIL_FROM_ADDRESS', 'no-reply@yourdomain.com'),
    name: env.get('MAIL_FROM_NAME', 'Your App'),
  },

  mailers: {
    sendgrid: sendGridTransport({
      apiKey: env.get('SENDGRID_API_KEY', ''),
    }),
  },
})

export default mailConfig
```

### Environment Variables

Add the following to your `.env` file and update the values accordingly:

```
SENDGRID_API_KEY=your_sendgrid_api_key_here
MAIL_FROM_ADDRESS=no-reply@yourdomain.com
MAIL_FROM_NAME=Your App
```

#### Explanation

- `default: 'sendgrid'`: Sets SendGrid as the default mailer.

- `from`: Defines the default sender email and name (optional; can be overridden per email).

- `mailers.sendgrid`: Registers the SendGrid transport with your API key.

## Usage

Once configured, you can use the AdonisJS `Mail` service to send emails as usual.

Here's an example:

Sending a Basic Email

```
import Mail from '@adonisjs/mail/services/main'

await mail.send((message) => {
  message
    .to('recipient@example.com')
    .subject('Hello from AdonisJS!')
    .html('<h1>Hello!</h1><p>This is a test email sent via SendGrid.</p>')
})
```

Sending with `sendLater`

```
import Mail from '@adonisjs/mail/services/main'

await mail.sendLater((message) => {
  message
   .to('recipient@example.com')
    .cc('cc@example.com')
    .bcc('bcc@example.com')
    .from('sender@yourdomain.com', 'Sender Name')
    .subject('Test Email with CC and BCC')
    .text('This is a plain text email.')
})
```

You can use all the methods listed in [AdonisJS Mail Docs](https://docs.adonisjs.com/guides/digging-deeper/mail) as usual.

### Notes

- The send method supports all standard fields defined by `@adonisjs/mail/types/NodeMailerMessage`.
- If html or text is omitted, default content (`<p>No content</p>` or `No content`) is used to prevent SendGrid errors.

## Advanced Configuration

You can pass additional SendGrid-specific options to the `send` method via the optional `config` parameter. For example:

```
await mail.send(
  (message) => {
    message
      .to('recipient@example.com')
      .subject('Scheduled Email')
      .html('<p>This email was scheduled!</p>')
  },
  { sendAt: Math.floor(Date.now() / 1000) + 3600 } // Send 1 hour from now
)
```

Note: The `config` parameter is typed as `any` in the current version. Ensure compatibility with SendGrid's `MailDataRequired` interface when passing custom options.

## Future Enhancements

This package currently provides a basic implementation for sending single emails. The following features are planned for upcoming releases:

- Bulk Sending: Support for sending emails to multiple recipients efficiently.
- Attachments: Ability to attach files to emails.
- Custom SendGrid Features: Full support for SendGrid-specific options (e.g., templates, categories).
- Improved Error Handling: Detailed error messages and retry logic.

Contributions and feature requests are welcome! [Check the GitHub repository](https://github.com/pulkitgupta2/adonis-sendgrid-mail) for more details.
