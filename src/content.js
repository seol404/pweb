// Portfolio copy is sourced from the supplied November 2026 résumé.
// Update this file when roles, projects, or contact details change.
export const profile = {
  name: 'Christina Lee',
  fullName: 'Seohyeon (Christina) Lee',
  github: 'https://github.com/seol404',
  linkedin: 'https://www.linkedin.com/in/christinaseohyeonlee/',
  substack: 'https://substack.com/@chrixtinalee',
  location: 'Austin, TX',
  intro:
    'I study computer science at UT Austin with a concentration in security. Right now I’m a security software engineer intern at Cloudflare, working on vulnerability scanning infrastructure. Before that I did product security at Bloomberg and threat hunting at CrowdStrike.',
  university: 'The University of Texas at Austin',
  degree: 'B.S. in Computer Science · Security concentration',
};

export const experiences = [
  {
    id: 'cloudflare',
    company: 'Cloudflare',
    role: 'Security Software Engineer Intern',
    period: 'Sep. 2026 — Present',
    location: 'Austin, TX',
    current: true,
    summary: 'Vulnerability scanning infrastructure on GCP and Kubernetes',
    highlights: [
      'Built infrastructure-as-code for a distributed vulnerability-scanning platform, automating provisioning and least-privilege access across cloud scanners, Kubernetes, and segmented networks.',
      'Connected scanner provisioning, private-network routing, authenticated scanning, and asset inventory into an end-to-end vulnerability-management workflow.',
      'Developed Python-based Prowler checks for GCP security risks, with a version-controlled pipeline for testing, validating, and deploying checks and metadata.',
    ],
    technologies: ['Python', 'Terraform', 'Kubernetes', 'GCP', 'Prowler'],
  },
  {
    id: 'bloomberg',
    company: 'Bloomberg LP',
    role: 'Product Security Engineer Intern',
    period: 'Jun. 2026 — Aug. 2026',
    location: 'New York, NY',
    current: false,
    summary: 'Static analysis and web application security',
    highlights: [
      'Developed CodeQL queries for TypeScript and applied Semgrep to Python repositories to detect vulnerabilities across 10,000+ internal codebases.',
      'Identified and reported 5+ web application vulnerabilities, including critical authentication and privilege-escalation issues, and led STRIDE-based threat modeling.',
      'Built a Frida-based interception tool for traffic analysis and extended MCP tooling for cloud asset inventory and vulnerability coverage through Wiz.',
    ],
    technologies: ['CodeQL', 'Semgrep', 'Python', 'TypeScript', 'Frida', 'Wiz'],
  },
  {
    id: 'crowdstrike',
    company: 'CrowdStrike',
    role: 'Falcon Complete Analyst Intern',
    period: 'Jun. 2025 — Aug. 2025',
    location: 'San Antonio, TX',
    current: false,
    summary: 'Threat hunting and incident response for Falcon Complete',
    highlights: [
      'Automated Chromstera adware detection and remediation with Falcon Fusion SOAR and PowerShell, saving 30+ minutes of analyst triage per detection.',
      'Developed and deployed two Falcon Query Language detection rules, each achieving a 95%+ true positive rate.',
      'Performed threat hunting and incident response in a global virtual SOC, improving detection rules for on-premise and cloud environments.',
    ],
    technologies: ['PowerShell', 'Falcon Fusion', 'FQL', 'Jupyter', 'AWS'],
  },
];

export const projects = [
  {
    id: 'vulnerability-pipeline',
    name: 'Vulnerability Detection Dataset & CPG Pipeline',
    period: 'Feb. 2026',
    summary: 'A labeled memory-leak dataset for vulnerability detection models',
    highlights: [
      'Built a Joern pipeline to extract and label 250+ method-level vulnerability samples from the Juliet Test Suite for CWE-401 memory leak detection.',
      'Wrote Python tooling for parsing, label generation, and preprocessing code property graphs for downstream detection models.',
    ],
    technologies: ['Python', 'Joern', 'Juliet', 'Code property graphs'],
  },
  // Hidden for now; uncomment to show it again.
  // {
  //   id: 'interview-mock-event-journal',
  //   name: 'Interview Mock: Event Journal',
  //   period: 'Oct. 2026',
  //   url: 'https://github.com/seol404/interview-mock-event-journal',
  //   summary: 'A practice repo for AI-assisted coding interviews',
  //   highlights: [
  //     'Dependency-free, in-memory event journal with a written API contract for ordering, pagination, and deep-snapshot data ownership.',
  //     'Includes a seeded bug report to debug with an agent, plus three feature-extension rounds (time-window queries, category summaries, cursor pagination) with acceptance criteria.',
  //   ],
  //   technologies: ['JavaScript', 'Node.js', 'AI-assisted development'],
  // },
];

export const skills = [
  {
    name: 'Languages',
    items: ['Python', 'C/C++', 'Java', 'JavaScript', 'SQL', 'Bash', 'PowerShell', 'HTML/CSS'],
  },
  {
    name: 'Infrastructure & development',
    items: ['Linux', 'Git', 'Docker', 'Kubernetes', 'Terraform', 'GCP', 'AWS', 'Windows'],
  },
  {
    name: 'Application & cloud security',
    items: ['CodeQL', 'Semgrep', 'Prowler', 'Burp Suite', 'Metasploit', 'Nessus', 'Wiz'],
  },
  {
    name: 'Detection & investigation',
    items: ['CrowdStrike Falcon', 'Splunk SIEM', 'Wireshark', 'Nmap', 'Frida'],
  },
];

export const education = {
  university: 'The University of Texas at Austin',
  degree: 'Bachelor of Science in Computer Science',
  concentration: 'Security',
  location: 'Austin, TX',
  coursework: [
    'Data Structures',
    'Algorithms',
    'Networks',
    'Operating Systems',
    'Computer Architecture',
    'Object-Oriented Programming',
    'Software Engineering',
    'Symbolic Programming',
    'Machine Learning',
    'Cloud Computing',
  ],
};

export const leadership = [
  {
    id: 'wicys',
    organization: 'WiCyS Austin Chapter',
    role: 'Co-founder, President',
    period: '2024 — Present',
  },
  {
    id: 'isss',
    organization: 'Information Systems & Security Society (ISSS)',
    role: 'Logistics',
    period: '2024 — 2025',
  },
  {
    id: 'hash',
    organization: 'HASH (HASH Association of Student Hackers)',
    role: 'Linux Specialist',
    period: '2024',
  },
];

export const hobbies = [
  { name: 'Journaling, taking notes' },
  { name: 'Any cardio / endurance sports - Ice skating, running, walking, swimming' },
  { name: 'Music - discovering new music (r&b + miami bass), singing' },
  { name: 'Brain teasers enjoyer - Linkedin queens, patches, zip, minesweeper, sets, zetamac...' },
  { name: 'Art', detail: 'Main media: color pencils, watercolor, and oil pastels', gallery: true },
];

// Cropped from the owner's art portfolio PDF. Files live in public/art/<id>.webp and <id>-thumb.webp.
export const artworks = [
  { id: '01', width: 1092, height: 1376, alt: 'A dog wading in a creek' },
  { id: '02', width: 1092, height: 902, alt: 'A horse and rider with a coiled lasso, seen from above' },
  { id: '03', width: 1092, height: 858, alt: 'A longhorn standing in a green field' },
  { id: '04', width: 1092, height: 860, alt: 'Cattle resting behind a fence' },
  { id: '05', width: 1092, height: 1420, alt: 'A child in a white hat' },
  { id: '06', width: 984, height: 1452, alt: 'Two sleeping figures surrounded by flowers and fruit' },
  { id: '07', width: 957, height: 1452, alt: 'A pink magnolia blossom' },
  { id: '08', width: 1062, height: 756, alt: 'Dark wine bottles with green pears' },
  { id: '09', width: 1021, height: 1452, alt: 'Pink cyclamen flowers with green leaves' },
  { id: '10', width: 1092, height: 796, alt: 'Two pears on a table' },
];
