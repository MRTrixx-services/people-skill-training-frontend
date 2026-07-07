"use client"

import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import Icon from "components/AppIcon"
import Button from "components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"

const PaymentGatewaySelection = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedGateway, setSelectedGateway] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const itemType = searchParams.get("itemType")
  const itemId = searchParams.get("itemId")
  const amount = searchParams.get("amount")

  // Available payment gateways
  const paymentGateways = [
    {
      id: "razorpay",
      name: "Razorpay",
      description: "Credit/Debit Cards, UPI, Net Banking, Wallets",
      icon: "CreditCard",
      color: "bg-blue-500",
      supported: ["INR"],
      features: ["Instant Refunds", "UPI Support", "EMI Options"],
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "PayPal Balance, Credit/Debit Cards",
      icon: "DollarSign",
      color: "bg-blue-600",
      supported: ["USD", "EUR", "GBP"],
      features: ["Buyer Protection", "Global Acceptance", "Express Checkout"],
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Credit/Debit Cards, Apple Pay, Google Pay",
      icon: "CreditCard",
      color: "bg-purple-500",
      supported: ["USD", "EUR", "GBP", "INR"],
      features: ["Apple Pay", "Google Pay", "Strong Authentication"],
    },
    {
      id: "cashfree",
      name: "Cashfree",
      description: "UPI, Cards, Net Banking, Wallets",
      icon: "Smartphone",
      color: "bg-green-500",
      supported: ["INR"],
      features: ["UPI AutoPay", "Instant Settlements", "Smart Routing"],
    },
    {
      id: "payu",
      name: "PayU",
      description: "Cards, Net Banking, UPI, EMI",
      icon: "Building",
      color: "bg-orange-500",
      supported: ["INR"],
      features: ["EMI Options", "Reward Points", "Instant Refunds"],
    },
  ]

  const handleGatewaySelect = (gatewayId) => {
    setSelectedGateway(gatewayId)
  }

  const handleProceedToPayment = async () => {
    if (!selectedGateway) return

    setIsLoading(true)

    try {
      // Navigate to checkout with selected gateway
      navigate(`/checkout/${itemType}/${itemId}?gateway=${selectedGateway}&amount=${amount}`)
    } catch (error) {
      console.error("Error proceeding to payment:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-14 md:pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Choose Payment Method</h1>
            <p className="text-muted-foreground">Select your preferred payment gateway to complete the purchase</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paymentGateways.map((gateway) => (
              <motion.div key={gateway.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedGateway === gateway.id ? "ring-2 ring-primary border-primary" : "hover:shadow-lg"
                  }`}
                  onClick={() => handleGatewaySelect(gateway.id)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${gateway.color} rounded-lg flex items-center justify-center`}>
                        <Icon name={gateway.icon} size={24} className="text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{gateway.name}</CardTitle>
                        <CardDescription className="text-sm">{gateway.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Supported Currencies:</p>
                        <div className="flex flex-wrap gap-1">
                          {gateway.supported.map((currency) => (
                            <span key={currency} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                              {currency}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Features:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {gateway.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-1">
                              <Icon name="Check" size={12} className="text-success" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigate(-1)} iconName="ArrowLeft" iconPosition="left">
              Back
            </Button>

            <Button
              onClick={handleProceedToPayment}
              disabled={!selectedGateway || isLoading}
              loading={isLoading}
              iconName="ArrowRight"
              iconPosition="right"
            >
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-sm font-medium text-foreground">Secure Payment</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All payments are processed securely using industry-standard encryption. Your payment information is never
              stored on our servers.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PaymentGatewaySelection
