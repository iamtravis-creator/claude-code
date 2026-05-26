import { RenderDelta } from 'quill-delta-to-react';

// --- 1. Basic formatted text ---
const basicOps = [
  { insert: 'Hello, ' },
  { insert: 'bold', attributes: { bold: true } },
  { insert: ' and ' },
  { insert: 'italic', attributes: { italic: true } },
  { insert: ' and ' },
  { insert: 'colored', attributes: { color: '#e63946' } },
  { insert: '.\n' },
];

// --- 2. Links ---
const linkOps = [
  { insert: 'Visit ' },
  { insert: 'wirechunk', attributes: { link: 'https://github.com/wirechunk' } },
  { insert: ' on GitHub.\n' },
];

// --- 3. Headers ---
const headerOps = [
  { insert: 'Section Title' },
  { insert: '\n', attributes: { header: 2 } },
  { insert: 'Subsection' },
  { insert: '\n', attributes: { header: 3 } },
];

// --- 4. Blockquote ---
const blockquoteOps = [
  { insert: 'Design is not just what it looks like. Design is how it works.' },
  { insert: '\n', attributes: { blockquote: true } },
  { insert: '— Steve Jobs' },
  { insert: '\n', attributes: { blockquote: true } },
];

// --- 5. Code block ---
const codeOps = [
  { insert: 'npm install quill-delta-to-react' },
  { insert: '\n', attributes: { 'code-block': true } },
  { insert: 'import { RenderDelta } from \'quill-delta-to-react\';' },
  { insert: '\n', attributes: { 'code-block': true } },
];

// --- 6. Custom styles via inlineStyles ---
const styledOps = [
  { insert: 'This renders with ' },
  { insert: 'no external CSS', attributes: { bold: true, color: '#2a9d8f' } },
  { insert: ' needed — pure inline styles.\n' },
];

export default function QuillDeltaDemo() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 680, margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
        quill-delta-to-react demo
      </h1>

      <Section title="1. Basic formatting">
        <RenderDelta ops={basicOps} />
      </Section>

      <Section title="2. Links">
        <RenderDelta ops={linkOps} linkTarget="_blank" linkRel="noopener noreferrer" />
      </Section>

      <Section title="3. Headers">
        <RenderDelta ops={headerOps} />
      </Section>

      <Section title="4. Blockquote (consecutive lines merged)">
        <RenderDelta ops={blockquoteOps} multiLineBlockquote />
      </Section>

      <Section title="5. Code block (consecutive lines merged)">
        <RenderDelta ops={codeOps} multiLineCodeBlock />
      </Section>

      <Section title="6. Inline styles (no Quill CSS needed)">
        <RenderDelta ops={styledOps} inlineStyles />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '0.5rem' }}>
        {title}
      </h2>
      <div style={{ border: '1px solid #eee', borderRadius: 6, padding: '1rem' }}>
        {children}
      </div>
    </div>
  );
}
