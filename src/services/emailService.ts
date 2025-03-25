
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
    // Create template parameters exactly matching the EmailJS template variables
    const templateParams = {
      // User information
      from_name: params.name,
      from_email: params.email,
      subject: params.subject || defaultSubject,
      message: params.message,
      // Recipient information - these must match exactly what the template expects
      to_name: "Shelley Team",
      reply_to: params.email,
    };

    console.log("Sending email with template params:", templateParams);
    
    // Send email using EmailJS
    const response = await emailjs.send(
      SERVICE_ID, 
      TEMPLATE_ID, 
      templateParams
    );
    
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error in emailService:", error);
    throw error;
  }
};
