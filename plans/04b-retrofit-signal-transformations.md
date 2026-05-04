# Retrofit — Σήμα Transformations

**This is a retrofit, not a new section plan.** It fixes a foundation gap discovered during review of `/foundations/systems`: the signals page never covered amplitude scaling, time shift, flip, time scaling, or how these combine — and the systems page silently assumed students could read `h(t-τ)` as "h flipped and shifted right by t". That assumption was wrong for many readers.

This plan does **three** things:

1. **Adds new content to the existing `/foundations/signals` page** (a new section between the existing sections 4 and 5).
2. **Adds a short prerequisite callout to `/foundations/systems`** (at the top of section 4, before convolution begins).
3. **Optionally** mirrors the new content as a standalone reference page `/foundations/signal-transformations` for direct linking from anywhere.

---

## Part 1: Retrofit `/foundations/signals`

### Where it goes

Insert as a new section **4.5 Βασικοί μετασχηματισμοί σήματος** between the current Section 4 ("Δομικοί λίθοι") and Section 5 ("Πώς ξεχωρίζουμε σήματα — ταξινομία").

Renumber subsequent sections so old §5 → §6, etc. (Or keep the numbering 4-5-6 and make this 4.5 — choice of whichever is cleaner with the page's current heading hierarchy. The TOC must stay accurate.)

Add to the page outline at the top of the section:

```
4.5 Βασικοί μετασχηματισμοί σήματος
   4.5a Amplitude scaling — A · x(t)
   4.5b Time shift — x(t − t₀)
   4.5c Time reversal (flip) — x(−t)
   4.5d Time scaling — x(at)
   4.5e Συνδυασμοί — η σειρά παίζει ρόλο
```

### Content

#### 4.5a Amplitude scaling — A · x(t)

- Multiplying the whole signal by a constant A scales **the y-axis** (vertical):
  - `A > 1` → ψηλαίνει
  - `0 < A < 1` → χαμηλώνει
  - `A < 0` → ανάκλαση γύρω από τον x-άξονα (πλάτος και αλλαγή πρόσημου)
- Δεν αλλάζει τη χρονική συμπεριφορά. Ένα cosine παραμένει cosine ίδιας συχνότητας — απλώς πιο ψηλό ή πιο χαμηλό.

Tiny viz: slider for A, plot of `A·cos(2π t)`. Shows squashing/stretching/flipping vertically.

#### 4.5b Time shift — x(t − t₀)

- Αντικαθιστούμε `t` με `t − t₀`. Το σήμα **ολισθαίνει** στον χρόνο.
- **Σύμβαση που μπερδεύει τους πάντες:** `t₀ > 0` σημαίνει ολίσθηση **προς τα δεξιά** (καθυστέρηση). `t₀ < 0` σημαίνει ολίσθηση **προς τα αριστερά** (προπορεία).
- Πώς το θυμόμαστε: ο όρος `t − t₀` γίνεται 0 όταν `t = t₀`. Αν στο αρχικό x(t) η ενδιαφέρουσα στιγμή ήταν στο 0 (π.χ. το peak μιας τριγωνικής συνάρτησης ήταν στο 0), τώρα στο `x(t − t₀)` η ενδιαφέρουσα στιγμή πέφτει στο `t₀`. Άρα μετακινήθηκε **προς τα δεξιά** κατά `t₀`.
- `<Callout type="key">`: *"Αν δεις θετικό t₀ μέσα στο `x(t − t₀)` και πας να μετατοπίσεις αριστερά, σταμάτα. Είναι το αντίστροφο. Σκέψου: «πότε γίνεται μηδέν αυτό που έχω μέσα στην παρένθεση;» — εκεί κάθεται η αρχή του σήματος τώρα."*

Viz: slider for `t₀`, plot of `x(t − t₀)` for an asymmetric signal (e.g. a triangle peaking at a known point — easier to *see* the shift than with a symmetric signal).

#### 4.5c Time reversal — x(−t)

- Αντικαθιστούμε `t` με `−t`. Το σήμα **καθρεφτίζεται** γύρω από τον y-άξονα.
- Παράδειγμα: αν `x(t)` ήταν αιτιατό (μη μηδενικό μόνο για `t > 0`), τότε το `x(−t)` είναι μη-μηδενικό μόνο για `t < 0`.
- Τα **άρτια** σήματα (όπως cosine) δεν αλλάζουν: `cos(−t) = cos(t)`. Τα **περιττά** (όπως sine) αλλάζουν πρόσημο: `sin(−t) = −sin(t)`. (Forward link — αυτό συνδέεται με την παρακάτω ενότητα για άρτια/περιττά.)

Viz: plot of an asymmetric signal and its mirrored version.

#### 4.5d Time scaling — x(at)

- Αντικαθιστούμε `t` με `at` (όπου a ένας μη-μηδενικός σταθερός αριθμός).
- `|a| > 1` → **συμπίεση** στον χρόνο (το σήμα τρέχει πιο γρήγορα). Ένα cosine περιόδου T γίνεται cosine περιόδου T/|a|.
- `0 < |a| < 1` → **επέκταση** στον χρόνο (πιο αργά).
- `a < 0` → επιπλέον flip (όπως στο 4.5c).

Tip για cosine: `cos(2π f t)` έχει συχνότητα `f`. Αν αντικαταστήσουμε `t` με `at`, παίρνουμε `cos(2π f a t)` — δηλαδή νέα συχνότητα `|f a|`. Συμπίεση στον χρόνο = αύξηση της συχνότητας. (Forward link: αυτό θα είναι μια από τις ιδιότητες του Fourier transform.)

Viz: slider for `a`, plot of `cos(2π · 1 · a · t)`. Watch the frequency change as a moves.

#### 4.5e Συνδυασμοί — η σειρά παίζει ρόλο

Αυτή είναι **η ενότητα που λείπει από όλες τις σημειώσεις και μπερδεύει τους πάντες.** Ξεκαθαρίζουμε τι κάνουμε όταν συναντάμε σύνθετες εκφράσεις όπως `x(at + b)` ή `A · x(−t + T)`.

**Γενικός κανόνας — βγάλε τον συντελεστή του t έξω από την παρένθεση πρώτα.**

Αν έχεις `x(at + b)`, ξαναγράψτο ως `x(a(t + b/a))`. Τώρα φαίνεται καθαρά ότι:

1. **Πρώτα** εφαρμόζεις το time scaling κατά `a` (και πιθανό flip αν `a < 0`).
2. **Μετά** ολισθαίνεις κατά `−b/a`.

Παράδειγμα: `x(2t − 4) = x(2(t − 2))`. Σκάλεμα κατά 2 (συμπίεση), μετά shift δεξιά κατά 2.

**Παράδειγμα-κλειδί που εμφανίζεται στη συνέλιξη:** `h(t − τ)`. Αν θεωρήσουμε το `τ` ως μεταβλητή και το `t` ως σταθερά (γιατί έτσι λειτουργεί η συνέλιξη — ολοκληρώνουμε ως προς τ ενώ το t είναι σταθερό), τότε:

`h(t − τ) = h(−(τ − t))`.

Πρώτα flip (το `−` έξω από την παρένθεση), μετά shift δεξιά κατά `t`. **Αυτό είναι το «flip-and-slide» που θα δούμε στη συνέλιξη**. Αν το έχεις στο μυαλό σου από τώρα, η συνέλιξη θα φαίνεται φυσική.

`<Callout type="key">`: *"Όταν βλέπεις `x(αλλόκοτο όρισμα)`: (1) βγάλε τον συντελεστή του ανεξάρτητη μεταβλητή έξω από την παρένθεση, (2) διάβασε flip και scaling από αυτόν, (3) διάβασε shift από το υπόλοιπο. Πάντα με αυτή τη σειρά."*

**Worked example στη σελίδα:**

Έστω `x(t)` το τρίγωνο πλάτους 1, με βάση από 0 έως 2 και κορυφή στο 1. Σχεδίασε το `x(−t + 3)`.

Λύση:
- `x(−t + 3) = x(−(t − 3))`
- Πρώτα flip → η βάση γίνεται από −2 έως 0, κορυφή στο −1
- Μετά shift δεξιά κατά 3 → η βάση γίνεται από 1 έως 3, κορυφή στο 2

Διάγραμμα δίπλα-δίπλα: αρχικό, μετά flip, μετά shift.

**Optional viz:** `<TransformationStepThrough />` — input asymmetric signal, dropdown to choose `x(at + b)` parameters, animation walks through the steps in order with intermediate states. Stretch goal — can be skipped if the worked example is clear enough.

### Updates to the rest of the page

In **Section 5b (Άρτια / Περιττά)**, the existing material can now reference back to 4.5c with a small *"όπως είδαμε στους μετασχηματισμούς, `cos(−t) = cos(t)`"* — back-reference, no rewrite needed.

In **Section 4g (δ(t))**, when discussing `δ(t − t₀)` as "shifted impulse", add a back-reference to 4.5b: *"αυτό είναι ένα standard time shift όπως είδαμε στο 4.5b"*.

### Forward references this section creates

- The flip-and-slide intuition for convolution explicitly **previews** what's coming in `/foundations/systems` Section 4. We tell the reader: "θα ξανασυναντήσεις αυτή την ιδέα στη συνέλιξη — και τώρα θα την αναγνωρίζεις". Helps the systems page later.
- Time scaling effect on frequency (cos compression → frequency up) **previews** a Fourier property. Forward link to `/foundations/fourier-transform`.

---

## Part 2: Retrofit `/foundations/systems`

### Where it goes

At the **top of Section 4 (Συνέλιξη)** — before subsection 4a — add a short callout that does a quick mini-recap of the relevant transformation rule, plus a link back to `/foundations/signals` 4.5e for the full treatment.

### Content for the callout

```
<Callout type="prerequisite">
**Πριν προχωρήσουμε:** η συνέλιξη βασίζεται στην ικανότητά μας να διαβάζουμε εκφράσεις όπως `h(t − τ)` σωστά. Σύντομη υπενθύμιση:

- Στο `h(t − τ)`, η μεταβλητή ολοκλήρωσης είναι το **τ** (το **t** είναι σταθερό για κάθε υπολογισμό).
- `h(t − τ) = h(−(τ − t))` — δηλαδή η `h` πρώτα **αναποδογυρίζεται** (flip), μετά **ολισθαίνεται δεξιά κατά t**.

Αν θες την πλήρη εξήγηση γιατί ισχύει αυτό και πώς γενικεύεται, [δες την παράγραφο για συνδυασμούς μετασχηματισμών](/foundations/signals#54e-sundyasmoi).
</Callout>
```

(Adjust the anchor to whatever the actual id of section 4.5e ends up being.)

This callout does two jobs: it makes the section self-sufficient (no need to leave the page), and it provides a deep link for readers who realize they need the full background.

---

## Part 3: Standalone reference page (optional but recommended)

Mirror the new content at `/foundations/signal-transformations` as a thin reference page. Frontmatter:

```yaml
title: "Μετασχηματισμοί σήματος — Quick reference"
slug: "foundations/signal-transformations"
order: 99                  # appears low in sidebar; this is reference, not flow
prerequisites: []
examWeight: 5
estimatedReadTime: 8
lastUpdated: "2026-05-XX"
```

Content: literally the same content as Part 1's section 4.5, but as a standalone page. No new vizzes — reuse the components from `/foundations/signals`.

Why have it as a separate page: when other parts of the site (Fourier, modulation) need the reader to recall flip-and-slide or scaling rules, they can deep-link directly to this page rather than into the middle of the signals page.

In the sidebar, group it as **Foundations → Reference → Μετασχηματισμοί σήματος** (under a new "Reference" subgroup) — distinguishing flow content from reference content.

---

## Acceptance criteria

When this retrofit is done:

1. ✅ `/foundations/signals` has a new section 4.5 with all 5 sub-parts (a-e) and a worked example
2. ✅ Section 4.5e clearly explains the order-of-operations for combined transformations and explicitly previews the flip-slide of `h(t − τ)`
3. ✅ The page TOC and "estimatedReadTime" frontmatter are updated to reflect the added content (~8 minutes more reading)
4. ✅ Back-references in §5b and §4g of the signals page are added
5. ✅ `/foundations/systems` has a prerequisite callout at the top of Section 4 with the mini-recap and a deep link
6. ✅ `/foundations/signal-transformations` standalone page exists, content-mirrored, sidebar-grouped under "Reference"
7. ✅ Sidebar shows the new "Reference" subgroup
8. ✅ User reviews with the stupid student filter — the question "given `x(−t + T)`, what do I do first?" has a clean answer the student can find in under 30 seconds

---

## Updates to COMMITMENTS.md

No new open commitments from this retrofit. The retrofit *closes a hidden gap* rather than promising future work.

---

## Note for Claude Code

This retrofit fixes a real reader-confusion that came up during the "stupid student" review. The student literally asked: *"if we have A · x(−t + T) do we first do the flip then the shift or first the shift then the flip then * A?"*. The whole point of section 4.5e is to give a clean, memorable answer to that exact question.

Don't treat this as polish — it's load-bearing for the rest of the foundations chapter and beyond.
