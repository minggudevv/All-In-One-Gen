const translations = {
  header: {
    identity: "Identity",
    email: "Email",
    password: "Password",
    dashboard: "Dashboard",
    login: "Log In",
    logout: "Logout",
    signup: "Sign Up",
  },
  home: {
    title: "The Ultimate All-In-One Generator",
    subtitle: "Create fake identities, temporary emails, and strong passwords in seconds. Your one-stop-shop for all your data generation needs.",
    getStarted: "Get Started",
    identityGenerator: "Identity Generator",
    identityGeneratorDesc: "Create realistic fake identities with names, addresses, and photos.",
    emailGenerator: "Email Generator",
    emailGeneratorDesc: "Instantly generate temporary and disposable email addresses.",
    passwordGenerator: "Password Generator",
    passwordGeneratorDesc: "Produce strong, secure, and random passwords to protect your accounts.",
    tryNow: "Try now",
  },
  identity: {
    title: "Fake Identity Generator",
    subtitle: "Generate a complete, random identity with a single click.",
    details: {
      title: "Details",
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      address: "Address",
      dob: "Date of Birth",
      backstory: "AI Generated Backstory",
    },
    buttons: {
        correctMap: "Correct Map Location",
        correctingMap: "Correcting...",
        generate: "Generate Backstory",
        generating: "Generating...",
        copyBackstory: "Copy Backstory",
        generateAgain: "Generate Again",
        save: "Save to Dashboard",
        saving: "Saving...",
        loginToSave: "Log in to Save",
    },
    loginPrompt: {
        login: "Log in",
        map: "for a more accurate map.",
        backstory: "to generate a backstory.",
    }
  },
  email: {
    title: "Fake Email Generator",
    subtitle: "Instantly generate random, disposable email addresses.",
    cardTitle: "Generated Emails",
    regenerate: "Regenerate",
    saveEmail: "Save email",
    copyEmail: "Copy email",
    loginPrompt: {
      login: "Log in",
      message: "to save emails to your dashboard.",
    },
  },
  password: {
    title: "Password Generator",
    subtitle: "Create strong, secure, and random passwords to protect your accounts.",
    ariaLabel: "Generated Password",
    strength: {
      weak: "Weak",
      medium: "Medium",
      strong: "Strong",
    },
    options: {
      length: "Password Length",
      uppercase: "Uppercase (A-Z)",
      numbers: "Numbers (0-9)",
      symbols: "Symbols (!@#)",
    },
    buttons: {
      generate: "Generate New Password",
      save: "Save to Dashboard",
      saving: "Saving...",
      loginToSave: "Log in to Save",
    },
  },
  dashboard: {
      title: "Dashboard",
      subtitle: "Manage your saved identities, emails, and passwords here.",
      tabs: {
          identities: "Identities",
          emails: "Emails",
          passwords: "Passwords"
      },
      buttons: {
          addIdentity: "Identity",
          addEmail: "Email",
          addPassword: "Password",
      },
      filter: {
          name: "Filter by name...",
          email: "Filter by email...",
          password: "Filter by password...",
      },
      empty: {
          identities: {
              title: "No Identities Saved",
              description: "You haven't saved any identities yet. Start by generating one!",
              cta: "Generate an Identity",
          },
          emails: {
              title: "No Emails Saved",
              description: "You haven't saved any emails yet. Start by generating some!",
              cta: "Generate Emails",
          },
          passwords: {
                title: "No Passwords Saved",
                description: "You haven't saved any passwords yet. Start by generating one!",
                cta: "Generate a Password",
          }
      },
      columns: {
          name: "Name",
          email: "Email",
          phone: "Phone",
          location: "Location",
          password: "Password",
          strength: "Strength",
          savedOn: "Saved On",
          justNow: "Just now",
      },
      actions: {
            title: "Actions",
            view: "View on Web",
            correctLocation: "Correct Location",
            copyJson: "Copy JSON",
            copyEmail: "Copy Email",
            copyPhone: "Copy Phone",
            copyPassword: "Copy Password",
            delete: "Delete",
      },
      deleteDialog: {
          title: "Are you absolutely sure?",
          description: "This action cannot be undone. This will permanently delete this saved item from our servers.",
          cancel: "Cancel",
          confirm: "Delete",
      }
  },
  identityView: {
    subtitle: "Digital Identity Profile",
    notFound: {
        title: "Identity Not Found",
        description: "The identity you are looking for could not be found. Please go back to the generator and create a new one.",
    },
    cards: {
        personal: {
            title: "Personal Info",
            age: "Age",
            birthday: "Birthday",
            nationality: "Nationality",
        },
        contact: {
            title: "Contact Details",
            email: "Email Address",
            phone: "Phone Number",
        },
        location: {
            title: "Location",
            address: "Full Address",
        },
        backstory: {
            title: "AI Generated Backstory",
        }
    }
  },
  login: {
      title: "Welcome Back!",
      subtitle: "Enter your credentials to access your account.",
      form: {
          email: "Email",
          password: "Password",
      },
      buttons: {
          loggingIn: "Logging in...",
          logIn: "Log In",
      },
      signupPrompt: {
          message: "Don't have an account?",
          link: "Sign up"
      }
  },
  signup: {
    title: "Create an Account",
    subtitle: "Start generating data in seconds. It's free!",
    form: {
        email: "Email",
        username: "Username",
        password: "Password",
        confirmPassword: "Confirm Password",
        terms: {
            start: "I agree to the",
            termsLink: "Terms of Service",
            and: "and",
            privacyLink: "Privacy Policy",
            description: "You must agree to the terms to create an account."
        }
    },
    buttons: {
        creating: "Creating account...",
        signup: "Sign Up",
    },
    loginPrompt: {
        message: "Already have an account?",
        link: "Log in",
    }
  },
  map: {
      loading: "Loading map...",
      popup: "Approximate location.",
      enlarge: "Enlarge Map",
      enlargedTitle: "Enlarged Map",
  },
  toasts: {
    success: "Success!",
    error: "Error",
    copied: "Copied!",
    logoutSuccess: {
        title: "Logged out",
        description: "You have been successfully logged out."
    },
    logoutFailed: {
        title: "Logout Failed",
        description: "An error occurred while logging out."
    },
    loginSuccess: {
        title: "Login Successful",
        description: "Welcome back!",
    },
    loginFailed: {
        title: "Login Failed",
        description: "An error occurred. Please try again."
    },
    signupSuccess: {
        title: "Account Created",
        description: "You have been successfully signed up."
    },
    signupFailed: {
        title: "Sign Up Failed",
        description: "An error occurred. Please try again."
    },
    identity: {
        locationErrorTitle: "Could not find a land-based location",
        locationErrorDesc: "The generated identity is located in the water. You can try correcting it with AI.",
        fetchErrorTitle: "Error Fetching Identity",
        fetchErrorDesc: "Could not retrieve a new identity. Please check your connection and try again.",
        backstoryError: "Failed to generate backstory.",
        backstoryCopied: "Backstory has been copied to your clipboard.",
        correctLocationSuccess: "Map location has been corrected by AI.",
        correctLocationError: "Failed to correct map location.",
        saveSuccess: "Identity saved to your dashboard.",
        saveError: "Failed to save identity. Please try again.",
    },
    email: {
        copiedDesc: "has been copied to your clipboard.",
        saveSuccessDesc: "saved to your dashboard.",
        saveErrorDesc: "Failed to save email. Please try again.",
    },
    password: {
        copiedDesc: "Password has been copied to your clipboard.",
        saveSuccess: "Password saved to your dashboard.",
        saveError: "Failed to save password. Please try again.",
    },
    dashboard: {
        fetchIdentitiesError: "Could not fetch saved identities.",
        fetchEmailsError: "Could not fetch saved emails.",
        fetchPasswordsError: "Could not fetch saved passwords.",
        deleteSuccess: "Item deleted successfully.",
        deleteError: "Failed to delete item.",
        copiedDesc: "copied to clipboard.",
        correctingLocationTitle: "Correcting Location...",
        correctingLocationDesc: "AI is working to find the correct coordinates.",
        correctLocationSuccess: "Map location has been corrected and saved.",
        correctLocationError: "Failed to correct map location.",
    }
  }
};

export default translations;
