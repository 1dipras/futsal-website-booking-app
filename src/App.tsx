import { useState, useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FieldGrid from "./components/FieldGrid";
import BookingModal from "./components/BookingModal";
import TransactionHistory from "./components/TransactionHistory";
import AdminChat from "./components/AdminChat";
import AdminDashboard from "./components/AdminDashboard";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import UserDashboard from "./components/UserDashboard";
import type {
  Field,
  Booking,
  Transaction,
  AdminCredentials,
  AdminSession,
  UserCredentials,
  UserSession,
  DoubleBooking,
  RefundRequest,
} from "./types";

const INITIAL_FIELDS: Field[] = [
  {
    id: "1",
    name: "Lapangan A",
    type: "Indoor",
    surface: "Vinyl",
    capacity: 10,
    pricePerHour: 150000,
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop&auto=format",
    amenities: ["AC", "Loker", "Shower"],
    bookings: [],
  },
  {
    id: "2",
    name: "Lapangan B",
    type: "Indoor",
    surface: "Parquet",
    capacity: 12,
    pricePerHour: 175000,
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop&auto=format",
    amenities: ["AC", "Loker", "Kantin"],
    bookings: [],
  },
  {
    id: "3",
    name: "Lapangan C",
    type: "Outdoor",
    surface: "Sintetis",
    capacity: 10,
    pricePerHour: 120000,
    image:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=400&fit=crop&auto=format",
    amenities: ["Tribun", "Lampu Malam", "Parkir"],
    bookings: [],
  },
  {
    id: "4",
    name: "Lapangan D",
    type: "Indoor",
    surface: "Vinyl",
    capacity: 10,
    pricePerHour: 160000,
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop&auto=format",
    amenities: ["AC", "Shower", "Kantin"],
    bookings: [],
  },
  {
    id: "5",
    name: "Lapangan E",
    type: "Outdoor",
    surface: "Sintetis",
    capacity: 12,
    pricePerHour: 130000,
    image:
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=400&fit=crop&auto=format",
    amenities: ["Tribun", "Lampu Malam"],
    bookings: [],
  },
  {
    id: "6",
    name: "Lapangan VIP",
    type: "Indoor",
    surface: "Parquet Premium",
    capacity: 14,
    pricePerHour: 250000,
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=600&h=400&fit=crop&auto=format",
    amenities: [
      "AC",
      "Loker Premium",
      "Shower",
      "Kantin VIP",
      "Tribun",
    ],
    bookings: [],
  },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<
    "fields" | "transactions" | "chat" | "dashboard"
  >("dashboard");
  const [fields, setFields] = useState<Field[]>(INITIAL_FIELDS);
  const [bookingModal, setBookingModal] = useState<{
    open: boolean;
    field: Field | null;
  }>({ open: false, field: null });
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([]);
  const [now, setNow] = useState(Date.now());
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [userAccounts, setUserAccounts] = useState<UserCredentials[]>(() => {
    localStorage.removeItem('userAccounts'); // Clear any existing fake data
    return [];
  });
  const [showAuth, setShowAuth] = useState(false);
  const [doubleBookings, setDoubleBookings] = useState<DoubleBooking[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    localStorage.setItem('userAccounts', JSON.stringify(userAccounts));
  }, [userAccounts]);

  const handleLogin = (email: string, password: string) => {
    console.log("App handleLogin called:", email, password);
    // 1. Admin login check
    if (email.toLowerCase() === "admin" && password === "admin123") {
      console.log("Admin credentials matched, setting admin session");
      setAdminSession({
        username: "admin",
        loginTime: Date.now(),
      });
      setShowAuth(false);
      return;
    }

    // 2. User login check
    const user = userAccounts.find(
      (account) =>
        account.email.toLowerCase() === email.toLowerCase() &&
        account.password === password,
    );

    if (user) {
      console.log("User credentials matched, setting user session");
      setUserSession({ name: user.name, email: user.email, loginTime: Date.now() });
      setShowAuth(false);
      setActiveSection("dashboard");
    } else {
      console.log("No matching credentials found");
      alert("Email atau password tidak cocok");
    }
  };

  const handleRegister = (credentials: UserCredentials) => {
    if (
      userAccounts.some(
        (account) => account.email.toLowerCase() === credentials.email.toLowerCase(),
      )
    ) {
      alert("Email sudah terdaftar");
      return;
    }
    setUserAccounts((prev) => [...prev, credentials]);
    setUserSession({ name: credentials.name, email: credentials.email, loginTime: Date.now() });
    setShowAuth(false);
    setActiveSection("dashboard");
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
  };

  const handleUserLogout = () => {
    setUserSession(null);
    setActiveSection("dashboard");
  };

  const handleBrowse = () => {
    setShowAuth(false);
    setActiveSection("fields");
  };

  const handleNavigate = (section: "fields" | "transactions" | "chat" | "dashboard") => {
    setActiveSection(section);
    if (section !== "dashboard") {
      setShowAuth(false);
    }
  };

  // Detect double bookings
  const detectDoubleBookings = (updatedFields: Field[]) => {
    const doubles: DoubleBooking[] = [];

    updatedFields.forEach((field) => {
      // Group bookings by date and time
      const timeSlots = new Map<string, Booking[]>();

      field.bookings.forEach((booking) => {
        const key = `${booking.date}-${booking.startTime}-${booking.endTime}`;
        if (!timeSlots.has(key)) {
          timeSlots.set(key, []);
        }
        timeSlots.get(key)!.push(booking);
      });

      // Find conflicts (same time slot with 2+ bookings)
      timeSlots.forEach((bookings, key) => {
        if (bookings.length > 1) {
          const [date, startTime, endTime] = key.split('-');
          const doubleBooking: DoubleBooking = {
            id: "db" + Date.now(),
            fieldId: field.id,
            fieldName: field.name,
            bookingIds: bookings.map((b) => b.id),
            conflictingTime: {
              date,
              startTime,
              endTime,
            },
            customers: bookings.map((b) => b.customerName),
            detectedAt: Date.now(),
            resolved: false,
          };
          doubles.push(doubleBooking);

          // Create refund requests for the extra bookings
          bookings.forEach((booking, idx) => {
            if (idx > 0) {
              // Keep the first booking, refund the rest
              const fieldData = fields.find((f) => f.id === booking.fieldId);
              const pricePerHour = fieldData?.pricePerHour || 0;
              const startHour = parseInt(startTime.split(":")[0]);
              const endHour = parseInt(endTime.split(":")[0]);
              const hours = endHour - startHour;
              const refundAmount = pricePerHour * hours;

              const refund: RefundRequest = {
                id: "rf" + Date.now() + idx,
                doubleBookingId: doubleBooking.id,
                bookingId: booking.id,
                fieldName: field.name,
                customerName: booking.customerName,
                amount: refundAmount,
                reason: "Double booking - automatic refund",
                status: "pending",
                requestedAt: Date.now(),
              };
              setRefundRequests((prev) => [...prev, refund]);
            }
          });
        }
      });
    });

    if (doubles.length > 0) {
      setDoubleBookings((prev) => [...prev, ...doubles]);
    }
  };

  // Handle open booking modal
  const handleOpenBooking = (field: Field) => {
    setBookingModal({ open: true, field });
  };

  const handleConfirmBooking = (
    booking: Booking,
    paymentMethod: string,
    totalPrice: number,
  ) => {
    const updatedFields = fields.map((f) =>
      f.id === booking.fieldId
        ? { ...f, bookings: [...f.bookings, booking] }
        : f,
    );
    
    setFields(updatedFields);
    
    // Detect double bookings after adding new booking
    detectDoubleBookings(updatedFields);

    const tx: Transaction = {
      id: "t" + Date.now(),
      bookingId: booking.id,
      fieldId: booking.fieldId,
      fieldName:
        fields.find((f) => f.id === booking.fieldId)?.name ??
        "",
      customerName: booking.customerName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      amount: totalPrice,
      paymentMethod,
      status: "success",
      createdAt: Date.now(),
    };
    setTransactions((prev) => [tx, ...prev]);
    setBookingModal({ open: false, field: null });
  };

  // Handle refund approval
  const handleApproveRefund = (refundId: string) => {
    const refund = refundRequests.find((r) => r.id === refundId);
    if (!refund) return;

    // Update refund status
    setRefundRequests((prev) =>
      prev.map((r) =>
        r.id === refundId
          ? {
              ...r,
              status: "approved",
              resolvedAt: Date.now(),
              resolvedBy: adminSession?.username,
            }
          : r,
      ),
    );

    // Remove the conflicting booking
    setFields((prev) =>
      prev.map((field) =>
        field.id === refund.fieldName
          ? {
              ...field,
              bookings: field.bookings.filter((b) => b.id !== refund.bookingId),
            }
          : field,
      ),
    );

    // Add refund transaction
    setTransactions((prev) => [
      {
        id: "ref" + Date.now(),
        bookingId: refund.bookingId,
        fieldId: refund.fieldName,
        fieldName: refund.fieldName,
        customerName: refund.customerName,
        date: "",
        startTime: "",
        endTime: "",
        amount: refund.amount,
        paymentMethod: "refund",
        status: "success",
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  };

  // Handle refund rejection
  const handleRejectRefund = (refundId: string) => {
    setRefundRequests((prev) =>
      prev.map((r) =>
        r.id === refundId
          ? {
              ...r,
              status: "rejected",
              resolvedAt: Date.now(),
              resolvedBy: adminSession?.username,
            }
          : r,
      ),
    );
  };

  //  Admin Dashboard View
  if (adminSession) {
    console.log("Rendering AdminDashboard for:", adminSession.username);
    return (
      <AdminDashboard
        fields={fields}
        transactions={transactions}
        onLogout={handleAdminLogout}
        adminName={adminSession.username}
        refundRequests={refundRequests}
        doubleBookings={doubleBookings}
        onApproveRefund={handleApproveRefund}
        onRejectRefund={handleRejectRefund}
        userAccounts={userAccounts}
      />
    );
  }

  //  User Dashboard & Main App View (Logika Sesi User)
  if (userSession) {
    if (activeSection === "dashboard") {
      return (
        <UserDashboard
          userSession={userSession}
          fields={fields}
          transactions={transactions}
          onBrowse={handleBrowse}
          onLogout={handleUserLogout}
        />
      );
    }
    
    // Jika tidak di dashboard, tampilkan menu utama (Fields/Chat/Transactions)
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
        <Header activeSection={activeSection} onNavigate={handleNavigate} userSession={userSession} onDashboardClick={() => setActiveSection("dashboard")} />
        {activeSection === "fields" ? (
          <> <HeroSection /> <FieldGrid fields={fields} now={now} onBook={handleOpenBooking} /> </>
        ) : activeSection === "transactions" ? (
          <TransactionHistory transactions={transactions} />
        ) : (
          <AdminChat />
        )}
        {bookingModal.open && bookingModal.field && (
          <BookingModal field={bookingModal.field} onClose={() => setBookingModal({ open: false, field: null })} onConfirm={handleConfirmBooking} />
        )}
      </div>
    );
  }

  // Auth Page View
  if (showAuth) {
    return (
      <AuthPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        onClose={() => setShowAuth(false)}
      />
    );
  }

  // Landing Page (Hanya tampil kalau tidak ada sesi dan tidak sedang Auth)
  return (
    <LandingPage
      fields={fields}
      onAuth={() => setShowAuth(true)}
      onBrowse={handleBrowse}
    />
  );
}