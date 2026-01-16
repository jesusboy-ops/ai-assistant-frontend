// Email Generator page
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  IconButton,
  Tooltip,
  alpha
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Send as SendIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import emailApi from '../api/emailApi';
import aiApi from '../api/aiApi';
import toast from '../utils/toast';
import PageHeader from '../components/PageHeader';

const Emails = () => {
  console.log('📧 Emails component loaded successfully');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [context, setContext] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const emailPreviewRef = useRef(null);

  // Auto-scroll to email preview when email is generated
  useEffect(() => {
    if (generatedEmail && emailPreviewRef.current) {
      emailPreviewRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [generatedEmail]);

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    console.log('📧 Starting email generation with:', { prompt, tone, context });

    try {
      setLoading(true);
      
      try {
        // Try real AI API first
        console.log('📧 Attempting real AI API call...');
        const aiEmail = await aiApi.generateEmail(prompt, tone, context);
        console.log('📧 Real AI email generated:', aiEmail);
        setGeneratedEmail(aiEmail);
        toast.success('Email generated successfully');
      } catch (aiError) {
        console.log('📧 AI API failed, generating contextual mock email:', aiError);
        const mockEmail = generateMockEmail(prompt, tone, context);
        console.log('📧 Mock email generated:', mockEmail);
        setGeneratedEmail(mockEmail);
        toast.success('Email generated successfully (offline mode)');
      }
      
    } catch (err) {
      console.error('📧 Error in handleGenerate:', err);
      toast.error('Failed to generate email');
    } finally {
      setLoading(false);
    }
  };

  const generateMockEmail = (prompt, tone, context) => {
    const toneStyles = {
      professional: {
        greeting: 'Dear',
        closing: 'Best regards',
        style: 'formal and business-appropriate'
      },
      friendly: {
        greeting: 'Hi',
        closing: 'Best wishes',
        style: 'warm and approachable'
      },
      formal: {
        greeting: 'Dear Sir/Madam',
        closing: 'Sincerely',
        style: 'very formal and respectful'
      },
      casual: {
        greeting: 'Hey',
        closing: 'Cheers',
        style: 'relaxed and informal'
      }
    };

    const selectedTone = toneStyles[tone] || toneStyles.professional;
    const promptLower = prompt.toLowerCase();
    
    // More intelligent email generation based on prompt analysis
    let subject = '';
    let body = '';
    
    // Job/Career related emails
    if (promptLower.includes('job') || promptLower.includes('interview') || promptLower.includes('application') || promptLower.includes('resume') || promptLower.includes('position')) {
      if (promptLower.includes('application') || promptLower.includes('apply')) {
        subject = 'Job Application - [Position Title]';
        body = `I am writing to express my strong interest in the [Position Title] role at your organization.

${context ? `With my background in ${context}, I believe I would be a valuable addition to your team.` : 'I believe my skills and experience align well with your requirements.'}

Key qualifications I bring:
• Relevant experience and proven track record
• Strong technical and interpersonal skills
• Passion for contributing to your organization's success

I have attached my resume for your review and would welcome the opportunity to discuss how I can contribute to your team.

Thank you for considering my application.`;
      } else if (promptLower.includes('interview')) {
        subject = 'Thank You - Interview Follow-up';
        body = `Thank you for taking the time to interview me for the [Position Title] role yesterday.

I enjoyed our conversation about ${context || 'the role and your team\'s objectives'}. Our discussion reinforced my enthusiasm for this opportunity and confirmed that this position aligns perfectly with my career goals.

I am particularly excited about:
• The opportunity to contribute to your team's success
• The challenging projects we discussed
• The company's innovative approach and culture

Please let me know if you need any additional information. I look forward to hearing about the next steps.`;
      } else {
        subject = 'Professional Inquiry - Career Opportunity';
        body = `I hope this email finds you well. I am reaching out regarding potential career opportunities.

${context ? `Given my experience in ${context}, I am particularly interested in roles that would allow me to leverage these skills.` : 'I am exploring new opportunities that align with my professional goals.'}

I would appreciate the opportunity to discuss how my background and skills might benefit your organization. I am happy to provide my resume and arrange a convenient time to speak.

Thank you for your time and consideration.`;
      }
    }
    
    // Meeting/Appointment related
    else if (promptLower.includes('meeting') || promptLower.includes('appointment') || promptLower.includes('schedule') || promptLower.includes('call')) {
      if (promptLower.includes('schedule') || promptLower.includes('arrange')) {
        subject = 'Meeting Request - [Topic]';
        body = `I hope you are doing well. I would like to schedule a meeting to discuss ${context || 'an important matter'}.

The purpose of this meeting would be to:
• Review current progress and objectives
• Discuss upcoming priorities and deadlines
• Address any questions or concerns
• Plan next steps and action items

I am flexible with timing and can accommodate your schedule. Please let me know what dates and times work best for you.

Looking forward to our productive discussion.`;
      } else {
        subject = 'Meeting Follow-up and Next Steps';
        body = `Thank you for the productive meeting we had regarding ${context || 'our recent discussion'}.

As discussed, here are the key takeaways and action items:
• [Action Item 1] - Due: [Date]
• [Action Item 2] - Due: [Date]
• [Action Item 3] - Due: [Date]

I will follow up on these items and provide updates as we progress. Please let me know if I missed anything or if you have additional thoughts.

Thank you for your time and collaboration.`;
      }
    }
    
    // Sales/Business related
    else if (promptLower.includes('proposal') || promptLower.includes('quote') || promptLower.includes('business') || promptLower.includes('partnership') || promptLower.includes('collaboration')) {
      subject = 'Business Proposal - Partnership Opportunity';
      body = `I hope this email finds you well. I am reaching out to discuss a potential business opportunity that I believe could be mutually beneficial.

${context ? `Based on your expertise in ${context}, I think there could be excellent synergy between our organizations.` : 'I believe there are opportunities for collaboration between our organizations.'}

The proposal includes:
• Clear value proposition for both parties
• Defined roles and responsibilities
• Projected timeline and milestones
• Expected outcomes and benefits

I would welcome the opportunity to discuss this proposal in detail at your convenience. Please let me know if you would be interested in exploring this further.

Thank you for your consideration.`;
    }
    
    // Customer service/Support related
    else if (promptLower.includes('complaint') || promptLower.includes('issue') || promptLower.includes('problem') || promptLower.includes('support') || promptLower.includes('help')) {
      if (promptLower.includes('complaint') || promptLower.includes('issue') || promptLower.includes('problem')) {
        subject = 'Service Issue - Request for Resolution';
        body = `I am writing to bring to your attention an issue I have encountered with ${context || 'your service'}.

Details of the issue:
• Date and time of occurrence
• Specific problem experienced
• Impact on my experience
• Steps already taken to resolve

I would appreciate your assistance in resolving this matter promptly. I have been a satisfied customer and hope we can find a quick solution.

Please let me know what information you need from me to proceed with the resolution.

Thank you for your attention to this matter.`;
      } else {
        subject = 'Request for Assistance';
        body = `I hope you are doing well. I am reaching out to request your assistance with ${context || 'a matter I am working on'}.

Specifically, I would appreciate guidance on:
• Understanding the current process
• Identifying the best approach
• Accessing necessary resources
• Timeline and next steps

I would be grateful for any support or direction you can provide. Please let me know if you need any additional information from me.

Thank you for your time and assistance.`;
      }
    }
    
    // Follow-up emails
    else if (promptLower.includes('follow') || promptLower.includes('follow-up') || promptLower.includes('checking in')) {
      subject = 'Follow-up on Our Previous Discussion';
      body = `I hope this email finds you well. I wanted to follow up on our previous conversation regarding ${context || 'the matter we discussed'}.

Since our last communication:
• I have reviewed the information you provided
• Made progress on the action items we identified
• Prepared additional questions for clarification

I would appreciate the opportunity to continue our discussion and move forward with the next steps. Please let me know when would be convenient for you.

Thank you for your continued support and collaboration.`;
    }
    
    // Thank you emails
    else if (promptLower.includes('thank') || promptLower.includes('appreciation') || promptLower.includes('grateful')) {
      subject = 'Thank You - Appreciation for Your Support';
      body = `I wanted to take a moment to express my sincere gratitude for ${context || 'your recent assistance and support'}.

Your help has been invaluable in:
• Achieving our objectives efficiently
• Overcoming challenges we encountered
• Moving the project forward successfully
• Maintaining high quality standards

I truly appreciate your professionalism, expertise, and dedication. It has been a pleasure working with you, and I look forward to our continued collaboration.

Thank you once again for everything you have done.`;
    }
    
    // Introduction/Networking emails
    else if (promptLower.includes('introduction') || promptLower.includes('connect') || promptLower.includes('network') || promptLower.includes('reach out')) {
      subject = 'Introduction and Professional Connection';
      body = `I hope this email finds you well. I am reaching out to introduce myself and explore potential opportunities for professional connection.

${context ? `I am particularly interested in your work in ${context} and believe there could be valuable synergies.` : 'I believe we share common professional interests and goals.'}

A bit about my background:
• [Your relevant experience]
• [Your current role/focus]
• [Your professional interests]

I would welcome the opportunity to connect and learn more about your work. Perhaps we could arrange a brief call or coffee meeting at your convenience.

Thank you for your time, and I look forward to potentially connecting.`;
    }
    
    // Default intelligent response based on prompt
    else {
      // Extract key words from prompt for more contextual response
      const keyWords = prompt.split(' ').filter(word => word.length > 3);
      const mainTopic = keyWords.length > 0 ? keyWords[0] : 'communication';
      
      subject = `Re: ${mainTopic.charAt(0).toUpperCase() + mainTopic.slice(1)} Discussion`;
      body = `I hope this email finds you well. I am writing regarding ${prompt.toLowerCase()}.

${context ? `In the context of ${context}, I wanted to share some thoughts and seek your input.` : 'I wanted to reach out to discuss this matter with you.'}

Key points to consider:
• Current situation and background
• Objectives and desired outcomes
• Potential approaches and solutions
• Timeline and next steps

I would appreciate the opportunity to discuss this further at your convenience. Please let me know your thoughts and availability.

Thank you for your time and consideration.`;
    }

    return `Subject: ${subject}

${selectedTone.greeting} [Recipient Name],

${body}

${selectedTone.closing},
[Your Name]`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast.success('Email copied to clipboard');
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
      <PageHeader
        title="AI Email Generator"
        subtitle="Create professional emails with AI assistance"
      />

      <Grid container spacing={3}>
        {/* Input Form - Left */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: 3
              }}
          >
            <CardContent sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: 600 }}>
                Email Details
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="What do you want to write about?"
                placeholder="E.g., Write a follow-up email to a client about project status"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                sx={{ marginBottom: 3 }}
              />

              <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                Tone
              </Typography>
              <ToggleButtonGroup
                value={tone}
                exclusive
                onChange={(e, newTone) => newTone && setTone(newTone)}
                fullWidth
                sx={{ marginBottom: 3 }}
              >
                {tones.map((t) => (
                  <ToggleButton
                    key={t.value}
                    value={t.value}
                    sx={{
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                        }
                      }
                    }}
                  >
                    {t.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Context (Optional)"
                placeholder="Add any specific details or requirements"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                sx={{ marginBottom: 3 }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  console.log('📧 Generate button clicked!');
                  handleGenerate();
                }}
                disabled={loading}
                sx={{
                  paddingY: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                  }
                }}
              >
                {loading ? 'Generating...' : 'Generate Email'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Email Preview - Right */}
        <Grid item xs={12} md={6}>
          <Card
            ref={emailPreviewRef}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: 3
              }}
          >
            <CardContent sx={{ padding: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Generated Email
                </Typography>
                {generatedEmail && (
                  <Box>
                    <Tooltip title="Copy">
                      <IconButton onClick={handleCopy} size="small">
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Regenerate">
                      <IconButton onClick={handleGenerate} size="small">
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>

              <Paper
                sx={{
                  padding: 3,
                  minHeight: 400,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {generatedEmail ? (
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {generatedEmail}
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    <Typography>Your generated email will appear here</Typography>
                  </Box>
                )}
              </Paper>

              {generatedEmail && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SendIcon />}
                  sx={{
                    marginTop: 2,
                    borderColor: '#06b6d4',
                    color: '#06b6d4',
                    '&:hover': {
                      borderColor: '#06b6d4',
                      backgroundColor: 'rgba(6, 182, 212, 0.1)'
                    }
                  }}
                >
                  Send via SendGrid
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Emails;
