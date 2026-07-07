// src/AppRoutes.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Components
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import { FloatingNavbar } from "./components/ui/FloatingNavbar";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import LandingPage from "./pages/landing-page";
import LoginPage from "./pages/login";
import Register from "./pages/register";
import UnauthorizedPage from "./pages/static-pages/UnauthorizedPage";
import ServerErrorPage from "./pages/static-pages/ServerErrorPage";
import MaintenancePage from "./pages/static-pages/MaintenancePage";

// Dashboards
import AdminDashboard from "./pages/admin-dashboard";
import AttendeeDashboard from "./pages/attendee-dashboard";
import InstructorDashboard from "./pages/instructor-dashboard";

// Attendee Pages
import MyOrders from "./pages/attendee/MyOrders";
import OrderDetails from "./pages/attendee/OrderDetails";
import MyEnrollments from "./pages/attendee/MyEnrollments";
import MyRecordings from "./pages/attendee/MyRecordings";
import JoinWebinar from "./pages/attendee/JoinWebinar";
import WebinarFeedback from "./pages/attendee/WebinarFeedback";
import ProfileSettings from "./pages/attendee/ProfileSettings";
import PaymentHistory from "./pages/attendee/PaymentHistory";

// Instructor
import MyWebinars from "./pages/instructor/MyWebinars";
import WebinarAnalytics from "./pages/instructor/WebinarAnalytics";
import RevenueReports from "./pages/instructor/RevenueReports";
import InstructorProfile from "./pages/instructor/InstructorProfile";
import CreateWebinar from "./pages/create-webinar";
import InstructorAnalyticsDashboard from "./pages/instructor-analytics-dashboard";

// Admin
import InstructorApproval from "./pages/admin/InstructorApproval";
import WebinarManagement from "./pages/admin/WebinarManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import SystemAnalytics from "./pages/admin/SystemAnalytics";
import SystemLogs from "./pages/admin/SystemLogs";
import AdminSettings from "./pages/admin/AdminSettings";

// Webinar & Analytics
import WebinarDetails from "./pages/webinar-details/LiveWebinarDetails";
import AttendanceReports from "./pages/webinar-details/components/AttendanceReports";
import WebinarFeedbackForm from "./pages/webinar-feedback-form";
import FeedbackAnalytics from "./pages/webinar-feedback-form/components/FeedbackAnalytics";
import RealTimeOperationsDashboard from "./pages/real-time-operations-dashboard";
import ExecutiveOverviewDashboard from "./pages/executive-overview-dashboard";

// Payments
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage";
import PaymentFailedPage from "./pages/payment/PaymentFailedPage";
import RefundRequestPage from "./pages/payment/RefundRequestPage";

// Zoom integration
import WebinarSchedulingInterface from "./pages/zoom/WebinarSchedulingInterface";
import PreWebinarLobby from "./pages/zoom/PreWebinarLobby";
import ZoomRedirectPage from "./pages/zoom/ZoomRedirectPage";
import PostWebinarPage from "./pages/zoom/PostWebinarPage";
import RecordingPlayerPage from "./pages/zoom/RecordingPlayerPage";
import JoinWebinarLobby from "./pages/join-webinar-lobby";
import InstructorLayout from "layouts/InstructorLayout";
import RecordingManagement from "pages/instructor/RecordingManagement";
import RecordingAccessDetail from "pages/instructor/RecordingAccessDetail";
import ProtectedRoute from "components/ProtectedRoute";
import { AuthProvider } from "contexts/AuthContext";
import WebinarResources from "pages/instructor/WebinarResources";
import AttendeeLayout from "layouts/AttendeeLayout";
import LiveWebinarsPage from "pages/webinar-details/LiveWebinarsPage";
import RecordedWebinarsPage from "pages/recorded-webinar/RecordedWebinarsPage";
import RecordedWebinarDetails from "pages/recorded-webinar/RecordedWebinarDetails";
import PurchasePage from "pages/payment/PurchasePage";
import AboutUs from "pages/static-pages/AboutUs";
import ContactUs from "pages/static-pages/ContactUs";
import InstructorManagement from "pages/admin/InstructorManagement";
import EmailVerification from "pages/register/components/EmailVerification";
import CheckEmail from "pages/login/components/CheckEmail";
import SpeakerProfile from "pages/admin/SpeakerProfile";
import PrivacyPolicy from "pages/static-pages/PrivacyPolicy";
import ShippingReturnPolicy from "pages/static-pages/ShippingReturnPolicy";
import RefundCancellationPolicy from "pages/static-pages/RefundCancellationPolicy";
import TermsConditions from "pages/static-pages/TermsConditions";

import { CartProvider } from "contexts/CartContext";
import CheckoutPage from "pages/payment/CheckoutPage";
import CartPage from "pages/payment/CartPage";
import AdminPaymentDetails from "pages/admin/AdminPaymentDetails";
import ForgotPasswordPage from "pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "pages/ForgotPassword/ResetPasswordPage";
import StripeReturnPage from "pages/payment/StripeReturnPage";

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider> 
        <CartProvider>
          <ErrorBoundary>
            <ScrollToTop />
            <Routes>
              {/* ---------- Admin Routes ---------- */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="create" element={<CreateWebinar />} />
                        <Route path="webinars" element={<WebinarManagement />} />
                        <Route path="edit-webinar/:webinar_id" element={<CreateWebinar />} />
                        <Route path="instructors/create" element={<SpeakerProfile />} />
                        <Route path="instructors" element={<InstructorManagement />} />
                        <Route path="instructor-profile/:id" element={<SpeakerProfile />} />
                            <Route path="payments" element={<PaymentManagement />} />
                 <Route path="payments/:paymentId" element={<AdminPaymentDetails />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* ---------- Attendee Routes (Minimal Layout) ---------- */}
              <Route
                path="/attendee/*"
                element={
                  <ProtectedRoute requiredRole="attendee">
                    <MainLayout>
                      <Routes>
                        <Route index element={<MyEnrollments />} />
                        <Route path="orders" element={<MyOrders />} />
                        <Route path="enrollments" element={<MyEnrollments />} />
                        <Route path="recordings" element={<MyRecordings />} />
                        <Route path="profile" element={<ProfileSettings />} />
                        <Route path="payments" element={<PaymentHistory />} />
                    <Route path="join/:id" element={<JoinWebinarLobby />} />
                        
                        <Route path="feedback/:id" element={<WebinarFeedback />} />
                        
                       
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* ---------- Public Routes ---------- */}
              <Route
                path="/*"
                element={
                  <MainLayout>
                    <Routes>
                      <Route index element={<LandingPage />} />
                      
                    
                      <Route path="cart" element={<CartPage />} />
                      <Route path="checkout" element={<CheckoutPage />} />
                      
              
                      <Route path="login" element={<LoginPage />} />
                      <Route path="check-email" element={<CheckEmail />} />
                      <Route path="register" element={<Register />} />
                      <Route path="verify-email" element={<EmailVerification />} />
                 <Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="webinars/live" element={<LiveWebinarsPage />} />
                      <Route path="live-webinar/:webinar_id" element={<WebinarDetails />} />
                 
                      <Route path="live-webinar/:webinar_id/:slug" element={<WebinarDetails />} />
                      
                      
                      <Route path="webinars/recorded" element={<RecordedWebinarsPage />} />
                      <Route path="recorded-webinar/:id" element={<RecordedWebinarDetails />} />
                      <Route path="recorded-webinar/:id/:slug" element={<RecordedWebinarDetails />} />
                <Route path="/checkout/stripe-return" element={<StripeReturnPage />} />
                      <Route path="checkout/payment-success/:invoice_number" element={<PaymentSuccessPage />} />
                      <Route path="checkout/payment-failed/:transactionId?" element={<PaymentFailedPage />} />
<Route path="checkout/payment-failed" element={<PaymentFailedPage />} />
                      {/* <Route path="checkout/payment-failed/:pending_invoice_number" element={<PaymentFailedPage />} /> */}
                      <Route path="refund-request" element={<RefundRequestPage />} />

                 
                      <Route path="unauthorized" element={<UnauthorizedPage />} />
                      <Route path="server-error" element={<ServerErrorPage />} />
                      <Route path="maintenance" element={<MaintenancePage />} />
                      <Route path="about" element={<AboutUs />} />
                      <Route path="contact" element={<ContactUs />} />
                      <Route path="privacy-policy" element={<PrivacyPolicy/>} />
                      <Route path="shipping-return-policy" element={<ShippingReturnPolicy/>} />
                      <Route path="refund-cancellation-policy" element={<RefundCancellationPolicy/>} />
                      <Route path="terms-conditions" element={<TermsConditions/>} />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                  </MainLayout>
                }
              />
              

           
              
              {/* Catch-All */}
                {/* <Route path="*" element={<MaintenancePage />} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
