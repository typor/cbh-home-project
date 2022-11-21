const crypto = require("crypto");

const {
  deterministicPartitionKey,
  MAX_PARTITION_KEY_LENGTH,
} = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns stringfied partitionKey when its length is smaller than MAX_PARTITION_KEY_LENGTH", () => {
    let event = {
      partitionKey: {
        hello: "world",
      },
    };
    let expectedTrivialKey = JSON.stringify(event.partitionKey);

    let trivialKey = deterministicPartitionKey(event);

    expect(event).toHaveProperty("partitionKey");
    expect(trivialKey).toBe(expectedTrivialKey);

    // Check if partitionKey is not object or string
    event = {
      partitionKey: 12345,
    };
    expectedTrivialKey = JSON.stringify(event.partitionKey);

    trivialKey = deterministicPartitionKey(event);

    expect(event).toHaveProperty("partitionKey");
    expect(trivialKey).toBe(expectedTrivialKey);
  });

  it("Returns partitionKey when it is string and its length is smaller than MAX_PARTITION_KEY_LENGTH", () => {
    const event = {
      partitionKey: "Hello World!",
    };
    const expectedTrivialKey = event.partitionKey;
    const trivialKey = deterministicPartitionKey(event);

    expect(event).toHaveProperty("partitionKey");
    expect(event.partitionKey.length).toBeLessThan(MAX_PARTITION_KEY_LENGTH);
    expect(trivialKey).toBe(expectedTrivialKey);
  });

  it("Returns SHA3-512 of partitionKey when it is string and its length is bigger than MAX_PARTITION_KEY_LENGTH", () => {
    const event = {
      partitionKey:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    };
    const expectedTrivialKey = crypto
      .createHash("sha3-512")
      .update(event.partitionKey)
      .digest("hex");
    const trivialKey = deterministicPartitionKey(event);

    expect(event).toHaveProperty("partitionKey");
    expect(event.partitionKey.length).toBeGreaterThan(MAX_PARTITION_KEY_LENGTH);
    expect(trivialKey).toBe(expectedTrivialKey);
  });

  it("Returns SHA3-512 of stringfied partitionKey when its length is bigger than MAX_PARTITION_KEY_LENGTH", () => {
    const event = {
      partitionKey: {
        hello: "world",
        description:
          "As he waited for the shower to warm, he noticed that he could hear water change temperature.",
        description2:
          "As he waited for the shower to warm, he noticed that he could hear water change temperature.",
        description3:
          "As he waited for the shower to warm, he noticed that he could hear water change temperature.",
      },
    };
    const expectedTrivialKey = crypto
      .createHash("sha3-512")
      .update(JSON.stringify(event.partitionKey))
      .digest("hex");

    const trivialKey = deterministicPartitionKey(event);

    expect(event).toHaveProperty("partitionKey");
    expect(JSON.stringify(event.partitionKey).length).toBeGreaterThan(
      MAX_PARTITION_KEY_LENGTH
    );
    expect(trivialKey).toBe(expectedTrivialKey);
  });

  it("Returns SHA3-512 of stringfied event string when partitionKey is not defined", () => {
    const event = {
      hello: "world",
    };
    const expectedTrivialKey = crypto
      .createHash("sha3-512")
      .update(JSON.stringify(event))
      .digest("hex");

    const trivialKey = deterministicPartitionKey(event);

    expect(event).not.toHaveProperty("partitionKey");
    expect(trivialKey).toBe(expectedTrivialKey);
  });
});
