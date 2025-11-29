import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      userType,
      fullName,
      phone,
      // Partner-specific fields
      companyName,
      serviceType,
      city,
      contactName,
      contactEmail,
      description,
    } = body;

    const supabase = getServiceSupabase();

    // Create profile with service role (bypasses RLS)
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      user_type: userType,
      full_name: fullName,
      phone: phone || null,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return NextResponse.json(
        { error: "Failed to create profile", details: profileError.message },
        { status: 500 }
      );
    }

    // If partner, create partner record
    if (userType === "partner") {
      const { error: partnerError } = await supabase.from("partners").insert({
        user_id: userId,
        company_name: companyName,
        service_type: serviceType,
        city,
        contact_name: contactName,
        contact_email: contactEmail,
        description: description || null,
      });

      if (partnerError) {
        console.error("Partner creation error:", partnerError);
        return NextResponse.json(
          { error: "Failed to create partner profile", details: partnerError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

