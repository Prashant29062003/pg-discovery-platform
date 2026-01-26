"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Eye } from "lucide-react";

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  propertyName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalAmount: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  createdAt: string;
}

export default function BookingsPageContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when bookings API is ready
      const mockBookings: Booking[] = [
        {
          id: "BK001",
          guestName: "Rahul Sharma",
          guestEmail: "rahul.sharma@email.com",
          guestPhone: "+91 98765 43210",
          propertyName: "Elite Gurugram Hub",
          roomNumber: "B101",
          checkInDate: "2025-02-01",
          checkOutDate: "2025-02-15",
          nights: 14,
          totalAmount: 252000,
          status: "confirmed",
          createdAt: "2025-01-20",
        },
        {
          id: "BK002",
          guestName: "Priya Desai",
          guestEmail: "priya.desai@email.com",
          guestPhone: "+91 87654 32109",
          propertyName: "Serene Women's Stay",
          roomNumber: "G202",
          checkInDate: "2025-02-05",
          checkOutDate: "2025-02-20",
          nights: 15,
          totalAmount: 180000,
          status: "pending",
          createdAt: "2025-01-19",
        },
        {
          id: "BK003",
          guestName: "Amit Patel",
          guestEmail: "amit.patel@email.com",
          guestPhone: "+91 76543 21098",
          propertyName: "Elite Gurugram Hub",
          roomNumber: "B102",
          checkInDate: "2025-01-15",
          checkOutDate: "2025-01-31",
          nights: 16,
          totalAmount: 288000,
          status: "completed",
          createdAt: "2025-01-05",
        },
      ];

      setBookings(mockBookings);
      filterBookings(mockBookings, searchTerm, statusFilter);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = (
    data: Booking[],
    search: string,
    status: string
  ) => {
    let filtered = data;

    if (search) {
      filtered = filtered.filter(
        (booking) =>
          booking.guestName.toLowerCase().includes(search.toLowerCase()) ||
          booking.propertyName.toLowerCase().includes(search.toLowerCase()) ||
          booking.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((booking) => booking.status === status);
    }

    setFilteredBookings(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterBookings(bookings, value, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterBookings(bookings, searchTerm, value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Bookings</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Manage all guest bookings and reservations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-600">{bookings.length}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {bookings.filter((b) => b.status === "confirmed").length}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-yellow-600">
                {bookings.filter((b) => b.status === "pending").length}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">
                ₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Search by guest name, property, or booking ID
              </label>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Status
              </label>
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bookings List</CardTitle>
            <Button
              variant="outline"
              className="rounded-lg gap-2"
              onClick={() => {
                // TODO: Implement export functionality
                alert("Export feature coming soon");
              }}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 dark:text-zinc-400">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">
                      Booking ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">
                      Guest
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">
                      Property
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">
                      Dates
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {booking.id}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {booking.guestName}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {booking.guestEmail}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <p className="font-medium text-zinc-900 dark:text-white">
                            {booking.propertyName}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Room {booking.roomNumber}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            {new Date(booking.checkInDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {booking.nights} nights
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-zinc-900 dark:text-white">
                          ₹{booking.totalAmount.toLocaleString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                          onClick={() => {
                            // TODO: Implement view booking details
                            alert(`Viewing booking ${booking.id}`);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
