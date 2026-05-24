export type CVType =
  | "engineer"
  | "product-designer"
  | "graphic-designer"
  | "pm"
  | "marketing"
  | "sales"
  | "student"
  | "researcher"
  | "generalist";

export type CVSection = "summary" | "experience" | "skills" | "education";

export type TipBlock = {
  dos: string[];
  donts: string[];
};

export type CVTypeContent = {
  label: string;
  blurb: string;
  sections: Record<CVSection, TipBlock>;
};

export const CV_TYPES: { id: CVType; label: string }[] = [
  { id: "engineer", label: "Engineer" },
  { id: "product-designer", label: "Product Designer" },
  { id: "graphic-designer", label: "Graphic Designer" },
  { id: "pm", label: "Product Manager" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "student", label: "Student / Early Career" },
  { id: "researcher", label: "Researcher / Academic" },
  { id: "generalist", label: "Generalist" },
];

export const TIPS: Record<CVType, CVTypeContent> = {
  engineer: {
    label: "Engineer",
    blurb: "Software, hardware, infra, ML, or platform engineering roles.",
    sections: {
      summary: {
        dos: [
          "Lead with your specialty: 'Backend engineer with 6 years building distributed systems.'",
          "Name a measurable outcome: 'Cut API latency from 800ms to 90ms.'",
          "Mention recognizable companies, languages, or scale if relevant.",
        ],
        donts: [
          "Don't list every language you've touched. Three core ones are enough.",
          "Don't say 'passionate about clean code'. Show it in experience bullets.",
          "Skip 'team player', 'detail-oriented', 'fast learner'.",
        ],
      },
      experience: {
        dos: [
          "Start each bullet with a strong verb: 'Built', 'Migrated', 'Shipped', 'Reduced'.",
          "Quantify: 'Reduced p99 latency by 60%', 'Shipped to 2M users', 'Saved $200k/year in infra costs'.",
          "Name the tech only when it's load-bearing: 'Rewrote auth service in Rust' beats 'Used Rust, Go, Python, JS'.",
          "Lead with impact, follow with method: 'Cut deploy time from 40min to 4min by parallelizing CI stages.'",
        ],
        donts: [
          "Avoid 'responsible for' and 'worked on'. They erase your contribution.",
          "Don't dump your entire stack into one bullet. Recruiters skim.",
          "Don't write tutorials. 'Implemented OAuth2 flow' is enough; nobody needs the spec.",
          "Skip vague claims like 'improved performance' with no number.",
        ],
      },
      skills: {
        dos: [
          "Group by category: Languages, Frameworks, Infrastructure, Tools.",
          "List specific things: 'PostgreSQL', 'Kubernetes', 'React'.",
          "Match keywords from the job description — ATS systems literally search for them.",
        ],
        donts: [
          "Don't list 'HTML/CSS' if you're applying to senior engineering roles. Implicit.",
          "Avoid vague clusters like 'Web Development' or 'Backend'.",
          "Don't pad with skills you used once five years ago.",
        ],
      },
      education: {
        dos: [
          "Lead with the institution, then degree.",
          "Include GPA only if 3.5+/4.0 or equivalent.",
          "Mention relevant coursework only if you're early career (under 3 years experience).",
        ],
        donts: [
          "Don't list every certification you've ever earned. Pick 2-3 that matter.",
          "Skip high school unless you're a current student.",
          "Don't expand acronyms recruiters already recognize (MIT, IIT, Stanford).",
        ],
      },
    },
  },

  "product-designer": {
    label: "Product Designer",
    blurb: "UI, UX, interaction, and product design roles in tech.",
    sections: {
      summary: {
        dos: [
          "State your focus: 'Product designer focused on B2B SaaS, 5 years of 0-to-1 work.'",
          "Name shipped products: 'Designed the checkout flow at [Company], used by 4M monthly.'",
          "Mention craft + business: 'Bridges research, UI, and engineering trade-offs.'",
        ],
        donts: [
          "Don't say 'I make beautiful experiences'. Everyone does.",
          "Avoid 'passionate about design' — empty calorie.",
          "Don't list every Figma plugin you know.",
        ],
      },
      experience: {
        dos: [
          "Open with the problem: 'Redesigned onboarding to reduce drop-off' beats 'Worked on onboarding'.",
          "Quantify with product metrics: 'Lifted activation 22%', 'Cut support tickets 40%'.",
          "Show range: research → IA → UI → handoff. Not every bullet, but spread across the role.",
          "Credit the team but own your part: 'Led the design system migration with 3 engineers and a PM.'",
        ],
        donts: [
          "Don't describe deliverables only ('made wireframes, prototypes'). Describe outcomes.",
          "Avoid 'pixel-perfect' — recruiters read it as junior.",
          "Don't claim sole credit for cross-functional work.",
          "Skip 'created beautiful UI' bullets. Show it in your portfolio link, not your CV.",
        ],
      },
      skills: {
        dos: [
          "Split: Design (Figma, FigJam), Research (UserTesting, Maze), Prototyping (Framer, ProtoPie), Adjacent (HTML/CSS, basic React).",
          "List the methods you actually use: 'Usability testing', 'Card sorting', 'Journey mapping'.",
          "Mention design systems work if you've done it.",
        ],
        donts: [
          "Don't list 'Photoshop' for product roles. It signals graphic, not product.",
          "Skip 'creativity' and 'problem solving' as skills.",
          "Don't list 20 design tools. 4-6 strong ones beat a comprehensive list.",
        ],
      },
      education: {
        dos: [
          "Design degree, HCI, or related — list normally.",
          "If self-taught, lead with your work and put education last.",
          "Bootcamps belong in education only if recent and reputable (Designlab, GA, IDF).",
        ],
        donts: [
          "Don't pad with every online course you've taken.",
          "Skip GPA unless you're a recent grad with a strong number.",
        ],
      },
    },
  },

  "graphic-designer": {
    label: "Graphic Designer",
    blurb: "Brand, identity, print, editorial, and visual design roles.",
    sections: {
      summary: {
        dos: [
          "Lead with discipline: 'Brand designer with 7 years in editorial and identity systems.'",
          "Name notable clients or publications: 'Worked with [recognizable name].'",
          "Mention your aesthetic anchor: 'Swiss typography, motion graphics, brand systems.'",
        ],
        donts: [
          "Don't say 'creative thinker' — designers all are.",
          "Avoid 'passion for design'.",
          "Skip Adobe Suite name-drops in the summary.",
        ],
      },
      experience: {
        dos: [
          "Name the deliverable + client/publication: 'Designed the rebrand for [Company], including logo, type system, and digital templates.'",
          "Quantify reach where possible: 'Identity used across 200+ touchpoints', 'Editorial spreads read by 500k/month.'",
          "Mention awards or features inline: 'Featured in Brand New / Print Magazine.'",
          "Highlight collaboration with copy, photo, motion when relevant.",
        ],
        donts: [
          "Don't write 'designed beautiful logos'. Show in portfolio.",
          "Avoid listing every tool used per project — boring and obvious.",
          "Don't claim concept ownership for collaborative work.",
        ],
      },
      skills: {
        dos: [
          "Group: Tools (Illustrator, InDesign, Figma, After Effects), Disciplines (Identity, Editorial, Motion, Packaging), Production (Print prep, web export).",
          "Include typography systems and grid work if it's a strength.",
          "Mention motion/3D only if you actually deliver it.",
        ],
        donts: [
          "Don't list every Adobe app. List the 3-4 you ship work in.",
          "Skip vague terms like 'visual storytelling'.",
        ],
      },
      education: {
        dos: [
          "Design school name carries weight — list it prominently.",
          "Mention thesis or capstone if it's portfolio-worthy.",
          "Include exchange or workshop programs if from notable schools.",
        ],
        donts: [
          "Don't list short workshops as formal education.",
          "Skip irrelevant certifications.",
        ],
      },
    },
  },

  pm: {
    label: "Product Manager",
    blurb: "Product management roles across consumer, B2B, platform, growth.",
    sections: {
      summary: {
        dos: [
          "Specify domain + stage: 'PM with 5 years in B2B SaaS, 0-to-1 and growth stages.'",
          "Show outcome ownership: 'Drove ARR from $2M to $14M in 18 months.'",
          "Mention scale or scope: '15-person cross-functional team', '$30M product line'.",
        ],
        donts: [
          "Don't say 'I love building products' — table stakes.",
          "Avoid 'customer-obsessed' unless you can prove it.",
          "Skip jargon like 'cross-functional synergy'.",
        ],
      },
      experience: {
        dos: [
          "Frame each bullet around outcome + your action: 'Grew weekly active users 40% by repositioning onboarding around a single core action.'",
          "Quantify everything you can: revenue, retention, adoption, NPS, cycle time.",
          "Show product judgment: 'Killed feature X after launch metrics showed no retention lift.'",
          "Credit the team: 'Led PM for a squad of 4 engineers, 1 designer, 1 data scientist.'",
        ],
        donts: [
          "Don't list every initiative. Pick the 3-4 that moved a number.",
          "Avoid 'managed roadmap' — describe what you decided.",
          "Skip 'wrote PRDs' — assumed.",
          "Don't claim credit for work you only attended meetings for.",
        ],
      },
      skills: {
        dos: [
          "Mix product, analytics, and adjacent technical skills: SQL, Amplitude/Mixpanel, A/B testing, Figma literacy.",
          "Mention methodologies: 'JTBD', 'OKRs', 'discovery research'.",
          "Include domain depth: 'Payments', 'Marketplaces', 'Developer tools'.",
        ],
        donts: [
          "Don't list 'leadership' or 'communication' as skills.",
          "Avoid listing every framework you've heard of.",
          "Skip generic project management tools (Jira, Notion) unless senior PM tools.",
        ],
      },
      education: {
        dos: [
          "MBA, technical degree, or design degree — list normally.",
          "Mention relevant prior roles inline if education is non-traditional.",
        ],
        donts: [
          "Don't pad with every PM certification course.",
          "Skip GPA unless 3.7+/4.0 from a known program.",
        ],
      },
    },
  },

  marketing: {
    label: "Marketing",
    blurb: "Growth, content, brand, performance, lifecycle marketing.",
    sections: {
      summary: {
        dos: [
          "Specify function: 'Growth marketer, 6 years in B2B SaaS, paid + lifecycle.'",
          "Lead with a number: 'Scaled organic from 50k to 800k monthly visits.'",
          "Name tools or channels you've mastered: 'HubSpot, Webflow, paid social, SEO.'",
        ],
        donts: [
          "Avoid 'storyteller', 'brand evangelist' — empty.",
          "Don't say 'data-driven' — everyone claims this.",
          "Skip 'passionate about marketing'.",
        ],
      },
      experience: {
        dos: [
          "Open with channel + result: 'Scaled paid LinkedIn from $5k to $50k/month at sub-$60 CAC.'",
          "Quantify: leads, MQLs, conversion rate, CAC, LTV, traffic, ARR contribution.",
          "Show campaign-level thinking: brief, hypothesis, execution, result.",
          "Mention named channels and platforms specifically — 'Google Ads', 'Meta', 'Klaviyo', 'Substack'.",
        ],
        donts: [
          "Don't say 'ran campaigns' without numbers.",
          "Avoid 'improved engagement' — meaningless without metric.",
          "Don't list everything you touched. Pick the work that moved real business numbers.",
        ],
      },
      skills: {
        dos: [
          "Group: Channels (SEO, Paid Social, Email, Content), Tools (HubSpot, Marketo, Mixpanel, Webflow), Analytics (SQL, GA4, Looker).",
          "Mention copy + creative skills if relevant.",
        ],
        donts: [
          "Don't list 'communication' or 'creativity'.",
          "Skip vague clusters like 'digital marketing'.",
        ],
      },
      education: {
        dos: [
          "Marketing, business, communication, English — list normally.",
          "Include relevant certifications: HubSpot, Google Ads, Meta Blueprint.",
        ],
        donts: [
          "Don't list every online course as a credential.",
        ],
      },
    },
  },

  sales: {
    label: "Sales",
    blurb: "AE, SDR/BDR, sales engineering, customer success, enterprise sales.",
    sections: {
      summary: {
        dos: [
          "Lead with quota and segment: 'Enterprise AE, 5 years, $1.2M ARR quota, 140% attainment last 3 years.'",
          "Name your industry vertical: 'Selling to mid-market fintech in North America.'",
          "Mention deal size and sales cycle.",
        ],
        donts: [
          "Don't say 'hungry hunter' — cliché.",
          "Avoid 'people person'.",
          "Skip 'love building relationships'.",
        ],
      },
      experience: {
        dos: [
          "Open with quota result: '$1.8M ARR closed against $1.4M quota (128%).'",
          "Show pipeline ownership: 'Built and managed $4.5M pipeline across 30 enterprise accounts.'",
          "Quantify everything: deal size, win rate, ramp time, expansion ARR.",
          "Name notable customer wins if non-confidential.",
        ],
        donts: [
          "Don't list every tool. Salesforce is assumed.",
          "Avoid 'exceeded expectations' without a number.",
          "Skip vague claims like 'built strong relationships'.",
        ],
      },
      skills: {
        dos: [
          "List sales tools: Salesforce, Outreach, Salesloft, Gong, ZoomInfo.",
          "Mention methodologies: MEDDPICC, Challenger, SPIN, Sandler.",
          "Include relevant industry knowledge.",
        ],
        donts: [
          "Don't list 'negotiation' or 'communication'.",
          "Skip CRM as a skill — assumed.",
        ],
      },
      education: {
        dos: [
          "Any degree is fine. List as standard.",
          "Mention sales certifications only if from recognized programs.",
        ],
        donts: [
          "Don't pad with motivational seminar attendance.",
        ],
      },
    },
  },

  student: {
    label: "Student / Early Career",
    blurb: "Final year students, fresh grads, internship seekers, career switchers.",
    sections: {
      summary: {
        dos: [
          "Lead with your degree and target field: 'CS senior at [school] seeking SWE roles.'",
          "Mention internships, projects, or relevant coursework.",
          "Show direction: 'Interested in distributed systems and developer tools.'",
        ],
        donts: [
          "Avoid 'recent graduate eager to learn' — implied.",
          "Don't say 'hard-working' or 'quick learner'.",
          "Skip 'looking for opportunities' — the CV makes that clear.",
        ],
      },
      experience: {
        dos: [
          "Include internships, course projects, hackathons, open-source contributions, research.",
          "Treat course projects like jobs: outcome + scope + tech.",
          "Quantify what you can: '50-user usability study', '500 GitHub stars', '3-month internship'.",
          "Show ownership: 'Solo-built X', 'Led team of 4 for capstone'.",
        ],
        donts: [
          "Don't pad with retail or unrelated jobs unless leadership/duration is notable.",
          "Avoid 'gained experience in...' — describe what you did.",
          "Don't list every course assignment.",
        ],
      },
      skills: {
        dos: [
          "List honest skill levels. Don't claim mastery of things you've used once.",
          "Group by category. Languages, Frameworks, Tools.",
          "Include the stack from your strongest project.",
        ],
        donts: [
          "Don't list 'MS Office' or 'Email'.",
          "Avoid claiming senior-level skills (system design, architecture) at entry level.",
        ],
      },
      education: {
        dos: [
          "Lead with school + degree + expected graduation.",
          "Include GPA if 3.5+/4.0.",
          "List relevant coursework, especially for technical roles.",
          "Mention scholarships, deans list, honors.",
        ],
        donts: [
          "Don't include high school unless directly relevant.",
          "Skip clubs unless leadership role or career-relevant.",
        ],
      },
    },
  },

  researcher: {
    label: "Researcher / Academic",
    blurb: "PhD, postdoc, industry research, applied research roles.",
    sections: {
      summary: {
        dos: [
          "Lead with field + affiliation: 'NLP researcher, PhD candidate at [school], focus on retrieval-augmented generation.'",
          "Mention publication venues if notable: 'Published at NeurIPS, ACL.'",
          "State research interests cleanly.",
        ],
        donts: [
          "Don't write a dissertation abstract. Two sentences.",
          "Avoid 'passionate researcher'.",
        ],
      },
      experience: {
        dos: [
          "Frame around contributions: 'First-author paper introducing X, accepted to [venue].'",
          "Quantify citations, dataset sizes, model performance.",
          "Show industry/teaching/mentorship breadth where relevant.",
          "Separate sections for Publications, Research Experience, and Teaching if substantial.",
        ],
        donts: [
          "Don't list every paper without filtering for relevance.",
          "Avoid jargon dense beyond your field.",
          "Skip 'collaborated with' for solo work.",
        ],
      },
      skills: {
        dos: [
          "Technical: 'Python', 'PyTorch', 'JAX', 'CUDA' (if relevant).",
          "Research: 'Experimental design', 'Causal inference', 'Statistical modeling'.",
          "Mention specific methods (e.g., 'Reinforcement learning', 'Bayesian inference').",
        ],
        donts: [
          "Don't list 'research' as a skill.",
          "Skip soft skills.",
        ],
      },
      education: {
        dos: [
          "PhD/postdoc affiliations are your headline. Lead with them.",
          "Include thesis title.",
          "Mention advisors only if widely recognized in the field.",
        ],
        donts: [
          "Don't expand obvious abbreviations.",
        ],
      },
    },
  },

  generalist: {
    label: "Generalist",
    blurb: "Operations, BD, ops, founder-level, multi-disciplinary roles.",
    sections: {
      summary: {
        dos: [
          "Lead with span: 'Operator with 8 years across product, growth, and ops at early-stage startups.'",
          "Name stages: 'Pre-seed to Series B.'",
          "Show specific wins: 'Took company from 5 to 40 people as second hire.'",
        ],
        donts: [
          "Avoid 'wears many hats' — generic.",
          "Don't say 'jack of all trades'.",
          "Skip 'adaptable' or 'versatile'.",
        ],
      },
      experience: {
        dos: [
          "Group bullets by domain when role was broad: ops, hiring, product, fundraising.",
          "Quantify across functions: revenue, headcount, runway extension, cycle time reduction.",
          "Show decision ownership at company-level.",
        ],
        donts: [
          "Don't dilute with every minor task.",
          "Avoid framing yourself as supporting cast.",
        ],
      },
      skills: {
        dos: [
          "Mix domains: 'Financial modeling, hiring, product strategy, basic SQL'.",
          "Mention tools: 'Notion, Linear, Stripe, Figma, basic React'.",
        ],
        donts: [
          "Don't claim expertise across 10 domains.",
          "Skip vague labels like 'strategic thinking'.",
        ],
      },
      education: {
        dos: [
          "Any degree is fine. Lead with the recognizable name.",
        ],
        donts: [
          "Don't pad with online courses.",
        ],
      },
    },
  },
};

export type FAQ = {
  question: string;
  answer: string;
};

export const FAQS: FAQ[] = [
  {
    question: "How long should my CV be?",
    answer:
      "One page if you have under 8 years of experience. Two pages for senior or specialized roles. Three+ pages only for academic CVs with publication lists. Recruiters spend 6-8 seconds on the first scan — density matters more than coverage.",
  },
  {
    question: "Should I use 'I' or write in third person?",
    answer:
      "Neither. CV bullets are written in implied first person, past tense. 'Built X' not 'I built X' and not 'Built X for the team'. Skip pronouns entirely.",
  },
  {
    question: "What's the deal with ATS systems?",
    answer:
      "Applicant Tracking Systems parse your CV before a human sees it. To pass: use standard section headings (Experience, Education, Skills), avoid columns/tables/images, match keywords from the job description, and submit as PDF. This builder produces ATS-safe PDFs by default.",
  },
  {
    question: "Should I include a photo?",
    answer:
      "Depends on region. India, Germany, France, Japan: often expected. US, UK, Canada, Australia: avoid — anti-discrimination practice favors text-only. When in doubt, leave it off.",
  },
  {
    question: "How do I handle employment gaps?",
    answer:
      "Don't hide them. Briefly note what you did: 'Career break for caregiving', 'Sabbatical — international travel', 'Independent study and personal projects'. Honesty beats unexplained gaps that look like you're hiding firings.",
  },
  {
    question: "What about hobbies and interests?",
    answer:
      "Skip them unless they're directly relevant or genuinely distinctive (open-source maintainer, published author, competitive athlete). 'Reading and hiking' is filler.",
  },
  {
    question: "Should I tailor the CV per application?",
    answer:
      "Yes. Match keywords to the job description, reorder bullets to surface the most relevant work, swap out projects if you have a portfolio. A 10-minute tailor beats a generic CV.",
  },
  {
    question: "What tense should I use?",
    answer:
      "Past tense for all previous roles. Present tense only for your current role's ongoing responsibilities. Mixing past and present in the same role reads sloppy.",
  },
  {
    question: "Should I include references?",
    answer:
      "No. Don't write 'References available upon request' either — it's assumed. Save the space.",
  },
];