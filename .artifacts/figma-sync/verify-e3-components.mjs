import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [sourceCheckout, extractedBundle] = process.argv.slice(2);
assert.ok(sourceCheckout && extractedBundle, "Usage: node verify-e3-components.mjs SOURCE_CHECKOUT EXTRACTED_BUNDLE");
const read = (relative) => JSON.parse(readFileSync(path.join(extractedBundle, relative), "utf8"));
const { createCore } = await import(pathToFileURL(path.resolve(sourceCheckout, "scripts/figma-sync/core.mjs")));
const { core, contract } = createCore();
const manifest = read("manifest.json");
for (const file of manifest) {
  const bytes = readFileSync(path.join(extractedBundle, file.path));
  assert.equal(bytes.length, file.bytes);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256, file.path);
}
const proof = read("evidence/e3-components-matrix-proof.json");
const groups = ["e3-r10-partial-coverage-proof.json", "e3-r11-partial-coverage-proof.json", "e3-r12-components-proof.json"].flatMap((name) => read("evidence/" + name).proof);
let verifiedRuns = 0;
for (const result of proof.results) {
  const covered = new Set();
  for (const run of result.runs) {
    const dir = path.posix.dirname(run.plan);
    const artifact = (name) => read(`${result.brand}/${dir}/${name}`);
    const plan = artifact("plan.json"), attempt = artifact("attempt.json");
    const beforeInventory = artifact("inputs/inventory-consumer.json");
    const previousReceipt = plan.inputDigests.previousReceipt ? artifact("inputs/previous-receipt.json") : null;
    const verdict = core.verifySync({ plan, attempt, beforeInventory, afterInventory: attempt.afterInventory, previousReceipt });
    assert.equal(verdict.status, "verified", JSON.stringify(verdict.verification.errors));
    const expected = groups.find((group) => group.brand === result.brand && group.plan === run.plan);
    assert.equal(contract.digest(verdict.receipt), expected.receiptDigest);
    for (const node of beforeInventory.nodes) if (node.scopeRootId !== null) covered.add(node.nodeId);
    verifiedRuns += 1;
  }
  assert.equal(result.directVariants, 210);
  assert.ok(result.variants.every((variant) => covered.has(variant.nodeId)));
  assert.equal(covered.size, result.coveredNodes);
}
process.stdout.write(JSON.stringify({ status: "verified", files: manifest.length, brands: proof.results.length, verifiedRuns, variantsPerBrand: 210 }) + "\n");
