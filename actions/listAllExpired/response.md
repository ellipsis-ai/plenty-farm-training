Searched for training sessions that occurred before {successResult.thresholdDate}.

{if successResult.hasExpiredTrainings}
_{successResult.expiryHeading}:_

{successResult.expiredString}
{else}
No expired training sessions found.
{endif}
{if successResult.hasWarnings}

---

_Spreadsheet data warning:_
{successResult.warningString}
{endif}