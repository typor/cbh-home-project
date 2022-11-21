const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

/**
 * Generate trivial key based on event data structure,
 * @param {object} event , may be undefined
 * @returns generated key string
 */
const deterministicPartitionKey = (event) => {
  let candidate;

  if (event) {
    if (event.partitionKey) {
      candidate =
        typeof event.partitionKey === "string"
          ? event.partitionKey
          : JSON.stringify(event.partitionKey);
    } else {
      candidate = JSON.stringify(event);
    }

    // Original solution tried MAX_PARTITION_KEY_LENGTH check before return result despite its length can be determined
    // so check if input is given and paritionKey field existance.
    if (
      (event.partitionKey && candidate.length > MAX_PARTITION_KEY_LENGTH) ||
      !event.partitionKey
    )
      candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  } else {
    candidate = TRIVIAL_PARTITION_KEY;
  }

  return candidate;
};

module.exports = {
  TRIVIAL_PARTITION_KEY,
  MAX_PARTITION_KEY_LENGTH,
  deterministicPartitionKey,
};
