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

  // TODO - Send Invite

  return {
    statusCode: 200,
    body: JSON.stringify("RSVP stored"),
  };
};

export { handler };
