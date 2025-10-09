import { supabase } from '@/integrations/supabase/client';

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

// Send contact form email (to site owner)
export const sendEmail = async (params: EmailParams, language: string) => {
  const defaultSubject = language === 'en' ? 'Contact Form Submission' : 'הודעה מטופס יצירת קשר';
  const subject = params.subject || defaultSubject;
  
  const html = language === 'he'
    ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>הודעה חדשה מטופס יצירת קשר</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>שם:</strong> ${params.name}</p>
          <p style="margin: 5px 0;"><strong>אימייל:</strong> ${params.email}</p>
          <p style="margin: 5px 0;"><strong>נושא:</strong> ${subject}</p>
        </div>
        <div style="background-color: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <p style="margin: 0;"><strong>הודעה:</strong></p>
          <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${params.message}</p>
        </div>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Message</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${params.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${params.email}</p>
          <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background-color: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <p style="margin: 0;"><strong>Message:</strong></p>
          <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${params.message}</p>
        </div>
      </div>
    `;

  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to_email: "contact@shelley.co.il",
        to_name: "Shelley Team",
        subject: `פניה חדשה מאתר שלי ספרים מ:${params.name}, נושא:${subject}`,
        html,
        reply_to: params.email
      }
    });
    
    if (error) throw error;
    
    console.log("Contact form email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending contact form email:", error);
    throw error;
  }
};

// Send registration confirmation email
export const sendRegistrationEmail = async (params: RegistrationEmailParams, language: string) => {
  const subject = language === 'he' ? 'ברוכים הבאים לשלי ספרים - הרשמה הושלמה' : 'Welcome to Shelley Books - Registration Complete';
  
  const html = language === 'he' 
    ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">שלום ${params.name},</h1>
        <p>ברוכים הבאים לשלי ספרים!</p>
        <p>הרשמתך הושלמה בהצלחה. להלן פרטי הכניסה שלך:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>שם משתמש (אימייל):</strong> ${params.email}</p>
          <p style="margin: 5px 0;"><strong>סיסמה:</strong> ${params.password}</p>
        </div>
        <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⚠️ שים לב:</strong> טרם בוצע תשלום עבור גישה לספר הדיגיטלי.</p>
          <p style="margin: 10px 0 0 0;">כדי לקבל גישה מלאה לתוכן, יש צורך להשלים את התשלום בערך של 60 ש"ח.</p>
        </div>
        <p>לאחר התשלום תקבל אימייל נוסף המאשר את הרכישה.</p>
        <p>תודה שבחרת בשלי ספרים!</p>
        <p style="margin-top: 30px;">בברכה,<br/>צוות שלי ספרים</p>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Hello ${params.name},</h1>
        <p>Welcome to Shelley Books!</p>
        <p>Your registration has been completed successfully. Here are your login details:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Username (Email):</strong> ${params.email}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${params.password}</p>
        </div>
        <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⚠️ Please note:</strong> Payment has not yet been made for access to the digital book.</p>
          <p style="margin: 10px 0 0 0;">To get full access to the content, you need to complete payment of 60 ILS.</p>
        </div>
        <p>After payment, you will receive another email confirming your purchase.</p>
        <p>Thank you for choosing Shelley Books!</p>
        <p style="margin-top: 30px;">Best regards,<br/>Shelley Books Team</p>
      </div>
    `;

  console.log("Sending registration email to:", params.email);
  
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to_email: params.email,
        to_name: params.name,
        subject,
        html,
        reply_to: "contact@shelley.co.il"
      }
    });
    
    if (error) throw error;
    
    console.log("Registration email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw error;
  }
};

// Send payment confirmation email
export const sendPaymentConfirmationEmail = async (params: PaymentConfirmationParams, language: string) => {
  const subject = language === 'he' ? 'שלי ספרים - תשלום התקבל בהצלחה!' : 'Shelley Books - Payment Received Successfully!';
  
  const html = language === 'he'
    ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745;">שלום ${params.name},</h1>
        <p><strong>מעולה! התשלום שלך התקבל בהצלחה.</strong></p>
        <p>כעת יש לך גישה מלאה לספר הדיגיטלי של שלי ספרים.</p>
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>פרטי הכניסה שלך:</strong></p>
          <p style="margin: 5px 0;">שם משתמש (אימייל): ${params.email}</p>
          ${params.password ? `<p style="margin: 5px 0;">סיסמה: ${params.password}</p>` : '<p style="margin: 5px 0;">(השתמש בסיסמה שבחרת בעת ההרשמה)</p>'}
        </div>
        <p>תוכל לגשת לתוכן בכל עת באתר.</p>
        <p>תודה על הרכישה וההצטרפות למשפחת שלי ספרים!</p>
        <p style="margin-top: 30px;">בברכה,<br/>צוות שלי ספרים</p>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745;">Hello ${params.name},</h1>
        <p><strong>Excellent! Your payment has been received successfully.</strong></p>
        <p>You now have full access to the Shelley Books digital flipbook.</p>
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Your login details:</strong></p>
          <p style="margin: 5px 0;">Username (Email): ${params.email}</p>
          ${params.password ? `<p style="margin: 5px 0;">Password: ${params.password}</p>` : '<p style="margin: 5px 0;">(Use the password you chose during registration)</p>'}
        </div>
        <p>You can access the content at any time on our website.</p>
        <p>Thank you for your purchase and for joining the Shelley Books family!</p>
        <p style="margin-top: 30px;">Best regards,<br/>Shelley Books Team</p>
      </div>
    `;

  console.log("Sending payment confirmation email to:", params.email);
  
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to_email: params.email,
        to_name: params.name,
        subject,
        html,
        reply_to: "contact@shelley.co.il"
      }
    });
    
    if (error) throw error;
    
    console.log("Payment confirmation email sent successfully:", data);
    return data;
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
      ? `<p><strong>📍 כתובת למשלוח:</strong><br/>${params.shippingAddress.address_line_1}<br/>${params.shippingAddress.admin_area_2}${params.shippingAddress.postal_code ? ', ' + params.shippingAddress.postal_code : ''}</p>`
      : `<p><strong>📍 Shipping Address:</strong><br/>${params.shippingAddress.address_line_1}<br/>${params.shippingAddress.admin_area_2}${params.shippingAddress.postal_code ? ', ' + params.shippingAddress.postal_code : ''}</p>`;
  } else if (params.deliveryMethod === 'pickup') {
    addressSection = language === 'he'
      ? `<p><strong>📍 נקודת איסוף עצמי:</strong><br/>אופיר ביכורים - הוצאה לאור<br/>משה דיין 10, קריית אריה, פתח תקווה<br/>בניין A, קומה 6<br/>טלפון: 03-5562677</p>`
      : `<p><strong>📍 Self Pickup Location:</strong><br/>Ofir Bikurim Publishing<br/>Moshe Dayan 10, Kiryat Arye, Petah Tikva<br/>Building A, Floor 6<br/>Phone: 03-5562677</p>`;
  }

  const html = language === 'he' 
    ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d9534f;">התקבלה הזמנה חדשה לספר פיזי "דניאל הולך לגן"</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>📦 פרטי ההזמנה:</h3>
          <p><strong>שם הלקוח:</strong> ${params.customerName}</p>
          <p><strong>אימייל:</strong> ${params.customerEmail}</p>
          ${params.customerPhone ? `<p><strong>טלפון:</strong> ${params.customerPhone}</p>` : ''}
          <p><strong>אופן קבלה:</strong> ${deliveryMethodText}</p>
          <p><strong>סכום:</strong> ${params.amount} ₪</p>
        </div>
        ${addressSection}
        <p style="margin-top: 20px;">אנא הכן את הספר למשלוח/איסוף.</p>
        <p style="margin-top: 30px;">בברכה,<br/>מערכת שלי ספרים</p>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d9534f;">New order received for physical book "Daniel Goes to Kindergarten"</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>📦 Order Details:</h3>
          <p><strong>Customer Name:</strong> ${params.customerName}</p>
          <p><strong>Email:</strong> ${params.customerEmail}</p>
          ${params.customerPhone ? `<p><strong>Phone:</strong> ${params.customerPhone}</p>` : ''}
          <p><strong>Delivery Method:</strong> ${deliveryMethodText}</p>
          <p><strong>Amount:</strong> ${params.amount} NIS</p>
        </div>
        ${addressSection}
        <p style="margin-top: 20px;">Please prepare the book for shipping/pickup.</p>
        <p style="margin-top: 30px;">Best regards,<br/>Shelley Books System</p>
      </div>
    `;

  console.log("Sending physical book order notification");
  
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to_email: "contact@shelley.co.il",
        to_name: "Shelley Team",
        subject,
        html,
        reply_to: params.customerEmail
      }
    });
    
    if (error) throw error;
    
    console.log("Physical book order notification sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending physical book order notification:", error);
    throw error;
  }
};

// Send physical book purchase confirmation to customer
export interface PhysicalBookCustomerConfirmationParams {
  customerName: string;
  customerEmail: string;
  deliveryMethod: 'pickup' | 'delivery';
  shippingAddress?: {
    address_line_1: string;
    admin_area_2: string;
    postal_code?: string;
  };
  amount: number;
}

export const sendPhysicalBookCustomerConfirmation = async (params: PhysicalBookCustomerConfirmationParams, language: string) => {
  const subject = language === 'he' 
    ? 'שלי ספרים - אישור הזמנת ספר פיזי' 
    : 'Shelley Books - Physical Book Order Confirmation';
  
  const deliveryMethodText = params.deliveryMethod === 'pickup' 
    ? (language === 'he' ? 'איסוף עצמי' : 'Self Pickup')
    : (language === 'he' ? 'משלוח עד הבית' : 'Home Delivery');

  let addressSection = '';
  if (params.deliveryMethod === 'delivery' && params.shippingAddress) {
    addressSection = language === 'he' 
      ? `<div style="background-color: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>📍 הספר יישלח לכתובת:</strong><br/>
          ${params.shippingAddress.address_line_1}<br/>
          ${params.shippingAddress.admin_area_2}${params.shippingAddress.postal_code ? ', ' + params.shippingAddress.postal_code : ''}</p>
          <p style="margin-top: 10px;"><strong>זמן אספקה משוער:</strong> 5-7 ימי עסקים</p>
        </div>`
      : `<div style="background-color: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>📍 The book will be shipped to:</strong><br/>
          ${params.shippingAddress.address_line_1}<br/>
          ${params.shippingAddress.admin_area_2}${params.shippingAddress.postal_code ? ', ' + params.shippingAddress.postal_code : ''}</p>
          <p style="margin-top: 10px;"><strong>Estimated delivery:</strong> 5-7 business days</p>
        </div>`;
  } else if (params.deliveryMethod === 'pickup') {
    addressSection = language === 'he'
      ? `<div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>📍 נקודת איסוף עצמי:</strong><br/>
          אופיר ביכורים - הוצאה לאור<br/>
          משה דיין 10, קריית אריה, פתח תקווה<br/>
          בניין A, קומה 6<br/>
          טלפון: 03-5562677</p>
          <p style="margin-top: 10px;">ניתן לאסוף את הספר בימים א'-ה' בין השעות 9:00-17:00</p>
        </div>`
      : `<div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>📍 Self Pickup Location:</strong><br/>
          Ofir Bikurim Publishing<br/>
          Moshe Dayan 10, Kiryat Arye, Petah Tikva<br/>
          Building A, Floor 6<br/>
          Phone: 03-5562677</p>
          <p style="margin-top: 10px;">You can pick up the book Sun-Thu between 9:00-17:00</p>
        </div>`;
  }

  const html = language === 'he' 
    ? `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745;">שלום ${params.customerName},</h1>
        <p><strong>תודה על הזמנתך!</strong></p>
        <h2>📚 הזמנת ספר פיזי: "דניאל הולך לגן"</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>פרטי ההזמנה:</strong></p>
          <p>אופן קבלה: ${deliveryMethodText}</p>
          <p>סכום ששולם: ${params.amount} ₪</p>
        </div>
        ${addressSection}
        <p>אם יש לך שאלות, אנא צור קשר איתנו.</p>
        <p><strong>תודה שבחרת בשלי ספרים!</strong></p>
        <p style="margin-top: 30px;">בברכה,<br/>צוות שלי ספרים</p>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745;">Hello ${params.customerName},</h1>
        <p><strong>Thank you for your order!</strong></p>
        <h2>📚 Physical Book Order: "Daniel Goes to Kindergarten"</h2>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order Details:</strong></p>
          <p>Delivery Method: ${deliveryMethodText}</p>
          <p>Amount Paid: ${params.amount} NIS</p>
        </div>
        ${addressSection}
        <p>If you have any questions, please contact us.</p>
        <p><strong>Thank you for choosing Shelley Books!</strong></p>
        <p style="margin-top: 30px;">Best regards,<br/>Shelley Books Team</p>
      </div>
    `;

  console.log("Sending physical book customer confirmation to:", params.customerEmail);
  
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to_email: params.customerEmail,
        to_name: params.customerName,
        subject,
        html,
        reply_to: "contact@shelley.co.il"
      }
    });
    
    if (error) throw error;
    
    console.log("Physical book customer confirmation sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending physical book customer confirmation:", error);
    throw error;
  }
};

export const generateMailtoLink = (params: EmailParams, language: string) => {
  const defaultSubject = language === 'en' ? 'Contact Form Submission' : 'הודעה מטופס יצירת קשר';
  const subject = encodeURIComponent(params.subject || defaultSubject);
  const body = encodeURIComponent(`Name: ${params.name}\nEmail: ${params.email}\n\nMessage:\n${params.message}`);
  return `mailto:contact@shelley.co.il?subject=${subject}&body=${body}`;
};
