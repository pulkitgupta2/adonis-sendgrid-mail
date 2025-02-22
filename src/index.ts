import sgMail, { MailDataRequired, ClientResponse } from "@sendgrid/mail";
import type {
  NodeMailerMessage,
  MailTransportContract,
  Recipient,
} from "@adonisjs/mail/types";
import { MailResponse } from "@adonisjs/mail";

/**
 * Configuration for the SendGrid transport.
 */
export type SendGridConfig = {
  apiKey: string;
};

/**
 * Helper function to map AdonisJS Recipient to SendGrid EmailData.
 */
const mapRecipientToEmailData = (
  recipient: Recipient
): { email: string; name?: string } => {
  if (typeof recipient === "string") {
    return { email: recipient };
  }
  return { email: recipient.address, name: recipient.name };
};

/**
 * SendGrid transport implementation for AdonisJS Mail.
 */
export class SendGridTransport implements MailTransportContract {
  constructor(config: SendGridConfig) {
    sgMail.setApiKey(config.apiKey);
  }

  async send(
    message: NodeMailerMessage,
    config?: any
  ): Promise<MailResponse<ClientResponse>> {
    const sgMessage: MailDataRequired = {
      to: message.to?.map(mapRecipientToEmailData),
      from: mapRecipientToEmailData(message.from!),
      subject: message.subject,
      html: message.html ? String(message.html) : "<p>No content</p>",
      text: message.text ? String(message.text) : "No content",
      cc: message.cc?.map(mapRecipientToEmailData),
      bcc: message.bcc?.map(mapRecipientToEmailData),
      replyTo: message.replyTo
        ? mapRecipientToEmailData(message.replyTo[0])
        : undefined,
      ...(config || {}),
    };

    const [response] = await sgMail.send(sgMessage);

    const envelopeRecipients = (recipients: Recipient[] | undefined) =>
      recipients?.map((r) => (typeof r === "string" ? r : r.address)) || [];

    const envelope = {
      from:
        typeof message.from === "string" ? message.from : message.from!.address,
      to: envelopeRecipients(message.to),
    };

    return new MailResponse(
      response.headers["x-message-id"],
      envelope,
      response
    );
  }
}

/**
 * Factory function to create a SendGrid transport instance.
 */
export function sendGridTransport(
  config: SendGridConfig
): () => SendGridTransport {
  return () => new SendGridTransport(config);
}
