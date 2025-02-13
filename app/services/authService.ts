import { 
    EmailAuthProvider, 
    reauthenticateWithCredential, 
    updatePassword, 
    User 
  } from "firebase/auth";
  
  interface PasswordValidation {
    isValid: boolean;
    errors: string[];
  }
  
  export class AuthService {
    static validatePassword(password: string): PasswordValidation {
      const errors: string[] = [];
      
      if (password.length < 8) {
        errors.push("Password must be at least 8 characters");
      }
      if (!/[A-Z]/.test(password)) {
        errors.push("Password must include an uppercase letter");
      }
      if (!/[0-9]/.test(password)) {
        errors.push("Password must include a number"); 
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must include a special character");
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    static async changePassword(
      user: User,
      currentPassword: string,
      newPassword: string
    ): Promise<{success: boolean; message: string}> {
      try {
        // First validate the new password
        const validation = this.validatePassword(newPassword);
        if (!validation.isValid) {
          return {
            success: false,
            message: validation.errors.join("\n")
          };
        }
  
        // Reauthenticate the user
        const credential = EmailAuthProvider.credential(
          user.email!,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
  
        // Update the password
        await updatePassword(user, newPassword);
  
        return {
          success: true,
          message: "Password successfully updated"
        };
  
      } catch (error: any) {
        return {
          success: false,
          message: error.code === 'auth/wrong-password' 
            ? "Current password is incorrect"
            : "Failed to update password"
        };
      }
    }
  }