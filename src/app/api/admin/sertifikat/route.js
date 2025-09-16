import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export async function GET(request) {

}

export async function POST(request) {
  try {
    
  }
  catch {
    
  }
}

export async function PUT(request) {

}

export async function DELETE(request) {

}
