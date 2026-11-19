# Sign-up checklist (mobile), checked 2026-11-19

The audit grades a recorded sign-up against this list. Each item says how strong its backing is:
**Rule** = an app store or a law requires it · **Standard** = a published standard (NIST, WCAG, OWASP) ·
**Research** = usability studies (Baymard, NN/g, FIDO) · **Practice** = common good practice, no study found.
Sources are the keys in brackets, listed at the bottom. Started from checklist.design's 8 items.
**Seen** = the recorder can judge it from a recording; **Person** = needs a person or the live site.

## 1. Before the form
| Item | Backing | Judged |
|---|---|---|
| One line saying what you get, above the form | Practice | Seen |
| Try before signing up (guest mode) where the product allows it | Research [baymard-guest] | Seen |
| Ask for an account at the moment it is needed (save, buy, post), not on first open | Research [baymard-guest] | Seen |
| Intro slides skippable, few of them | Practice | Seen |
| Sign up and Log in easy to tell apart | Practice | Seen |

## 2. Ways to sign up
| Item | Backing | Judged |
|---|---|---|
| Sign up with Apple, Google or a social account | Practice (checklist.design) | Seen |
| If any third-party sign-in is offered on iPhone, also offer one that limits data to name and email and can hide the email (Sign in with Apple qualifies) | Rule [apple-4.8] | Seen |
| Phone number sign-up with a country-code picker (strong in the Gulf) | Practice | Seen |
| Passkey sign-up: email first, say a passkey is part of sign-up before the phone's prompt, keep a fallback | Research [fido-ux] | Seen |
| Same email from a social account links to the existing account, no dead end | Practice | Person |
| Sign-up stays in the app, never sent out to the web browser | Rule [apple-deletion-faq] | Seen |

## 3. Fields
| Item | Backing | Judged |
|---|---|---|
| Only the fields needed (each extra one lowers completion) | Practice (checklist.design) | Seen |
| Email field brings the email keyboard; phone brings the number pad | Standard [webdev-signup] | Seen |
| Password manager can fill and save (marked as new password and username) | Standard [webdev-signup] | Seen |
| Auto-capitalise and auto-correct off on email and username | Practice | Seen |
| Labels stay visible; hint text alone disappears when typing | Research [nng-placeholder] | Seen |
| Return key moves to the next field and sends on the last | Practice | Seen |
| Paste allowed everywhere, passwords and codes too | Standard [webdev-signup] [nist-63b] | Seen |
| Spaces at the start and end trimmed | Practice | Person |
| "Did you mean gmail.com?" on a typo | Practice | Person |
| Name field accepts any name (Arabic, one word, hyphens) | Practice | Person |

## 4. Password
| Item | Backing | Judged |
|---|---|---|
| No confirm-password field; a show/hide button instead | Research [baymard-show] [govuk-show] | Seen |
| Length over symbols: no "must have a capital and a symbol" rules | Standard [nist-63b] | Seen |
| Long passwords allowed (at least 64 characters) | Standard [nist-63b] | Person |
| Known leaked or common passwords refused, with a kind message | Standard [nist-63b] | Person |
| Rules shown up front and ticked as met; strength shown while typing | Practice (checklist.design) | Seen |

## 5. Errors and checking
| Item | Backing | Judged |
|---|---|---|
| Each field checked when the person leaves it, not while typing | Research [baymard-inline] | Seen |
| Error removed as soon as the field is fixed; a tick when it is right | Research [baymard-inline] | Seen |
| Error next to the field, saying how to fix it | Research [baymard-inline] | Seen |
| Errors never erase what was typed | Practice | Seen |
| No-connection state keeps what was typed and offers retry | Practice | Person |
| Errors read aloud by screen readers | Standard (WCAG 4.1.3) | Seen |

## 6. Account already exists (a real trade-off)
| Item | Backing | Judged |
|---|---|---|
| Helpful: "This email has an account" with Log in and Reset right there | Practice | Seen |
| Private: same answer whether the email exists or not, details sent by email | Standard [owasp-auth] | Seen |
The best version picks helpful for ordinary apps and private for sensitive ones (health, money, dating).

## 7. Legal and consent
| Item | Backing | Judged |
|---|---|---|
| Terms and privacy accepted before the account is made, readable in the app | Practice (checklist.design) | Seen |
| Marketing opt-in separate, off by default, as easy to withdraw | Rule [pdpl] (Saudi), GDPR (EU) | Seen |
| Age asked neutrally (type birth month and year, no "I am over 12" box) where children's rules apply | Rule [coppa] (US) | Seen |
| Tracking asked through the phone's own prompt, before any tracking (iPhone) | Rule [apple-privacy] | Person |

## 8. The button and sending
| Item | Backing | Judged |
|---|---|---|
| Button says what it does: "Create account" | Practice | Seen |
| Loading state; cannot be pressed twice | Practice | Seen |
| Button stays above the keyboard | Practice | Seen |
| A disabled button says why, or it stays enabled and shows the errors | Practice | Seen |
| Robot check only when needed, invisible first | Practice | Person |
| Limits on repeated tries and code sends | Standard [owasp-auth] [nist-63b] | Person |

## 9. Verification
| Item | Backing | Judged |
|---|---|---|
| Product usable before the email is confirmed | Practice (checklist.design) | Person |
| Code fills itself from the SMS (iPhone one-time-code; Android SMS Retriever or WebOTP) | Standard [otp] | Seen |
| Code boxes take a pasted code, move on by themselves and send on the last digit | Practice | Seen |
| Resend with a countdown, plus "change email or number" | Practice | Seen |
| "Open mail app" button on the check-your-email screen | Practice | Seen |
| Expired code or link: clear message and one tap for a new one | Practice | Person |

## 10. After sign-up
| Item | Backing | Judged |
|---|---|---|
| Welcome screen pointing to the first action | Practice (checklist.design) | Seen |
| Signed in straight away, never "now log in" | Practice | Seen |
| Permissions asked when each is needed, a reason screen first, no reward for saying yes | Rule [apple-privacy] | Seen |
| Profile setup optional and skippable | Practice | Seen |
| Already-have-an-account link | Practice (checklist.design) | Seen |
| Delete account inside the app (iPhone and Android) plus a web link (Android) | Rule [apple-deletion] [play-deletion] | Person |

## 11. Access and language
| Item | Backing | Judged |
|---|---|---|
| Touch targets at least 24 px (WCAG AA); 44 recommended, and Apple's own guide uses 44 points | Standard [wcag-target] | Seen |
| Every field has a name screen readers say | Standard (WCAG 1.3.1, 4.1.2) | Seen |
| Contrast passes in light and dark | Standard (WCAG 1.4.3) | Seen |
| Large text setting does not break the layout | Standard (WCAG 1.4.4) | Seen |
| Right-to-left for Arabic, with phone numbers and codes kept left-to-right | Practice | Seen |
| Main actions within thumb reach | Practice | Seen |

## 12. Edge cases
| Item | Backing | Judged |
|---|---|---|
| Leaving halfway keeps what was typed | Practice | Person |
| Invite link kept through the whole flow; returns to where they were | Practice | Person |
| Works on slow mobile data | Practice | Person |

## Corrections to the first draft (in chat)
- "Apple sign-in required" was wrong: Apple asks for *a* login that limits data, and Sign in with Apple is one that qualifies.
- Touch size: the web rule's minimum is 24 px; 44 is the stronger level and Apple's figure.
- "Same answer whether the email exists" and "offer Log in" conflict: now one trade-off row (section 6).
- Dropped: "welcome email says which method they used", "new-device alert", "two-step offered later",
  "drop-off measured" (no source found; not visible in a recording).

## Sources
- [apple-4.8] App Store Review Guidelines 4.8: https://developer.apple.com/app-store/review/guidelines/#login-services
- [apple-deletion] 5.1.1(v): https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion
- [apple-deletion-faq] https://developer.apple.com/support/offering-account-deletion-in-your-app
- [apple-privacy] HIG, privacy: https://developer.apple.com/design/human-interface-guidelines/privacy
- [play-deletion] https://support.google.com/googleplay/android-developer/answer/13327111
- [nist-63b] NIST SP 800-63B Rev. 4: https://pages.nist.gov/800-63-4/sp800-63b/passwords
- [owasp-auth] https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- [wcag-target] https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- [webdev-signup] https://web.dev/articles/sign-up-form-best-practices
- [otp] https://web.dev/articles/sms-otp-form
- [fido-ux] https://fidoalliance.org/ux-guidelines-for-passkey-creation-and-sign-ins/
- [baymard-inline] https://baymard.com/blog/inline-form-validation
- [baymard-show] https://baymard.com/guidelines/665-show-password-feature
- [baymard-guest] https://baymard.com/blog/reduce-cart-abandonment
- [govuk-show] https://technology.blog.gov.uk/2021/04/19/simple-things-are-complicated-making-a-show-password-
- [nng-placeholder] https://www.nngroup.com/articles/form-design-placeholders/
- [pdpl] https://www.tamimi.com/news/sdaia-opens-public-consultation-on-proposed-amendments-to-the-pdpl-implementing-regulation/
- [coppa] FTC COPPA FAQ: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- Base list: https://www.checklist.design/mobile/sign-up
