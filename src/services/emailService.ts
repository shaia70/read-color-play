
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
  
  // EmailJS expects specific parameter names based on your template
  // Make sure these match exactly with your EmailJS template variables
  const templateParams = {
    from_name: params.name,
    from_email: params.email,
    to_name: "Shelley Team", // Add recipient name
    to_email: TO_EMAIL,
    reply_to: params.email, // Add reply-to field
    subject: params.subject || defaultSubject,
    message: params.message,
  };

  console.log("Sending email with template params:", templateParams);
  
  try {
    // Send the email using EmailJS
    return await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
  } catch (error) {
    console.error("Error in emailService:", error);
    throw error;
  }
};
