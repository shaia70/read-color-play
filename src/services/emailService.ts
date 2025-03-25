
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
  
  // EmailJS template parameters - ensure these match your template variables exactly
  const templateParams = {
    from_name: params.name,
    from_email: params.email,
    to_name: "Shelley Team",
    to_email: TO_EMAIL,
    reply_to: params.email,
    subject: params.subject || defaultSubject,
    message: params.message,
    // Adding EmailJS specific formatting that might be required
    recipient: TO_EMAIL
  };

  console.log("Sending email with template params:", templateParams);
  
  try {
    // Send the email using EmailJS with the correct parameters order
    return await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );
  } catch (error) {
    console.error("Error in emailService:", error);
    throw error;
  }
};
