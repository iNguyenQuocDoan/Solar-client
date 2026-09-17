# Run Configuration

Fill in these values before running this prompt. Every section below refers to them by key.

```yaml
standards_package_path: docs/
out_of_scope_paths: [] # Project documentation inside the package path that must not be normalized, e.g. [docs/adr/, docs/api/]
project_rules_location: '' # Destination for relocated project-specific rules, e.g. AGENTS.md. Required if project-specific content is found.
project_specific_terms: [] # Terms that must not remain in the package: project name, product names, domain nouns, service names, domains
output_language: keep-existing # keep-existing | en | vi | another language code
migration_map_path: standards-migration-map.md
execution_mode: full # full | audit-then-stop
```

---

# Role

You are a senior software engineer and engineering standards maintainer.

Your task is to audit, refactor, and standardize the Markdown documentation under `standards_package_path`.

The result must become a reusable **Engineering Standards package** that can be copied into different software projects without carrying assumptions, domain rules, or implementation details from the current project.

Do not build application features.

Your primary responsibility is the documentation and engineering rules. The limits on changes outside the documentation are defined in Execution Rules.

---

# Primary Goal

Transform the in-scope Markdown files under `standards_package_path` into a coherent, reusable standards system covering:

- software engineering and coding practices
- backend and frontend engineering principles
- code review
- testing and quality gates
- application security
- performance and optimization
- dependency and configuration management
- Git/change conventions
- rules for AI coding assistants (B9), and prompting rules where the existing documentation already covers them

The standards must help another AI coding agent or developer work consistently in a completely different project.

---

# How to Use This Prompt

This prompt has two parts:

- **Part A** defines how to perform the refactor.
- **Part B** defines what the resulting standards must contain. Sections of Part B that also apply to you while performing this task say so explicitly.

Instructions in this prompt are mandatory unless explicitly marked as optional (for example, with MAY). The keyword definitions in B1 govern the standards you write.

Versions, statuses, and thresholds stated in this prompt were verified on 2026-09-17, when this prompt was written. They can change; A7 defines how to use them.

## Phases

1. **Audit and plan** — perform A1–A4, and plan the structure (A5), the handling of project-specific content (A6), and the migration map (A9). Do not edit documentation in this phase.
2. **Normalize** — apply A5–A9 and Part B.
3. **Verify** — perform A10.
4. **Report** — return the Final Response.

## Execution Modes

Set by `execution_mode`:

- `full` — run all phases without stopping, unless a stop condition applies.
- `audit-then-stop` — run Phase 1, write the planned migration map to `migration_map_path`, report, and stop without editing documentation.

## Stop Conditions

- If `standards_package_path` does not exist, report and stop.
- If project-specific content is found inside the package and `project_rules_location` is empty, complete Phase 1, report, and stop.

---

# Core Principle: Three Layers

Separate rules into three conceptual layers.

### Core Standards

Rules that are genuinely applicable across projects and technology stacks.

Examples:

- maintainability
- correctness
- simplicity
- testing
- secure development
- code review
- observability principles
- evidence-based optimization

### Stack-Specific Standards

Rules that only apply when a particular language, framework, runtime, database, or platform is present.

Do not present stack-specific implementation choices as universal rules.

### Project-Specific Rules

Domain terminology, business logic, project-specific architecture, paths, API contracts, roles, workflows, infrastructure, performance SLAs, and other project-specific decisions.

These MUST NOT leak into the reusable package. Where they currently exist inside it, generalize or relocate them as defined in A6.

B1 defines how each layer is expressed in the documentation and how the layers take precedence over each other.

---

# Part A — Performing the Refactor

## A1. Scope and Package Boundary

The reusable standards package is `standards_package_path`. Everything in it, except `out_of_scope_paths`, must be reusable in another project.

- Files under `out_of_scope_paths` are project documentation. Read them for context only. Do not rewrite, move, or normalize them.
- During the audit, classify every Markdown file under the package path as **standards** or **project documentation**.
- If you find project documentation inside the package path that is not listed in `out_of_scope_paths` (for example ADRs, API references, product specifications, or meeting notes), do not rewrite or move it. Report it as content that prevents the package from being copied as-is.

## A2. Audit Existing Documentation

Read every in-scope `.md` file under the package path before making structural decisions.

Build an internal map of:

- purpose of each document
- duplicated rules
- contradictory rules
- outdated rules
- project-specific content
- stack-specific content
- rules without clear justification
- missing engineering areas
- broken links or references
- terminology inconsistencies

Also record:

- the classification of each file (A1)
- the list of files that exist before any edit (used by A10)
- candidate project-specific terms found in the documentation (used by A10)

Do not rewrite files independently without understanding how they relate to the rest of the documentation.

When two documents define the same rule, establish one canonical source and reference it from the other document instead of maintaining duplicated rules.

## A3. Preserve Valid Existing Knowledge

This is a refactor of the documentation, not an excuse to redesign everything.

Preserve existing rules when they are:

- technically valid
- reusable
- clear
- non-duplicated
- consistent with the rest of the standards

Do not rewrite text merely to make it look different.

Do not remove useful constraints just to shorten documents.

Do not expand a simple rule into unnecessary theory.

## A4. Handle Missing Areas

For each area in the Primary Goal:

1. **Covered by the existing documentation** → normalize it.
2. **Missing, and rules can be grounded under A7** → create a minimal standard containing only what can be grounded.
3. **Missing, and the substance is a team or project choice rather than a verifiable engineering practice** (for example a commit message format, a branching model, or a code formatting style) → do not choose one. Write only rules that hold regardless of that choice and satisfy A7, and report the open decision.

Missing areas outside the Primary Goal are reported, not written.

Conventions that this prompt defines explicitly, such as the comment rules in B4, are decisions of the package owner. Write them as specified and do not apply rule 3 to them. Where an existing rule conflicts with such a convention, the convention supersedes it; record the superseded rule in the migration map.

## A5. Architecture of the Standards

Do NOT blindly create a new folder structure.

First evaluate the current structure.

Preserve existing file names when they already have a clear responsibility.

Rename, split, merge, or create files only when doing so materially improves:

- discoverability
- ownership of rules
- deduplication
- consistency
- reuse across projects

The package MUST have exactly one entry point. Keep the existing index or README if there is one; otherwise create one. Its required content is defined in B1.

The result must allow a project-level `CLAUDE.md`, `AGENTS.md`, or equivalent agent instruction file to say "Follow the engineering standards under `<standards_package_path>`" without the standards needing to know the project's business domain.

## A6. Project-Specific Content

- Project-specific content MUST NOT be deleted.
- Where a valid generic rule exists, generalize that part into the package.
- Relocate the project-specific part to `project_rules_location`, preserving its meaning.
- You MAY create or edit `project_rules_location`, even if it is outside the package path. If it already exists, add a clearly headed section; do not remove or rewrite its existing content.
- The package MUST NOT contain paths or pointers to `project_rules_location`. The entry point states generically that project-specific rules are supplied by the project, for example through its agent instruction file.
- Record every generalization and relocation in the migration map (A9).

## A7. Evidence Rules

Every important normative rule added during this normalization must be traceable to at least one of:

1. an existing valid project standard
2. an official language, framework, or platform specification
3. an established engineering standard
4. an authoritative security standard
5. documented, measurable engineering evidence
6. a package convention defined explicitly in this prompt

When external research is available, prefer primary and official sources.

Do not create fake citations.

Do not cite a source merely because it discusses the same topic. The source must actually support the rule being derived from it.

Distinguish:

- `Standard requirement` — required by an external standard
- `Recommended engineering practice` — supported by guidance or evidence, but not required by a standard
- `Package convention` — decided by the owner of this package and defined explicitly in this prompt; applies to every project that adopts the package
- `Project decision` — belongs to the project (A6), never to the package

Do not present project decisions, package conventions, or recommended practices as industry standards.

### Recording Evidence

- A rule derived from an external source carries a short marker, for example `[R1]`, that points to a **References** section at the end of the same file.
- Each reference entry states: exact document title; version or revision (or "unversioned"); URL; retrieval date (`YYYY-MM-DD`); type (`Standard requirement` or `Recommended engineering practice`).
- A package convention is labeled `Package convention` where it is defined. One label MAY cover a whole section of such rules.
- A rule without a marker or a `Package convention` label is a recommended engineering practice of this package.
- Rules preserved from the existing documentation need no marker. If they were moved or their meaning changed, the migration map traces them.
- A newly added important rule that has no marker, no `Package convention` label, and no migration map entry is not allowed.

### Citing Precisely

- Cite requirement identifiers only in versioned form (for OWASP ASVS: `v<version>-<chapter>.<section>.<requirement>`), and only from a source you actually opened during this task.
- Do not cite a draft publication as a final standard.
- Versions, statuses, and thresholds stated in this prompt are a cross-check, not a source. Verify them before citing. If they have changed, use the current information and report the difference.

### When a Source Cannot Be Accessed

- You MAY cite it at document level only (title and version).
- You MUST NOT quote clauses, requirement identifiers, or numeric values from memory.
- Values stated in this prompt MAY be used only as allowed in the section where they appear.
- List every source you could not access under Remaining Uncertainty.

## A8. Cross-Document Consistency

Check the entire documentation set for contradictions.

Pay particular attention to conflicts such as:

- security vs performance
- simplicity vs abstraction
- strict standards vs framework conventions
- testing requirements vs task risk
- code review requirements vs delivery speed
- frontend rules vs backend rules
- generic standards vs project-specific configuration

When two valid principles conflict, document how the trade-off should be decided instead of declaring one side universally correct.

Precedence between layers is not decided case by case; it is fixed by B1.

## A9. Migration Map

Maintain a migration map at `migration_map_path`. It is a review artifact of this refactor, not part of the package.

Add one row for each section of the existing documentation that was moved, merged, split, generalized, relocated, translated, rewritten with a change in meaning, or removed, and one row for each newly created file:

| Old location (file#section) | New location | Action | Reason |
| --------------------------- | ------------ | ------ | ------ |

- Sections kept in place without a change in meaning need no row.
- A translated file MAY be recorded as a single row.
- Removal is allowed only for content that is duplicated, outdated, invalid, or superseded. The Reason column MUST state which, and on what basis.

## A10. Verification of This Refactor

Before reporting, perform the following checks and record the method and the actual result of each:

1. **Links** — every relative link and anchor inside the package, and in every file you edited, resolves.
2. **References across the repository** — search the entire repository, not only the package, for references to every renamed, moved, merged, split, or removed file, including agent instruction files (such as `CLAUDE.md` or `AGENTS.md`), READMEs, and code comments. Update them.
3. **Leak scan** — search the package, case-insensitively, for every term in `project_specific_terms` and for project-specific items identified in the audit (for example real endpoints, domains, role names, environment names, or SLAs). Report every remaining hit and whether it is an intentional generic example.
4. **Normative keywords** — search the package for rule levels expressed outside the B1 keywords (for example "avoid", "never", "should never", "must usually", SHALL, REQUIRED) and resolve them.
5. **Migration map completeness** — every file recorded before the first edit (A2) is unchanged, listed in the migration map, or out of scope.
6. **Code examples** — every code example in the package follows the comment rules in B4, except examples that illustrate a violation and say so.

If `project_specific_terms` is empty, use the candidate terms recorded in A2, and state under Remaining Uncertainty that the list was not supplied by the project owner.

If a check could not be performed, say so. Do not report a check as passed without performing it.

---

# Part B — Required Content of the Standards

## B1. Standards Framework

Write the following into the package entry point (A5), once. Other files reference it instead of repeating it.

### Normative Keywords

Use the BCP 14 keywords (RFC 2119, as clarified by RFC 8174) consistently. They carry normative meaning only when written in uppercase.

`MUST`
Mandatory engineering requirement.

`MUST NOT`
Explicit prohibition.

`SHOULD`
Recommended default. A deviation requires a documented reason.

`SHOULD NOT`
Not recommended. Allowed only with a documented reason.

`MAY`
Optional practice.

- Use only these five keywords. Do not use their BCP 14 synonyms (SHALL, SHALL NOT, REQUIRED, RECOMMENDED, NOT RECOMMENDED, OPTIONAL).
- Do not use AVOID, NEVER, or PREFER as substitutes for a keyword. Use the keyword that matches the intended enforcement; for example, write `MUST NOT` or `SHOULD NOT` instead of AVOID.
- Do not use ambiguous combinations such as "must usually", "should never", or "recommended but required".
- Keywords stay in uppercase English in every documentation language.
- Each rule must communicate its enforcement level clearly.

### Layers

- **Core standards** apply to every project.
- **Stack-specific standards** apply only when their condition holds. Every stack-specific file, or clearly headed stack-specific section, starts with `Applies when: <condition>`.
- **Project-specific rules** are not part of the package. The entry point states that they are supplied by the project, for example through its agent instruction file.
- The entry point lists every file in the package with its responsibility and applicability.

### Rule Provenance

- A reference marker such as `[R1]` points to the References section of the same file.
- `Package convention` marks rules decided by the owner of this package. They apply to every project that adopts the package and are not industry standards.
- Other rules are recommended engineering practices of this package.

### Precedence

1. A Core `MUST` or `MUST NOT` that applies to a project cannot be relaxed by a stack-specific or project-specific rule. A rule that does not apply, because of its stated condition or risk tier, needs no exception.
2. Stack-specific and project-specific rules MAY make any rule stricter.
3. A `SHOULD` or `SHOULD NOT` MAY be deviated from by a stack-specific rule, a project-specific rule, or an individual change, when the reason is documented where the project declares, or otherwise in the change description (for example, the pull request description).
4. Where an established convention of the language or framework conflicts with a Core recommendation about style or code organization, the established convention takes precedence.
5. Conflicts between valid principles at the same level are resolved through documented trade-offs in the relevant standard, not through precedence.

## B2. Project Integration Boundary

Reusable standards define HOW engineering work is performed.

The project-level agent configuration defines WHAT project is being built.

The package MUST NOT contain the following, except as clearly marked generic examples:

- actual project name
- business rules
- real roles
- real API endpoints
- real database entities
- deployment environment
- real file paths outside the package, including `project_rules_location`
- project-specific SLAs
- product-specific workflows

Real credentials MUST NOT appear anywhere in the package, including examples (B6).

## B3. Documentation Quality

Each standards file must have a clear responsibility.

Use:

one canonical rule → one canonical location → references from other files.

Do not include:

- duplicate rules
- conflicting definitions
- giant files covering unrelated subjects
- excessive prose
- tutorial-style explanations inside normative standards
- domain-specific examples
- arbitrary implementation preferences
- AI-generated filler text

Examples must be short and generic.

Use generic entities such as:

`user`

`product`

`article`

`task`

Do not introduce business domains from the current project.

## B4. Programming Standards

Ensure the standards cover engineering principles such as:

- correctness before cleverness
- simple designs over speculative abstractions
- readable and maintainable code
- clear naming
- explicit responsibilities
- reasonable cohesion and coupling
- separation of concerns
- error handling
- input validation
- configuration management
- dependency management
- backward compatibility where applicable
- appropriate logging and observability
- documentation of non-obvious decisions
- testing appropriate to the risk and type of change

Do not force one directory tree, architecture pattern, class structure, or design pattern onto every technology stack.

Framework-agnostic standards must define responsibilities and boundaries rather than pretending one physical folder structure fits every framework.

Do not require abstractions "for future use" without a current requirement.

Prefer the simplest implementation that correctly satisfies the current requirement while remaining maintainable.

### Readability, Simplicity, and Comments

The standards must make readability, simplicity, and commenting concrete with the rules below, at the levels stated. These rules are decisions of the package owner (A4): label them `Package convention` (A7). You MAY also add reference markers for individual rules that a source you actually opened supports.

**Readability**

- Code MUST follow the formatter and linter configured in the repository.
- Names MUST state what a value is or what a function does. Abbreviations that are not widely understood MUST NOT be used.
- A function SHOULD do one thing.
- Nesting SHOULD be kept shallow, for example with early returns where the language allows it.
- Compressed or clever code MUST NOT be used where a plainer version with the same behavior exists.
- Do not invent universal limits on function or file length. A project MAY declare its own.

**Simplicity (no over-engineering)**

Unless a current requirement needs them (for example a test seam, a framework contract, or a system boundary), the following MUST NOT be introduced:

- abstractions, interfaces, or extension points that have a single use
- layers or wrappers that only forward calls
- configuration options, flags, or parameters that no current caller uses
- design patterns applied where the problem they solve is not present
- generic solutions for a problem that currently has one concrete case

Optimization without measurement is governed by B7.

**Comments**

Only these comments are allowed:

1. documentation comments, defined below
2. region markers, defined below
3. comments that explain why: a non-obvious decision, constraint, workaround, known limitation, or external requirement that the code cannot express

All other comments MUST NOT be written, including:

- comments that restate what the code already says
- comments that narrate steps, for example "Now loop through the users"
- commented-out code
- author, date, or change-history comments; version control records these
- decorative banners or separators
- comments that mark where a function or block ends, for example `} // end login`
- custom start or end markers that no tool recognizes, for example `// auth start` and `// auth end`
- comments that no longer match the code

A comment MUST be updated or removed in the same change that makes it inaccurate.

**Documentation comments**

- Documentation comments MUST use the standard documentation syntax of the language, in the style already used in the repository, for example JSDoc or TSDoc, Python docstrings, Javadoc, Go doc comments, or C# XML documentation comments.
- A documentation comment MUST be written for every function, method, class, or type that is part of a public or exported API, has non-trivial size, or contains non-obvious logic.
- A module or file that implements one feature SHOULD have a module-level documentation comment where the language supports one.
- A documentation comment states what the unit does and what a caller needs to know: inputs, result, errors, and side effects, where relevant. It MUST NOT describe implementation steps or merely restate the name.
- A short, obvious, non-public helper whose name and signature already say everything MUST NOT receive a documentation comment that adds no information.

**Code boundaries**

- The start and end of a function, method, class, or module are expressed by the syntax of the language itself; no comment marks them.
- Related functions SHOULD be grouped by structure, in the same module or class. Unrelated functional groups SHOULD be placed in separate modules.

**Region markers**

- When a file contains more than one functional group, each group SHOULD be wrapped in region markers that the language or the editors used by the project recognize, for example the C# `#region` and `#endregion` directives, or `//#region` and `//#endregion` for TypeScript and JavaScript and `# region` and `# endregion` for Python, which VS Code recognizes.
- The start marker names the group with a short, lowercase name, with words joined by hyphens, and comes before the documentation comments and decorators of the first unit in the group. The end marker repeats the name where the syntax allows it.
- Region markers MUST NOT be placed inside a function body, MUST NOT be nested, and MUST NOT be used in a file that contains only one functional group.
- A region syntax that no language or editor used by the project recognizes MUST NOT be used; split the file instead.
- The region syntax MUST be consistent for each language within a project.
- Where a comment placed directly before a declaration becomes that declaration's documentation (for example in Go), a blank line MUST follow the region start marker so that the marker does not become part of that documentation.

```ts
//#region task-validation
/** Returns the validation errors for a task; an empty list means the task is valid. */
export function validateTask(task: Task, now: Date): string[] {
  const errors: string[] = []
  if (task.title.trim() === '') errors.push('title is required')
  if (task.dueDate < now) errors.push('due date must not be in the past')
  return errors
}
//#endregion task-validation

//#region task-status
/** Returns a copy of the task marked as done, with its completion time set. */
export function completeTask(task: Task, now: Date): Task {
  return { ...task, status: 'done', completedAt: now }
}

/** Returns a copy of the task reopened, with its completion time cleared. */
export function reopenTask(task: Task): Task {
  return { ...task, status: 'open', completedAt: null }
}
//#endregion task-status
```

**Applying these rules**

- Documentation comments and region markers move with their code: moving or deleting code moves or deletes them in the same change.
- When a change modifies a unit that meets the documentation criteria and has no documentation comment, the change MUST add one.
- A change MUST NOT add documentation comments or region markers to code it does not otherwise modify, unless that is the purpose of the change.
- Exempt: formats without comment syntax (for example JSON), generated code, and vendored third-party code.
- Code examples in the standards MUST follow these rules, except examples that illustrate a violation and say so.

## B5. Code Review Standards

Create or normalize code review rules using established engineering review principles. One baseline reference is the code review guide in Google Engineering Practices (https://google.github.io/eng-practices/review/reviewer/); cite it under A7 if rules are derived from it.

A review must consider, when relevant:

- purpose and scope of the change
- system design
- functional correctness
- edge cases
- complexity and over-engineering (B4)
- maintainability
- tests
- naming
- comments, documentation comments, and region markers (B4)
- style/conventions
- documentation
- security impact
- performance impact
- concurrency or race conditions
- compatibility/regression risk
- dependency changes

Review technical facts and evidence rather than personal preferences.

Do not block a change purely because a reviewer prefers another style when both approaches satisfy the established conventions.

Classify every finding by impact. Each level states its effect on merge:

`BLOCKER`
Cannot merge because of correctness, security, data-loss, severe regression, or equivalent critical risk.

`MAJOR`
Materially affects maintainability, design, performance, reliability, or testability. Must be resolved before merge, unless the reviewer explicitly agrees to defer it and the deferral is recorded as a tracked follow-up.

`MINOR`
Real improvement with limited impact. Does not block merge.

`NIT`
Polish or style suggestion. Does not block merge.

`QUESTION`
A potential problem, or a request for clarification, that is not yet supported by evidence. Blocks merge only until the author responds. If the concern is confirmed, reclassify it at the appropriate level.

A finding that violates an applicable `MUST` or `MUST NOT` is at least `MAJOR`.

Do not report speculative problems as confirmed defects; use `QUESTION` for them.

Every reported defect must point to concrete code, behavior, rule, test, measurement, or other evidence.

## B6. Security Standards

Security must be treated as part of the software development lifecycle rather than a final review step.

Use these authoritative references as baseline guidance. Apply A7: verify the current status, and record the version or the retrieval date.

- **OWASP Application Security Verification Standard (ASVS)** — https://github.com/OWASP/ASVS. Latest stable version at prompt-writing time: 5.0.0. Scope: web applications and web services.
- **NIST SP 800-218, Secure Software Development Framework (SSDF)** — https://csrc.nist.gov/Projects/ssdf. At prompt-writing time, the final publication was SP 800-218 (SSDF v1.1), and SP 800-218 Rev. 1 (SSDF v1.2) was still a draft.
- **OWASP Cheat Sheet Series** — https://cheatsheetseries.owasp.org. Cite each specific cheat sheet by its exact title and URL, not the series as a whole.
- **OWASP secure code review guidance** — cite the specific document by its exact title and URL.
- **Microsoft Security Development Lifecycle (SDL)** — use Microsoft's official SDL guidance; record the version if one is stated, otherwise the retrieval date.

Security standards must address relevant areas, including:

- authentication
- authorization
- least privilege
- server-side access control
- input validation
- injection prevention
- output encoding
- secrets management
- session/token handling
- sensitive data handling
- cryptography usage
- file upload handling
- dependency and supply-chain risk
- security logging
- error disclosure
- secure defaults
- threat modeling for meaningful risk
- SAST / dependency scanning / security testing where appropriate

Never invent custom cryptography.

Never store real secrets, tokens, passwords, credentials, or private keys in documentation examples. Use obvious placeholders such as `<API_KEY>`.

Do not rely on frontend validation as a security boundary.

Do not treat authentication as equivalent to authorization.

Security rules must be risk-aware rather than mechanically requiring every possible security mechanism in every project:

- A rule whose necessity depends on risk must state the risk tier at which it applies.
- Where OWASP ASVS applies, use its verification levels as the tier model. Otherwise, define the tiers explicitly and state their basis.
- A project's target tier is a project decision and is not set inside the package.

## B7. Performance Standards

Performance rules must be measurement-driven.

Do not optimize because something merely "looks slow".

Prefer this sequence:

Measure → identify bottleneck → establish baseline → change → benchmark/test again → compare results.

Performance documentation must distinguish between:

- frontend/browser performance
- backend/API performance
- database performance
- network/payload performance
- infrastructure/runtime performance

Do not invent universal latency, throughput, memory, database, or bundle-size limits.

If a project requires numeric performance targets, they must be declared as a project-specific performance budget or backed by an authoritative standard.

Every reported performance measurement must state how it was obtained. For web performance, label it as **field** data (real-user page loads) or **lab** data (local or synthetic runs).

### Core Web Vitals

When Core Web Vitals are applicable:

- Use the current official Web Vitals guidance rather than outdated metrics, and cite it (https://web.dev/articles/vitals) with a retrieval date. Do not use the values below as the source.
- At prompt-writing time, the documented "good" thresholds were LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1, assessed at the 75th percentile of page loads, segmented by mobile and desktop. Use these values only to cross-check what you retrieve. If the official source cannot be accessed, you MAY include them labeled "not re-verified during this task", and you MUST list them under Remaining Uncertainty.
- The standards must state that a Core Web Vitals assessment uses field data, and that lab measurements may be used for diagnosis and regression detection but must not be reported as a Core Web Vitals assessment.

Do not apply browser metrics to backend services.

Performance standards must also prevent common regressions where applicable, including:

- unnecessary network requests
- excessive payloads
- unnecessary JavaScript
- repeated computation
- N+1 database access
- obviously inefficient queries
- missing pagination for potentially large collections
- unbounded operations
- unnecessary serialization
- inefficient asset delivery

Caching must not be recommended automatically.

Any caching recommendation must consider:

- cache ownership
- invalidation
- consistency requirements
- stale data tolerance
- memory/storage cost

## B8. Testing and Verification

This section also applies to you while performing this task.

Documentation must distinguish between:

- claims
- static inspection
- automated verification
- runtime verification
- benchmark results

An AI assistant must not say:

"It should work."

"It is fixed."

"Performance is improved."

"Tests pass."

unless it has evidence supporting that statement.

When execution is available, verify changes using the relevant:

- build
- compiler/type checker
- lint
- tests
- security checks
- runtime checks
- benchmarks

Report the actual result.

If verification could not be performed, explicitly say so.

Never fabricate command output, benchmark results, test results, security scan results, or build status.

## B9. Rules for AI Coding Assistants

This section also applies to you while performing this task.

When these standards are consumed by an AI coding assistant, the assistant must:

- inspect relevant existing code before modifying it
- follow repository conventions before introducing new patterns; where a repository convention conflicts with an applicable `MUST` or `MUST NOT`, follow the rule and report the conflict
- keep changes within task scope
- avoid unrelated refactors
- avoid speculative features
- apply the readability, simplicity, and comment rules in B4, including documentation comments and region markers, to all code it writes
- verify claims whenever verification is possible
- never fabricate files, APIs, commands, results, or repository state
- consider security and performance impact where relevant
- update affected documentation when behavior or contracts change

Do not require a visible implementation plan for every task.

For complex, ambiguous, high-risk, or multi-step changes, planning SHOULD be performed when it materially reduces implementation risk.

For simple localized tasks, proceed directly.

---

# Definition of Done

The work is complete only when every item below is met. Report each item as `met`, `not met`, or `not verified`, with evidence.

1. Every in-scope Markdown file was reviewed and classified (A1, A2).
2. Duplicate standards were consolidated into one canonical location, with references from other files.
3. Contradictory rules were reconciled, or the trade-off decision is documented.
4. Project-specific content was generalized or relocated to `project_rules_location`; nothing was removed without a migration map entry and a reason.
5. Stack-specific rules are separated from Core rules and declare their applicability.
6. The package entry point contains the keyword convention, the layer model, the rule provenance labels, the precedence rules, and the file index (B1).
7. Programming standards are coherent and include the readability, simplicity, and comment rules defined in B4.
8. Code review standards are actionable, and every finding level states its effect on merge.
9. Security standards cite authoritative sources with a version or retrieval date, and risk-dependent rules state their risk tier.
10. Performance standards are measurable and measurement-driven, avoid arbitrary universal numbers, and distinguish field data from lab data.
11. Verification rules prevent unsupported AI claims.
12. Links inside the package are valid, and references to renamed, moved, merged, split, or removed files were updated across the repository (A10).
13. The leak scan was performed, every remaining hit is reported, and the package can reasonably be copied into another project.
14. Terminology and normative keywords are consistent.
15. The migration map accounts for every moved, merged, split, generalized, relocated, translated, or removed section, so that no important existing rule was silently lost.

---

# Execution Rules

- You may directly edit documentation inside `standards_package_path`, except `out_of_scope_paths`.
- Outside the package path, you may write only to `project_rules_location` (A6), `migration_map_path` (A9), and references to documentation files that were renamed, moved, merged, split, or removed (A10).
- Do not make any other change to application source code. If a documentation change appears to require one, report it instead.
- In `full` mode, do not stop after giving recommendations. Perform the normalization.
- Do not introduce new technologies, frameworks, libraries, architecture patterns, or tooling unless they already exist in the documentation or are clearly presented only as optional examples.
- Do not over-engineer the documentation.
- Output language (`output_language`): with `keep-existing`, keep each file's existing language and do not translate. With a language code, write new and rewritten content in that language, preserve normative meaning, and record translated files in the migration map.
- If the repository uses Git and the environment allows it, work on a dedicated branch.
- If you create commits, commit renames and moves separately from content edits, so that rename detection keeps file history traceable.
- Do not push, force-push, or rewrite history.

---

# Final Response

After completing the work, return a concise report containing:

### Changed

Which documentation files were created, modified, merged, split, renamed, moved, or removed.

### Important Normalizations

The meaningful standards changes that were made.

### Conflicts Resolved

Contradictory or overlapping rules that were reconciled, and trade-offs that were documented.

### Project-Specific Content

What was generalized or relocated, and where it was relocated.

### Missing Areas

Areas created as minimal standards, and open decisions reported under A4.

### Migration Map

Its path, and the number of rows per action.

### Verification

Each check from A10, and any build, test, or other verification that was actually performed: the method used and the actual result.

### Definition of Done

The status of each item: `met`, `not met`, or `not verified`, with evidence.

### Remaining Uncertainty

Only issues that cannot be determined from the repository or authoritative sources, including sources that could not be accessed and configuration values that were not supplied.

Do not claim completion for checks you did not actually perform.

When the run stops after Phase 1 (`audit-then-stop` mode or a stop condition), report instead: the file classification, the proposed structure, the planned migration map, project-specific content found with proposed destinations, missing areas, and the decisions required from the project owner.
