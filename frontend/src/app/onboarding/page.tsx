"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { 
  ArrowRight, 
  ArrowLeft,
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Target, 
  Bell, 
  Shield, 
  Zap,
  Eye,
  Calculator,
  LineChart,
  DollarSign,
  CheckCircle,
  Sparkles
} from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  image?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to Your Crypto Portfolio Hub",
    subtitle: "Take control of your digital assets like never before",
    content: "Our platform combines advanced analytics with intuitive design to help you track, analyze, and optimize your cryptocurrency investments in real-time.",
    features: [
      {
        icon: <PieChart className="w-6 h-6 text-cyan-400" />,
        title: "Real-Time Portfolio Tracking",
        description: "Monitor all your crypto assets in one unified dashboard"
      },
      {
        icon: <TrendingUp className="w-6 h-6 text-green-400" />,
        title: "Advanced Analytics",
        description: "Get deep insights into your portfolio performance and trends"
      },
      {
        icon: <Shield className="w-6 h-6 text-blue-400" />,
        title: "Secure & Private",
        description: "Your data is encrypted and never shared with third parties"
      }
    ]
  },
  {
    id: 2,
    title: "Comprehensive Portfolio Analytics",
    subtitle: "Understand your performance with professional-grade tools",
    content: "Get detailed insights into your investment performance, risk metrics, and market trends with our comprehensive analytics suite.",
    features: [
      {
        icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
        title: "Performance Charts",
        description: "Interactive charts showing your portfolio growth over time"
      },
      {
        icon: <Calculator className="w-6 h-6 text-yellow-400" />,
        title: "P&L Tracking",
        description: "Real-time profit and loss calculations with detailed breakdowns"
      },
      {
        icon: <Target className="w-6 h-6 text-red-400" />,
        title: "Risk Assessment",
        description: "Analyze your portfolio's risk exposure and diversification"
      }
    ]
  },
  {
    id: 3,
    title: "Smart Trading Insights",
    subtitle: "Make informed decisions with AI-powered analytics",
    content: "Our platform provides intelligent insights to help you make better trading decisions and optimize your investment strategy.",
    features: [
      {
        icon: <Zap className="w-6 h-6 text-orange-400" />,
        title: "Market Intelligence",
        description: "Real-time market data and trend analysis across all major exchanges"
      },
      {
        icon: <Bell className="w-6 h-6 text-indigo-400" />,
        title: "Smart Alerts",
        description: "Custom notifications for price movements and portfolio changes"
      },
      {
        icon: <LineChart className="w-6 h-6 text-emerald-400" />,
        title: "Technical Analysis",
        description: "Advanced charting tools with multiple indicators and overlays"
      }
    ]
  },
  {
    id: 4,
    title: "Ready to Start Your Journey?",
    subtitle: "Everything you need to succeed is at your fingertips",
    content: "You're all set to explore your personalized crypto portfolio dashboard. Start tracking, analyzing, and optimizing your investments today!",
    features: [
      {
        icon: <Eye className="w-6 h-6 text-cyan-400" />,
        title: "Instant Portfolio View",
        description: "See all your holdings, balances, and performance at a glance"
      },
      {
        icon: <DollarSign className="w-6 h-6 text-green-400" />,
        title: "Value Tracking",
        description: "Monitor total portfolio value with real-time price updates"
      },
      {
        icon: <Sparkles className="w-6 h-6 text-pink-400" />,
        title: "Personalized Experience",
        description: "Customizable dashboard tailored to your investment style"
      }
    ]
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();
  const { user, updateUserProfile, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div className="text-white text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    setIsCompleting(true);
    
    try {
      // Mark user as having completed onboarding
      if (updateUserProfile && user) {
        await updateUserProfile({
          hasCompletedOnboarding: true
        });
      }
      
      // Store in localStorage as backup
      localStorage.setItem('hasCompletedOnboarding', 'true');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still redirect to dashboard even if profile update fails
      router.push('/dashboard');
    } finally {
      setIsCompleting(false);
    }
  };

  const skipOnboarding = () => {
    router.push('/dashboard');
  };

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Crypto Portfolio</h1>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm">
            Step {currentStep + 1} of {onboardingSteps.length}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              {currentStepData.title}
            </h2>
            <p className="text-xl text-gray-300 mb-4">
              {currentStepData.subtitle}
            </p>
            <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
              {currentStepData.content}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {currentStepData.features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-700/50 border border-gray-600 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={skipOnboarding}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Skip tour
            </button>

            <div className="flex items-center gap-4">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={isCompleting}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCompleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : currentStep === onboardingSteps.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Go to Dashboard
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}