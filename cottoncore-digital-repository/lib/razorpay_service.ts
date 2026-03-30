
export interface RazorpayOptions {
  amount: number;
  currency: string;
  name: string;
  description: string;
  email?: string;
  contact?: string;
  onSuccess: (response: any) => void;
  onDismiss?: () => void;
}

export const initializePayment = async (options: RazorpayOptions) => {
  // Accessing environment variables via process.env for consistency across the application
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const rzpOptions = {
    key: key,
    amount: options.amount * 100, // Amount in paise
    currency: options.currency,
    name: "CottonCore Analytics",
    description: options.description,
    image: "https://cottoncore.io/logo.png", // Replace with actual logo
    handler: function (response: any) {
      options.onSuccess(response);
    },
    prefill: {
      name: options.name,
      email: options.email,
      contact: options.contact
    },
    notes: {
      address: "CottonCore Digital Headquarters"
    },
    theme: {
      color: "#2563eb"
    },
    modal: {
      ondismiss: function() {
        if (options.onDismiss) options.onDismiss();
      }
    }
  };

  const rzp = new (window as any).Razorpay(rzpOptions);
  rzp.open();
};
