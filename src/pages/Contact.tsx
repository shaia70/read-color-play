
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { Mail, Send, Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageDirectionWrapper from "@/components/layout/LanguageDirectionWrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const TARGET_EMAIL = "contact@shelley.co.il";

const Contact = () => {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFromNotifyMe, setIsFromNotifyMe] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<z.infer<typeof formSchema> | null>(null);

  const formSchema = z.object({
    name: z.string().min(1, language === 'en' ? "Name is required" : "נדרש שם"),
    email: z.string().email(language === 'en' ? "Invalid email address" : "כתובת אימייל לא תקינה"),
    subject: z.string().optional(),
    message: z.string().min(1, language === 'en' ? "Message is required" : "נדרשת הודעה")
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  useEffect(() => {
    if (location.state) {
      if (location.state.prefilledSubject) {
        form.setValue("subject", location.state.prefilledSubject);
        
        if (location.state.prefilledSubject === 'עדכנו אותי בשחרור האפליקציה' || 
            location.state.prefilledSubject === 'Notify me when the app is released') {
          setIsFromNotifyMe(true);
        }
      }
      
      if (location.state.prefilledMessage) {
        form.setValue("message", location.state.prefilledMessage);
      }
    }
  }, [location.state, form]);

  useEffect(() => {
    if (isFromNotifyMe) {
      if (language === 'he') {
        form.setValue("subject", 'עדכנו אותי בשחרור האפליקציה');
        form.setValue("message", 'שלום, אשמח לקבל עדכון כאשר האפליקציה שלכם מוכנה להורדה');
      } else {
        form.setValue("subject", 'Notify me when the app is released');
        form.setValue("message", 'Hello, I would like to be notified when your app is available for download');
      }
    }
  }, [language, isFromNotifyMe, form]);

  const copyToClipboard = () => {
    if (!submittedData) return;
    
    const { name, email, subject, message } = submittedData;
    const formattedSubject = subject || (language === 'en' ? 'Contact Form Submission' : 'הודעה מטופס יצירת קשר');
    
    const textToCopy = 
      `${language === 'en' ? 'Name' : 'שם'}: ${name}\n` +
      `${language === 'en' ? 'Email' : 'אימייל'}: ${email}\n` +
      `${language === 'en' ? 'Subject' : 'נושא'}: ${formattedSubject}\n\n` +
      `${message}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({
          title: language === 'en' ? "Copied to clipboard" : "הועתק ללוח",
          description: language === 'en' ? "You can now paste this information elsewhere" : "כעת ניתן להדביק מידע זה במקום אחר",
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast({
          title: language === 'en' ? "Failed to copy" : "העתקה נכשלה",
          description: language === 'en' ? "Please try again" : "אנא נסה שוב",
          variant: "destructive",
        });
      });
  };

  const resetForm = () => {
    setFormSubmitted(false);
    setSubmittedData(null);
    form.reset();
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      console.log("Form submitted with data:", data);
      
      // Save the submitted data
      setSubmittedData(data);
      setFormSubmitted(true);
      
      toast({
        title: language === 'en' ? "Form Submitted" : "הטופס נשלח",
        description: language === 'en' 
          ? "Your message has been received. Please copy the details to send via email." 
          : "ההודעה שלך התקבלה. אנא העתק את הפרטים לשליחה באמצעות דוא״ל.",
      });
    } catch (error) {
      console.error("Error processing form:", error);
      toast({
        title: language === 'en' ? "Error" : "שגיאה",
        description: language === 'en' ? "An error occurred while processing your form" : "אירעה שגיאה בעיבוד הטופס שלך",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main className="pt-28 pb-20">
        <div className="page-container">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">{language === 'en' ? 'Contact Us' : 'צור קשר'}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'en' ? '!Do you have questions or ideas? We are always happy to hear from you' : 'יש לכם שאלות או רעיונות? אנחנו תמיד שמחים לשמוע מכם!'}
            </p>
          </div>

          <div className="glass-card mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {!formSubmitted ? (
                <div className={`p-8 ${language === 'en' ? 'text-left' : 'text-right'}`}>
                  <h2 className="text-2xl font-bold mb-6">{language === 'en' ? 'Send Us a Message' : 'שלחו לנו הודעה'}</h2>
                  
                  <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {language === 'en' ? 'Full Name' : 'שם מלא'} <span className="text-shelley-red">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                dir={language === 'en' ? 'ltr' : 'rtl'}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shelley-blue focus:border-transparent outline-none transition"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {language === 'en' ? 'Email' : 'דוא"ל'} <span className="text-shelley-red">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                dir="ltr"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shelley-blue focus:border-transparent outline-none transition"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {language === 'en' ? 'Subject' : 'נושא'}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                dir={language === 'en' ? 'ltr' : 'rtl'}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shelley-blue focus:border-transparent outline-none transition"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {language === 'en' ? 'Message' : 'הודעה'} <span className="text-shelley-red">*</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={5}
                                dir={language === 'en' ? 'ltr' : 'rtl'}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shelley-blue focus:border-transparent outline-none transition"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <CustomButton 
                        type="submit" 
                        variant="purple" 
                        icon={<Send />} 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting 
                          ? (language === 'en' ? 'Submitting...' : 'שולח...') 
                          : (language === 'en' ? 'Send Message' : 'שלח הודעה')}
                      </CustomButton>
                    </form>
                  </Form>
                </div>
              ) : (
                <div className={`p-8 ${language === 'en' ? 'text-left' : 'text-right'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{language === 'en' ? 'Message Submitted' : 'ההודעה נשלחה'}</h2>
                    <div className="flex gap-2">
                      <CustomButton 
                        variant="outline" 
                        icon={<Copy />} 
                        onClick={copyToClipboard}
                        size="sm"
                      >
                        {language === 'en' ? 'Copy' : 'העתק'}
                      </CustomButton>
                      <CustomButton 
                        variant="secondary" 
                        onClick={resetForm}
                        size="sm"
                      >
                        {language === 'en' ? 'New Message' : 'הודעה חדשה'}
                      </CustomButton>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Check className="text-green-500" />
                      <p className="text-green-700 font-medium">
                        {language === 'en' 
                          ? 'Your message has been received!' 
                          : 'ההודעה שלך התקבלה!'}
                      </p>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {language === 'en' 
                        ? 'To send this message to our team, please:' 
                        : 'כדי לשלוח הודעה זו לצוות שלנו, אנא:'}
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600 mb-4">
                      <li>{language === 'en' ? 'Click the "Copy" button above' : 'לחץ על כפתור "העתק" למעלה'}</li>
                      <li>
                        {language === 'en' 
                          ? `Send an email to ${TARGET_EMAIL} with the copied content` 
                          : `שלח אימייל ל-${TARGET_EMAIL} עם התוכן שהעתקת`}
                      </li>
                    </ol>
                  </div>
                  
                  {submittedData && (
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-bold mb-4">{language === 'en' ? 'Message Details:' : 'פרטי ההודעה:'}</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">{language === 'en' ? 'Name:' : 'שם:'}</p>
                          <p className="text-gray-600">{submittedData.name}</p>
                        </div>
                        <div>
                          <p className="font-medium">{language === 'en' ? 'Email:' : 'אימייל:'}</p>
                          <p className="text-gray-600">{submittedData.email}</p>
                        </div>
                        <div>
                          <p className="font-medium">{language === 'en' ? 'Subject:' : 'נושא:'}</p>
                          <p className="text-gray-600">
                            {submittedData.subject || (language === 'en' ? 'Contact Form Submission' : 'הודעה מטופס יצירת קשר')}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">{language === 'en' ? 'Message:' : 'הודעה:'}</p>
                          <p className="text-gray-600 whitespace-pre-wrap">{submittedData.message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="bg-gradient-to-br from-shelley-blue/10 to-shelley-purple/10 p-8 flex flex-col justify-center rounded-tr-2xl rounded-br-2xl">
                <h2 className={`text-2xl font-bold mb-6 ${language === 'en' ? 'text-left' : 'text-right'}`}>
                  {language === 'en' ? 'Contact Details' : 'פרטי יצירת קשר'}
                </h2>
                
                <div className="space-y-6">
                  <div className={`flex ${language === 'en' ? 'flex-row' : 'flex-row-reverse'} items-center`}>
                    <div className={`bg-shelley-blue/20 p-3 rounded-full ${language === 'en' ? 'mr-4' : 'ml-4'}`}>
                      <Mail className="w-6 h-6 text-shelley-blue" />
                    </div>
                    <div className="w-full">
                      <LanguageDirectionWrapper>
                        {language === 'en' ? (
                          <p className="text-gray-600">
                            <span className="font-bold mr-2">Email:</span>
                            {TARGET_EMAIL}
                          </p>
                        ) : (
                          <p className="text-gray-600">דוא"ל: {TARGET_EMAIL}</p>
                        )}
                      </LanguageDirectionWrapper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Contact;
