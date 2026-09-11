export const COMPANIES = [
  { id: "swiggy", name: "Swiggy", slug: "swiggy", industry: "Consumer / Delivery", size_band: "5,001–10,000", hq: "Bengaluru", about: "India's food and quick-commerce operating system.", rating: 4.2, founded: 2014, logo_letter: "S" },
  { id: "meesho", name: "Meesho", slug: "meesho", industry: "E-commerce", size_band: "1,001–5,000", hq: "Bengaluru", about: "Social commerce platform enabling MSME sellers.", rating: 4.0, founded: 2015, logo_letter: "M" },
  { id: "flipkart", name: "Flipkart", slug: "flipkart", industry: "E-commerce", size_band: "10,000+", hq: "Bengaluru", about: "India's homegrown commerce giant.", rating: 4.1, founded: 2007, logo_letter: "F" },
  { id: "razorpay", name: "Razorpay", slug: "razorpay", industry: "Fintech", size_band: "1,001–5,000", hq: "Bengaluru", about: "Payments and banking stack for Indian businesses.", rating: 4.3, founded: 2014, logo_letter: "R" },
  { id: "freshworks", name: "Freshworks", slug: "freshworks", industry: "SaaS", size_band: "5,001–10,000", hq: "Chennai", about: "Customer experience software for the global mid-market.", rating: 4.2, founded: 2010, logo_letter: "F" },
  { id: "cred", name: "CRED", slug: "cred", industry: "Fintech", size_band: "501–1,000", hq: "Bengaluru", about: "Credit and lifestyle membership for India's professionals.", rating: 4.1, founded: 2018, logo_letter: "C" },
  { id: "phonepe", name: "PhonePe", slug: "phonepe", industry: "Fintech", size_band: "5,001–10,000", hq: "Bengaluru", about: "UPI-first financial super-app.", rating: 4.0, founded: 2015, logo_letter: "P" },
  { id: "zoho", name: "Zoho", slug: "zoho", industry: "SaaS", size_band: "10,000+", hq: "Chennai", about: "Privacy-first business software, built in India.", rating: 4.4, founded: 1996, logo_letter: "Z" },
  { id: "atlassian", name: "Atlassian", slug: "atlassian", industry: "SaaS", size_band: "10,000+", hq: "Bengaluru", about: "Team collaboration software used by millions.", rating: 4.3, founded: 2002, logo_letter: "A" },
  { id: "google", name: "Google", slug: "google", industry: "Internet", size_band: "10,000+", hq: "Hyderabad", about: "Search, ads, cloud, and AI.", rating: 4.4, founded: 1998, logo_letter: "G" },
  { id: "amazon", name: "Amazon", slug: "amazon", industry: "Internet / Retail", size_band: "10,000+", hq: "Hyderabad", about: "Commerce, AWS, devices, and operations.", rating: 4.0, founded: 1994, logo_letter: "A" },
  { id: "postman", name: "Postman", slug: "postman", industry: "Developer tools", size_band: "501–1,000", hq: "Bengaluru", about: "API platform for building in public.", rating: 4.3, founded: 2014, logo_letter: "P" },
] as const;

export const JOBS = [
  { id: "j-swiggy-pm", company_id: "swiggy", title: "Senior Product Manager", location: "Bengaluru", remote_type: "hybrid", employment_type: "full-time", seniority: "Senior", salary_min: 28, salary_max: 40, skills: ["Product Roadmap", "SQL", "Experimentation", "Stakeholder Mgmt", "Marketplace"], description: "Own the Instamart discovery surface. Ship weekly experiments that move conversion and retention.", requirements: "5+ years PM. Marketplace or consumer experience. Comfort with SQL.", intern: false },
  { id: "j-meesho-pmg", company_id: "meesho", title: "Product Manager — Growth", location: "Bengaluru", remote_type: "hybrid", employment_type: "full-time", seniority: "Mid", salary_min: 22, salary_max: 35, skills: ["Growth", "A/B Testing", "Funnel", "SQL", "Activation"], description: "Drive new-seller activation. Own the first-30-days funnel end to end.", requirements: "3+ years in growth or consumer PM.", intern: false },
  { id: "j-flipkart-pm", company_id: "flipkart", title: "PM — Consumer Experience", location: "Bengaluru", remote_type: "onsite", employment_type: "full-time", seniority: "Senior", salary_min: 25, salary_max: 38, skills: ["UX", "Consumer", "Roadmap", "Analytics", "Cross-functional"], description: "Reimagine post-order experience across app and logistics partners.", requirements: "4+ years PM. Strong design partnership.", intern: false },
  { id: "j-razorpay-apm", company_id: "razorpay", title: "Associate Product Manager", location: "Bengaluru", remote_type: "hybrid", employment_type: "full-time", seniority: "Junior", salary_min: 18, salary_max: 26, skills: ["Payments", "APIs", "SQL", "PRDs", "B2B"], description: "APM on the Payment Links squad. Ship merchant-facing improvements.", requirements: "1–3 years. Internship at a fintech a plus.", intern: false },
  { id: "j-fresh-pl", company_id: "freshworks", title: "Product Lead — B2B", location: "Chennai", remote_type: "hybrid", employment_type: "full-time", seniority: "Lead", salary_min: 30, salary_max: 45, skills: ["B2B SaaS", "Roadmap", "Enterprise", "Pricing", "Leadership"], description: "Lead a pod of 3 PMs on CRM workflows. Own the annual product bet.", requirements: "8+ years. People leadership required.", intern: false },
  { id: "j-cred-ios", company_id: "cred", title: "Senior iOS Engineer", location: "Bengaluru", remote_type: "hybrid", employment_type: "full-time", seniority: "Senior", salary_min: 35, salary_max: 52, skills: ["Swift", "iOS", "Architecture", "Performance", "UIKit"], description: "Craft the membership surfaces. Obsess over 120fps interactions.", requirements: "5+ years iOS. Published apps.", intern: false },
  { id: "j-phonepe-ds", company_id: "phonepe", title: "Data Scientist — Risk", location: "Bengaluru", remote_type: "hybrid", employment_type: "full-time", seniority: "Mid", salary_min: 24, salary_max: 38, skills: ["Python", "SQL", "ML", "Risk", "Feature Stores"], description: "Build fraud models for UPI and credit. Ship weekly model drops.", requirements: "3+ years applied ML.", intern: false },
  { id: "j-zoho-fe", company_id: "zoho", title: "Frontend Engineer", location: "Chennai", remote_type: "onsite", employment_type: "full-time", seniority: "Mid", salary_min: 16, salary_max: 28, skills: ["React", "TypeScript", "CSS", "Accessibility", "Design Systems"], description: "Build the next generation of Zoho CRM views. Performance first.", requirements: "2+ years React.", intern: false },
  { id: "j-atlas-em", company_id: "atlassian", title: "Engineering Manager", location: "Bengaluru", remote_type: "hybrid", employment_type: "full-time", seniority: "Lead", salary_min: 45, salary_max: 65, skills: ["Leadership", "Jira", "People", "Delivery", "Systems"], description: "Lead a team of 8 on Jira Cloud. Hire, coach, ship.", requirements: "8+ years, 2+ managing.", intern: false },
  { id: "j-google-swe", company_id: "google", title: "Software Engineer III", location: "Hyderabad", remote_type: "hybrid", employment_type: "full-time", seniority: "Senior", salary_min: 42, salary_max: 70, skills: ["Java", "Distributed Systems", "Algorithms", "GCP", "Leadership"], description: "YouTube infra. Scale storage and serving for India traffic.", requirements: "4+ years. Strong CS fundamentals.", intern: false },
  { id: "j-amazon-sde", company_id: "amazon", title: "SDE II — Last Mile", location: "Hyderabad", remote_type: "onsite", employment_type: "full-time", seniority: "Mid", salary_min: 28, salary_max: 44, skills: ["Java", "AWS", "Optimization", "Systems", "SQL"], description: "Routing and capacity for last-mile. Reduce SLA breaches.", requirements: "3+ years backend.", intern: false },
  { id: "j-postman-dx", company_id: "postman", title: "Developer Experience PM", location: "Remote", remote_type: "remote", employment_type: "full-time", seniority: "Mid", salary_min: 24, salary_max: 36, skills: ["APIs", "DX", "Product", "Community", "Technical Writing"], description: "Own the public API network experience for 30M developers.", requirements: "3+ years PM or DX.", intern: false },
  { id: "j-swiggy-intern", company_id: "swiggy", title: "Product Intern — Instamart", location: "Bengaluru", remote_type: "onsite", employment_type: "intern", seniority: "Intern", salary_min: 0, salary_max: 0, skills: ["Product", "Analytics", "SQL", "Research"], description: "6-month product internship. Shadow a senior PM, own one experiment.", requirements: "Penultimate year. Case interviews.", intern: true, stipend: 80000, duration_months: 6 },
  { id: "j-razorpay-intern", company_id: "razorpay", title: "Software Intern", location: "Bengaluru", remote_type: "hybrid", employment_type: "intern", seniority: "Intern", salary_min: 0, salary_max: 0, skills: ["JavaScript", "Node", "SQL", "APIs"], description: "Ship production services with a mentor. PPO track.", requirements: "CS undergrad. DSA + projects.", intern: true, stipend: 70000, duration_months: 6 },
  { id: "j-zoho-intern", company_id: "zoho", title: "Campus Software Intern", location: "Chennai", remote_type: "onsite", employment_type: "intern", seniority: "Intern", salary_min: 0, salary_max: 0, skills: ["Java", "SQL", "Web", "Problem Solving"], description: "Zoho Schools + product teams. Full-stack exposure.", requirements: "Any degree. Strong logic.", intern: true, stipend: 25000, duration_months: 12 },
  { id: "j-google-intern", company_id: "google", title: "STEP Intern", location: "Hyderabad", remote_type: "onsite", employment_type: "intern", seniority: "Intern", salary_min: 0, salary_max: 0, skills: ["Python", "Algorithms", "Systems"], description: "12-week SWE internship. Production code, real mentors.", requirements: "2nd/3rd year CS.", intern: true, stipend: 120000, duration_months: 3 },
  { id: "j-meesho-intern", company_id: "meesho", title: "Growth Intern", location: "Bengaluru", remote_type: "hybrid", employment_type: "intern", seniority: "Intern", salary_min: 0, salary_max: 0, skills: ["Growth", "Excel", "SQL", "Copy"], description: "Run weekly experiments on seller activation.", requirements: "MBA / undergrad. Curiosity.", intern: true, stipend: 40000, duration_months: 3 },
  { id: "j-fresh-intern", company_id: "freshworks", title: "UX Intern", location: "Chennai", remote_type: "hybrid", employment_type: "intern", seniority: "Intern", salary_min: 0, salary_max: 0, skills: ["Figma", "Research", "UI", "Prototyping"], description: "Pair with a senior designer on CRM density problems.", requirements: "Design portfolio.", intern: true, stipend: 35000, duration_months: 4 },
] as const;

export const COURSES = [
  { id: "c-pm-os", title: "Product Management Operating System", provider: "Nexora Learn", category: "Product", level: "Intermediate", hours: 18, rating: 4.8, learners: 21400, description: "Roadmaps, PRDs, discovery, and stakeholder theater — the working PM stack.", modules: ["Discovery interviews", "Opportunity scoring", "PRD craft", "Experiment design", "Exec narrative"] },
  { id: "c-dsa", title: "DSA for Product Companies", provider: "Nexora Learn", category: "Engineering", level: "Beginner", hours: 40, rating: 4.7, learners: 58200, description: "Patterns that actually show up in Swiggy / CRED / Atlassian screens.", modules: ["Arrays & hashing", "Trees", "Graphs", "DP", "System design lite"] },
  { id: "c-sql", title: "SQL for PMs and Analysts", provider: "Nexora Learn", category: "Analytics", level: "Beginner", hours: 12, rating: 4.9, learners: 33100, description: "Window functions, funnels, and the queries hiring managers ask live.", modules: ["Select mastery", "Joins", "Windows", "Funnels", "Case interview SQL"] },
  { id: "c-system", title: "System Design — India Scale", provider: "Nexora Learn", category: "Engineering", level: "Advanced", hours: 22, rating: 4.6, learners: 19800, description: "UPI, live order tracking, and flash-sale architectures.", modules: ["Load & latency", "Data stores", "UPI case", "Tracking case", "Trade-off drills"] },
  { id: "c-behave", title: "Behavioral Interviews that Land Offers", provider: "Nexora Learn", category: "Career", level: "All", hours: 8, rating: 4.8, learners: 27600, description: "STAR stories mapped to Amazon LPs and Indian startup values.", modules: ["Story bank", "Conflict", "Failure", "Leadership", "Salary talk"] },
  { id: "c-ml", title: "Applied ML for Risk & Growth", provider: "Nexora Learn", category: "Data", level: "Intermediate", hours: 28, rating: 4.5, learners: 9200, description: "Feature stores, leakage, and shipping weekly model drops.", modules: ["Labels", "Features", "Eval", "Serving", "Monitoring"] },
  { id: "c-ux", title: "UX for Dense B2B", provider: "Nexora Learn", category: "Design", level: "Intermediate", hours: 14, rating: 4.7, learners: 6400, description: "Tables, filters, and empty states that don't insult operators.", modules: ["Information density", "IA", "States", "Handoff", "Critique"] },
  { id: "c-neg", title: "Offer Negotiation for India Tech", provider: "Nexora Learn", category: "Career", level: "All", hours: 5, rating: 4.9, learners: 41100, description: "CTC vs in-hand, ESOPs, joining bonus, and competing offers.", modules: ["Decode CTC", "ESOP", "Competing offers", "Scripts", "Walk-away"] },
] as const;

export const TALENT = [
  { id: "t1", name: "Aarav Mehta", role: "Senior Product Manager", location: "Bengaluru", experience_years: 7, skills: ["Roadmap", "SQL", "Marketplace", "Growth"], education: "IIT Bombay, B.Tech", current_company: "PhonePe", expected_ctc: 42, notice_days: 30, score: 92, source: "inbound", institution: "" },
  { id: "t2", name: "Diya Kapoor", role: "Product Manager", location: "Mumbai", experience_years: 4, skills: ["Growth", "A/B", "SQL", "Activation"], education: "SRCC, B.Com + ISB", current_company: "Meesho", expected_ctc: 32, notice_days: 60, score: 88, source: "sourced", institution: "" },
  { id: "t3", name: "Kabir Rao", role: "SDE II", location: "Hyderabad", experience_years: 4, skills: ["Java", "AWS", "Systems", "SQL"], education: "BITS Pilani", current_company: "Amazon", expected_ctc: 38, notice_days: 90, score: 85, source: "inbound", institution: "" },
  { id: "t4", name: "Ishita Nair", role: "Data Scientist", location: "Bengaluru", experience_years: 5, skills: ["Python", "ML", "Risk", "SQL"], education: "IISc", current_company: "Razorpay", expected_ctc: 36, notice_days: 30, score: 90, source: "referral", institution: "" },
  { id: "t5", name: "Rohan Shah", role: "Frontend Engineer", location: "Pune", experience_years: 3, skills: ["React", "TypeScript", "CSS", "A11y"], education: "COEP", current_company: "Postman", expected_ctc: 24, notice_days: 15, score: 81, source: "inbound", institution: "" },
  { id: "t6", name: "Meera Iyer", role: "UX Designer", location: "Chennai", experience_years: 6, skills: ["Figma", "Research", "B2B", "Design Systems"], education: "NID", current_company: "Freshworks", expected_ctc: 28, notice_days: 45, score: 87, source: "sourced", institution: "" },
  { id: "t7", name: "Yash Verma", role: "APM", location: "Gurugram", experience_years: 2, skills: ["PRDs", "SQL", "Payments", "B2B"], education: "IIT Delhi", current_company: "CRED", expected_ctc: 22, notice_days: 30, score: 79, source: "campus", institution: "IIT Delhi" },
  { id: "t8", name: "Ananya Bose", role: "Engineering Manager", location: "Bengaluru", experience_years: 11, skills: ["Leadership", "Delivery", "Java", "People"], education: "Jadavpur University", current_company: "Atlassian", expected_ctc: 62, notice_days: 60, score: 93, source: "sourced", institution: "" },
  { id: "t9", name: "Vikram Singh", role: "iOS Engineer", location: "Bengaluru", experience_years: 6, skills: ["Swift", "iOS", "Performance", "UIKit"], education: "NIT Trichy", current_company: "Swiggy", expected_ctc: 40, notice_days: 30, score: 86, source: "inbound", institution: "" },
  { id: "t10", name: "Sara Qureshi", role: "Growth PM", location: "Remote", experience_years: 5, skills: ["Growth", "Funnel", "Copy", "SQL"], education: "Ashoka", current_company: "Independent", expected_ctc: 30, notice_days: 0, score: 84, source: "inbound", institution: "" },
] as const;

export const STUDENTS = [
  { id: "s1", name: "Neel Sharma", program: "B.Tech CSE", year: 4, cgpa: 8.7, skills: ["Python", "React", "DSA"], location: "Kanpur", institution: "IIT Kanpur", seeking: "SDE intern", resume_score: 82 },
  { id: "s2", name: "Priya Menon", program: "MBA", year: 2, cgpa: 3.6, skills: ["Product", "SQL", "Case"], location: "Hyderabad", institution: "ISB", seeking: "PM intern", resume_score: 88 },
  { id: "s3", name: "Aditya Kulkarni", program: "B.Tech ECE", year: 3, cgpa: 8.1, skills: ["C++", "Verilog", "Python"], location: "Pune", institution: "COEP", seeking: "Hardware intern", resume_score: 74 },
  { id: "s4", name: "Zara Khan", program: "B.Des", year: 4, cgpa: 8.9, skills: ["Figma", "Research", "Motion"], location: "Ahmedabad", institution: "NID", seeking: "UX intern", resume_score: 91 },
  { id: "s5", name: "Harsh Patel", program: "B.Tech CSE", year: 4, cgpa: 9.1, skills: ["Java", "Systems", "SQL"], location: "Surat", institution: "NIT Surat", seeking: "SDE", resume_score: 86 },
  { id: "s6", name: "Lavanya Reddy", program: "M.Tech AI", year: 2, cgpa: 9.0, skills: ["ML", "Python", "NLP"], location: "Bengaluru", institution: "IISc", seeking: "ML intern", resume_score: 90 },
  { id: "s7", name: "Arjun Nanda", program: "BBA", year: 3, cgpa: 8.0, skills: ["Excel", "Growth", "Copy"], location: "Delhi", institution: "SSCBS", seeking: "Growth intern", resume_score: 71 },
  { id: "s8", name: "Tanvi Joshi", program: "B.Tech CSE", year: 4, cgpa: 8.4, skills: ["TypeScript", "React", "Node"], location: "Mumbai", institution: "VJTI", seeking: "Frontend intern", resume_score: 80 },
] as const;

export const EMPLOYEES = [
  { id: "e-ceo", name: "Anika Sharma", title: "Chief Executive Officer", department: "Office of the CEO", manager_id: null, location: "Bengaluru", email: "anika@nexora.dev", start_date: "2019-04-01", status: "active", band: "E6" },
  { id: "e-cto", name: "Rahul Desai", title: "Chief Technology Officer", department: "Engineering", manager_id: "e-ceo", location: "Bengaluru", email: "rahul@nexora.dev", start_date: "2019-06-01", status: "active", band: "E5" },
  { id: "e-cpo", name: "Leela Banerjee", title: "Chief Product Officer", department: "Product", manager_id: "e-ceo", location: "Bengaluru", email: "leela@nexora.dev", start_date: "2020-01-15", status: "active", band: "E5" },
  { id: "e-chro", name: "Farhan Ali", title: "Chief People Officer", department: "People", manager_id: "e-ceo", location: "Mumbai", email: "farhan@nexora.dev", start_date: "2021-03-01", status: "active", band: "E5" },
  { id: "e-em1", name: "Sneha Kulkarni", title: "Engineering Manager", department: "Engineering", manager_id: "e-cto", location: "Bengaluru", email: "sneha@nexora.dev", start_date: "2021-08-01", status: "active", band: "E4" },
  { id: "e-em2", name: "Dev Patel", title: "Engineering Manager", department: "Engineering", manager_id: "e-cto", location: "Hyderabad", email: "dev@nexora.dev", start_date: "2022-02-01", status: "active", band: "E4" },
  { id: "e-pm1", name: "Nisha Rao", title: "Staff Product Manager", department: "Product", manager_id: "e-cpo", location: "Bengaluru", email: "nisha@nexora.dev", start_date: "2020-09-01", status: "active", band: "E4" },
  { id: "e-ic1", name: "Kunal Jain", title: "Senior Software Engineer", department: "Engineering", manager_id: "e-em1", location: "Bengaluru", email: "kunal@nexora.dev", start_date: "2022-07-11", status: "active", band: "E3" },
  { id: "e-ic2", name: "Pooja Iyer", title: "Software Engineer", department: "Engineering", manager_id: "e-em1", location: "Bengaluru", email: "pooja@nexora.dev", start_date: "2023-05-02", status: "active", band: "E2" },
  { id: "e-ic3", name: "Amit Ghosh", title: "Software Engineer", department: "Engineering", manager_id: "e-em2", location: "Hyderabad", email: "amit@nexora.dev", start_date: "2024-01-08", status: "active", band: "E2" },
  { id: "e-des", name: "Ria Sen", title: "Product Designer", department: "Product", manager_id: "e-cpo", location: "Remote", email: "ria@nexora.dev", start_date: "2023-11-01", status: "active", band: "E3" },
  { id: "e-hrbp", name: "Mohit Bansal", title: "HR Business Partner", department: "People", manager_id: "e-chro", location: "Mumbai", email: "mohit@nexora.dev", start_date: "2022-10-01", status: "active", band: "E3" },
] as const;

export const NETWORK = [
  { person_id: "n1", person_name: "Kavya Pillai", person_role: "Recruiter", person_company: "Swiggy" },
  { person_id: "n2", person_name: "Arun Prakash", person_role: "Staff Engineer", person_company: "Atlassian" },
  { person_id: "n3", person_name: "Sana Sheikh", person_role: "PM Lead", person_company: "Flipkart" },
  { person_id: "n4", person_name: "Ben Thomas", person_role: "Hiring Manager", person_company: "Razorpay" },
  { person_id: "n5", person_name: "Ira Malhotra", person_role: "Talent Partner", person_company: "Google" },
] as const;

export const POSTS = [
  { author_name: "Sana Sheikh", author_role: "PM Lead · Flipkart", author_letter: "S", body: "We closed a 9-week discovery on post-order anxiety. The winning intervention wasn't a new screen — it was a 14-word SMS. Shipping small is still a strategy." },
  { author_name: "Arun Prakash", author_role: "Staff Engineer · Atlassian", author_letter: "A", body: "If your system design answer never mentions failure modes, you didn't design a system. You designed a happy path. Interviewers in Bengaluru can tell in 4 minutes." },
  { author_name: "Kavya Pillai", author_role: "Recruiter · Swiggy", author_letter: "K", body: "Please stop putting 'open to work' as the first line of your headline. Lead with the problem you solve. Recruiters search for problems, not availability." },
  { author_name: "Leela Banerjee", author_role: "CPO · Nexora", author_letter: "L", body: "A career OS should make the next action obvious. If you stare at a dashboard wondering what to do, the product failed — not you." },
  { author_name: "Ishita Nair", author_role: "Data Scientist · Razorpay", author_letter: "I", body: "Risk models that look great in a notebook and die in production usually share one sin: label leakage from tomorrow's settlement file." },
] as const;

export const DEFAULT_RESUME = {
  name: "",
  headline: "Product Manager",
  summary:
    "Product manager with 4 years shipping consumer and fintech surfaces. Comfortable with SQL, experimentation, and messy stakeholder rooms. Looking for a Senior PM seat in Bengaluru.",
  experience: [
    { company: "PhonePe", title: "Product Manager", dates: "2022 — present", bullets: ["Owned merchant onboarding; lifted activation 18% in two quarters", "Shipped 14 experiments on KYC drop-off with a 9% conversion win"] },
    { company: "Freshworks", title: "Associate PM", dates: "2020 — 2022", bullets: ["Launched CRM saved-views used by 12k agents weekly", "Partnered with design on density without sacrificing accessibility"] },
  ],
  education: "B.Tech Computer Science, NIT Trichy · 2020",
  skills: ["Product Roadmap", "SQL", "Experimentation", "Stakeholder Mgmt", "Growth", "PRDs"],
};

export const SALARY_BANDS = [
  { role: "Associate Product Manager", city: "Bengaluru", p25: 16, p50: 22, p75: 28 },
  { role: "Product Manager", city: "Bengaluru", p25: 24, p50: 32, p75: 42 },
  { role: "Senior Product Manager", city: "Bengaluru", p25: 32, p50: 42, p75: 55 },
  { role: "Software Engineer II", city: "Bengaluru", p25: 18, p50: 26, p75: 34 },
  { role: "SDE II", city: "Hyderabad", p25: 22, p50: 30, p75: 40 },
  { role: "Data Scientist", city: "Bengaluru", p25: 20, p50: 28, p75: 38 },
  { role: "Engineering Manager", city: "Bengaluru", p25: 42, p50: 55, p75: 72 },
];
