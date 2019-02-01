Searched for trainings that occurred before {successResult.thresholdDate}.

{if successResult.hasExpiredTrainings}
_{successResult.expiryHeading}:_

{successResult.expiredString}
{else}
No expired trainings found.
{endif}
{if successResult.hasWarnings}

---

_Spreadsheet data warning:_
{successResult.warningString}
{endif}