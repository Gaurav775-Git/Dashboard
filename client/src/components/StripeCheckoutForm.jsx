import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { api } from '../lib/api'; // Using the api instance

const StripeCheckoutForm = ({ orderData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/payment-success` },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
      try {
        const payload = { ...orderData, paymentIntentId: paymentIntent.id };
        
        if (orderData.orderType === 'ranking') {
          await api.post('/services/google-ranking', payload);
        } else {
          await api.post('/services/google-indexing', payload);
        }
        
        onSuccess();
      } catch (dbError) {
        setErrorMessage('Payment succeeded, but failed to save order. Please contact support.');
        setIsProcessing(false);
        if (onError) onError(dbError.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <PaymentElement />
      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Processing...' : `Pay $${orderData.totalPrice}`}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;