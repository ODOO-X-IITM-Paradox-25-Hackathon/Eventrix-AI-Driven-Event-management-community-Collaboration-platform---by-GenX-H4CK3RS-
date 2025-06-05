
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export const initializeRazorpayPayment = (options: {
  amount: number;
  eventName: string;
  eventId: string;
  tier: string;
  onSuccess: (paymentData: any) => void;
  onFailure: () => void;
  onDismiss: () => void;
}) => {
  const razorpayOptions: RazorpayOptions = {
    key: 'rzp_test_1DP5mmOlF5G5ag', // Test key - replace with your actual key
    amount: options.amount * 100, // Razorpay expects amount in paise
    currency: 'INR',
    name: 'Eventrix',
    description: `${options.tier} ticket for ${options.eventName}`,
    handler: function (response: any) {
      console.log('Payment successful:', response);
      options.onSuccess({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        eventId: options.eventId,
        tier: options.tier,
        amount: options.amount
      });
    },
    prefill: {
      name: 'User',
      email: 'user@example.com',
      contact: '7550293777' // Updated phone number
    },
    theme: {
      color: '#7C3AED'
    },
    modal: {
      ondismiss: function() {
        console.log('Payment modal dismissed');
        options.onDismiss();
      }
    }
  };

  if (window.Razorpay) {
    const rzp = new window.Razorpay(razorpayOptions);
    rzp.on('payment.failed', function (response: any) {
      console.log('Payment failed:', response);
      options.onFailure();
    });
    rzp.open();
  } else {
    console.error('Razorpay SDK not loaded');
    options.onFailure();
  }
};
