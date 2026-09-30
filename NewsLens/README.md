# NewsLens

NewsLens is a browser-based article analysis tool. It lets you paste an
article and breaks the text down into **claims, evidence, doubt, and
missing context**.

The project is built with plain HTML, CSS, and JavaScript, so it can run
directly in a browser without a framework or build system.

## Project Structure

``` text
newslens/
├── index.html
├── styles.css
├── script.js
└── README.md
```

### `index.html`

Contains the structure of the NewsLens interface.

It includes:

-   The NewsLens header
-   Article input area
-   Analyze button
-   Sample article button
-   Clear button
-   Word counter
-   Analysis dashboard
-   Article panel
-   Claims panel
-   Evidence panel
-   Doubt panel
-   Missing context panel

The HTML loads the external CSS and JavaScript files.

### `styles.css`

Contains the visual design of the application.

It controls:

-   Colors and theme variables
-   Layout and responsive design
-   Buttons and panels
-   Article highlighting
-   Dashboard styling
-   Animations
-   Light and dark mode behavior
-   Mobile layouts
-   Reduced-motion accessibility behavior

### `script.js`

Contains the application's analysis and interaction logic.

It handles:

-   Article input
-   Word counting
-   Sample article loading
-   Clearing the editor
-   Sentence detection
-   Claim detection
-   Evidence detection
-   Hedge detection
-   Anonymous or vague source detection
-   Named-source detection
-   Missing-context detection
-   Rendering the analysis dashboard
-   Highlighting analyzed sentences
-   Interactive navigation between findings and the article
-   The sourcing verdict

## How It Works

1.  Paste an article into the text area.
2.  Click **Analyze**.
3.  NewsLens separates the article into sentences.
4.  It looks for linguistic patterns such as:
    -   Numbers
    -   Causal language
    -   Predictions
    -   Absolute statements
    -   Superlatives
    -   Attributions
    -   Evidence-related terms
    -   Hedging
    -   Vague or anonymous sources
    -   Opposing views
5.  The results are displayed in the dashboard.
6.  Clicking a finding takes you to the relevant sentence in the
    article.

## Analysis Categories

### Claims

NewsLens identifies sentences that appear to make substantial claims. It
also checks whether evidence appears nearby.

### Evidence

The tool looks for references to things such as:

-   Studies
-   Surveys
-   Reports
-   Data
-   Research
-   Court filings
-   Documents
-   Records
-   Statistics
-   Audits
-   Investigations
-   Footage
-   Transcripts
-   Testimony

It also detects some quoted material and named sources.

### Doubt

The tool identifies language that makes a statement less certain, such
as:

-   may
-   might
-   could
-   possibly
-   reportedly
-   allegedly
-   likely
-   approximately
-   expected
-   uncertain

It also identifies absolute language such as:

-   always
-   never
-   proves
-   definitely
-   everyone
-   nobody
-   guarantee

### Missing Context

NewsLens looks for potential gaps such as:

-   No named sources
-   Too much reliance on vague sources
-   No opposing view
-   No dates or timeframes
-   Figures without a baseline
-   Unsupported cause-and-effect language
-   Loaded wording
-   Absolute language
-   Opinion-like language
-   No primary source
-   Very short articles

The tool also generates questions a reader can ask when evaluating the
article.

## Important Limitation

NewsLens analyzes **language patterns**. It does not fact-check the
article or independently verify whether its claims are true.

A high or low sourcing result should therefore not be interpreted as
proof that an article is true or false.

The dashboard itself states:

> Reads wording patterns. It cannot check whether claims are true.

## Running the Project

No installation is required.

Keep these three files in the same folder:

``` text
index.html
styles.css
script.js
```

Then open `index.html` in a modern web browser.

For example:

``` text
Double-click index.html
```

The browser will load the CSS and JavaScript files automatically.

## Browser Compatibility

The project uses modern browser APIs and JavaScript features. A current
version of Chrome, Edge, Firefox, or Safari is recommended.

## Design

NewsLens uses a distinctive visual system based around:

-   Mint
-   Magenta
-   Green
-   Dark olive
-   Pale cyan

The interface is designed around the idea of visually exposing how an
article is constructed rather than simply giving it a single credibility
score.

## Sample Article

The application includes a built-in sample article about a fictional
city council decision. The **Use sample** button loads it and
immediately runs the analysis.

## Accessibility and Responsiveness

The interface includes:

-   Responsive layouts for smaller screens
-   Keyboard-friendly buttons
-   Semantic HTML elements
-   Reduced-motion support through `prefers-reduced-motion`
-   High-contrast highlighting for different analysis categories

## License

No license is specified for this project. If the project will be
published publicly, add an appropriate license before distributing it.
