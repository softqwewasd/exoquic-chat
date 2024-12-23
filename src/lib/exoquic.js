import { ExoquicPublisher } from "@exoquic/pub";
import * as exoquicAuth from "@exoquic/auth";

export const exoquicPublisher = new ExoquicPublisher({ apiKey: process.env.EXOQUIC_API_KEY });
exoquicAuth.initSubscriptionAuthorizer({ apiKey: process.env.EXOQUIC_API_KEY });