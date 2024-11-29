import kafka from "./client";
import { TOPIC_NAME } from "./constants";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  const producer = kafka.producer();

  console.log("connecting producer ⏳");
  await producer.connect();
  console.log("Producer connected ✅");

  rl.setPrompt(">");
  rl.prompt();

  rl.on("line", async function (line) {
    const [a, b] = line.split(" ");
    let partitionNo = 0;
    switch (a) {
      case "nami":
        partitionNo = 0;
        break;
      case "robin":
        partitionNo = 1;
        break;
      case "luffy":
        partitionNo = 3;
        break;
      case "arshil":
        partitionNo = 2;
        break;
      default:
        partitionNo = 0;
        break;
    }

    await producer.send({
      topic: TOPIC_NAME,
      messages: [
        // {
        //   key: "location-update",
        //   value: JSON.stringify({
        //     lng: "10.43434",
        //     lat: "21.3455",
        //   }),
        //   partition: partitionNo, // partition index
        // },
        {
          key: "user-state-update",
          value: JSON.stringify({
            old: a,
            new: b,
          }),
          partition: partitionNo,
        },
      ],
    });
  }).on("close", async function () {
    console.log("Disconnecting producer ⏳");
    await producer.disconnect();
    console.log("Producer disconnects ✅");
  });
}

init();
