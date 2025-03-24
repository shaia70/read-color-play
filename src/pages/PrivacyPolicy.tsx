
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageDirectionWrapper from "@/components/layout/LanguageDirectionWrapper";

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  
  // Hebrew content for privacy policy
  const hebrewContent = (
    <>
      <h1>מדיניות פרטיות</h1>
      <p>עודכן לאחרונה: 24 במרץ, 2025</p>
      <p>מדיניות פרטיות זו מתארת את המדיניות והנהלים שלנו בנוגע לאיסוף, שימוש וחשיפה של המידע שלך בעת השימוש בשירות ומודיעה לך על זכויות הפרטיות שלך וכיצד החוק מגן עליך.</p>
      <p>אנו משתמשים בנתונים האישיים שלך כדי לספק ולשפר את השירות. על ידי שימוש בשירות, אתה מסכים לאיסוף ושימוש במידע בהתאם למדיניות פרטיות זו. מדיניות פרטיות זו נוצרה בעזרת מחולל מדיניות הפרטיות.</p>
      
      <h2 className="text-xl font-bold mt-6 mb-3">פרשנות והגדרות</h2>
      <h3 className="text-lg font-bold mt-4 mb-2">פרשנות</h3>
      <p>המילים שהאות הראשונה שלהן היא אות גדולה יש להן משמעויות המוגדרות תחת התנאים הבאים. להגדרות הבאות תהיה אותה משמעות בין אם הן מופיעות ביחיד או ברבים.</p>
      <h3 className="text-lg font-bold mt-4 mb-2">הגדרות</h3>
      <p>למטרות מדיניות פרטיות זו:</p>
      <ul className="list-disc mr-6 my-3">
        <li>
          <p><strong>חשבון</strong> פירושו חשבון ייחודי שנוצר עבורך לגישה לשירות שלנו או לחלקים מהשירות שלנו.</p>
        </li>
        <li>
          <p><strong>שותף</strong> פירושו ישות השולטת, נשלטת על ידי או נמצאת תחת שליטה משותפת עם צד, כאשר "שליטה" פירושה בעלות על 50% או יותר מהמניות, זכויות הון או ניירות ערך אחרים הזכאים להצביע לבחירת דירקטורים או רשות ניהול אחרת.</p>
        </li>
        <li>
          <p><strong>אפליקציה</strong> מתייחסת לשלי ספרים AR, תוכנת המחשב המסופקת על ידי החברה.</p>
        </li>
        <li>
          <p><strong>חברה</strong> (המכונה "החברה", "אנחנו", "אותנו" או "שלנו" בהסכם זה) מתייחסת לשלי ספרים.</p>
        </li>
        <li>
          <p><strong>עוגיות</strong> הן קבצים קטנים המוצבים על המחשב, המכשיר הנייד או כל מכשיר אחר שלך על ידי אתר אינטרנט, המכילים את פרטי היסטוריית הגלישה שלך באותו אתר בין השימושים הרבים שלהן.</p>
        </li>
        <li>
          <p><strong>מדינה</strong> מתייחסת ל: ישראל</p>
        </li>
        <li>
          <p><strong>מכשיר</strong> פירושו כל מכשיר שיכול לגשת לשירות כגון מחשב, טלפון סלולרי או טאבלט דיגיטלי.</p>
        </li>
        <li>
          <p><strong>מידע אישי</strong> הוא כל מידע הקשור לאדם מזוהה או ניתן לזיהוי.</p>
        </li>
        <li>
          <p><strong>שירות</strong> מתייחס לאפליקציה או לאתר האינטרנט או לשניהם.</p>
        </li>
        <li>
          <p><strong>ספק שירות</strong> פירושו כל אדם טבעי או משפטי המעבד את הנתונים בשם החברה. הוא מתייחס לחברות צד שלישי או יחידים המועסקים על ידי החברה כדי לאפשר את השירות, לספק את השירות בשם החברה, לבצע שירותים הקשורים לשירות או לסייע לחברה בניתוח אופן השימוש בשירות.</p>
        </li>
        <li>
          <p><strong>נתוני שימוש</strong> מתייחסים לנתונים הנאספים באופן אוטומטי, בין אם נוצרו על ידי השימוש בשירות או מתשתית השירות עצמה (לדוגמה, משך הביקור בדף).</p>
        </li>
        <li>
          <p><strong>אתר</strong> מתייחס לשלי ספרים, נגיש מ- <a href="https://www.shelley.co.il" rel="external nofollow noopener" target="_blank" className="text-blue-600 hover:underline">https://www.shelley.co.il</a></p>
        </li>
        <li>
          <p><strong>אתה</strong> פירושו האדם הגולש או משתמש בשירות, או החברה, או ישות משפטית אחרת שבשמה אדם כזה ניגש או משתמש בשירות, לפי העניין.</p>
        </li>
      </ul>
      
      <h2 className="text-xl font-bold mt-6 mb-3">איסוף ושימוש בנתונים האישיים שלך</h2>
      <h3 className="text-lg font-bold mt-4 mb-2">סוגי נתונים שנאספים</h3>
      <h4 className="text-base font-bold mt-3 mb-2">מידע אישי</h4>
      <p>בעת השימוש בשירות שלנו, אנו עשויים לבקש ממך לספק לנו מידע מזהה אישי מסוים שניתן להשתמש בו ליצירת קשר או לזיהוי שלך. מידע מזהה אישי עשוי לכלול, אך לא מוגבל ל:</p>
      <ul className="list-disc mr-6 my-3">
        <li>
          <p>כתובת דוא"ל</p>
        </li>
        <li>
          <p>שם פרטי ושם משפחה</p>
        </li>
        <li>
          <p>נתוני שימוש</p>
        </li>
      </ul>
      <h4 className="text-base font-bold mt-3 mb-2">נתוני שימוש</h4>
      <p>נתוני שימוש נאספים באופן אוטומטי בעת השימוש בשירות.</p>
      <p>נתוני שימוש עשויים לכלול מידע כגון כתובת פרוטוקול האינטרנט של המכשיר שלך (למשל כתובת IP), סוג דפדפן, גרסת דפדפן, הדפים של השירות שלנו שאתה מבקר בהם, השעה והתאריך של הביקור שלך, הזמן שבילית בדפים אלה, מזהי מכשיר ייחודיים ונתוני אבחון אחרים.</p>
      <p>כאשר אתה ניגש לשירות באמצעות מכשיר נייד, אנו עשויים לאסוף מידע מסוים באופן אוטומטי, כולל, אך לא רק, סוג המכשיר הנייד שבו אתה משתמש, מזהה הייחודי של המכשיר הנייד שלך, כתובת ה-IP של המכשיר הנייד שלך, מערכת ההפעלה הניידת שלך, סוג דפדפן האינטרנט הנייד שבו אתה משתמש, מזהי מכשיר ייחודיים ונתוני אבחון אחרים.</p>
      <p>אנו עשויים גם לאסוף מידע שהדפדפן שלך שולח בכל פעם שאתה מבקר בשירות שלנו או כאשר אתה ניגש לשירות באמצעות מכשיר נייד.</p>
      <h4 className="text-base font-bold mt-3 mb-2">מידע הנאסף בעת השימוש באפליקציה</h4>
      <p>בעת השימוש באפליקציה שלנו, על מנת לספק תכונות של האפליקציה שלנו, אנו עשויים לאסוף, עם הרשאתך מראש:</p>
      <ul className="list-disc mr-6 my-3">
        <li>תמונות ומידע אחר מהמצלמה וספריית התמונות של המכשיר שלך</li>
      </ul>
      <p>אנו משתמשים במידע זה כדי לספק תכונות של השירות שלנו, לשפר ולהתאים אישית את השירות שלנו. המידע עשוי להיות מועלה לשרתי החברה ו/או לשרת של ספק שירות או שהוא פשוט מאוחסן במכשיר שלך.</p>
      <p>אתה יכול להפעיל או להשבית גישה למידע זה בכל עת, דרך הגדרות המכשיר שלך.</p>
      <h4 className="text-base font-bold mt-3 mb-2">טכנולוגיות מעקב ועוגיות</h4>
      <p>אנו משתמשים בעוגיות וטכנולוגיות מעקב דומות כדי לעקוב אחר הפעילות בשירות שלנו ולאחסן מידע מסוים. טכנולוגיות מעקב המשמשות הן משואות, תגים וסקריפטים לאיסוף ומעקב אחר מידע ולשיפור וניתוח השירות שלנו. הטכנולוגיות בהן אנו משתמשים עשויות לכלול:</p>
      <ul className="list-disc mr-6 my-3">
        <li><strong>עוגיות או עוגיות דפדפן.</strong> עוגייה היא קובץ קטן המוצב על המכשיר שלך. אתה יכול להורות לדפדפן שלך לסרב לכל העוגיות או לציין מתי עוגייה נשלחת. עם זאת, אם אינך מקבל עוגיות, ייתכן שלא תוכל להשתמש בחלקים מסוימים מהשירות שלנו. אלא אם כן התאמת את הגדרת הדפדפן שלך כך שתסרב לעוגיות, השירות שלנו עשוי להשתמש בעוגיות.</li>
        <li><strong>משואות אינטרנט.</strong> חלקים מסוימים של השירות שלנו והדוא"ל שלנו עשויים להכיל קבצים אלקטרוניים קטנים הידועים כמשואות אינטרנט (המכונים גם גיפים ברורים, תגי פיקסל וגיפים חד-פיקסליים) המאפשרים לחברה, לדוגמה, לספור משתמשים שביקרו בדפים אלה או פתחו אימייל ולסטטיסטיקות אחרות הקשורות לאתר (לדוגמה, רישום הפופולריות של סעיף מסוים ואימות המערכת והשרת).</li>
      </ul>
      <p>עוגיות יכולות להיות עוגיות "קבועות" או "מושב". עוגיות קבועות נשארות במחשב האישי או במכשיר הנייד שלך כאשר אתה מנותק, בעוד שעוגיות מושב נמחקות ברגע שאתה סוגר את דפדפן האינטרנט שלך. אתה יכול ללמוד עוד על עוגיות במאמר באתר <a href="https://www.termsfeed.com/blog/cookies/#What_Are_Cookies" target="_blank" className="text-blue-600 hover:underline">TermsFeed</a>.</p>
      <p>אנו משתמשים בעוגיות מושב וקבועות למטרות המפורטות להלן:</p>
      <ul className="list-disc mr-6 my-3">
        <li>
          <p><strong>עוגיות הכרחיות / חיוניות</strong></p>
          <p>סוג: עוגיות מושב</p>
          <p>מנוהל על ידי: אנחנו</p>
          <p>מטרה: עוגיות אלה חיוניות כדי לספק לך שירותים הזמינים דרך האתר ולאפשר לך להשתמש בחלק מהתכונות שלו. הם עוזרים לאמת משתמשים ולמנוע שימוש מרמה בחשבונות משתמשים. ללא עוגיות אלה, לא ניתן לספק את השירותים שביקשת, ואנו משתמשים בעוגיות אלה רק כדי לספק לך שירותים אלה.</p>
        </li>
        <li>
          <p><strong>עוגיות מדיניות עוגיות / קבלת הודעה</strong></p>
          <p>סוג: עוגיות קבועות</p>
          <p>מנוהל על ידי: אנחנו</p>
          <p>מטרה: עוגיות אלה מזהות אם משתמשים קיבלו את השימוש בעוגיות באתר.</p>
        </li>
        <li>
          <p><strong>עוגיות פונקציונליות</strong></p>
          <p>סוג: עוגיות קבועות</p>
          <p>מנוהל על ידי: אנחנו</p>
          <p>מטרה: עוגיות אלה מאפשרות לנו לזכור בחירות שאתה עושה בעת השימוש באתר, כגון זכירת פרטי הכניסה שלך או העדפת השפה. מטרתן של עוגיות אלה היא לספק לך חוויה אישית יותר ולהימנע ממצב שבו תצטרך להזין מחדש את העדפותיך בכל פעם שאתה משתמש באתר.</p>
        </li>
      </ul>
      <p>למידע נוסף על העוגיות בהן אנו משתמשים ולבחירות שלך בנוגע לעוגיות, אנא בקר במדיניות העוגיות שלנו או בסעיף העוגיות של מדיניות הפרטיות שלנו.</p>
      
      <h3 className="text-lg font-bold mt-4 mb-2">שימוש בנתונים האישיים שלך</h3>
      <p>החברה עשויה להשתמש בנתונים אישיים למטרות הבאות:</p>
      <ul className="list-disc mr-6 my-3">
        <li>
          <p><strong>לספק ולתחזק את השירות שלנו</strong>, כולל ניטור השימוש בשירות שלנו.</p>
        </li>
        <li>
          <p><strong>לנהל את החשבון שלך:</strong> לנהל את הרישום שלך כמשתמש בשירות. הנתונים האישיים שאתה מספק יכולים לתת לך גישה לפונקציונליות שונה של השירות הזמינה לך כמשתמש רשום.</p>
        </li>
        <li>
          <p><strong>לביצוע חוזה:</strong> הפיתוח, הציות וביצוע חוזה הרכישה עבור המוצרים, הפריטים או השירותים שרכשת או של כל חוזה אחר איתנו באמצעות השירות.</p>
        </li>
        <li>
          <p><strong>ליצור איתך קשר:</strong> ליצור איתך קשר באמצעות דוא"ל, שיחות טלפון, SMS או צורות אחרות של תקשורת אלקטרונית, כגון התראות דחיפה של אפליקציה לנייד בנוגע לעדכונים או תקשורת אינפורמטיבית הקשורה לפונקציונליות, מוצרים או שירותים מסוכמים, כולל עדכוני אבטחה, כאשר הדבר נחוץ או סביר ליישומם.</p>
        </li>
        <li>
          <p><strong>לספק לך</strong> חדשות, הצעות מיוחדות ומידע כללי על סחורות, שירותים ואירועים אחרים שאנו מציעים הדומים לאלה שכבר רכשת או ביררת אלא אם בחרת שלא לקבל מידע כזה.</p>
        </li>
        <li>
          <p><strong>לנהל את הבקשות שלך:</strong> לטפל ולנהל את הבקשות שלך אלינו.</p>
        </li>
        <li>
          <p><strong>להעברות עסקיות:</strong> אנו עשויים להשתמש במידע שלך כדי להעריך או לבצע מיזוג, מכירה, רה-ארגון, פירוק או מכירה או העברה אחרת של חלק או כל הנכסים שלנו, בין אם כעסק חי ובין אם כחלק מפשיטת רגל, פירוק או הליך דומה, שבו נתונים אישיים המוחזקים על ידינו אודות משתמשי השירות שלנו נמצאים בין הנכסים המועברים.</p>
        </li>
        <li>
          <p><strong>למטרות אחרות:</strong> אנו עשויים להשתמש במידע שלך למטרות אחרות, כגון ניתוח נתונים, זיהוי מגמות שימוש, קביעת האפקטיביות של קמפיינים פרסומיים שלנו ולהערכה ושיפור השירות, המוצרים, השירותים, השיווק והחוויה שלך.</p>
        </li>
      </ul>
      <p>אנו עשויים לשתף את המידע האישי שלך במצבים הבאים:</p>
      <ul className="list-disc mr-6 my-3">
        <li><strong>עם ספקי שירות:</strong> אנו עשויים לשתף את המידע האישי שלך עם ספקי שירות כדי לנטר ולנתח את השימוש בשירות שלנו, ליצור איתך קשר.</li>
        <li><strong>להעברות עסקיות:</strong> אנו עשויים לשתף או להעביר את המידע האישי שלך בקשר, או במהלך משא ומתן של, כל מיזוג, מכירת נכסי החברה, מימון או רכישה של כל או חלק מהעסק שלנו לחברה אחרת.</li>
        <li><strong>עם שותפים:</strong> אנו עשויים לשתף את המידע שלך עם השותפים שלנו, במקרה זה נדרוש משותפים אלה לכבד את מדיניות הפרטיות הזו. שותפים כוללים את חברת האם שלנו וכל חברות בת אחרות, שותפים למיזם משותף או חברות אחרות שאנו שולטים בהן או שנמצאות תחת שליטה משותפת איתנו.</li>
        <li><strong>עם שותפים עסקיים:</strong> אנו עשויים לשתף את המידע שלך עם שותפים עסקיים שלנו כדי להציע לך מוצרים, שירותים או מבצעים מסוימים.</li>
        <li><strong>עם משתמשים אחרים:</strong> כאשר אתה משתף מידע אישי או מתקשר באופן אחר באזורים ציבוריים עם משתמשים אחרים, מידע זה עשוי להיראות על ידי כל המשתמשים ועשוי להיות מופץ באופן פומבי מחוץ לאתר.</li>
        <li><strong>עם הסכמתך:</strong> אנו עשויים לחשוף את המידע האישי שלך לכל מטרה אחרת בהסכמתך.</li>
      </ul>
      
      <h3 className="text-lg font-bold mt-4 mb-2">שמירת הנתונים האישיים שלך</h3>
      <p>החברה תשמור את הנתונים האישיים שלך רק למשך הזמן הנדרש למטרות המפורטות במדיניות פרטיות זו. אנו נשמור ונשתמש בנתונים האישיים שלך במידה הנדרשת כדי לעמוד בהתחייבויות המשפטיות שלנו (לדוגמה, אם אנו נדרשים לשמור את הנתונים שלך כדי לציית לחוקים החלים), ליישב מחלוקות ולאכוף את ההסכמים והמדיניות המשפטיים שלנו.</p>
      <p>החברה תשמור גם נתוני שימוש למטרות ניתוח פנימי. נתוני שימוש נשמרים בדרך כלל לתקופה קצרה יותר, למעט כאשר נתונים אלה משמשים לחיזוק האבטחה או לשיפור הפונקציונליות של השירות שלנו, או כאשר אנו מחויבים משפטית לשמור נתונים אלה לתקופות זמן ארוכות יותר.</p>
      
      <h3 className="text-lg font-bold mt-4 mb-2">העברת הנתונים האישיים שלך</h3>
      <p>המידע שלך, כולל נתונים אישיים, מעובד במשרדי התפעול של החברה ובכל מקום אחר שבו הצדדים המעורבים בעיבוד נמצאים. פירוש הדבר שמידע זה עשוי להיות מועבר - ומתוחזק על - מחשבים הממוקמים מחוץ למדינה, מחוז, ארץ או סמכות ממשלתית אחרת שבה חוקי הגנת הנתונים עשויים להיות שונים מאלה בסמכות השיפוט שלך.</p>
      <p>הסכמתך למדיניות פרטיות זו המלווה בהגשת מידע כזה מייצגת את הסכמתך להעברה זו.</p>
      <p>החברה תנקוט בכל הצעדים הסבירים הנדרשים כדי להבטיח שהנתונים שלך מטופלים באופן מאובטח ובהתאם למדיניות פרטיות זו ולא תתבצע העברה של הנתונים האישיים שלך לארגון או למדינה אלא אם כן קיימות בקרות הולמות כולל אבטחת הנתונים שלך ומידע אישי אחר.</p>
      
      <h3 className="text-lg font-bold mt-4 mb-2">מחיקת הנתונים האישיים שלך</h3>
      <p>יש לך את הזכות למחוק או לבקש שנסייע במחיקת הנתונים האישיים שאספנו עליך.</p>
      <p>השירות שלנו עשוי לתת לך את היכולת למחוק מידע מסוים עליך מתוך השירות.</p>
      <p>אתה יכול לעדכן, לתקן או למחוק את המידע שלך בכל עת על ידי כניסה לחשבון שלך, אם יש לך אחד, וביקור בסעיף הגדרות החשבון המאפשר לך לנהל את המידע האישי שלך. אתה יכול גם ליצור איתנו קשר כדי לבקש גישה, תיקון או מחיקה של כל מידע אישי שסיפקת לנו.</p>
      <p>אנא שים לב, עם זאת, שייתכן שנצטרך לשמור מידע מסוים כאשר יש לנו חובה משפטית או בסיס חוקי לעשות זאת.</p>
      
      <h3 className="text-lg font-bold mt-4 mb-2">חשיפת הנתונים האישיים שלך</h3>
      <h4 className="text-base font-bold mt-3 mb-2">עסקאות עסקיות</h4>
      <p>אם החברה מעורבת במיזוג, רכישה או מכירת נכסים, הנתונים האישיים שלך עשויים להיות מועברים. אנו נספק הודעה לפני שהנתונים האישיים שלך יועברו ויהיו כפופים למדיניות פרטיות אחרת.</p>
      <h4 className="text-base font-bold mt-3 mb-2">אכיפת חוק</h4>
      <p>בנסיבות מסוימות, החברה עשויה להידרש לחשוף את הנתונים האישיים שלך אם נדרש לעשות זאת על פי חוק או בתגובה לבקשות תקפות של רשויות ציבוריות (למשל בית משפט או סוכנות ממשלתית).</p>
      <h4 className="text-base font-bold mt-3 mb-2">דרישות משפטיות אחרות</h4>
      <p>החברה עשויה לחשוף את הנתונים האישיים שלך באמונה כנה שפעולה כזו נחוצה כדי:</p>
      <ul className="list-disc mr-6 my-3">
        <li>לציית לחובה משפטית</li>
        <li>להגן ולהגן על הזכויות או הרכוש של החברה</li>
        <li>למנוע או לחקור עוולות אפשריות בקשר לשירות</li>
        <li>להגן על הבטיחות האישית של משתמשי השירות או הציבור</li>
        <li>להגן מפני אחריות משפטית</li>
      </ul>
      
      <h3 className="text-lg font-bold mt-4 mb-2">אבטחת הנתונים האישיים שלך</h3>
      <p>אבטחת הנתונים האישיים שלך חשובה לנו, אך זכור שאין שיטת שידור דרך האינטרנט, או שיטת אחסון אלקטרוני שהיא 100% מאובטחת. בעוד שאנו שואפים להשתמש באמצעים מקובלים מסחרית להגנה על הנתונים האישיים שלך, איננו יכולים להבטיח את האבטחה המוחלטת שלהם.</p>
      
      <h2 className="text-xl font-bold mt-6 mb-3">פרטיות ילדים</h2>
      <p>השירות שלנו אינו פונה לאף אחד מתחת לגיל 13. איננו אוספים ביודעין מידע מזהה אישי מכל אדם מתחת לגיל 13. אם אתה הורה או אפוטרופוס ואתה מודע לכך שילדך סיפק לנו נתונים אישיים, אנא צור איתנו קשר. אם אנו נהיה מודעים לכך שאספנו נתונים אישיים מכל אדם מתחת לגיל 13 ללא אימות הסכמת ההורים, אנו נוקטים צעדים להסרת מידע זה מהשרתים שלנו.</p>
      <p>אם אנו צריכים להסתמך על הסכמה כבסיס משפטי לעיבוד המידע שלך והמדינה שלך דורשת הסכמה מהורה, אנו עשויים לדרוש את הסכמת ההורה שלך לפני שנאסוף ונשתמש במידע זה.</p>
      
      <h2 className="text-xl font-bold mt-6 mb-3">קישורים לאתרים אחרים</h2>
      <p>השירות שלנו עשוי להכיל קישורים לאתרים אחרים שאינם מופעלים על ידינו. אם תלחץ על קישור של צד שלישי, תופנה לאתר של אותו צד שלישי. אנו ממליצים בחום לבדוק את מדיניות הפרטיות של כל אתר שאתה מבקר בו.</p>
      <p>אין לנו שליטה ואיננו מקבלים שום אחריות לתוכן, מדיניות הפרטיות או הנהלים של כל אתר צד שלישי או שירות.</p>
      
      <h2 className="text-xl font-bold mt-6 mb-3">שינויים במדיניות פרטיות זו</h2>
      <p>אנו עשויים לעדכן את מדיניות הפרטיות שלנו מעת לעת. אנו נודיע לך על כל שינוי על ידי פרסום מדיניות הפרטיות החדשה בדף זה.</p>
      <p>אנו נודיע לך באמצעות דוא"ל ו/או הודעה בולטת בשירות שלנו, לפני שהשינוי ייכנס לתוקף ונעדכן את תאריך "העדכון האחרון" בראש מדיניות פרטיות זו.</p>
      <p>מומלץ לך לבדוק את מדיניות הפרטיות הזו מעת לעת לשינויים כלשהם. שינויים במדיניות פרטיות זו נכנסים לתוקף כאשר הם מפורסמים בדף זה.</p>
      
      <h2 className="text-xl font-bold mt-6 mb-3">צור קשר</h2>
      <p>אם יש לך שאלות כלשהן לגבי מדיניות פרטיות זו, אתה יכול ליצור איתנו קשר:</p>
      <ul className="list-disc mr-6 my-3">
        <li>
          <p>בדוא"ל: <a href="mailto:contact@shelley.co.il" className="text-blue-600 hover:underline">contact@shelley.co.il</a></p>
        </li>
        <li>
          <p>על ידי ביקור בדף זה באתר האינטרנט שלנו: <a href="https://www.shelley.co.il/contact" rel="external nofollow noopener" target="_blank" className="text-blue-600 hover:underline">https://www.shelley.co.il/contact</a></p>
        </li>
      </ul>
    </>
  );

  // English content for privacy policy
  const englishContent = (
    <>
      <h1>Privacy Policy</h1>
      <p>Last updated: March 24, 2025</p>
      <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
      <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the <a href="https://www.termsfeed.com/privacy-policy-generator/" target="_blank" className="text-blue-600 hover:underline">Privacy Policy Generator</a>.</p>
      
      <h2 className="text-xl font-bold mt-6 mb-3">Interpretation and Definitions</h2>
      <h3 className="text-lg font-bold mt-4 mb-2">Interpretation</h3>
      <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
      <h3 className="text-lg font-bold mt-4 mb-2">Definitions</h3>
      <p>For the purposes of this Privacy Policy:</p>
      <ul className="list-disc ml-6 my-3">
        <li>
          <p><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</p>
        </li>
        <li>
          <p><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p>
        </li>
        <li>
          <p><strong>Application</strong> refers to AR שלי ספרים, the software program provided by the Company.</p>
        </li>
        <li>
          <p><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to שלי ספרים.</p>
        </li>
        <li>
          <p><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</p>
        </li>
        <li>
          <p><strong>Country</strong> refers to:  Israel</p>
        </li>
        <li>
          <p><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</p>
        </li>
        <li>
          <p><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</p>
        </li>
        <li>
          <p><strong>Service</strong> refers to the Application or the Website or both.</p>
        </li>
        <li>
          <p><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</p>
        </li>
        <li>
          <p><strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</p>
        </li>
        <li>
          <p><strong>Website</strong> refers to שלי ספרים, accessible from <a href="https://www.shelley.co.il" rel="external nofollow noopener" target="_blank" className="text-blue-600 hover:underline">https://www.shelley.co.il</a></p>
        </li>
        <li>
          <p><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
        </li>
      </ul>
      
      <h2 className="text-xl font-bold mt-6 mb-3">Collecting and Using Your Personal Data</h2>
      <h3 className="text-lg font-bold mt-4 mb-2">Types of Data Collected</h3>
      <h4 className="text-base font-bold mt-3 mb-2">Personal Data</h4>
      <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
      <ul className="list-disc ml-6 my-3">
        <li>
          <p>Email address</p>
        </li>
        <li>
          <p>First name and last name</p>
        </li>
        <li>
          <p>Usage Data</p>
        </li>
      </ul>
      <h4 className="text-base font-bold mt-3 mb-2">Usage Data</h4>
      <p>Usage Data is collected automatically when using the Service.</p>
      <p>Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
      <p>When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.</p>
      <p>We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.</p>
      <h4 className="text-base font-bold mt-3 mb-2">Information Collected while Using the Application</h4>
      <p>While using Our Application, in order to provide features of Our Application, We may collect, with Your prior permission:</p>
      <ul className="list-disc ml-6 my-3">
        <li>Pictures and other information from your Device's camera and photo library</li>
      </ul>
      <p>We use this information to provide features of Our Service, to improve and customize Our Service. The information may be uploaded to the Company's servers and/or a Service Provider's server or it may be simply stored on Your device.</p>
      <p>You can enable or disable access to this information at any time, through Your Device settings.</p>
      <h4 className="text-base font-bold mt-3 mb-2">Tracking Technologies and Cookies</h4>
      <p>We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:</p>
      <ul className="list-disc ml-6 my-3">
        <li><strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.</li>
        <li><strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</li>
      </ul>
      <p>Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser. You can learn more about cookies on <a href="https://www.termsfeed.com/blog/cookies/#What_Are_Cookies" target="_blank" className="text-blue-600 hover:underline">TermsFeed website</a> article.</p>
      <p>We use both Session and Persistent Cookies for the purposes set out below:</p>
      <ul className="list-disc ml-6 my-3">
        <li>
          <p><strong>Necessary / Essential Cookies</strong></p>
          <p>Type: Session Cookies</p>
          <p>Administered by: Us</p>
          <p>Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</p>
        </li>
        <li>
          <p><strong>Cookies Policy / Notice Acceptance Cookies</strong></p>
          <p>Type: Persistent Cookies</p>
          <p>Administered by: Us</p>
          <p>Purpose: These Cookies identify if users have accepted the use of cookies on the Website.</p>
        </li>
        <li>
          <p><strong>Functionality Cookies</strong></p>
          <p>Type: Persistent Cookies</p>
          <p>Administered by: Us</p>
          <p>Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.</p>
        </li>
      </ul>
      <p>For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of our Privacy Policy.</p>
      
      <h3 className="text-lg font-bold mt-4 mb-2">Use of Your Personal Data</h3>
      <p>The Company may use Personal Data for the following purposes:</p>
      <ul className="list-disc ml-6 my-3">
        <li>
          <p><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</p>
        </li>
        <li>
          <p><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</p>
        </li>
        <li>
          <p><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</p>
        </li>
        <li>
          <p><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</p>
        </li>
        <li>
          <p><strong>To provide You</strong> with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.</p>
        </li>
        <li>
          <p><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</p>
        </li>
        <li>
          <p><strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</p>
        </li>
        <li>
          <p><strong>For other purposes</strong>: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</p>
        </li>
      </ul>
      <p>We may share Your personal information in the following situations:</p>
      <ul className="list-disc ml-6 my-3">
        <li><strong>With Service Providers:</strong> We may share Your personal information with Service Providers to monitor and analyze the use of our Service,  to contact You.</li>
        <li><strong>For business transfers:</strong> We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.</li>
        <li><strong>With Affiliates:</strong> We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.</li>
        <li><strong>With business partners:</strong> We may share Your information with Our business partners to offer You certain products, services or promotions.</li>
        <li><strong>With other users:</strong> when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.</li>
        <li><strong>With Your consent</strong>: We may disclose Your personal information for any other purpose with Your consent.</li>
      </ul>
      
      <h3 className="text-lg font-bold mt-4 mb-2">Retention of Your Personal Data</h3>
      <p>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.</p>
      <p>The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.</p>
      
      <h3 className="text-lg font-bold mt-4 mb-2">Transfer of Your Personal Data</h3>
      <p>Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.</p>
      <p>Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.</p>
      <p>The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.</p>
      
      <h3 className="text-lg font-bold mt-4 mb-2">Delete Your Personal Data</h3>
      <p>You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.</p>
      <p>Our Service may give You the ability to delete certain information about You from within the Service.</p>
      <p>You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.</p>
      <p>Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.</p>
      
      <h3 className="text-lg font-bold mt-4 mb-2">Disclosure of Your Personal Data</h3>
      <h4 className="text-base font-bold mt-3 mb-2">Business Transactions</h4>
      <p>If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>
      <h4 className="text-base font-bold mt-3 mb-2">Law enforcement</h4>
      <p>Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>
      <h4 className="text-base font-bold mt-3 mb-2">Other legal requirements</h4>
      <p>The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:</p>
      <ul className="list-disc ml-6 my-3">
        <li>Comply with a legal obligation</li>
        <li>Protect and defend the rights or property of the Company</li>
        <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
        <li>Protect the personal safety of Users of the Service or the public</li>
        <li>Protect against legal liability</li>
      </ul>
      
      <h3 className="text-lg font-bold mt-4 mb-2">Security of Your Personal Data</h3>
      <p>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
      
      <h2 className="text-xl font-bold mt-6 mb-3">Children's Privacy</h2>
      <p>Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.</p>
      <p>If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.</p>
      
      <h2 className="text-xl font-bold mt-6 mb-3">Links to Other Websites</h2>
      <p>Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.</p>
      <p>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>
      
      <h2 className="text-xl font-bold mt-6 mb-3">Changes to this Privacy Policy</h2>
      <p>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
      <p>We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the &quot;Last updated&quot; date at the top of this Privacy Policy.</p>
      <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
      
      <h2 className="text-xl font-bold mt-6 mb-3">Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, You can contact us:</p>
      <ul className="list-disc ml-6 my-3">
        <li>
          <p>By email: <a href="mailto:contact@shelley.co.il" className="text-blue-600 hover:underline">contact@shelley.co.il</a></p>
        </li>
        <li>
          <p>By visiting this page on our website: <a href="https://www.shelley.co.il/contact" rel="external nofollow noopener" target="_blank" className="text-blue-600 hover:underline">https://www.shelley.co.il/contact</a></p>
        </li>
      </ul>
    </>
  );
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <LanguageDirectionWrapper>
            <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
              {language === 'he' ? hebrewContent : englishContent}
            </div>
          </LanguageDirectionWrapper>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default PrivacyPolicy;
