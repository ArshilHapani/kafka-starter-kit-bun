/**
 * This file works as admin user which manages infra
 *
 * Here admin creates number of topics, partitions and other related configs
 */

import kafka from "./client";
import { TOPIC_NAME } from "./constants";

async function init() {
  const admin = kafka.admin();
  console.log("Admin connecting ⏳");
  admin.connect();
  console.log("Admin connected ✅");

  console.log("Creating topic ['streamer-updates'] ⏳");
  await admin.createTopics({
    topics: [
      {
        topic: TOPIC_NAME,
        numPartitions: 4,
      },
    ],
  });
  console.log("Topics created ✅");

  console.log("Disconnecting admin ⏳");
  await admin.disconnect();
  console.log("Admin disconnected ✅");
}

init();
