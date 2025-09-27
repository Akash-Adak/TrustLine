// src/data/mock-articles.js

export const articles = [
  {
    id: 'upi-scam-alert',
    title: 'New UPI Scam Alert: Beware of Fake Cashback Offers',
    category: 'Cyber Crime',
    date: '2025-09-17',
    readTime: '3 min read',
    image: '/images/upi-scam.webp',
    excerpt: 'Scammers are sending fake UPI payment requests with messages like "Claim your cashback." Do not enter your PIN to receive money.',
    content: `
      <p>A new wave of UPI scams is targeting users in the Howrah area. Scammers are exploiting the "Request Money" feature on apps like Google Pay, PhonePe, and Paytm.</p>
      <p><strong>How the Scam Works:</strong> You receive a payment request, often for a small amount, with a tempting message like "Click here to receive your Rs. 500 cashback" or "Confirm to get your refund." If you approve the request and enter your UPI PIN, money is <strong>debited</strong> from your account, not credited.</p>
      <h3 class="font-bold mt-4">Remember: You NEVER need to enter your PIN to receive money.</h3>
      <ul>
        <li>&#8226; Always read the transaction message carefully.</li>
        <li>&#8226; Decline any unexpected payment requests.</li>
        <li>&#8226; Never share your UPI PIN with anyone.</li>
      </ul>
    `,
    severity: 'High',
    tags: ['Online Fraud', 'Digital Payment', 'Financial Safety']
  },
  {
    id: 'monsoon-pothole-watch',
    title: 'Monsoon Watch: Reporting Potholes in Your Area',
    category: 'Civic Issue',
    date: '2025-09-15',
    readTime: '4 min read',
    image: './images/pothole-safety.webp',
    excerpt: 'With the monsoon season, many roads are developing dangerous potholes. Here\'s how you can help by reporting them.',
    content: `
      <p>The monsoon season puts immense strain on our city's infrastructure, leading to the formation of potholes that can cause accidents and traffic congestion.</p>
      <p>The Howrah Municipal Corporation urges citizens to be proactive. If you see a pothole, especially on a busy road, please report it immediately using this app.</p>
      <h3 class="font-bold mt-4">What to Include in Your Report:</h3>
      <ul>
        <li>&#8226; A clear photo of the pothole.</li>
        <li>&#8226; The exact street address or a nearby landmark.</li>
        <li>&#8226; An estimate of the pothole's size (e.g., "as large as a helmet").</li>
      </ul>
      <p>Your timely reports help the authorities prioritize repairs and make our roads safer for everyone.</p>
    `,
    severity: 'Medium',
    tags: ['Road Safety', 'Infrastructure', 'Public Works']
  },
  {
    id: 'online-job-fraud',
    title: 'Beware of Fake Job Offers: Work-from-Home Scams on the Rise',
    category: 'Cyber Crime',
    date: '2025-09-12',
    readTime: '5 min read',
    image: '/images/job-scam.png',
    excerpt: 'Fraudsters are posting fake job opportunities on social media, demanding upfront fees for "training" or "registration".',
    content: `
      <p>With increasing unemployment, scammers are exploiting job seekers with fake work-from-home opportunities.</p>
      <h3 class="font-bold mt-4">Red Flags to Watch For:</h3>
      <ul>
        <li>&#8226; Job offers that seem too good to be true</li>
        <li>&#8226; Requests for upfront payment for "training materials"</li>
        <li>&#8226; Poorly written job descriptions with grammatical errors</li>
        <li>&#8226; Communication only through WhatsApp or Telegram</li>
        <li>&#8226; No proper company website or contact information</li>
      </ul>
      <p>Always verify company details through official channels before sharing personal information or making payments.</p>
    `,
    severity: 'High',
    tags: ['Employment Fraud', 'Online Safety', 'Social Media']
  },
  {
    id: 'water-contamination-alert',
    title: 'Water Contamination Alert in Eastern Howrah Areas',
    category: 'Public Health',
    date: '2025-09-10',
    readTime: '4 min read',
    image: '/images/water-safety.jpg',
    excerpt: 'Reports of water contamination in several eastern neighborhoods. Boil water before consumption until further notice.',
    content: `
      <p>The Public Health Department has issued a precautionary advisory for residents of Eastern Howrah following reports of water contamination.</p>
      <h3 class="font-bold mt-4">Affected Areas:</h3>
      <ul>
        <li>&#8226; Shibpur area</li>
        <li>&#8226; Liluah region</li>
        <li>&#8226; Bally neighborhood</li>
      </ul>
      <h3 class="font-bold mt-4">Safety Measures:</h3>
      <ul>
        <li>&#8226; Boil water for at least 10 minutes before drinking</li>
        <li>&#8226; Use bottled water for infants and elderly</li>
        <li>&#8226; Report any unusual water color or odor immediately</li>
      </ul>
      <p>Water tankers are being deployed to affected areas. Follow official channels for updates.</p>
    `,
    severity: 'Critical',
    tags: ['Health Advisory', 'Water Safety', 'Emergency']
  },
  {
    id: 'digital-literacy-workshop',
    title: 'Free Digital Literacy Workshops for Senior Citizens',
    category: 'Safety Tips',
    date: '2025-09-08',
    readTime: '2 min read',
    image: '/images/digital-workshop.webp',
    excerpt: 'Learn essential online safety skills at free workshops conducted by the Cyber Crime Prevention Unit.',
    content: `
      <p>The Howrah Police Commissionerate is organizing free digital literacy workshops specifically designed for senior citizens.</p>
      <h3 class="font-bold mt-4">Workshop Topics:</h3>
      <ul>
        <li>&#8226; Recognizing online scams and phishing attempts</li>
        <li>&#8226; Safe online banking practices</li>
        <li>&#8226; Social media privacy settings</li>
        <li>&#8226; Secure password creation and management</li>
      </ul>
      <h3 class="font-bold mt-4">Schedule:</h3>
      <p>Every Saturday, 10 AM - 1 PM at Howrah City Hall</p>
      <p><strong>Registration:</strong> Call 033-12345678 or visit your local police station</p>
    `,
    severity: 'Low',
    tags: ['Education', 'Senior Safety', 'Community Program']
  },
  {
    id: 'property-fraud-alert',
    title: 'Property Document Fraud: Verify Before You Buy',
    category: 'Legal Updates',
    date: '2025-09-05',
    readTime: '6 min read',
    image: '/images/property-fraud.webp',
    excerpt: 'Rising cases of property fraud involving fake documents. Always verify property papers with registrar office.',
    content: `
      <p>There has been a significant increase in property fraud cases where scammers use forged documents to sell properties they don't own.</p>
      <h3 class="font-bold mt-4">Verification Checklist:</h3>
      <ul>
        <li>&#8226; Verify title deeds at the Sub-Registrar Office</li>
        <li>&#8226; Check encumbrance certificate for last 30 years</li>
        <li>&#8226; Confirm property tax receipts with municipal corporation</li>
        <li>&#8226; Use registered lawyers for document verification</li>
        <li>&#8226; Verify seller's identity through multiple documents</li>
      </ul>
      <p>The Howrah District Administration has set up a dedicated helpline (033-98765432) for property verification assistance.</p>
    `,
    severity: 'High',
    tags: ['Property Fraud', 'Legal Safety', 'Document Verification']
  },
  {
    id: 'electricity-safety-monsoon',
    title: 'Electrical Safety During Monsoon: Precautions to Take',
    category: 'Safety Tips',
    date: '2025-09-03',
    readTime: '3 min read',
    image: '/images/electrical-safety.webp',
    excerpt: 'Important electrical safety measures to prevent accidents during heavy rains and flooding.',
    content: `
      <p>Monsoon season increases the risk of electrical accidents. Follow these safety guidelines to protect your family.</p>
      <h3 class="font-bold mt-4">Safety Precautions:</h3>
      <ul>
        <li>&#8226; Install Earth Leakage Circuit Breakers (ELCB) in your home</li>
        <li>&#8226; Keep electrical appliances away from water sources</li>
        <li>&#8226; Avoid using electrical devices during heavy rains and thunderstorms</li>
        <li>&#8226; Report fallen electrical wires immediately to CESC helpline</li>
        <li>&#8226; Ensure proper earthing for all electrical installations</li>
      </ul>
      <p><strong>Emergency Contacts:</strong> CESC Helpline - 19123, Howrah Electrical Department - 033-23456789</p>
    `,
    severity: 'Medium',
    tags: ['Home Safety', 'Monsoon Preparedness', 'Electrical Safety']
  },
  {
    id: 'covid-guidelines-update',
    title: 'Updated COVID-19 Guidelines for Public Gatherings',
    category: 'Public Health',
    date: '2025-08-28',
    readTime: '3 min read',
    image: '/images/covid-guidelines.webp',
    excerpt: 'Revised guidelines for public gatherings, transportation, and commercial establishments.',
    content: `
      <p>The West Bengal Health Department has issued updated COVID-19 guidelines based on current situation assessment.</p>
      <h3 class="font-bold mt-4">Key Guidelines:</h3>
      <ul>
        <li>&#8226; Masks mandatory in hospitals and healthcare facilities</li>
        <li>&#8226; 50% capacity limit for indoor public gatherings</li>
        <li>&#8226; Regular sanitization required in public transport</li>
        <li>&#8226; Temperature checks at large event venues</li>
        <li>&#8226; Vaccination certificates recommended for international travelers</li>
      </ul>
      <p>These guidelines will be reviewed bi-weekly based on infection rates. Stay updated through official health department channels.</p>
    `,
    severity: 'Medium',
    tags: ['Health Guidelines', 'Pandemic', 'Public Safety']
  },
  {
    id: 'online-banking-security',
    title: 'Enhanced Security Measures for Online Banking',
    category: 'Safety Tips',
    date: '2025-08-25',
    readTime: '4 min read',
    image: '/images/banking-security.webp',
    excerpt: 'RBI mandates additional security layers for online transactions. Learn how to secure your digital banking.',
    content: `
      <p>The Reserve Bank of India has introduced new security measures to protect online banking users from fraud.</p>
      <h3 class="font-bold mt-4">New Security Features:</h3>
      <ul>
        <li>&#8226; Two-factor authentication for all online transactions</li>
        <li>&#8226; Transaction limits based on risk assessment</li>
        <li>&#8226; Real-time fraud monitoring systems</li>
        <li>&#8226; Enhanced encryption for mobile banking apps</li>
      </ul>
      <h3 class="font-bold mt-4">User Responsibilities:</h3>
      <ul>
        <li>&#8226; Never share OTPs or passwords with anyone</li>
        <li>&#8226; Register for transaction alerts</li>
        <li>&#8226; Use official banking apps from trusted sources</li>
        <li>&#8226; Regularly update your banking app</li>
      </ul>
    `,
    severity: 'High',
    tags: ['Banking Security', 'Financial Safety', 'RBI Guidelines']
  },
  {
    id: 'waste-management-initiative',
    title: 'Segregated Waste Collection Initiative Launched',
    category: 'Civic Issue',
    date: '2025-08-20',
    readTime: '3 min read',
    image: '/images/waste-management.webp',
    excerpt: 'New door-to-door segregated waste collection system implemented across Howrah municipal areas.',
    content: `
      <p>Howrah Municipal Corporation has launched a new waste management initiative to promote recycling and reduce landfill waste.</p>
      <h3 class="font-bold mt-4">Segregation Guidelines:</h3>
      <ul>
        <li>&#8226; <strong>Green Bin:</strong> Biodegradable waste (food scraps, garden waste)</li>
        <li>&#8226; <strong>Blue Bin:</strong> Recyclable waste (plastic, paper, metal, glass)</li>
        <li>&#8226; <strong>Red Bin:</strong> Hazardous waste (batteries, chemicals, e-waste)</li>
      </ul>
      <h3 class="font-bold mt-4">Collection Schedule:</h3>
      <p>Green Bin: Daily | Blue Bin: Monday, Wednesday, Friday | Red Bin: 1st and 3rd Saturday of month</p>
      <p>Non-compliance may attract penalties as per municipal bylaws.</p>
    `,
    severity: 'Low',
    tags: ['Environment', 'Waste Management', 'Municipal Services']
  },
  {
    id: 'child-safety-online',
    title: 'Protecting Children from Online Predators',
    category: 'Safety Tips',
    date: '2025-08-15',
    readTime: '5 min read',
    image: '/images/child-safety.webp',
    excerpt: 'Essential guidelines for parents to ensure their children\'s safety in the digital world.',
    content: `
      <p>With children spending more time online for education and entertainment, it's crucial to implement safety measures.</p>
      <h3 class="font-bold mt-4">Safety Measures for Parents:</h3>
      <ul>
        <li>&#8226; Use parental control software to monitor online activity</li>
        <li>&#8226; Educate children about not sharing personal information online</li>
        <li>&#8226; Keep computers in common areas, not bedrooms</li>
        <li>&#8226; Regularly check browser history and social media accounts</li>
        <li>&#8226; Teach children to recognize inappropriate content and behavior</li>
      </ul>
      <p><strong>Report Suspicious Activity:</strong> Cyber Crime Helpline - 1930 or Child Helpline - 1098</p>
    `,
    severity: 'High',
    tags: ['Child Safety', 'Parenting', 'Online Protection']
  },
  {
    id: 'property-tax-deadline',
    title: 'Last Date for Property Tax Payment Extended to Sept 30',
    category: 'Legal Updates',
    date: '2025-08-10',
    readTime: '2 min read',
    image: '/images/property-tax.webp',
    excerpt: 'Howrah Municipal Corporation extends property tax payment deadline with 1% rebate for early payment.',
    content: `
      <p>The Howrah Municipal Corporation has extended the deadline for property tax payment to September 30, 2025.</p>
      <h3 class="font-bold mt-4">Payment Options:</h3>
      <ul>
        <li>&#8226; Online payment through municipal website</li>
        <li>&#8226; Mobile app: "Howrah Municipal Corp"</li>
        <li>&#8226; Designated bank branches</li>
        <li>&#8226; Municipal corporation office</li>
      </ul>
      <h3 class="font-bold mt-4">Rebate Scheme:</h3>
      <p>1% rebate on total tax amount for payments made before September 15, 2025.</p>
      <p>Late payments after September 30 will attract 2% monthly penalty.</p>
    `,
    severity: 'Low',
    tags: ['Tax Payment', 'Municipal Services', 'Deadline']
  }
];