import { Handler } from "@netlify/functions";
import storeRsvp from "./storeRsvp";
import fetch from "node-fetch";

const handler: Handler = async function (event, context) {
  if (event.body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify("Payload required"),
    };
  }

  const requestBody = JSON.parse(event.body) as {
    inviteId: string;
    invitee: string;
    inviteeEmail: string;
  };

  // Store RSVP in Database
  const party = storeRsvp(requestBody.inviteId, requestBody.invitee);

  await fetch(`${process.env.URL}/.netlify/functions/emails/confirm`, {
    headers: {
      "netlify-emails-secret": process.env.NETLIFY_EMAILS_SECRET as string,
    },
    method: "POST",
    body: JSON.stringify({
      from: party.hostEmail,
      to: requestBody.inviteeEmail,
      subject: "RSVP!",
      parameters: {
        name: requestBody.invitee,
      },
    }),
  });

  return {
    statusCode: 200,
    body: JSON.stringify("RSVP stored"),
  };
};

export { handler };
