"use client";

import React, { useEffect, useState } from "react";
import { processPilotOwnerRequest } from "@/actions/check-user";
import { useUser } from "@clerk/nextjs";

import { Card, CardContent } from "@/components/ui/card";

export default function ApprovePilotOwnerPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isValidAdmin, setIsValidAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [action, setAction] = useState(null);
  const [token, setToken] = useState("");

  // List of emails that can approve requests
  const AUTHORIZED_ADMINS = [
    "mahboobelahi93@gmail.com",
    "admin@ai-prism.dev",
    // Add more authorized emails here
  ];

  if (!isLoaded) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center p-8">
        <Card>
          <CardContent className="p-6">Please sign in again.</CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    // Get token and action from URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const urlAction = urlParams.get("action");

    if (urlToken) {
      setToken(urlToken);
      setAction(urlAction);
      try {
        const decoded = JSON.parse(atob(urlToken));
        setRequestData(decoded);
      } catch (error) {
        setMessage("❌ Invalid approval link");
      }
    } else {
      setMessage("❌ No approval token found");
    }
  }, []);

  // Auto-fill admin email if user is signed in
  useEffect(() => {
    if (user?.emailAddresses[0]?.emailAddress && !adminEmail) {
      const userEmail = user.emailAddresses[0].emailAddress;
      setAdminEmail(userEmail);
      // Auto-verify if signed in user is authorized
      if (AUTHORIZED_ADMINS.includes(userEmail.toLowerCase())) {
        setIsValidAdmin(true);
        setMessage("✅ Admin access verified (signed in)");
      }
    }
  }, [user, adminEmail, AUTHORIZED_ADMINS]);

  const checkAdminAccess = () => {
    if (!adminEmail) {
      setMessage("Please enter your email address");
      return;
    }

    if (!AUTHORIZED_ADMINS.includes(adminEmail.toLowerCase())) {
      setMessage("❌ You are not authorized to approve pilot owner requests");
      return;
    }

    setIsValidAdmin(true);
    setMessage("✅ Admin access verified");
  };

  const handleProcessRequest = async () => {
    if (!isValidAdmin) {
      setMessage("❌ Please verify admin access first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await processPilotOwnerRequest(token, action, adminEmail);

      if (result.success) {
        setMessage(result.message);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!requestData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Invalid Request
          </h1>
          <p className="text-gray-600">{message || "Loading..."}</p>
          {!isLoaded && (
            <div className="mt-4">
              <div className="flex animate-pulse space-x-4">
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-2 w-3/4 rounded bg-gray-300"></div>
                  <div className="h-2 w-1/2 rounded bg-gray-300"></div>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Checking authentication...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isApproval = action === "approve";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-lg bg-white shadow-md">
        <div
          className={`p-6 text-white ${isApproval ? "bg-green-600" : "bg-red-600"}`}
        >
          <h1 className="text-2xl font-bold">
            {isApproval ? "Approve" : "Reject"} Pilot Owner Request
          </h1>
          <p className="mt-2 opacity-90">
            {isApproval
              ? "Approve this user as a Pilot Owner"
              : "Reject this pilot owner request"}
          </p>
        </div>

        <div className="p-6">
          {!isValidAdmin ? (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <h3 className="mb-3 font-medium text-yellow-800">
                Admin Verification Required
              </h3>
              {user ? (
                <div className="mb-3 rounded border border-blue-200 bg-blue-50 p-3">
                  <p className="text-sm text-blue-800">
                    Signed in as:{" "}
                    <strong>{user?.emailAddresses[0]?.emailAddress}</strong>
                  </p>
                </div>
              ) : null}
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your admin email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={checkAdminAccess}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Verify
                </button>
              </div>
              {!user && (
                <p className="mt-2 text-sm text-gray-600">
                  Not signed in?{" "}
                  <a href="/login" className="text-blue-600 hover:underline">
                    Sign in first
                  </a>
                </p>
              )}
            </div>
          ) : null}

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <h2 className="mb-4 text-lg font-semibold">Request Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="font-medium">{requestData?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="font-medium">{requestData?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Organization
                </label>
                <p className="font-medium">{requestData?.organization}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Contact
                </label>
                <p className="font-medium">{requestData?.contactNumber}</p>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-500">
                Purpose
              </label>
              <p className="rounded border bg-white p-3 font-medium">
                {requestData?.purpose}
              </p>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-500">
                Request Date
              </label>
              <p className="font-medium">
                {new Date(requestData?.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>

          {message && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                message.includes("✅")
                  ? "border border-green-200 bg-green-100 text-green-700"
                  : "border border-red-200 bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {isValidAdmin &&
            !message.includes("Successfully") &&
            !message.includes("rejected") && (
              <div className="text-center">
                <button
                  onClick={handleProcessRequest}
                  disabled={loading}
                  className={`rounded-md px-8 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                    isApproval
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {loading
                    ? "Processing..."
                    : isApproval
                      ? "✅ Confirm Approval"
                      : "❌ Confirm Rejection"}
                </button>
              </div>
            )}

          {(message.includes("Successfully") ||
            message.includes("rejected")) && (
            <div className="text-center">
              <p className="mb-4 text-gray-600">
                Action completed successfully.
              </p>
              <a
                href="/admin"
                className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Back to Admin Panel
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
