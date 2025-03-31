
import React from "react";
import PasswordSection from "./password-management/PasswordSection";
import RecaptchaSection from "./password-management/RecaptchaSection";

export const PasswordManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <PasswordSection />
      <RecaptchaSection />
    </div>
  );
};

export default PasswordManagement;
