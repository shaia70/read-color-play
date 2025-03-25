
import emailjs from 'emailjs-com';

// EmailJS configuration
const SERVICE_ID = "service_b8wznhv";
const TEMPLATE_ID = "template_n7g59yj";
const PUBLIC_KEY = "jWPCnv-Rf3v6GmioO";
const TO_EMAIL = "contact@shelley.co.il";

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
    // Create a complete object with all required fields
    const templateParams = {
      from_name: params.name,
      from_email: params.email,
      subject: params.subject || defaultSubject,
      message: params.message,
      // Direct template variables
      to_email: TO_EMAIL,
      to_name: "Shelley Team",
      reply_to: params.email,
    };

    console.log("Sending email with template params:", templateParams);
    
    // Use the EmailJS direct send method
    const response = await emailjs.send(
      SERVICE_ID, 
      TEMPLATE_ID, 
      templateParams, 
      PUBLIC_KEY // Re-adding the public key as the fourth parameter
    );
    
    return response;
  } catch (error) {
    console.error("Error in emailService:", error);
    throw error;
  }
};
