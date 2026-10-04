# E3 live test evidence

This bundle contains real TEST Figma results through candidate `640c4479799603d03bc275e01e92a327271c8d24`. It is evidence, not a release or a completed full-coverage acceptance. Do not merge this evidence branch into application branches.

`e3-live-evidence-r9.zip` SHA-256: `991bd4b02f4cf61407bbbd38d9e35e4f74bf99bcb6b28acce78d099b41622d70` (10,066,166 bytes). The manifest records SHA-256 and byte size for each of 1,172 enclosed files; every entry was re-read from the zip and checked.

- `a/` and `b/` preserve each isolated project's public settings, target receipts, and normal CLI run artifacts. They use different slugs and brand inputs. Each artifact records its actual Git/tool fingerprint; older runs retain their older fingerprints.
- `evidence/` indexes brand creation/noop, Button preservation, published Library versions and explicit source review, controlled withheld recording and resume, private overrides, same-name rebuilt layers, and multipart drift rejection.
- A successful `receipt` was emitted only by the normal record/verify path. Blocked plans, failed attempts, transport errors, and intentionally withheld original apply envelopes remain as evidence. Do not blindly replay an execute script or record an older result against a later receipt.
- Recovery tested withholding the successful response from recording; this is not a claim that a real network outage occurred. The separate multipart drift test did modify a TEST node between chunks and was rejected without replacing the prior success receipt.

For portable inspection, unpack into a new directory, verify file hashes against `manifest.json`, and use the exact recorded tool commit's `core-contract.mjs` to validate and canonical-hash JSON artifacts. `inputs/` preserves prior snapshots and receipts for independent verification. Use the current CLI's documented recovery process for further Figma changes, with fresh scans and new run IDs.

At this checkpoint the remaining E3 work is full component/reference coverage and final delivery. Formal CookHome Figma migration and F have not started.
