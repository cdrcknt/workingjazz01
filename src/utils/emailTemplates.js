export const getPasswordResetEmailTemplate = (resetToken) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    return {
      subject: 'Jazz Coffee - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Jazz Coffee</h1>
            <p style="color: #4b5563; font-size: 16px;">Password Reset Request</p>
          </div>
  
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
              Hello,
            </p>
            
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
              We received a request to reset your password for your Jazz Coffee Management System account. If you didn't make this request, you can safely ignore this email.
            </p>
  
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
              To reset your password, click the button below:
            </p>
  
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: linear-gradient(to right, #2563eb, #3b82f6);
                        color: white;
                        text-decoration: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-weight: 500;
                        display: inline-block;">
                Reset Password
              </a>
            </div>
  
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              This link will expire in 1 hour for security reasons.
            </p>
          </div>
  
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p>Jazz Coffee Management System</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      `,
      text: `
        Jazz Coffee - Password Reset Request
  
        Hello,
  
        We received a request to reset your password for your Jazz Coffee Management System account. 
        If you didn't make this request, you can safely ignore this email.
  
        To reset your password, copy and paste the following link in your browser:
        ${resetLink}
  
        This link will expire in 1 hour for security reasons.
  
        Best regards,
        Jazz Coffee Management System
      `
    };
  };