import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      throw new Error("Payment service not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const { priceId } = await req.json();
    console.log("Creating checkout session for:", priceId);

    // Create or get the product and price
    let price;
    
    // Check if we already have a lifetime access price
    const existingPrices = await stripe.prices.list({
      lookup_keys: ["lifetime_access"],
      limit: 1,
    });

    if (existingPrices.data.length > 0) {
      price = existingPrices.data[0];
      console.log("Using existing price:", price.id);
    } else {
      // Create the product first
      const product = await stripe.products.create({
        name: "Je vends mon temps - Accès à Vie",
        description: "Accès illimité à toutes les fonctionnalités premium de l'application",
      });
      console.log("Created product:", product.id);

      // Create the price (10.99 EUR one-time)
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: 1099, // 10.99 EUR in cents
        currency: "eur",
        lookup_key: "lifetime_access",
      });
      console.log("Created price:", price.id);
    }

    // Get the origin from the request headers
    const origin = req.headers.get("origin") || "https://lovable.dev";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/payment?cancelled=true`,
      metadata: {
        product: "lifetime_access",
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating checkout session:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
