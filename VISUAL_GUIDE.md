# 📸 Visual Demo Guide

## Taking Screenshots for Presentation

### Recommended Tools
- **Windows**: Snipping Tool (Windows + Shift + S)
- **Screen Recording**: OBS Studio (free) or Windows Game Bar (Windows + G)

### Screenshots to Capture

#### 1. Landing Page
**Filename**: `01-landing-page.png`

**What to show:**
- Full landing page view
- Hero section with title
- Three feature cards
- Three demo customer cards
- Clean, professional design

**Caption for presentation:**  
*"Enterprise-grade landing page with BFSI-compliant design and instant access to demo scenarios"*

---

#### 2. Progress Tracker
**Filename**: `02-progress-tracker.png`

**What to show:**
- Chat interface header
- Progress tracker with all stages
- Active stage highlighted
- Clean visual flow

**Caption:**  
*"Real-time progress tracking shows customers exactly where they are in the loan journey"*

---

#### 3. Chat - Greeting Stage
**Filename**: `03-chat-greeting.png`

**What to show:**
- Welcome message from Master Agent
- Customer name and pre-approved limit shown
- Clean chat bubble design
- Progress: "Welcome" stage active

**Caption:**  
*"Master AI Agent greets customer personally and displays pre-approved loan limit instantly"*

---

#### 4. Chat - Sales Negotiation
**Filename**: `04-chat-sales.png`

**What to show:**
- Customer requesting loan amount
- Agent response with smart recommendations
- Quick reply buttons (if visible)
- Natural conversation flow

**Caption:**  
*"Sales Agent intelligently negotiates loan terms and suggests optimal EMI options"*

---

#### 5. Chat - Verification
**Filename**: `05-chat-verification.png`

**What to show:**
- KYC verification success message
- Checkmark icon
- Progress moving to verification stage

**Caption:**  
*"Instant KYC verification from mock CRM - in production, integrates with real systems"*

---

#### 6. Chat - Underwriting
**Filename**: `06-chat-underwriting.png`

**What to show:**
- Credit assessment in progress
- Progress tracker at "Assessment" stage
- Professional messaging

**Caption:**  
*"Underwriting Agent performs real-time credit scoring and eligibility assessment"*

---

#### 7. Approval Decision
**Filename**: `07-approval-decision.png`

**What to show:**
- Congratulations message with 🎉 emoji
- Loan details breakdown:
  - Amount
  - Tenure
  - Interest rate
  - Monthly EMI
- "Download Sanction Letter" button visible
- Explanation from Gemini AI

**Caption:**  
*"Instant approval with complete transparency - all loan terms clearly displayed"*

---

#### 8. PDF Sanction Letter
**Filename**: `08-sanction-letter.png`

**What to show:**
- Downloaded PDF open in viewer
- Professional formatting
- Customer details
- Loan terms
- Terms & conditions
- Company branding

**Caption:**  
*"Automated PDF generation with professional sanction letter - ready for customer download"*

---

#### 9. Rejection Scenario
**Filename**: `09-rejection-scenario.png`

**What to show:**
- Rejection message with clear explanation
- Credit score mentioned
- Risk category shown
- Empathetic tone
- Helpful alternative suggestions

**Caption:**  
*"Explainable AI - even rejections are handled professionally with clear reasoning"*

---

#### 10. Mobile Responsive View
**Filename**: `10-mobile-view.png`

**What to show:**
- Chat interface on mobile viewport
- Responsive layout
- All elements accessible
- Professional appearance on small screen

**Caption:**  
*"Fully responsive design - works seamlessly on mobile devices for on-the-go customers"*

---

#### 11. Architecture Diagram (Create in PowerPoint/Figma)
**Filename**: `11-architecture.png`

**What to show:**
```
┌─────────────────────────────────────────┐
│         Customer / User                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Master AI Agent                    │
│  (Conversation Orchestrator)            │
└────┬────────┬─────────┬─────────┬───────┘
     │        │         │         │
     ▼        ▼         ▼         ▼
┌────────┐┌────────┐┌──────────┐┌────────┐
│ Sales  ││Verif.  ││Underwrit.││Sanction│
│ Agent  ││Agent   ││Agent     ││Letter  │
└────────┘└────────┘└──────────┘└────────┘
     │        │         │         │
     ▼        ▼         ▼         ▼
┌─────────────────────────────────────────┐
│         Backend Services                │
│  • Gemini AI                            │
│  • Mock CRM                             │
│  • Credit Bureau                        │
│  • PDF Generator                        │
└─────────────────────────────────────────┘
```

**Caption:**  
*"Multi-agent architecture: Master Agent orchestrates 4 specialized Worker Agents"*

---

## Creating Demo Video (Optional)

### Recommended Flow (5 minutes)

**Minute 0:00-0:30 - Introduction**
- Show landing page
- Explain the problem statement
- Highlight key features

**Minute 0:30-2:00 - Instant Approval Demo**
- Click Rajesh Kumar
- Type loan amount
- Type tenure
- Show verification
- Show approval
- Download PDF

**Minute 2:00-3:00 - Architecture Explanation**
- Show architecture diagram
- Explain Master Agent
- Explain Worker Agents
- Show how they communicate

**Minute 3:00-4:00 - Rejection Scenario (Quick)**
- Click Amit Patel
- Quick flow to rejection
- Show explainable AI

**Minute 4:00-5:00 - Closing**
- Business impact summary
- Technical highlights
- Call to action

### Video Recording Tips

1. **Preparation:**
   - Clean desktop background
   - Close unnecessary applications
   - Test microphone quality
   - Prepare script

2. **During Recording:**
   - Speak clearly and confidently
   - Move mouse slowly
   - Pause between major actions
   - Highlight important elements

3. **Editing:**
   - Add captions for key points
   - Speed up waiting times
   - Add background music (subtle)
   - Include title and end screens

### Recommended Tools
- **Free**: OBS Studio, DaVinci Resolve
- **Paid**: Camtasia, Adobe Premiere Pro

---

## Presentation Slides Structure

### Slide 1: Title
- Project name
- Team name
- EY Techathon 2025 logo

### Slide 2: Problem Statement
- NBFC challenges
- Statistics (60-70% drop-off)
- Current pain points

### Slide 3: Solution Overview
- Agentic AI platform
- Key differentiators
- Value proposition

### Slide 4: Architecture
- Architecture diagram
- Master + Worker Agents
- Tech stack

### Slide 5: Live Demo
- Link to live application
- QR code for judges

### Slide 6: Demo Scenarios
- Three customer profiles
- Expected outcomes
- [Show screenshots]

### Slide 7: Key Features
- Bullet points with icons
- Screenshots of UI

### Slide 8: Business Impact
- ROI metrics
- Time savings
- Cost reduction

### Slide 9: Technical Excellence
- Code quality
- Scalability
- Documentation

### Slide 10: Future Roadmap
- Phase 1, 2, 3
- Market strategy

### Slide 11: Thank You
- Contact information
- GitHub repository
- Q&A invitation

---

## Quick Demo Checklist

Before capturing screenshots or recording:

- [ ] Backend running smoothly
- [ ] Frontend loaded and responsive
- [ ] All demo customers working
- [ ] PDF generation tested
- [ ] Browser zoom at 100%
- [ ] Developer tools closed (F12)
- [ ] Clean browser history (no autofill)
- [ ] Good lighting (if video)
- [ ] Microphone tested (if video)
- [ ] Script prepared

---

## File Naming Convention

Use consistent naming for easy organization:

```
01-landing-page.png
02-progress-tracker.png
03-chat-greeting.png
04-chat-sales.png
05-chat-verification.png
06-chat-underwriting.png
07-approval-decision.png
08-sanction-letter.png
09-rejection-scenario.png
10-mobile-view.png
11-architecture.png
demo-video.mp4
presentation.pptx
```

---

## Where to Use These Assets

### GitHub Repository
- README.md with screenshot embeds
- Architecture section with diagrams
- Demo GIFs in documentation

### Presentation
- PowerPoint/Google Slides
- Live demo backup
- Printed handouts

### Submission Portal
- Project showcase images
- Demo video upload
- Documentation attachments

### Social Media (Optional)
- LinkedIn post
- Twitter thread
- YouTube demo

---

## Pro Tips

1. **Consistency**: Use same browser, same resolution
2. **Quality**: High-res screenshots (1920x1080 or higher)
3. **Annotations**: Add arrows, highlights if needed
4. **Branding**: Include EY Techathon branding where appropriate
5. **Accessibility**: Add alt text for all images
6. **Compression**: Optimize file sizes for faster loading

---

**Ready to capture your winning demo! 📸🏆**
