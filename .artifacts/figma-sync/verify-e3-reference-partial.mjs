import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [sourceCheckout, extractedBundle] = process.argv.slice(2);
assert.ok(
  sourceCheckout && extractedBundle,
  "Usage: node verify-e3-reference-partial.mjs SOURCE_CHECKOUT EXTRACTED_BUNDLE",
);
const read = (p) =>
  JSON.parse(readFileSync(path.join(extractedBundle, p), "utf8"));
const { createCore } = await import(
  pathToFileURL(path.resolve(sourceCheckout, "scripts/figma-sync/core.mjs"))
);
const { core, contract } = createCore();
const manifest = read("manifest.json");
for (const file of manifest) {
  const bytes = readFileSync(path.join(extractedBundle, file.path));
  assert.equal(bytes.length, file.bytes);
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    file.sha256,
    file.path,
  );
}
const proof = read("evidence/e3-r13-quota-stop-verified-proof.json");
for (const item of proof.proof) {
  const dir = item.brand + "/" + path.posix.dirname(item.plan),
    artifact = (n) => read(dir + "/" + n);
  const plan = artifact("plan.json"),
    attempt = artifact("attempt.json"),
    beforeInventory = artifact("inputs/inventory-consumer.json");
  const previousReceipt = plan.inputDigests.previousReceipt
    ? artifact("inputs/previous-receipt.json")
    : null;
  const verdict = core.verifySync({
    plan,
    attempt,
    beforeInventory,
    afterInventory: attempt.afterInventory,
    previousReceipt,
  });
  assert.equal(
    verdict.status,
    "verified",
    JSON.stringify(verdict.verification.errors),
  );
  assert.equal(contract.digest(verdict.receipt), item.receiptDigest);
}
assert.equal(proof.proof.length, 43);
const recovery = read("evidence/e3-r13-quota-stop-recovery.json");
assert.equal(recovery.allEComplete, false);
assert.equal(recovery.formalMutations, false);
const pending = recovery.brands.find((b) => b.brand === "b")
  .incompleteApplies[0];
const head = read("b/" + pending.head);
assert.equal(head.attemptHead.status, "applied");
assert.equal(head.attemptHead.completedActions.length, 12);
assert.deepEqual(head.attemptHead.errors, []);
assert.equal(head.payload.chunkCount, 4);
process.stdout.write(
  JSON.stringify({
    status: "partial-evidence-verified",
    files: manifest.length,
    verifiedRuns: 43,
    smallBatches: { a: 14, b: 13 },
    pendingB14: { writesReported: 12, complete: false },
    allEComplete: false,
  }) + "\n",
);
