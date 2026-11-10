// Portfolio copy is sourced from the supplied November 2026 résumé.
// Update this file when roles, projects, or contact details change.
export const profile = {
  name: 'Christina Lee',
  fullName: 'Seohyeon (Christina) Lee',
  email: 'seohyeon7426@gmail.com',
  github: 'https://github.com/seol404',
  linkedin: 'https://www.linkedin.com/in/christinaseohyeonlee/',
  location: 'Austin, TX',
  intro:
    'I’m Christina, a computer science student at UT Austin focused on security. I build tools that find vulnerabilities, automate detection, and make systems safer—from cloud infrastructure and application security to the operating system underneath it all.',
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
    summary: 'Cloud security, vulnerability management, and infrastructure automation.',
    highlights: [
      'Built infrastructure-as-code for a distributed vulnerability-scanning platform, automating provisioning and least-privilege access across cloud scanners, Kubernetes, and segmented networks.',
      'Connected scanner provisioning, private-network routing, authenticated scanning, and asset inventory into an end-to-end vulnerability-management workflow.',
      'Developed Python-based Prowler checks for GCP security risks, with a version-controlled pipeline for testing, validating, and deploying checks and metadata.',
    ],
    technologies: ['Python', 'Terraform', 'Ansible', 'Kubernetes', 'GCP', 'Prowler'],
  },
  {
    id: 'bloomberg',
    company: 'Bloomberg LP',
    role: 'Product Security Engineer Intern',
    period: 'Jun. 2026 — Aug. 2026',
    location: 'New York, NY',
    current: false,
    summary: 'Application security, threat modeling, and detection at scale.',
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
    summary: 'Threat hunting, incident response, and automated remediation.',
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
    summary: 'Turning vulnerable source code into structured data for detection models.',
    highlights: [
      'Built a Joern pipeline to extract and label 250+ method-level vulnerability samples from the Juliet Test Suite for CWE-401 memory leak detection.',
      'Wrote Python tooling for parsing, label generation, and preprocessing code property graphs for downstream detection models.',
    ],
    technologies: ['Python', 'Joern', 'Juliet', 'Code property graphs'],
  },
  {
    id: 'pintos',
    name: 'PintOS',
    period: 'Apr. 2025',
    summary: 'Building the internals of an operating system in C on x86.',
    highlights: [
      'Implemented kernel components spanning scheduling, system calls, virtual memory, and the file system.',
      'Built synchronization primitives, demand paging, and a buffer cache with inode management; validated multithreaded workloads with QEMU and GDB.',
    ],
    technologies: ['C', 'x86', 'GDB', 'QEMU'],
  },
];

export const skills = [
  {
    name: 'Languages',
    items: ['Python', 'C/C++', 'Java', 'JavaScript', 'SQL', 'Bash', 'PowerShell', 'HTML/CSS'],
  },
  {
    name: 'Infrastructure & development',
    items: ['Linux', 'Git', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'GCP', 'AWS', 'Windows'],
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
