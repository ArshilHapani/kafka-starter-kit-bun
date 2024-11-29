import kafka from "./client";
import { TOPIC_NAME } from "./constants";

const groupName = process.argv[2];

async function run() {
  const consumer = kafka.consumer({
    groupId: groupName ?? "default-group",
  });

  console.log("connecting consumer ⏳");
  await consumer.connect();
  console.log("connecting consumer ✅");

  await consumer.subscribe({
    topics: [TOPIC_NAME],
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async function ({ topic, partition, message }) {
      console.log(
        `Message received 🧾 ${topic}:PART${partition} -> ${
          message.key
        } - ${message.value?.toString()} `
      );
    },
  });

  //   console.log("Disconnecting consumer ⏳");
  //   await consumer.disconnect();
  //   console.log("Consumer disconnected. ✅");
}

run();
