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
  const subject = language === 'he' ? 'ברוכים הבאים לשלי ספרים - הרשמה הושלמה' : 'Welcome to Shelley Books - Registration Complete';
  
  const message = language === 'he' 
    ? `שלום ${params.name},

ברוכים הבאים לשלי ספרים!

הרשמתך הושלמה בהצלחה. להלן פרטי הכניסה שלך:

שם משתמש (אימייל): ${params.email}
סיסמה: ${params.password}

⚠️ שים לב: טרם בוצע תשלום עבור גישה לספר הדיגיטלי.
כדי לקבל גישה מלאה לתוכן, יש צורך להשלים את התשלום בערך של 60 ש"ח.

לאחר התשלום תקבל אימייל נוסף המאשר את הרכישה.

תודה שבחרת בשלי ספרים!

בברכה,
צוות שלי ספרים`
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
  const subject = language === 'he' ? 'שלי ספרים - תשלום התקבל בהצלחה!' : 'Shelley Books - Payment Received Successfully!';
  
  const message = language === 'he' 
    ? `שלום ${params.name},

מעולה! התשלום שלך התקבל בהצלחה.

כעת יש לך גישה מלאה לספר הדיגיטלי של שלי ספרים.

פרטי הכניסה שלך:
שם משתמש (אימייל): ${params.email}
${params.password ? `סיסמה: ${params.password}` : '(השתמש בסיסמה שבחרת בעת ההרשמה)'}

תוכל לגשת לתוכן בכל עת באתר.

תודה על הרכישה וההצטרפות למשפחת שלי ספרים!

בברכה,
צוות שלי ספרים`
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

// Send physical book order notification to site owner
export interface PhysicalBookOrderParams {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryMethod: 'pickup' | 'delivery';
  shippingAddress?: {
    address_line_1: string;
    admin_area_2: string;
    postal_code?: string;
  };
  amount: number;
}

export const sendPhysicalBookOrderNotification = async (params: PhysicalBookOrderParams, language: string) => {
  const subject = language === 'he' 
    ? 'הזמנה חדשה - ספר פיזי "דניאל הולך לגן"' 
    : 'New Order - Physical Book "Daniel Goes to Kindergarten"';
  
  const deliveryMethodText = params.deliveryMethod === 'pickup' 
    ? (language === 'he' ? 'איסוף עצמי' : 'Self Pickup')
    : (language === 'he' ? 'משלוח עד הבית' : 'Home Delivery');

  let addressSection = '';
  if (params.deliveryMethod === 'delivery' && params.shippingAddress) {
    addressSection = language === 'he' 
      ? `\n\n📍 כתובת למשלוח:\n${params.shippingAddress.address_line_1}\n${params.shippingAddress.admin_area_2}${params.shippingAddress.postal_code ? ', ' + params.shippingAddress.postal_code : ''}`
      : `\n\n📍 Shipping Address:\n${params.shippingAddress.address_line_1}\n${params.shippingAddress.admin_area_2}${params.shippingAddress.postal_code ? ', ' + params.shippingAddress.postal_code : ''}`;
  } else if (params.deliveryMethod === 'pickup') {
    addressSection = language === 'he'
      ? `\n\n📍 נקודת איסוף עצמי:\nאופיר ביכורים - הוצאה לאור\nמשה דיין 10, קריית אריה, פתח תקווה\nבניין A, קומה 6\nטלפון: 03-5562677`
      : `\n\n📍 Self Pickup Location:\nOfir Bikurim Publishing\nMoshe Dayan 10, Kiryat Arye, Petah Tikva\nBuilding A, Floor 6\nPhone: 03-5562677`;
  }

  const message = language === 'he' 
    ? `התקבלה הזמנה חדשה לספר פיזי "דניאל הולך לגן"

📦 פרטי ההזמנה:
שם הלקוח: ${params.customerName}
אימייל: ${params.customerEmail}${params.customerPhone ? '\nטלפון: ' + params.customerPhone : ''}
אופן קבלה: ${deliveryMethodText}
סכום: ${params.amount} ₪${addressSection}

אנא הכן את הספר למשלוח/איסוף.

בברכה,
מערכת שלי ספרים`
    : `New order received for physical book "Daniel Goes to Kindergarten"

📦 Order Details:
Customer Name: ${params.customerName}
Email: ${params.customerEmail}${params.customerPhone ? '\nPhone: ' + params.customerPhone : ''}
Delivery Method: ${deliveryMethodText}
Amount: ${params.amount} NIS${addressSection}

Please prepare the book for shipping/pickup.

Best regards,
Shelley Books System`;

  const templateParams = {
    name: params.customerName,
    title: subject,
    from_name: "Shelley Books System",
    from_email: "contact@shelley.co.il",
    subject,
    message,
    to_name: "Shelley Team",
    to_email: "contact@shelley.co.il",
    recipient: "contact@shelley.co.il",
    reply_to: params.customerEmail,
  };

  console.log("Sending physical book order notification with params:", templateParams);
  
  try {
    const response = await emailjs.send(
      SERVICE_ID, 
      TEMPLATE_ID, 
      templateParams,
      PUBLIC_KEY
    );
    
    console.log("Physical book order notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending physical book order notification:", error);
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
