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

export interface RegistrationEmailParams {
  name: string;
  email: string;
  password: string;
}

export interface PaymentConfirmationParams {
  name: string;
  email: string;
  password?: string;
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
      from_email: params.email, // This maps to {{from_email}} in the template
      subject: params.subject || defaultSubject,
      message: params.message,
      
      // Remove the incorrect email field and ensure from_email is used
      
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

// Send registration confirmation email
export const sendRegistrationEmail = async (params: RegistrationEmailParams, language: string) => {
  const subject = language === 'he' ? 'ברוכים הבאים לשלי בוקס - הרשמה הושלמה' : 'Welcome to Shelley Books - Registration Complete';
  
  const message = language === 'he' 
    ? `שלום ${params.name},

ברוכים הבאים לשלי בוקס!

הרשמתך הושלמה בהצלחה. להלן פרטי הכניסה שלך:

שם משתמש (אימייל): ${params.email}
סיסמה: ${params.password}

⚠️ שים לב: טרם בוצע תשלום עבור גישה לספר הדיגיטלי.
כדי לקבל גישה מלאה לתוכן, יש צורך להשלים את התשלום בערך של 60 ש"ח.

לאחר התשלום תקבל אימייל נוסף המאשר את הרכישה.

תודה שבחרת בשלי בוקס!

בברכה,
צוות שלי בוקס`
    : `Hello ${params.name},

Welcome to Shelley Books!

Your registration has been completed successfully. Here are your login details:

Username (Email): ${params.email}
Password: ${params.password}

⚠️ Please note: Payment has not yet been made for access to the digital book.
To get full access to the content, you need to complete payment of 60 ILS.

After payment, you will receive another email confirming your purchase.

Thank you for choosing Shelley Books!

Best regards,
Shelley Books Team`;

  // Use different template parameters for user-directed emails
  const templateParams = {
    name: params.name,
    title: subject,
    from_name: "Shelley Books",
    from_email: "contact@shelley.co.il", // Send FROM contact@shelley.co.il
    subject,
    message,
    to_name: params.name,
    to_email: params.email, // Send TO the user's email
    recipient: params.email,
    reply_to: "contact@shelley.co.il",
  };

  console.log("Sending registration email with params:", templateParams);
  
  try {
    const response = await emailjs.send(
      SERVICE_ID, 
      TEMPLATE_ID, 
      templateParams,
      PUBLIC_KEY
    );
    
    console.log("Registration email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw error;
  }
};

// Send payment confirmation email
export const sendPaymentConfirmationEmail = async (params: PaymentConfirmationParams, language: string) => {
  const subject = language === 'he' ? 'שלי בוקס - תשלום התקבל בהצלחה!' : 'Shelley Books - Payment Received Successfully!';
  
  const message = language === 'he' 
    ? `שלום ${params.name},

מעולה! התשלום שלך התקבל בהצלחה.

כעת יש לך גישה מלאה לספר הדיגיטלי של שלי בוקס.

פרטי הכניסה שלך:
שם משתמש (אימייל): ${params.email}
${params.password ? `סיסמה: ${params.password}` : '(השתמש בסיסמה שבחרת בעת ההרשמה)'}

תוכל לגשת לתוכן בכל עת באתר.

תודה על הרכישה וההצטרפות למשפחת שלי בוקס!

בברכה,
צוות שלי בוקס`
    : `Hello ${params.name},

Excellent! Your payment has been received successfully.

You now have full access to the Shelley Books digital flipbook.

Your login details:
Username (Email): ${params.email}
${params.password ? `Password: ${params.password}` : '(Use the password you chose during registration)'}

You can access the content at any time on our website.

Thank you for your purchase and for joining the Shelley Books family!

Best regards,
Shelley Books Team`;

  // Use different template parameters for user-directed emails
  const templateParams = {
    name: params.name,
    title: subject,
    from_name: "Shelley Books",
    from_email: "contact@shelley.co.il", // Send FROM contact@shelley.co.il
    subject,
    message,
    to_name: params.name,
    to_email: params.email, // Send TO the user's email
    recipient: params.email,
    reply_to: "contact@shelley.co.il",
  };

  console.log("Sending payment confirmation email with params:", templateParams);
  
  try {
    const response = await emailjs.send(
      SERVICE_ID, 
      TEMPLATE_ID, 
      templateParams,
      PUBLIC_KEY
    );
    
    console.log("Payment confirmation email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending payment confirmation email:", error);
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
