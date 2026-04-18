import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'
if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.warn('Warning: STRIPE_SECRET_KEY is not defined. Stripe features will fail at runtime.')
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
  appInfo: {
    name: 'Inception Crowdfunding',
    version: '0.1.0',
  },
})
