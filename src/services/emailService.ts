
import emailjs from 'emailjs-com';

// EmailJS configuration
const SERVICE_ID = "service_b8wznhv";
const TEMPLATE_ID = "template_n7g59yj";
const PUBLIC_KEY = "jWPCnv-Rf3v6GmioO";

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

export interface EmailParams {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const sendEmail = async (params: EmailParams, language: string) => {
  const defaultSubject = language === 'en' ? 'Contact Form Submission' : 'הודעה מטופס יצירת קשר';
  
  try {
    // Create template parameters with all possible recipient fields
    const templateParams = {
      // User information with correct template fields
      name: params.name, // This maps to {{name}} in the template
      title: params.subject || defaultSubject, // This maps to {{title}} in the template
      from_name: params.name,
      from_email: params.email,
      subject: params.subject || defaultSubject,
      message: params.message,
      
      // Add the explicit email field that the EmailJS template expects
      email: "contact@shelley.co.il",
      
      // Keep other recipient formats for compatibility
      to_name: "Shelley Team",
      to_email: "contact@shelley.co.il",
      recipient: "contact@shelley.co.il",
      reply_to: params.email,
    };

    console.log("Sending email with template params:", templateParams);
    
    // Send email using EmailJS with PUBLIC_KEY as third parameter
    const response = await emailjs.send(
      SERVICE_ID, 
      TEMPLATE_ID, 
      templateParams,
      PUBLIC_KEY
    );
    
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error in emailService:", error);
    throw error;
  }
};

// Create a function to generate a mailto link as fallback
export const generateMailtoLink = (params: EmailParams, language: string) => {
  const defaultSubject = language === 'en' ? 'Contact Form Submission' : 'הודעה מטופס יצירת קשר';
  const subject = encodeURIComponent(params.subject || defaultSubject);
  const body = encodeURIComponent(`Name: ${params.name}\nEmail: ${params.email}\n\nMessage:\n${params.message}`);
  return `mailto:contact@shelley.co.il?subject=${subject}&body=${body}`;
};
