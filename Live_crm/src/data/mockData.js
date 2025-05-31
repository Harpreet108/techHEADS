// src/data/mockData.js
export const mockData = {
    agents: [
        { id: 1, name: 'Alex Johnson', calls: 32, avgSentiment: 8.2 },
        { id: 2, name: 'Maria Garcia', calls: 28, avgSentiment: 7.5 },
        { id: 3, name: 'Chen Wei', calls: 35, avgSentiment: 8.9 },
        { id: 4, name: 'Samira Khan', calls: 25, avgSentiment: 6.8 },
        { id: 5, name: 'David Miller', calls: 30, avgSentiment: 7.9 },
    ],
    sentimentTrend: [7.1, 7.5, 7.3, 8.1, 8.0, 8.5, 8.9],
    calls: [
        { id: 1, customer: 'Innovate Corp', agent: 'Alex Johnson', sentiment: 'Positive', duration: '8:15', date: '2024-05-31', sentimentScore: 8.5, talkRatio: 45, summary: 'Discussed Q3 expansion plans. Customer is happy with current service and interested in the new Pro-Tier features. Awaiting proposal.', actionItems: ['Send Pro-Tier proposal by EOD.', 'Schedule follow-up for next week.'], topics: ['Expansion', 'Pro-Tier', 'Pricing'], transcript: [
            { speaker: 'Alex Johnson', time: '0:02', text: 'Thanks for joining, Mark. How are things at Innovate Corp?' },
            { speaker: 'Mark (Customer)', time: '0:10', text: 'Things are great, Alex. The Q2 results were fantastic, and we\'re looking to expand our operations.' },
            { speaker: 'Alex Johnson', time: '0:25', text: 'That\'s brilliant news! Our Pro-Tier service might be a perfect fit for your expansion.' },
            { speaker: 'Mark (Customer)', time: '0:40', text: 'Oh, I saw an email about that. Tell me more. I am particularly interested in the advanced analytics it offers.' },
            { speaker: 'Alex Johnson', time: '0:55', text: 'Absolutely. It provides real-time data streaming and predictive insights that could really benefit your new branches.' },
            { speaker: 'Mark (Customer)', time: '1:15', text: 'That sounds exactly like what we need. Can you send over a proposal?' },
        ], sentimentData: [5, 6, 7, 7, 8, 8, 9, 8]},
        { id: 2, customer: 'Quantum Solutions', agent: 'Maria Garcia', sentiment: 'Neutral', duration: '12:45', date: '2024-05-31', sentimentScore: 6.2, talkRatio: 65, summary: 'Customer experienced a technical issue with the API. Issue was troubleshooted and escalated to the support team.', actionItems: ['Monitor support ticket #58291.', 'Follow up with customer in 24 hours.'], topics: ['API Issue', 'Support', 'Troubleshooting'], transcript: [
            { speaker: 'Maria Garcia', time: '0:05', text: 'Hi Sarah, this is Maria from SmartVoice. How can I help?' },
            { speaker: 'Sarah (Customer)', time: '0:12', text: 'Hi Maria. We\'re having trouble with the API integration. We are seeing a lot of 503 errors.' },
            { speaker: 'Maria Garcia', time: '0:30', text: 'I\'m sorry to hear that. Let me look into this for you. Can you tell me which endpoint you are using? I am also seeing some alerts on our end.' },
            { speaker: 'Sarah (Customer)', time: '0:58', text: 'We\'re using the /v2/analytics endpoint. It was working fine until this morning.' }
        ], sentimentData: [5, 4, 3, 4, 5, 6, 5, 5]},
        { id: 3, customer: 'Synergy Systems', agent: 'Chen Wei', sentiment: 'Positive', duration: '6:30', date: '2024-05-30', sentimentScore: 9.1, talkRatio: 50, summary: 'Successful onboarding call. Customer is excited to start using the platform.', actionItems: ['Send welcome kit.', 'Schedule 1-week check-in.'], topics: ['Onboarding', 'Platform Intro'], transcript: [
            { speaker: 'Chen Wei', text: 'Welcome aboard, Synergy Systems! We are thrilled to have you.'},
            { speaker: 'Client (Synergy)', text: 'Thank you! We are very excited to get started and see how SmartVoice can help our team.'}
        ], sentimentData: [6, 7, 8, 8, 9, 9, 9, 9]},
        { id: 4, customer: 'Dynamic Digital', agent: 'Samira Khan', sentiment: 'Negative', duration: '9:02', date: '2024-05-30', sentimentScore: 4.5, talkRatio: 70, summary: 'Customer is unhappy about the recent price increase and mentioned looking at competitors.', actionItems: ['Escalate to manager for potential discount.', 'Log churn risk.'], topics: ['Pricing', 'Competitor Mention', 'Churn Risk'], transcript: [
            { speaker: 'Samira Khan', text: 'Hello Dynamic Digital, how can I assist you?'},
            { speaker: 'Client (Dynamic)', text: 'I am calling about the recent price hike. It\'s quite a jump, and frankly, we are looking at other options like Acme Corp.'}
        ], sentimentData: [6, 5, 4, 3, 3, 4, 5, 4]},
        { id: 5, customer: 'Global Exports', agent: 'Alex Johnson', sentiment: 'Positive', duration: '7:22', date: '2024-05-29', sentimentScore: 8.8, talkRatio: 55, summary: 'Follow-up call. Customer confirmed receipt of proposal and has a few questions to be addressed internally.', actionItems: ['Await feedback from customer.'], topics: ['Proposal', 'Follow-up'], transcript: [], sentimentData: [7, 7, 8, 8, 8, 9, 9, 8]},
    ],
    liveCall: {
        transcript: [
            { speaker: 'Agent', text: "Hello, this is Jane from SmartSolutions, how can I help you today?" }, // Time 0
            { speaker: 'Customer', text: "Hi Jane, I'm calling about my recent invoice. It seems higher than I expected." }, // Time 1
            { speaker: 'Agent', text: "I can certainly look into that for you. Can I get your account number please?" }, // Time 2
            { speaker: 'Customer', text: "Sure, it's 555-2468. I also noticed you guys have a competitor, Acme Corp, offering lower rates." }, // Time 3
            { speaker: 'Agent', text: "Thank you. I see your account. Let me review the invoice details..." }, // Time 4
            { speaker: 'Customer', text: "Okay, please hurry. I don't have all day." }, // Time 5 - Potential Objection
            { speaker: 'Agent', text: "I understand. It looks like the extra charge is for the premium data package you added last month." }, // Time 6
            { speaker: 'Customer', text: "Oh, I see. I had forgotten about that. That makes sense now." }, // Time 7
            { speaker: 'Agent', text: "Great! Is there anything else I can help you with today?" }, // Time 8
            { speaker: 'Customer', text: "No, that's all. Thanks for your help." } // Time 9
        ],
        sentiments: [5, 4, 4, 3, 3, 2, 5, 7, 8, 8], // Sentiment drops at Time 5
        coachingAlerts: [
            { time: 3, message: "Competitor 'Acme Corp' mentioned. Be prepared to discuss value proposition.", type: 'info' },
            { time: 5, message: "Customer sentiment is dropping. Use empathy statements.", type: 'warning' },
        ],
        scriptSuggestions: [
            { time: 0, text: "Opening: 'Thanks for calling SmartSolutions...'" },
            { time: 3, text: "Competitor Rebuttal: 'While their prices might seem lower, our platform offers 99.9% uptime and dedicated support...'" },
            { time: 8, text: "Closing: 'Glad I could help! Is there anything else...'" }
        ]
    }
};

