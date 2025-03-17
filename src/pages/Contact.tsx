
import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: language === 'en' ? "Error" : "שגיאה",
        description: language === 'en' ? "Please fill in all required fields" : "אנא מלאו את כל השדות החובה",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: language === 'en' ? "Message Sent" : "הודעה נשלחה",
      description: language === 'en' ? "Thank you for your message! We will get back to you soon" : "תודה על פנייתך! נחזור אליך בהקדם",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
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
              {language === 'en' ? 'Do you have questions or ideas? We are always happy to hear from you!' : 'יש לכם שאלות או רעיונות? אנחנו תמיד שמחים לשמוע מכם!'}
            </p>
          </div>

          <div className="glass-card mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-8 ${language === 'en' ? 'text-left' : 'text-right'}`}>
                <h2 className="text-2xl font-bold mb-6">{language === 'en' ? 'Send Us a Message' : 'שלחו לנו הודעה'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">
                      {language === 'en' ? 'Full Name' : 'שם מלא'} <span className="text-shelley-red">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shelley-blue focus:border-transparent outline-none transition"
                      required
                      dir={language === 'en' ? 'ltr' : 'rtl'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">
                      {language === 'en' ? 'Email' : 'דוא"ל'} <span className="text-shelley-red">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shelley-blue focus:border-transparent outline-none transition"
                      required
                      dir="ltr"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block mb-2 font-medium">
                      {language === 'en' ? 'Subject' : 'נושא'}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shelley-blue focus:border-transparent outline-none transition"
                      dir={language === 'en' ? 'ltr' : 'rtl'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block mb-2 font-medium">
                      {language === 'en' ? 'Message' : 'הודעה'} <span className="text-shelley-red">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shelley-blue focus:border-transparent outline-none transition"
                      required
                      dir={language === 'en' ? 'ltr' : 'rtl'}
                    ></textarea>
                  </div>
                  
                  <CustomButton type="submit" variant="purple" icon={<Send />} className="w-full">
                    {language === 'en' ? 'Send Message' : 'שלח הודעה'}
                  </CustomButton>
                </form>
              </div>
              
              <div className="bg-gradient-to-br from-shelley-blue/10 to-shelley-purple/10 p-8 flex flex-col justify-center rounded-tr-2xl rounded-br-2xl">
                <h2 className={`text-2xl font-bold mb-6 ${language === 'en' ? 'text-left' : 'text-right'}`}>
                  {language === 'en' ? 'Contact Details' : 'פרטי יצירת קשר'}
                </h2>
                
                <div className="space-y-6">
                  <div className={`flex items-start ${language === 'he' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`bg-shelley-blue/20 p-3 rounded-full ${language === 'he' ? 'mr-4' : 'ml-4'}`}>
                      <Mail className="w-6 h-6 text-shelley-blue" />
                    </div>
                    <div className={`${language === 'he' ? 'text-left justify-between w-full flex' : 'text-left'}`}>
                      <p className="text-gray-600">info@shelley.co.il</p>
                      {language === 'he' && <h3 className="font-bold mb-1">דוא"ל</h3>}
                      {language === 'en' && <h3 className="font-bold mb-1">Email</h3>}
                    </div>
                  </div>
                  
                  <div className={`flex items-start ${language === 'he' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`bg-shelley-orange/20 p-3 rounded-full ${language === 'he' ? 'mr-4' : 'ml-4'}`}>
                      <Phone className="w-6 h-6 text-shelley-orange" />
                    </div>
                    <div className={`${language === 'he' ? 'text-left justify-between w-full flex' : 'text-left'}`}>
                      <p className="text-gray-600">053-1234567</p>
                      {language === 'he' && <h3 className="font-bold mb-1">טלפון</h3>}
                      {language === 'en' && <h3 className="font-bold mb-1">Phone</h3>}
                    </div>
                  </div>
                  
                  <div className={`flex items-start ${language === 'he' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`bg-shelley-purple/20 p-3 rounded-full ${language === 'he' ? 'mr-4' : 'ml-4'}`}>
                      <MapPin className="w-6 h-6 text-shelley-purple" />
                    </div>
                    <div className={`${language === 'he' ? 'text-left justify-between w-full flex' : 'text-left'}`}>
                      <p className="text-gray-600">{language === 'en' ? '28 Gilad St., Bat Hefer' : 'רחוב גלעד 28, בת חפר'}</p>
                      {language === 'he' && <h3 className="font-bold mb-1">כתובת</h3>}
                      {language === 'en' && <h3 className="font-bold mb-1">Address</h3>}
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
